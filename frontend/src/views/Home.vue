<template>
  <main class="main-page-container">
    <section class="dark" @click="hideResultBar">
      <DarkHalf />
    </section>
    <section class="light">
      <LightHalf />
    </section>
  </main>
</template>

<script>
import DarkHalf from '@/components/DarkHalf.vue'
import LightHalf from '@/components/LightHalf.vue'
import { useStore } from 'vuex'
import {useHead} from '@vueuse/head'

export default {
  name: 'Home',
  components: {
    DarkHalf,
    LightHalf
  },
  setup() {
    const store = useStore()

    useHead({
      title: 'Welcome | Stream-Pool'
    })

    const hideResultBar = () => store.commit('HIDE_RESULT_BAR')

    store.dispatch('getMovies', {
      genre: '',
      year: '',
      sort: '',
      page: ''
    })
    store.dispatch('getTvs', {
      genre: '',
      year: '',
      sort: '',
      page: ''
    })

    return {hideResultBar}
  }
}
</script>

