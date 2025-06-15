<template>
  <div class="card">
    <!-- {{ card }} -->
    <div class="margin">
      <img class="icon" :src="icons[card.suit]" />
      <div class="short" v-html="card.short" />
    </div>

    <div class="content" v-if="card.value < 10 || card.name == '10'">
      <img
        class="icon small"
        v-for="i in card.value"
        :key="i"
        :src="icons[card.suit]"
      />
    </div>
    <div class="content" v-if="card.value == 0">
      <img class="icon ace" :src="icons[card.suit]" />
    </div>

    <div class="content" v-if="card.value == 10">
      <ic
        class="cardicon"
        :class="{ rose: card.suit == 'Hearts' || card.suit == 'Diamonds' }"
        :icon="icons[card.short]"
      />
    </div>

    <div class="margin reversed">
      <img class="icon" :src="icons[card.suit]" />
      <div class="short" v-html="card.short" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import heart from '@/assets/cards/heart.svg'
import diamond from '@/assets/cards/diamond.svg'
import club from '@/assets/cards/club.svg'
import spade from '@/assets/cards/spade.svg'

export default defineComponent({
  props: ['card'],
  data() {
    return {
      icons: {
        Hearts: heart,
        Diamonds: diamond,
        Clubs: club,
        Spades: spade,
        J: 'star',
        Q: 'chess-queen',
        K: 'chess-king',
      },
      movedby: 0,
    }
  },
  mounted() {
    this.movedby = Math.floor(Math.random() * 10) - 5
    this.$el.style.transform = `translateY(${this.movedby}px)`
  },
})
</script>

<style lang="scss" scoped>
.card {
  width: 110px;
  height: 176px;
  background-color: $light;
  border-radius: 10px;
  color: $dark;
  display: flex;
  padding: 5px;
}

.icon {
  width: 25px;
  height: 25px;
  &.small {
    width: 15px;
    height: 15px;
  }
  &.ace {
    width: 40px;
    height: 40px;
  }
}

.content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-grow: 1;
}

.margin {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  &.reversed {
    transform: rotate(180deg);
  }
}

.cardicon {
  font-size: 30px;
}

.rose {
  color: $rose;
}
</style>
