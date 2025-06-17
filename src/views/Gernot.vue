<template>
  <!-- <div class="home">A</div> -->
  <div class="moved" />
  <div class="game">
    <div
      class="plum"
      v-for="plum in plums"
      :key="plum"
      @click="cash.addCash(3), (plum.clicked = true)"
      :style="{
        left: plum.x + 'px',
        top: plum.y + 'px',
      }"
    />
  </div>
</template>

<script lang="ts">
import { useCashStore } from '@/store/cash'
import { defineComponent } from 'vue'

class Plum {
  x: number
  y: number
  clicked = false

  constructor() {
    const minX = 75
    const maxX = 1125
    const step = 50

    // liczba możliwych pozycji
    const positionsCount = Math.floor((maxX - minX) / step) + 1

    const posIndex = Math.floor(Math.random() * positionsCount)

    this.x = minX + posIndex * step
    this.y = -50
  }
}

export default defineComponent({
  data() {
    return {
      plums: [new Plum()],
      intervalId: 0 as number | undefined,
      spawnIntervalId: 0 as number | undefined,
      cash: useCashStore(),
    }
  },
  components: {},
  mounted() {
    document.title = 'Zeus Casino | Cash'

    this.intervalId = window.setInterval(() => {
      this.plums.forEach((plum) => {
        plum.y += 4 * 0.75
      })

      // Usuwamy śliwki, które spadły poniżej 850
      this.plums = this.plums.filter(
        (plum) => plum.y < 850 && plum.clicked === false
      )
    }, 8)

    this.spawnIntervalId = window.setInterval(() => {
      this.plums.push(new Plum())
    }, 500)
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    if (this.spawnIntervalId) clearInterval(this.spawnIntervalId)
  },
})
</script>

<style scoped lang="scss">
.game {
  background: $light;
  border-radius: 12px;
  padding: 20px;
  width: 1200px;
  height: 800px;
  margin: 0 auto;
  background-image: url('@/assets/work/sad.png');
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.plum {
  position: absolute;
  width: 100px;
  height: 100px;
  background-image: url('@/assets/work/plum.png');
  background-size: cover;
  background-position: center;
  transform: translate(-50%, -50%);
}
</style>
