<template>
  <div class="search-box">
      <form @submit.prevent="submitHandler">
        <input type="text" placeholder="Search for Movies and Tv Shows" @keyup="queryHandler" required>
        <button type="submit" class="btn btn-outline-primary" :disabled="!queryText">
            <i class="fas fa-search"></i>
        </button>
      </form>
      <search-result :query="queryText" />
  </div>

  <div class="divider"></div>

  <div class="sort-box">
    <div class="by-genre">
        <label>Genre</label>
        <select v-model="selectedGenre">
            <option value="">All</option>
            <option v-for="(genre, i) in genres" :key="i" :value="genre">{{genre}}</option>
        </select>
    </div>

    <div class="by-year">
        <label>Year</label>
        <select v-model="selectedYear">
            <option value="">All</option>
            <option v-for="(year, i) in years" :key="i" :value="year">{{year}}</option>
        </select>
    </div>
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
    <div v-show="userInfo && userInfo.isAdmin" class="config" @click="showCreateModal">
        <i class="fas fa-cog"></i>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import SearchResult from './SearchResult.vue'
import { useRoute, useRouter } from 'vue-router'
import { watchEffect } from '@vue/runtime-core'

export default {
    name: 'SearchAndSort',
    props: ['page'],
    components: {SearchResult},
    setup(props) {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()

        const genres = ['action', 'adventure', 'crime', 'sci-fi', 'thriller', 'drama']
        const years = ['1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022']

        const queryText = ref('')
        const timeOut = ref(null)
        const selectedGenre = ref('')
        const selectedYear = ref('')
        const sort = ref('')


        const userInfo = computed(() => store.getters.getUserInfo)

        const showCreateModal = () => {
            store.commit('SHOW_CREATE')
        }

        watchEffect(() => {
            if (selectedGenre || selectedYear || sort) {
                if (route.name === 'Movies') {
                    store.dispatch('getMovies', {
                        genre: selectedGenre.value,
                        year: selectedYear.value,
                        sort: sort.value,
                        page: props.page || 1
                    })
                } else {
                    store.dispatch('getTvs', {
                        genre: selectedGenre.value,
                        year: selectedYear.value,
                        sort: sort.value,
                        page: props.page || 1
                    })
                }
            }
        })

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
            }, 300)

        }

        const submitHandler = () => router.push({name: 'SearchResult', params: {query: queryText.value}})

        return {
            showCreateModal, 
            userInfo,
            queryText,
            queryHandler,
            submitHandler,
            genres,
            years,
            selectedGenre,
            selectedYear,
            sort
        }
    }
}
</script>

<style>

</style>