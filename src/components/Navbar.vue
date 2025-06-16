<template>
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

      <div>
        <router-link to="/roulette">Ruletka</router-link>
      </div>
      <div>
        <router-link to="/slots">Automaty</router-link>
      </div>
      <router-link to="/cash">
        <div class="cash">
          <ic icon="coins" />
          <div class="money" v-html="formatCurrency(cash.getCash)" />
        </div>
      </router-link>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCashStore } from '@/store/cash'

export default defineComponent({
  data() {
    return {
      cash: useCashStore(),
    }
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

<style lang="scss" scoped>
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

.cash {
  display: flex;

  font-size: 20px;
  align-items: center;
  gap: 10px;
  color: $light;

  .money {
    font-size: 18px;
    text-shadow: none;
  }
}
</style>
