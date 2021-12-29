<template>
  <div @click="hideResultBar" class="content-container">
    <div class="search-and-sort">
      <search-and-sort :page="page" />
    </div>
    <div class="content">
      <loader v-if="loading && tvs.length === 0" text="loading" />
      <info-msg v-if="!loading && !tvs.length" text="No Tv Shows!" />
      <media-content :media="tvs" :ratings="ratings" />
    </div>
    <div class="paginate">
      <pagination :paginationData="paginationData" :count="count" pathName="Tvs" contentNum="12" />
    </div>
    <create-content-modal contentType="Tv Show" :page="page" />
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
import { watchEffect } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import {useHead} from '@vueuse/head'

export default {
    name: 'Tvs',
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
        title: 'Tv Shows'
      })

      const tvs = computed(() => store.getters.getAllTvs)
      const loading = computed(() => store.getters.getContentLoading)
      const ratings = computed(() => store.getters.getRatings)
      const paginationData = computed(() => store.getters.getTvPaginationData)
      const count = computed(() => store.getters.getTvCount)
      const page = computed(() => route.query.page)

      watchEffect(() => {
        store.dispatch('getTvs', {
          genre: '',
          year: '',
          sort: '',
          page: page.value || ''
        })
      })

      store.dispatch('getRatings')

      const hideResultBar = () => store.commit('HIDE_RESULT_BAR')

      return {
        tvs, 
        loading, 
        ratings, 
        hideResultBar,
        paginationData,
        count,
        page
      }
    }
}
</script>