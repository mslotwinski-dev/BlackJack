<template>
  <nav>
    <div class="logo">
      <img src="@/assets/logo.png" />
      <span class="name"> Zeus Cassino </span>
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

import _background from '@/assets/audio/background.mp3'
const backgroundSound = new Howl({
  src: [_background],
  volume: 0.2,
  loop: true,
})

export default defineComponent({
  components: {},
  mounted() {
    backgroundSound.play()
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
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 5px;
  position: fixed;
  z-index: 100;
  width: 100%;
}

@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');

.name {
  font-family: 'Alfa Slab One', serif;
  font-weight: 400;
  font-size: 30px;

  font-style: normal;
}

.logo {
  display: flex;
  align-items: center;
  color: #e0b856;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 36px;
  text-shadow: 1px 1px 2px black, 2px 2px 5px #ca9126, 0 0 10px #eed98080;
  // background: linear-gradient(to right, darkred, black);
  padding: 10px 20px;
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
</style>
