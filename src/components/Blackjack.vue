<template>
  <div class="cont">
    <div class="blackjack">
      <Jackpot v-if="playerSum === 21 && playerDeck.length === 2" />
    </div>

    <Deck :deck="croupierDeck" :sum="croupierSum" header="Karty krupiera" />
    <Deck :deck="playerDeck" :sum="playerSum" header="Twoje karty" />

    <div class="buttons">
      <button @click="hit()" :disabled="actionLocked">Hit</button>
      <button @click="stand()" :disabled="actionLocked">Stand</button>
      <button @click="double()" :disabled="isDoubleDisabled">Double</button>
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
      playerDeck: [] as Card[],
      croupierDeck: [] as Card[],
      gameDeck: [] as Card[],
      actionLocked: true,
      isDoubleDown: false,
      cash: useCashStore(),
    }
  },
  computed: {
    playerSum(): number {
      return this.calculatePoints(this.playerDeck)
    },
    croupierSum(): number {
      return this.calculatePoints(this.croupierDeck)
    },
    isDoubleDisabled(): boolean {
      return (
        this.actionLocked ||
        this.playerDeck.length !== 2 ||
        !this.cash.isPossibleToBuy(this.bet)
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

    async hit() {
      if (this.actionLocked) return
      this.actionLocked = true

      await this.dealCard(this.playerDeck)

      if (this.playerSum > 21) {
        await this.sleep(1200)
        this.$emit('gameover', '-1')
        return
      }
      this.actionLocked = false
    },

    async double() {
      if (this.isDoubleDisabled) return
      this.actionLocked = true
      this.isDoubleDown = true

      this.cash.takeCash(this.bet)

      await this.dealCard(this.playerDeck, 1)

      if (this.playerSum > 21) {
        await this.sleep(1200)
        this.$emit('gameover', '-1')
        return
      }

      await this.stand()
    },

    async stand() {
      // --- FIX: USUNIĘTO BŁĘDNĄ LINIĘ 'if (this.actionLocked) return' ---
      // Blokada jest ustawiana, aby zapobiec dalszym akcjom gracza.
      // Przycisk "Stand" jest już zablokowany w UI, więc ta metoda poprawnie wykona się po "Double".
      this.actionLocked = true
      standSound.play()

      while (this.croupierSum < 17) {
        await this.dealCard(this.croupierDeck)
      }

      await this.sleep(1500)
      this.determineWinner()
    },

    determineWinner() {
      const playerPoints = this.playerSum
      const croupierPoints = this.croupierSum

      if (croupierPoints > 21 || playerPoints > croupierPoints) {
        this.$emit('gameover', this.isDoubleDown ? '3' : '1')
      } else if (croupierPoints > playerPoints) {
        this.$emit('gameover', '-1')
      } else {
        this.$emit('gameover', '0')
      }
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
      await this.dealCard(this.playerDeck)
      await this.dealCard(this.croupierDeck)
      await this.dealCard(this.playerDeck)

      if (this.playerSum === 21) {
        await this.sleep(2000)
        this.$emit('gameover', '2')
        return
      }

      this.actionLocked = false
    },
  },

  async mounted() {
    window.addEventListener('keydown', this.handleKeydown)
    this.createAndShuffleDeck()
    this.initialDeal()
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
})
</script>

<style lang="scss">
/* Style bez zmian */
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
</style>
