<template>
  <div class="section">
    <div class="header">{{ header }} ({{ sum }})</div>
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
  font-size: 25px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
}

.section {
  margin: 10px;
  padding: 10px;
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
