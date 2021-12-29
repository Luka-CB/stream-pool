<template>
  <div @click="hideResultBar" class="content-container">
    <div class="search-and-sort">
      <search-and-sort :page="page" />
    </div>
    <div class="content">
      <loader v-if="loading && movies.length === 0" text="loading" />
      <info-msg v-if="!loading && !movies.length" text="No Movies!" />
      <media-content :media="movies" :ratings="ratings" />
    </div>
    <div class="paginate">
      <pagination :paginationData="paginationData" :count="count" pathName="Movies" contentNum="12" />
    </div>
    <create-content-modal contentType="Movie" :page="page" />
  </div>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import SearchAndSort from '../components/SearchAndSort.vue'
import MediaContent from '../components/MediaContent.vue'
import CreateContentModal from '../components/modals/CreateContentModal.vue'
import Loader from '../components/Loader.vue'
import InfoMsg from '../components/InfoMsg.vue'
import Pagination from '../components/Pagination.vue'
import { useRoute } from 'vue-router'
import { watchEffect } from '@vue/runtime-core'
import {useHead} from '@vueuse/head'

export default {
    name: 'Movies',
    components: {
      SearchAndSort, 
      MediaContent, 
      CreateContentModal, 
      Loader,
      InfoMsg,
      Pagination
    },
    setup() {
      const store = useStore()
      const route = useRoute()

      useHead({
        title: 'Movies'
      })

      const movies = computed(() => store.getters.getAllMovies)
      const loading = computed(() => store.getters.getContentLoading)
      const ratings = computed(() => store.getters.getRatings)
      const paginationData = computed(() => store.getters.getMoviePaginationData)
      const count = computed(() => store.getters.getMovieCount)
      const page = computed(() => route.query.page)

      watchEffect(() => {
        store.dispatch('getMovies', {
          genre: '',
          year: '',
          sort: '',
          page: page.value || ''
        })
      })

      store.dispatch('getRatings')

      const hideResultBar = () => store.commit('HIDE_RESULT_BAR')

      return {
        movies, 
        loading, 
        ratings, 
        hideResultBar,
        paginationData,
        page,
        count
      }
    }
}
</script>