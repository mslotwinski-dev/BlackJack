<template>
  <div class="moved" />
  <div class="game" @click="start(), plane.Boost()">
    <div class="plane" :style="{ bottom: plane.y + 'px' }" />
    <div
      class="coin"
      v-for="coin in coins"
      :key="coin"
      :style="{
        left: coin.x + 'px',
        top: coin.y + 'px',
      }"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useCashStore } from '@/store/cash'

class Plane {
  y = 400 // Pozycja startowa na środku ekranu
  vy = 0
  gravity = 0.6

  // ✅ Dodajemy stałe wymiary i pozycję X dla łatwiejszego dostępu
  x = 80 // Zgodnie z CSS .plane { left: 80px; }
  width = 310
  height = 100

  Update() {
    this.vy += this.gravity
    this.y -= this.vy

    const gameHeight = 800
    if (this.y < 0) {
      this.y = 0
      this.vy = 0
    }
    if (this.y > gameHeight - this.height) {
      this.y = gameHeight - this.height
      this.vy = 0
    }
  }

  Boost() {
    this.vy = -12
  }
}

class Coin {
  x: number
  y: number

  // ✅ Dodajemy wymiary monety
  width = 100
  height = 100

  constructor() {
    const gameHeight = 800
    // Poprawiony zakres Y, aby moneta nie pojawiała się zbyt blisko krawędzi
    const minY = 50 // 50px od góry
    const maxY = gameHeight - 50 // 50px od dołu

    this.y = Math.random() * (maxY - minY) + minY
    this.x = 1200 + 50 // Pojawia się za prawą krawędzią
  }

  // ✅ Całkowicie nowa, poprawna logika kolizji (AABB)
  CheckCollision(plane: Plane): boolean {
    const gameHeight = 800

    // Granice monety (jej x, y to środek, ze względu na transform: translate)
    const coinLeft = this.x - this.width / 2
    const coinRight = this.x + this.width / 2
    const coinTop = this.y - this.height / 2
    const coinBottom = this.y + this.height / 2

    // Granice samolotu
    const planeLeft = plane.x
    const planeRight = plane.x + plane.width
    // Przeliczamy współrzędną Y samolotu z 'bottom' na 'top'
    const planeTop = gameHeight - plane.y - plane.height
    const planeBottom = gameHeight - plane.y

    // Sprawdzenie, czy prostokąty (bounding boxes) na siebie nachodzą
    return (
      planeLeft < coinRight &&
      planeRight > coinLeft &&
      planeTop < coinBottom &&
      planeBottom > coinTop
    )
  }
}

export default defineComponent({
  components: {},
  data() {
    return {
      plane: new Plane(),
      started: false,
      intervalId: 0 as number | undefined,
      spawnIntervalId: 0 as number | undefined,
      coins: [] as Coin[],
      cash: useCashStore(),
    }
  },
  methods: {
    start() {
      if (this.started) return
      this.started = true

      const gameLoop = () => {
        this.plane.Update()

        const coinsToKeep: Coin[] = []
        for (const coin of this.coins) {
          coin.x -= 5 // Przesuwamy monetę

          // ✅ Poprawione wywołanie z przekazaniem całego obiektu samolotu
          if (coin.CheckCollision(this.plane)) {
            // Kolizja nastąpiła, więc NIE dodajemy monety do nowej tablicy
            // Tutaj możesz dodać punkty, dźwięk itp.
            this.cash.addCash(7.5)
          } else if (coin.x < -coin.width) {
            // Moneta wyleciała za ekran, również jej nie zatrzymujemy
          } else {
            // Jeśli nie ma kolizji i moneta jest na ekranie, zatrzymujemy ją
            coinsToKeep.push(coin)
          }
        }

        // ✅ Bezpiecznie nadpisujemy tablicę monet nową, przefiltrowaną tablicą
        this.coins = coinsToKeep

        this.intervalId = window.requestAnimationFrame(gameLoop)
      }
      gameLoop()
      window.addEventListener('keydown', this.handleKeydown)

      this.spawnIntervalId = window.setInterval(() => {
        if (this.started) {
          // Tworzymy monety tylko, gdy gra się rozpoczęła
          this.coins.push(new Coin())
        }
      }, 2000)
    },

    handleKeydown(event: KeyboardEvent) {
      if (event.code === 'Space') {
        event.preventDefault()
        !this.started ? this.start() : this.plane.Boost()
      }
    },
  },
  mounted() {
    document.title = 'Zeus Casino | Cash'
  },
  beforeUnmount() {
    if (this.intervalId) cancelAnimationFrame(this.intervalId)
    if (this.spawnIntervalId) clearInterval(this.spawnIntervalId)

    window.removeEventListener('keydown', this.handleKeydown)
  },
})
</script>

<style scoped lang="scss">
.game {
  background: $light;
  border-radius: 12px;
  width: 1200px;
  height: 800px;
  margin: 0 auto;
  background-image: url('@/assets/work/city.png');
  background-size: cover;
  background-position: center;
  overflow: hidden;
  position: relative; /* ✅ Niezbędne dla pozycjonowania absolutnego potomka */
  cursor: pointer; /* ✅ Zmiana kursora, by wskazać interaktywny obszar */
}

.plane {
  position: absolute;
  /* Ustawienie stałej pozycji horyzontalnej */
  left: 80px;
  width: 310px;
  height: 100px;
  background-image: url('@/assets/work/plane.png');
  background-size: cover;
  /* ❌ Usunięto 'transition', aby ruch był w pełni kontrolowany przez JS */
}

.coin {
  position: absolute;
  width: 100px;
  height: 100px;
  background-image: url('@/assets/work/zeton.png');
  background-size: cover;
  background-position: center;
  transform: translate(-50%, -50%);
}
</style>
