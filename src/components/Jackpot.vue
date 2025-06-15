<template>
  <div class="section">
    <div class="title">🂡 Black Jack! 🂡</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Howl } from 'howler'

import _jackpot from '@/assets/audio/jackpot.mp3'

const jackpotSound = new Howl({
  src: [_jackpot],
  volume: 1,
})

export default defineComponent({
  mounted() {
    jackpotSound.play()
  },
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');

.section {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}

.title {
  font-family: 'Orbitron', sans-serif;
  font-size: 4rem;
  background: linear-gradient(90deg, $gold, #ff4b2b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px #ff4b2b, 0 0 20px $gold;
  }
  to {
    text-shadow: 0 0 20px #ff416c, 0 0 40px #ff4b2b;
  }
}
</style>
