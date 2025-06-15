<template>
  <div class="background" v-if="!isadult"></div>
  <div v-if="!isadult" class="adult" @click="SetAdult()">
    <div class="container">
      <div class="name">Zeus Casino</div>
      <div>
        To jest strona przeznaczona tylko dla dorosłych. Kliknij w dowolne
        miejsce, aby potwierdzić, że masz ukończone 18 lat.
      </div>
      <div>Zeus Casino nie ponosi odpowiedzialności za Twoje działania.</div>
    </div>
  </div>
  <nav>
    <div class="logo">
      <img src="@/assets/logo.png" />
      <span class="name"> Zeus Casino </span>
    </div>
    <div class="links">
      <div>
        <router-link to="/">Home</router-link>
      </div>
      <div>
        <router-link to="/blackjack">Blackjack</router-link>
      </div>
    </div>
  </nav>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Howl } from 'howler'

import _start from '@/assets/audio/start.mp3'
import _background from '@/assets/audio/background.mp3'
import _ambient from '@/assets/audio/casino.mp3'

const ambientSound = new Howl({
  src: [_ambient],
  volume: 0.15,
  loop: true,
})

const backgroundSound = new Howl({
  src: [_background],
  volume: 0.05,
  loop: true,
})
const startSound = new Howl({
  src: [_start],
  volume: 1,
})

export default defineComponent({
  data() {
    return {
      isadult: false,
    }
  },
  components: {},
  mounted() {
    backgroundSound.play()
    ambientSound.play()
  },
  methods: {
    SetAdult() {
      this.isadult = true
      startSound.play()
    },
  },
})
</script>

<style lang="scss">
nav {
  height: $height;
  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  color: #fff;
  border-radius: 10px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 5px;
  position: fixed;
  z-index: 10;
  width: 100%;
}

@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');

.name {
  font-family: 'Alfa Slab One', serif;
  font-weight: 400;
  font-size: 28px;

  font-style: normal;
}

.logo {
  display: flex;
  align-items: center;
  color: #e0b856;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 32px;
  text-shadow: 1px 1px 2px black, 2px 2px 5px #ca9126, 0 0 10px #eed98080;
  // background: linear-gradient(to right, darkred, black);
  padding: 8px 20px;
  border: 2px dashed $gold;
  border-radius: 10px;
  animation: blink 1s infinite alternate;
}

@keyframes blink {
  from {
    filter: brightness(1.1);
  }
  to {
    filter: brightness(1);
  }
}

.links {
  display: flex;
  gap: 20px;
  font-family: 'Alfa Slab One', serif;
  text-shadow: 1px 1px 2px black, 2px 2px 5px #ca9126, 0 0 10px #eed98080;
  a {
    color: #e0b856;
    &:hover {
      filter: brightness(1.1);
    }
  }
}

.background {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 9;
  background: #28353aa0;
  backdrop-filter: blur(3.5px);
  z-index: 100;
}

.adult {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: $light;
    color: $dark;
    font-size: 24px;
    text-align: center;
    max-width: 1200px;
    gap: 10px;
    padding: 10px;
    font-size: 18px;
    padding: 20px;
    margin: 10px;
    border-radius: 10px;
  }
  .name {
    color: darken(gold, 5%);
    text-shadow: 1px 1px 2px $dark;
    margin-bottom: 20px;
  }
}
</style>
