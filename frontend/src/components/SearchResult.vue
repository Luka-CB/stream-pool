<template>
  <div v-show="showResult" @click="e => e.stopPropagation()" class="search-result">
    <span v-if="searchResult && searchResult.length === 0" class="no-res">No Result!</span>
    <div class="content">
        <spinner v-if="loading" />
        <div class="list" v-for="res in searchResult" :key="res._id">
            <img :src="res.posterUrl" :alt="res.title">
            <div class="info">
                <div class="col-1">
                    <h5 @click="goToDetailsPageHandler({type: res.type, id: res._id})">{{res.title}} - <small>( {{res.year}} )</small></h5>
                    <div class="genre">
                        <div v-for="(genre, i) in res.genres" :key="i">
                            <span>{{genre}}</span>
                        </div>
                    </div>
                    <p class="desc">{{res.description.substring(0, 250)}} ....</p>
                    <p class="desc-mobile">{{res.description.substring(0, 40)}} ....</p>
                </div>
                <div class="col-2">
                    <div class="type">
                        <span>Type</span>
                        <hr>
                        <h6>{{res.type}}</h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-show="searchResult && searchResult.length >= 3" class="more">
        <span @click="goToResultPageHandler" class="more-res">See more result</span>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import Spinner from './Spinner.vue'
import { useRouter } from 'vue-router'

export default {
    name: 'SearchResult',
    components: {Spinner},
    props: ['query'],
    setup(props) {
        const store = useStore()
        const router = useRouter()

        const showResult = computed(() => store.getters.showResultBar)
        const searchResult = computed(() => store.getters.getSearchResult) 
        const loading = computed(() => store.getters.getContentLoading)

        const goToDetailsPageHandler = data => {
            router.push({name: 'Details', params: {type: data.type, id: data.id}})
            store.commit('HIDE_RESULT_BAR')
        }

        const goToResultPageHandler = () => {
            router.push({name: 'SearchResult', params: {query: props.query }})
            store.commit('HIDE_RESULT_BAR')
        }

        return {
            showResult,
            searchResult,
            loading,
            goToDetailsPageHandler,
            goToResultPageHandler
        }
    }

}
</script>