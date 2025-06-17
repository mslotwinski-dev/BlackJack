<template>
  <div class="moved" />
  <div class="container">
    <div class="header">
      <h1>Zeus Casino</h1>
      <div class="cash">
        Budżet: <span>{{ formatCurrency(cash.getCash) }}</span>
      </div>
    </div>

    <section class="work-section">
      <nav class="work-links">
        <router-link
          v-for="work in works"
          :key="work.id"
          :to="work.link"
          class="work-link"
          >{{ work.id }}</router-link
        >
      </nav>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCashStore } from '@/store/cash'

export default defineComponent({
  data() {
    return {
      works: [
        { id: 'Zbieraj mirabelki', link: '/gernot' },
        // { id: 'Zostań barmanem', link: '/barman' },
        // { id: 'Sprzedawaj nieruchomości', link: '/estate' },
        { id: 'Lataj z Wizz Air', link: '/wizzair' },
      ],
      cash: useCashStore(),
    }
  },
  mounted() {
    document.title = 'Zeus Casino | Cash'
  },
  methods: {
    formatCurrency(value: number) {
      return value.toLocaleString('pl-PL', {
        style: 'currency',
        currency: 'EUR',
      })
    },
  },
})
</script>

<style scoped lang="scss">
.container {
  margin: 40px auto;
  padding: 20px;
  color: #eee;
  max-width: 1000px;
  border-radius: 12px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header h1 {
  font-weight: 400;
  font-size: 30px;
  color: #f5a623; /* złoty kolor */
  text-shadow: 0 0 6px #f5a623cc;
  font-family: 'Alfa Slab One', serif;
}

.cash {
  font-weight: 600;
  font-size: 1.2rem;
  background: #333;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: inset 0 0 5px #f5a623aa;
}

.cash span {
  color: #f5a623;
  font-weight: 700;
}

.work-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.work-link {
  display: block;
  background: $main2;
  color: $light;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.25);
}

.work-link:hover {
  color: #fff;
  transform: translateX(6px);
  box-shadow: 0 4px 12px darken($main, 10%);
}
</style>
