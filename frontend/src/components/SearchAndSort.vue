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

        const genres = ['action', 'adventure', 'animation', 'biography', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy', 'history', 'horror', 'music', 'musical', 'mystery', 'romance', 'sci-fi', 'sport', 'thriller', 'war', 'western']
        const years = ['2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990', '1989', '1988', '1987', '1986', '1985', '1984', '1983', '1982', '1981', '1980', '1979', '1978', '1977', '1976', '1975', '1974', '1973', '1972', '1971', '1970']

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