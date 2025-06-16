<template>
  <div class="cont">
    <div class="blackjack">
      <Jackpot
        v-if="!isSplit && playerSums[0] === 21 && playerDecks[0].length === 2"
      />
    </div>

    <Deck :deck="croupierDeck" :sum="croupierSum" header="Karty krupiera" />

    <Deck
      v-for="(deck, index) in playerDecks"
      v-show="index === 0 || isSplit"
      :key="index"
      :deck="deck"
      :sum="playerSums[index]"
      :header="isSplit ? `Twoje karty ${index + 1}` : 'Twoje karty'"
      :class="{ activehand: currentHandIndex === index && isSplit }"
    />

    <div class="buttons">
      <button @click="hit()" :disabled="actionLocked">Hit</button>
      <button @click="stand()" :disabled="actionLocked">Stand</button>
      <button @click="double()" :disabled="isDoubleDisabled">Double</button>
      <button @click="split()" :disabled="!canSplit">Split</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Howl } from 'howler'
import { useCashStore } from '@/store/cash'
import _card from '@/assets/audio/card.mp3'
import _stand from '@/assets/audio/stand.mp3'
import Deck from './Deck.vue'
import Jackpot from './Jackpot.vue'
import { Card, Cards } from '../data/card'

const cardSound = new Howl({ src: [_card], volume: 0.5 })
const standSound = new Howl({ src: [_stand], volume: 0.8 })

export default defineComponent({
  props: {
    bet: { type: Number, required: true },
  },
  components: { Deck, Jackpot },
  data() {
    return {
      playerDecks: [[] as Card[]],
      croupierDeck: [] as Card[],
      gameDeck: [] as Card[],
      actionLocked: true,
      isDoubleDown: false,
      isSplit: false,
      currentHandIndex: 0,
      cash: useCashStore(),
      roundResults: [] as ('win' | 'lose' | 'draw')[],
    }
  },
  computed: {
    playerSums(): number[] {
      return this.playerDecks.map((d) => this.calculatePoints(d))
    },
    playerSum(): number {
      return this.playerSums[this.currentHandIndex]
    },
    croupierSum(): number {
      return this.calculatePoints(this.croupierDeck)
    },
    isDoubleDisabled(): boolean {
      const hand = this.playerDecks[this.currentHandIndex]
      return (
        this.actionLocked ||
        this.playerDecks.length > 1 ||
        hand.length != 2 ||
        !this.cash.isPossibleToBuy(this.bet)
      )
    },
    canSplit(): boolean {
      const hand = this.playerDecks[0]
      return (
        !this.isSplit &&
        hand.length === 2 &&
        hand[0].name === hand[1].name &&
        !this.actionLocked &&
        this.cash.isPossibleToBuy(this.bet)
      )
    },
  },
  methods: {
    sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    createAndShuffleDeck() {
      const deck = [...Cards]
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[deck[i], deck[j]] = [deck[j], deck[i]]
      }
      this.gameDeck = deck
    },
    async dealCard(deck: Card[], count = 1) {
      for (let i = 0; i < count; i++) {
        await this.sleep(350)
        cardSound.play()
        if (this.gameDeck.length > 0) {
          deck.push(this.gameDeck.pop()!)
        }
      }
    },
    calculatePoints(deck: Card[]): number {
      let sum = 0
      let aceCount = 0
      for (const card of deck) {
        if (card.name === 'Ace') {
          aceCount++
          sum++
        } else {
          sum += card.value
        }
      }
      while (aceCount > 0 && sum + 10 <= 21) {
        sum += 10
        aceCount--
      }
      return sum
    },
    async double() {
      if (this.isDoubleDisabled) return
      this.actionLocked = true
      this.isDoubleDown = true
      this.cash.takeCash(this.bet)
      await this.dealCard(this.playerDecks[this.currentHandIndex], 1)

      if (this.playerSum > 21) {
        await this.sleep(2500)
        this.$emit('gameover', '-1')
        return
      }

      await this.stand()
    },
    async hit() {
      if (this.actionLocked) return
      this.actionLocked = true

      await this.dealCard(this.playerDecks[this.currentHandIndex])

      const sum = this.calculatePoints(this.playerDecks[this.currentHandIndex])
      if (sum > 21) {
        await this.sleep(2500)
        this.roundResults[this.currentHandIndex] = 'lose'

        if (this.currentHandIndex === this.playerDecks.length - 1) {
          this.stand()
        } else {
          this.currentHandIndex++
          this.actionLocked = false
          return
        }
      }
      this.actionLocked = false
    },

    async stand() {
      this.actionLocked = true
      standSound.play()

      if (!(this.currentHandIndex === this.playerDecks.length - 1)) {
        this.currentHandIndex++
        this.actionLocked = false
        return
      }

      let passed = 0

      for (const deck of this.playerDecks) {
        const points = this.calculatePoints(deck)
        if (points > 21) passed++
      }

      if (passed === this.playerDecks.length) {
        this.roundResults = Array(this.playerDecks.length).fill('lose')
        await this.sleep(2000)
        this.$emit('gameover', '-1')
        return
      }

      while (this.croupierSum < 17) {
        await this.dealCard(this.croupierDeck)
      }

      await this.sleep(2000)
      this.evaluateHands()
    },

    evaluateHands() {
      const dealerPoints = this.croupierSum

      for (let i = 0; i < this.playerDecks.length; i++) {
        const points = this.calculatePoints(this.playerDecks[i])

        if (this.roundResults[i] === 'lose') continue

        if (points > 21) {
          this.roundResults[i] = 'lose'
        } else if (dealerPoints > 21 || points > dealerPoints) {
          this.roundResults[i] = 'win'
        } else if (points < dealerPoints) {
          this.roundResults[i] = 'lose'
        } else {
          this.roundResults[i] = 'draw'
        }
      }

      const finalResult = this.calculateFinalResult()
      this.$emit('gameover', finalResult)
    },

    calculateFinalResult(): string {
      const results = this.roundResults

      if (results.length === 1) {
        if (results[0] === 'win') return this.isDoubleDown ? '3' : '1'
        if (results[0] === 'draw') return '0'
        return '-1'
      }

      const winCount = results.filter((r) => r === 'win').length
      const drawCount = results.filter((r) => r === 'draw').length
      const loseCount = results.filter((r) => r === 'lose').length

      if (winCount === 2) return 'split2'
      if (winCount === 1 && drawCount === 1) return 'split1'
      if (drawCount === 2 || (winCount === 1 && loseCount === 1))
        return 'split0'
      if (loseCount === 1 && drawCount === 1) return 'split-1'
      return '-1'
    },

    async split() {
      if (!this.canSplit) return

      this.cash.takeCash(this.bet)
      this.isSplit = true

      const [card1, card2] = this.playerDecks[0]
      this.playerDecks[0] = [card1]
      this.playerDecks[1] = [card2]
      this.currentHandIndex = 0

      await this.dealCard(this.playerDecks[0])
      await this.dealCard(this.playerDecks[1])
      this.actionLocked = false
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.code === 'Space') {
        event.preventDefault()
        this.hit()
      } else if (event.code === 'Enter') {
        event.preventDefault()
        this.stand()
      }
    },
    async initialDeal() {
      this.actionLocked = true
      await this.dealCard(this.playerDecks[0])
      await this.dealCard(this.croupierDeck)
      await this.dealCard(this.playerDecks[0])

      if (this.calculatePoints(this.playerDecks[0]) === 21) {
        await this.sleep(4000)
        this.$emit('gameover', '2')
        return
      }

      this.actionLocked = false
    },
  },
  async mounted() {
    window.addEventListener('keydown', this.handleKeydown)
    this.createAndShuffleDeck()
    await this.initialDeal()
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
})
</script>

<style lang="scss">
.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 15px;

  button {
    padding: 10px 20px;
    width: 150px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    background-color: $gold;
    color: white;
    transition: all 0.3s;
    font-size: 16px;

    &:hover:not(:disabled) {
      background-color: darken($gold, 10%);
    }

    &:disabled {
      background-color: #555;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}

.blackjack {
  height: 85px;
}

.activehand {
  border: 2px solid $light;
  box-shadow: 0 0 10px $light;
  border-radius: 10px;
}
</style>
