<template>
  <div class="main-page-search-form">
    <form @submit.prevent="submitHandler">
      <input type="text" placeholder="Search for Movies and Tv Shows" @keyup="queryHandler" required>
      <button class="btn btn-outline-primary btn-m" type="submit">Search</button>
    </form>
    <search-result :query="queryText" />
  </div>
  <div class="recently-added">
    <div class="movies">
      <h4>Recently Added Movies</h4>
      <div class="box">
        <div v-for="movie in movies" :key="movie._id">
          <router-link :to="{name: 'Details', params: {type: movie.type, id: movie._id}}">
            <img :src="movie.posterUrl" :alt="movie.title">
            <div class="text" :title="movie.title">
              <h6 class="title">{{movie.title.length > 12 ? movie.title.substring(0, 12) + ' ...' : movie.title}}</h6>
              <h6>{{movie.year}}</h6>
              <div class="rating">
                  <div class="avg">
                      <i class="fas fa-star"></i>
                      <span v-if="movie.rating.avgRating !== null" class="avg-num">{{movie.rating.avgRating.toFixed(1)}}</span>
                  </div>
                  <div class="user-rating">
                      <div v-for="rating in ratings" :key="rating._id">
                        <i v-if="rating.content === movie._id" class="fas fa-star"></i>
                      </div>
                      <div v-for="rating in ratings" :key="rating._id">
                        <span v-if="rating.content === movie._id" class="user-num">{{rating.value}}</span>
                      </div>
                  </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="tvs">
      <h4>Recently Added Tv Shows</h4>
      <div class="box">
        <div v-for="tv in tvs" :key="tv._id">
          <router-link :to="{name: 'Details', params: {type: tv.type, id: tv._id}}">
            <img :src="tv.posterUrl" :alt="tv.title">
            <div class="text" :title="tv.title">
              <h6 class="title">{{tv.title.length > 12 ? tv.title.substring(0, 12) + ' ...' : tv.title}}</h6>
              <h6>{{tv.year}}</h6>
              <div class="rating">
                  <div class="avg">
                      <i class="fas fa-star"></i>
                      <span v-if="tv.rating.avgRating !== null" class="avg-num">{{tv.rating.avgRating.toFixed(1)}}</span>
                  </div>
                  <div class="user-rating">
                      <div v-for="rating in ratings" :key="rating._id">
                        <i v-if="rating.content === tv._id" class="fas fa-star"></i>
                      </div>
                      <div v-for="rating in ratings" :key="rating._id">
                        <span v-if="rating.content === tv._id" class="user-num">{{rating.value}}</span>
                      </div>
                  </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import {useStore} from 'vuex'
import SearchResult from './SearchResult.vue'
import { useRouter } from 'vue-router'

export default {
    name: 'DarkHalf',
    components: {SearchResult},
    setup() {
      const store = useStore()
      const router = useRouter()

      const queryText = ref('')
      const timeOut = ref(null)

      const movies = computed(() => store.getters.getLatestMovies)
      const tvs = computed(() => store.getters.getLatestTvs)
      const ratings = computed(() => store.getters.getRatings)

      store.dispatch('getMovies')
      store.dispatch('getTvs')
      store.dispatch('getRatings')

      const queryHandler = (e) => {
        queryText.value = e.target.value

        if (e.target.value) {
            store.commit('SHOW_RESULT_BAR')
        } else {
            store.commit('HIDE_RESULT_BAR')
        }

        clearTimeout(timeOut.value)

        timeOut.value = setTimeout(() => {
            if (e.target.value) {
                store.dispatch('getSearchedContent', e.target.value)
            }
        }, 500)
      }

      const submitHandler = () => router.push({name: 'SearchResult', params: {query: queryText.value}})

      return {
        movies, 
        tvs, 
        ratings, 
        queryHandler,
        queryText,
        submitHandler
      }
    }
}
</script>

<style>

</style>