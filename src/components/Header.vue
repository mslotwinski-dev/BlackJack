<template>
  <header>
    <div class="hero"></div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
})
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

header {
  background: white;
  width: 100vw;
  height: 100vh;
}

.hero {
  position: absolute;
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  transition: opacity 2s;
  background-image: url('@/assets/hero.png');
}
</style>
