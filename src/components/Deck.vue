<template>
  <div class="section">
    <div class="header">
      {{ header }}
      <div class="sum">({{ sum }})</div>
    </div>
    <div class="cards">
      <Card v-for="card in deck" :key="card.name" :card="card" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from './Card.vue'

export default defineComponent({
  props: ['deck', 'sum', 'header'],
  components: { Card },
})
</script>

<style lang="scss" scoped>
.header {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 15px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  .sum {
    font-size: 15px;
    font-weight: 400;
  }
}

.section {
  margin: 5px;
  padding: 5px;
}

.score {
  margin: 10px;
  font-weight: bold;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  height: 180px;
}
</style>
