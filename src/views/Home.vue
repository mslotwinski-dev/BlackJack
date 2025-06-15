<template>
  <Header />
  <!-- <div class="home">A</div> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '@/components/Header.vue'

export default defineComponent({
  components: {
    Header,
  },
  mounted() {
    document.title = 'Zeus Casino'
  },
})
</script>
