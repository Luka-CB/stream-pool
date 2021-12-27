<template>
  <div class="result-container">
      <div class="top">
        <back color="color-light" />
        <div class="count">
            <h3>{{count}} <small>Results</small></h3>
        </div>
      </div>
      <hr>
      <p v-if="searchRes && searchRes.content.length === 0" class="no-res">No Result!</p>
      <div v-for="res in searchRes.content" :key="res._id" class="list">
          <img :src="res.posterUrl" :alt="res.title">
          <div class="info">
              <div class="col-1">
                <router-link :to="{name: 'Details', params: {type: res.type, id: res._id}}">
                    <h2>{{res.title}} <small>( {{res.year}} )</small></h2>
                </router-link>
                <div class="rating">
                    <div class="avg"> 
                        <i class="fas fa-star"></i>
                        <span v-if="res.rating.avgRating !== null" class="avg-num">{{res.rating.avgRating.toFixed(1)}}</span>
                    </div>
                    <div class="user-rating">
                        <div v-for="rating in ratings" :key="rating._id">
                            <i v-if="rating.content === res._id" class="fas fa-star"></i>
                        </div>
                        <div v-for="rating in ratings" :key="rating._id">
                            <span v-if="rating.content === res._id" class="user-num">{{rating.value}}</span>
                        </div>
                    </div>
                </div>
                <div class="genre">
                    <div v-for="(genre, i) in res.genres" :key="i">
                        <span>{{genre}}</span>
                    </div>
                </div>
                <p class="desc">{{res.description.length > 900 ? res.description.substring(0, 900) + ' ....' : res.description}}</p>
                <p class="desc-mobile">{{res.description.length > 200 ? res.description.substring(0, 200) + ' ....' : res.description}}</p>
              </div>
              <div class="col-2">
                  <div class="type">
                      <span>Type</span>
                      <hr>
                      <h5>{{res.type}}</h5>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Back from '../components/Back.vue'
import {useHead} from "@vueuse/head"

export default {
    name: 'ResultPage',
    components: { Back },
    setup() {
        const route = useRoute()
        const store = useStore()

        const query = computed(() => route.params.query)
        const searchRes = computed(() => store.getters.getFullSearchResult)
        const count = computed(() => store.getters.getSearchResultCount)
        const ratings = computed(() => store.getters.getRatings)

        useHead({
            title: computed(() => `Search Result (${count.value})`)
        })

        store.dispatch('getSearchedContent', query.value)
        store.dispatch('getRatings')

        return {
            searchRes,
            ratings,
            count
        }
    }

}
</script>