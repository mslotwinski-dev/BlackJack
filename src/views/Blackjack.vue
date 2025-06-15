<template>
  <div class="moved"></div>
  <div class="home">
    <div class="play" v-if="!showgame && first">
      <h2>BlackJack</h2>
      <p>Naciśnij spację lub przycisk, aby rozpocząć.</p>
      <div class="buttons">
        <button @click="start()">Zagraj</button>
      </div>
    </div>
    <Game v-if="showgame" @gameover="handleGameOver" />
    <div class="results" v-if="!showgame && !first">
      <h2>{{ score }}</h2>
      <p>Naciśnij spację lub przycisk, aby zagrać ponownie.</p>
      <div class="buttons">
        <button @click="showgame = true">Zagraj ponownie</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Howl } from 'howler'

import _win from '@/assets/audio/win.mp3'
import _draw from '@/assets/audio/draw.mp3'
import _lose from '@/assets/audio/lose.mp3'

const winSound = new Howl({
  src: [_win],
  volume: 1,
})

const drawSound = new Howl({
  src: [_draw],
  volume: 1,
})

const loseSound = new Howl({
  src: [_lose],
  volume: 1,
})

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
    }
  },
  mounted() {
    document.title = 'BlackJack | Zeus Casino'

    window.addEventListener('keydown', this.handleKeydown)
  },
  methods: {
    handleGameOver(result: string) {
      if (result === '1') {
        this.score = 'Wygrałeś'
        winSound.play()
      } else if (result === '0') {
        this.score = 'Remis'
        drawSound.play()
      } else {
        this.score = 'Przegrałeś'
        loseSound.play()
      }

      this.showgame = false
    },
    start() {
      this.showgame = true
      this.first = false
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.code === 'Space') {
        event.preventDefault()
        if (!this.showgame && this.first) {
          this.start()
        } else if (!this.showgame && !this.first) {
          this.showgame = true
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
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(80vh - $height); // Adjusted to account for header height
}

h2 {
  font-size: 40px;
  font-weight: 500;
  text-align: center;
  margin: 20px;
  color: $gold; // Assuming $gold is defined in your SCSS variables
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px;

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
  }
}
</style>
