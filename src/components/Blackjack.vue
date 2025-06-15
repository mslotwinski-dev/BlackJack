<template>
  <div class="cont">
    <div class="blackjack">
      <Jackpot v-if="Calculate(Deck) == 21" />
    </div>

    <Deck
      :deck="CroupierDeck"
      :sum="Calculate(CroupierDeck)"
      header="Karty krupiera"
    />
    <Deck :deck="Deck" :sum="Calculate(Deck)" header="Twoje karty" />

    <div class="buttons">
      <button @click="Hit()">Hit</button>
      <button @click="Stand()">Stand</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Howl } from 'howler'

import _card from '@/assets/audio/card.mp3'
const cardSound = new Howl({
  src: [_card],
  volume: 0.5,
})

import _stand from '@/assets/audio/stand.mp3'
const standSound = new Howl({
  src: [_stand],
  volume: 0.8,
})

import Deck from './Deck.vue'
import Jackpot from './Jackpot.vue'
import { Card, Cards } from '../data/card'

export default defineComponent({
  components: { Deck, Jackpot },
  data() {
    return {
      Deck: [] as Card[],
      CroupierDeck: [] as Card[],
      score: '',
      lockhit: false,
    }
  },
  methods: {
    sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    async PickCard(deck: Card[], n = 1) {
      for (let i = 0; i < n; i++) {
        await this.sleep(300)

        cardSound.play()

        deck.push(Cards[Math.floor(Math.random() * Cards.length)])
      }
    },

    Calculate(deck: Card[]): number {
      let sum = 0
      for (const i in deck) {
        sum += deck[i].value
      }

      const aces = deck.filter((e) => e.name == 'Ace')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ in aces) {
        sum += sum < 11 ? 11 : 1
      }

      return sum
    },
    async Hit() {
      if (this.lockhit) return
      this.lockhit = true

      await this.PickCard(this.Deck)

      if (this.Calculate(this.Deck) > 21) {
        await this.sleep(1200)
        this.$emit('gameover', -1)
      }
      this.lockhit = false
    },
    async Stand() {
      const wait = 2000
      this.lockhit = true

      standSound.play()
      await this.sleep(wait / 2)

      if (this.Calculate(this.Deck) != 0) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (this.Calculate(this.CroupierDeck) > 21) {
            await this.sleep(wait)
            this.$emit('gameover', '1')
            break
          }

          if (
            this.Calculate(this.CroupierDeck) < 17 ||
            this.Calculate(this.CroupierDeck) < this.Calculate(this.Deck)
          ) {
            await this.PickCard(this.CroupierDeck)
            continue
          }

          if (this.Calculate(this.CroupierDeck) < this.Calculate(this.Deck)) {
            await this.sleep(wait)
            this.$emit('gameover', '1')
            break
          }

          if (this.Calculate(this.CroupierDeck) > this.Calculate(this.Deck)) {
            await this.sleep(wait)
            this.$emit('gameover', '-1')
            break
          }

          if (this.Calculate(this.CroupierDeck) == this.Calculate(this.Deck)) {
            await this.sleep(wait)
            this.$emit('gameover', '0')
            break
          }
        }
      }
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.code === 'Space') {
        event.preventDefault()
        this.Hit()
      } else if (event.code === 'Enter') {
        this.Stand()
      }
    },
  },

  async mounted() {
    window.addEventListener('keydown', this.handleKeydown)

    this.PickCard(this.CroupierDeck, 1)
    setTimeout(() => this.PickCard(this.Deck, 2), 300)
    // console.log(Cards)
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
    transition: background-color 0.3s;
    font-size: 16px;

    &:hover {
      background-color: darken($gold, 10%);
    }
  }
}

.blackjack {
  height: 85px;
}
</style>
