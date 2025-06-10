<template>
  <div class="cont">
    <div class="section">
      <div>Karty krupiera</div>
      <div v-html="CroupierDeck.map((e) => e.name)" />
    </div>
    <div class="section">
      <div>Suma kart krupiera</div>
      <div v-html="Calculate(CroupierDeck)" />
    </div>
    <div class="section">
      <div>Twoje karty</div>
      <div v-html="Deck.map((e) => e.name)" />
    </div>
    <div class="section">
      <div>Suma kart</div>
      <div v-html="Calculate(Deck)" />
    </div>

    <div v-if="Calculate(Deck) == 21">
      <div class="section">
        <div>Black Jack!</div>
      </div>
    </div>

    <button @click="Hit()">Hit</button>
    <button @click="Stand()">Stand</button>

    <div class="score">
      <div>Wynik</div>
      <div v-html="score" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Card {
  name: string
  value: number
}

const Cards: Card[] = [
  { name: '2', value: 2 },
  { name: '3', value: 3 },
  { name: '4', value: 4 },
  { name: '5', value: 5 },
  { name: '6', value: 6 },
  { name: '7', value: 7 },
  { name: '8', value: 8 },
  { name: '9', value: 9 },
  { name: '10', value: 10 },
  { name: 'Jack', value: 10 },
  { name: 'Queen', value: 10 },
  { name: 'King', value: 10 },
  { name: 'Ace', value: 0 },
]

export default defineComponent({
  components: {},
  data() {
    return {
      Deck: [] as Card[],
      CroupierDeck: [] as Card[],
      score: '',
    }
  },
  methods: {
    PickCard(deck: Card[], n = 1) {
      for (let i = 0; i < n; i++)
        deck.push(Cards[Math.floor(Math.random() * Cards.length)])
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

      return sum <= 21 ? sum : 0
    },
    Hit() {
      this.PickCard(this.Deck)
      if (this.Calculate(this.Deck) == 0) {
        this.score = 'PRZEGRANA'
      }
    },
    Stand() {
      if (this.Calculate(this.Deck) != 0) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (this.Calculate(this.CroupierDeck) == 0) {
            this.score = 'WYGRANA'
            break
          }

          if (
            this.Calculate(this.CroupierDeck) < 17 ||
            this.Calculate(this.CroupierDeck) < this.Calculate(this.Deck)
          ) {
            this.PickCard(this.CroupierDeck)
          }

          if (this.Calculate(this.CroupierDeck) > this.Calculate(this.Deck)) {
            this.score = 'PRZEGRANA'
            break
          }

          if (
            this.Calculate(this.CroupierDeck) == this.Calculate(this.Deck) &&
            this.Calculate(this.CroupierDeck) >= 17
          ) {
            this.score = 'REMIS'
            break
          }
        }
      }
    },
  },

  mounted() {
    this.PickCard(this.Deck, 2)
    this.PickCard(this.CroupierDeck, 1)
  },
})
</script>

<style lang="scss">
.section {
  margin: 10px;
}

.score {
  margin: 10px;
  font-weight: bold;
}
</style>
