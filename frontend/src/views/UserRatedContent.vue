<template>
  <div class="user-rated-content-container">
      <div class="urc-header">
        <h3>Your Ratings</h3>
        <div class="right">
          <div class="sorting">
            <label>Sort By: </label>
            <select v-model="pickRatings">
              <option value="">All Ratings</option>
              <option v-for="(rt, i) in [...Array(10)]" :key="i" :value="i + 1">{{i + 1}} Rating</option>
            </select>
            <div class="arrows">
              <div v-if="sort === 'asc'" @click="sort ='desc'" class="asc">
                  <i class="fas fa-long-arrow-alt-up"></i>
                  <i class="fas fa-long-arrow-alt-down"></i>
              </div>
              <div v-else-if="sort === 'desc'" @click="sort = 'asc'" class="desc">
                  <i class="fas fa-long-arrow-alt-up"></i>
                  <i class="fas fa-long-arrow-alt-down"></i>
              </div>
              <div v-else @click="sort = 'asc'" class="none">
                  <i class="fas fa-long-arrow-alt-up"></i>
                  <i class="fas fa-long-arrow-alt-down"></i>
              </div>
            </div>
          </div>
          <div class="count">
            <h4>{{documentFormated.length}} of {{docCount}} <small>Titles</small></h4>
          </div>
        </div>
      </div>
      <hr>
      <div class="urc-body">
        <loader v-if="loading" text="loading" />
        <p v-if="pagination.totalDocs === 0" class="not-found">No Ratings!</p>
        <div v-for="doc in documentFormated" :key="doc._id" class="list">
          <div class="image">
            <img :src="doc.content.posterUrl" :alt="doc.content.title">
          </div>
          <div class="info">
            <router-link :to="{name: 'Details', params: {type: doc.content.type, id: doc.content._id}}">
              <h4>{{doc.content.title}} <small>( {{doc.content.year}} )</small></h4>
            </router-link>
            <div class="ratings">
              <div class="avg">
                <i class="fas fa-star"></i>
                <span class="num">{{doc.content.rating.avgRating.toFixed(1)}}</span>
                <small>( {{doc.content.rating.count}} votes )</small>
              </div>
              <div @click="showRatingHandler({id: doc.content._id, rateVal: doc.value})" class="user">
                <i class="fas fa-star"></i>
                <span class="num">{{doc.value}}</span>
              </div>
            </div>
            <div class="rated-at">Rated on {{doc.createdAt}}</div>
            <div class="genres">
              <div v-for="(genre, i) in doc.content.genres" :key="i">
                <span>{{genre}}</span>
              </div>
            </div>
            <p class="desc">{{doc.content.description.substring(0, 450)}} ...</p>
          </div>

          <rating :contentId="ratingData.id" :rate="{value: ratingData.rateVal}" />
        </div>

        <div v-show="pagination.totalDocs > 30" class="urc-pagination">
          <span @click="firstPageHandler" :class="!pagination.prevPage ? 'first-disabled' : 'first'">First</span>
          <div class="divider"></div>
          <span @click="prevPageHandler" :class="!pagination.prevPage ? 'prev-disabled' : 'prev'">Prev</span>
          <span class="page">{{pagination.page}} of {{pagination.totalPages}}</span>
          <span @click="nextPageHandler" :class="!pagination.nextPage ? 'next-disabled' : 'next'">Next</span>
        </div>
      </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { watchEffect } from '@vue/runtime-core'
import {format} from 'date-fns'
import Loader from '../components/Loader.vue'
import Rating from '../components/modals/Rating.vue'
import {useHead} from '@vueuse/head'

export default {
    name: 'UserRatedContnt',
    components: {Loader, Rating},
    setup() {
      const store = useStore()
      const route = useRoute()

      const pickRatings = ref('')
      const sort = ref('')
      const ratingData = ref({})

      const page = computed(() => route.query.page)
      const documents = computed(() => store.getters.getAllRatedContent)
      const docCount = computed(() => store.getters.getRatedContentCount)
      const pagination = computed(() => store.getters.getRatedContentPagination)
      const loading = computed(() => store.getters.getContentLoading)

      useHead({
        title: computed(() => `Your Ratings (${docCount.value})`)
      })

      const documentFormated = computed(() => {
        if (documents.value) {
          return documents.value.map(doc => {
            let time = format(new Date(doc.createdAt), 'MMMM dd - yyyy')
            return {...doc, createdAt: time}
          })
        }
      })

      watchEffect(() => {
        store.dispatch('getRatedContent', {
          rating: pickRatings.value || '',
          sort: sort.value || '',
          page: page.value || ''
        })
      })

      const firstPageHandler = () => {
        if (pagination.value.prevPage) {
          window.history.pushState(null, null, `?page=1`)
          window.location.reload()
        }
      }

      const prevPageHandler = () => {
        if (pagination.value.prevPage) {
          window.history.pushState(null, null, `?page=${pagination.value.prevPage}`)
          window.location.reload()
        }
      }

      const nextPageHandler = () => {
        if (pagination.value.nextPage) {
          window.history.pushState(null, null, `?page=${pagination.value.nextPage}`)
          window.location.reload()
        }
      }

      const showRatingHandler = (data) => {
        store.commit('SHOW_RATING')
        ratingData.value = data
      }

      return {
        pickRatings,
        sort,
        documentFormated,
        docCount,
        pagination,
        firstPageHandler,
        prevPageHandler,
        nextPageHandler,
        loading,
        showRatingHandler,
        ratingData
      }
    }
}
</script>