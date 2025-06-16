<template>
  <div class="moved"></div>
  <div class="home">
    <div class="play" v-if="!showgame && first">
      <h2>BlackJack</h2>
      <p v-if="cash.isPossibleToBuy(10)">
        Wybierz bet, a następnie naciśnij spację lub przycisk, aby rozpocząć.
      </p>
      <div class="buttons" v-if="cash.isPossibleToBuy(10)">
        <button
          class="bet"
          v-for="b in bets"
          :key="b"
          @click="this.bet = b"
          :class="{ active: this.bet === b }"
        >
          {{ b }} <ic icon="euro-sign" />
        </button>
      </div>
      <div class="buttons" v-if="cash.isPossibleToBuy(10)">
        <button @click="start()">Zagraj</button>
      </div>
      <p v-else>Nie stać cię na grę. Wróć z większą gotówką.</p>
    </div>

    <Game v-if="showgame" @gameover="handleGameOver" :bet="bet" :key="gameId" />

    <div class="results" v-if="!showgame && !first">
      <h2>{{ score }}</h2>
      <p v-if="cash.isPossibleToBuy(10)">
        Naciśnij spację lub przycisk, aby zagrać ponownie.
      </p>
      <div class="buttons" v-if="cash.isPossibleToBuy(10)">
        <button
          class="bet"
          v-for="b in bets"
          :key="b"
          @click="this.bet = b"
          :class="{ active: this.bet === b }"
        >
          {{ b }} <ic icon="euro-sign" />
        </button>
      </div>
      <div class="buttons" v-if="cash.isPossibleToBuy(10)">
        <button @click="start()">Zagraj ponownie</button>
      </div>
      <p v-else>Nie stać cię na grę. Wróć z większą gotówką.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Howl } from 'howler'
import { useCashStore } from '@/store/cash'

import _win from '@/assets/audio/win.mp3'
import _draw from '@/assets/audio/draw.mp3'
import _lose from '@/assets/audio/lose.mp3'

const winSound = new Howl({ src: [_win], volume: 1 })
const drawSound = new Howl({ src: [_draw], volume: 1 })
const loseSound = new Howl({ src: [_lose], volume: 1 })

import Game from '@/components/Blackjack.vue'

export default defineComponent({
  components: {
    Game,
  },
  data() {
    return {
      showgame: false,
      score: '',
      first: true,
      bet: 10,
      bets: this.getBets(),
      cash: useCashStore(),
      gameId: 0, // Klucz do resetowania komponentu gry
    }
  },
  mounted() {
    document.title = 'BlackJack | Zeus Casino'
    window.addEventListener('keydown', this.handleKeydown)
  },
  methods: {
    getBets() {
      return [
        10, 20, 30, 50, 75, 100, 150, 200, 250, 350, 500, 650, 750, 850, 1000,
      ].filter((bet) => useCashStore().isPossibleToBuy(bet))
    },
    handleGameOver(result: string) {
      switch (result) {
        // Gracz postawił 2 * bet, więc wygrana to 2 * bet, a zwrot to 4 * bet.
        case '3': {
          this.score = 'Wygrałeś (Double)!'
          winSound.play()
          this.cash.addCash(4 * this.bet)
          break
        }
        // Wygrana za Blackjacka (3:2), zwrot 2.5 * bet
        case '2': {
          this.score = 'Blackjack!'
          winSound.play()
          this.cash.addCash(2.5 * this.bet)
          break
        }
        // Normalna wygrana (1:1), zwrot 2 * bet
        case '1': {
          this.score = 'Wygrałeś'
          this.cash.addCash(2 * this.bet)
          winSound.play()
          break
        }
        // Remis, zwrot stawki
        case '0': {
          this.score = 'Remis'
          drawSound.play()
          this.cash.addCash(this.bet)
          break
        }
        case 'split2': {
          // Split: Wygrana + Remis
          this.score = 'Split: Wygrałeś'
          winSound.play()
          this.cash.addCash(4 * this.bet)
          break
        }
        case 'split1': {
          // Split: Wygrana + Remis
          this.score = 'Split: Wygrana i remis'
          winSound.play()
          this.cash.addCash(3 * this.bet)
          break
        }
        case 'split0': {
          this.score = 'Remis'
          drawSound.play()
          this.cash.addCash(2 * this.bet)
          break
        }
        case 'split-1': {
          // Split: Przegrana + Remis
          this.score = 'Split: Przegrana i remis'
          loseSound.play()
          this.cash.addCash(this.bet)
          break
        }
        // Przegrana
        default:
          this.score = 'Przegrałeś'
          loseSound.play()
        // Stawka już została pobrana, więc nic nie robimy
      }

      this.showgame = false
      this.first = false // Gra się odbyła
      this.bets = this.getBets()

      // Jeśli aktualny bet jest już niemożliwy, zresetuj do najniższego
      if (!this.cash.isPossibleToBuy(this.bet)) {
        this.bet = 10
      }
    },
    start() {
      this.gameId++ // Zwiększenie klucza resetuje komponent <Game>
      this.cash.takeCash(this.bet) // Pobierz stawkę
      this.showgame = true
    },
    handleKeydown(event: KeyboardEvent) {
      if (
        (event.code === 'Space' || event.code === 'Enter') &&
        !this.showgame &&
        this.cash.isPossibleToBuy(this.bet)
      ) {
        event.preventDefault()
        this.start()
      } else if (event.code === 'ArrowRight' && !this.showgame) {
        event.preventDefault()
        const currentIndex = this.bets.indexOf(this.bet)
        if (currentIndex < this.bets.length - 1) {
          this.bet = this.bets[currentIndex + 1]
        }
      } else if (event.code === 'ArrowLeft' && !this.showgame) {
        event.preventDefault()
        const currentIndex = this.bets.indexOf(this.bet)
        if (currentIndex > 0) {
          this.bet = this.bets[currentIndex - 1]
        }
      }
    },
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  },
})
</script>

<style lang="scss" scoped>
/* Style pozostają bez zmian */
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(80vh - $height);
  text-align: center;
}

h2 {
  font-size: 40px;
  font-weight: 500;
  text-align: center;
  margin: 20px;
  color: $gold;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px;
  flex-wrap: wrap;
  max-width: 800px;

  button {
    padding: 10px 20px;
    width: 250px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    background-color: $gold;
    color: white;
    transition: background-color 0.3s;
    font-size: 18px;

    &:hover {
      background-color: darken($gold, 10%);
    }

    &.bet {
      width: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;
      background-color: darken($dark_gray, 20%);
    }

    &.active {
      background-color: $rose;
    }
  }
}
</style>
