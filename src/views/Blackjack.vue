<template>
  <div class="moved"></div>
  <div class="home">
    <Game :key="key" />
    <button @click="key++">RESET</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Game from '@/components/Blackjack.vue'
export default defineComponent({
  components: {
    Game,
  },
  data() {
    return {
      key: 0,
    }
  },
  mounted() {
    document.title = 'BlackJack | Zeus Cassino'
  },
})
</script>
