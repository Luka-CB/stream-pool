<template>
    <div class="detail-container" @click="hideResultBar">
        <div class="search">
            <form @submit.prevent="submitHandler">
                <input type="text" placeholder="Search for Movies or Tv Shows" @keyup="queryHandler" required>
                <button class="btn btn-outline-primary" type="submit"><i class="fas fa-search"></i></button>
            </form>
            <search-result :query="queryText" />
        </div>
        <div class="config-container">
            <back color="color-light" />
        </div>
        <hr>
        <div class="video-player">
            <div v-if="!content.videoUrl" class="no-video">
                <div class="info">
                    <i class="fas fa-video-slash"></i>
                    <hr>
                    <h4>No {{content ? content.type === 'movie' ? 'Movie' : 'Tv Show' : 'Video'}}!</h4>
                </div>
            </div>
            <video-player v-else :url="content.videoUrl" />
        </div> 
        <div class="info-box">
            <div class="col-1">
                <img :src="content.posterUrl" :alt="content.title">
                <div class="activity">
                    <div class="star" @click="showRating" :title="content.type === 'movie' ? 'Rate This Movie' : 'Rate This Tv Show'">
                        <i v-if="content.isRated" title="Rated" class="fas fa-star fill"></i>
                        <i v-else class="far fa-star"></i>
                    </div>
                    <div @click="showList" class="w-list" :title="content.type === 'movie' ? 'Add This Movie to the List' : 'Add This Tv Show to the List'">
                        <i class="far fa-plus-square"></i>
                    </div>
                    <div v-if="userInfo && userInfo.isAdmin" @click="showConfigHandler" class="config">
                        <i class="fas fa-cog"></i>
                    </div>

                </div>
            </div>
            <div class="col-2">
                <h1>{{content.title}}</h1>
                <div class="rating">
                    <div class="avg">
                        <i class="fas fa-star"></i>
                        <span class="avg-num">{{content.rating?.avgRating.toFixed(1)}}</span>
                    </div>
                    <div class="user-rating">
                        <i v-if="rate" class="fas fa-star"></i>
                        <span v-if="rate" class="user-num">{{rate.value}}</span>
                    </div>
                </div>
                <h3>{{content.year}}</h3>
                <div v-for="(genre, i) in content.genres" :key="i" class="genres">
                    <h5>{{genre}}</h5>
                </div>
                <div class="votes">
                    <span>Votes | {{content.rating?.count}}</span>
                </div>
                <p>{{content.description}}</p>
            </div>
        </div>
        <hr>
        <div class="comment-section">
            <comment-section :contentId="id" />
        </div>

        <rating :contentId="id" :rate="rate" />
        <list-modal :contentId="id" :title="content.title" :userId="userInfo && userInfo.id" />
        <config-content-modal :content="content" />
    </div>

</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import {useStore} from 'vuex'
import { computed, ref} from '@vue/reactivity'
import { watchEffect } from '@vue/runtime-core'
import VideoPlayer from '../components/VideoPlayer.vue'
import CommentSection from '../components/CommentSection.vue'
import Rating from "../components/modals/Rating.vue"
import ListModal from "../components/modals/ListModal.vue"
import SearchResult from '../components/SearchResult.vue'
import Back from '../components/Back.vue'
import ConfigContentModal from '../components/modals/ConfigContentModal.vue'
import {useHead} from '@vueuse/head'


export default { 
    name: 'Details',
    components: {
        VideoPlayer, 
        CommentSection,
        Rating,
        ListModal,
        SearchResult,
        Back,
        ConfigContentModal,
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const store = useStore()

        const queryText = ref('')
        const timeOut = ref(null)

        const id = computed(() => route.params.id)
        const content = computed(() => store.getters.getContent)
        const rate = computed(() => store.getters.getRateNum)
        const userInfo = computed(() => store.getters.getUserInfo)
        const showRatingModal = computed(() => store.getters.showRatingModal)
        const showListModal = computed(() => store.getters.showListModal)

        const showRating = () => store.commit('SHOW_RATING')
        const showList = () => store.commit('SHOW_LIST')
        const hideResultBar = () => store.commit('HIDE_RESULT_BAR')
        const showConfigHandler = () => store.commit('SHOW_CONTENT_CONFIG', true)

        useHead({
            title: computed(() => content.value.title)
        })

        watchEffect(() => {
            if (showRatingModal.value || showListModal.value) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'unset'
            }

            store.dispatch('getRating', id.value)
        })

        store.dispatch('getSingleContent', {
            contentId: id.value,
            userId: userInfo.value?.id || ''
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
            }, 500)

        }

        const submitHandler = () => router.push({name: 'SearchResult', params: {query: queryText.value}})


        return {
            content, 
            showRating, 
            showConfigHandler,
            id, 
            rate, 
            userInfo,
            showList,
            queryHandler,
            hideResultBar,
            queryText,
            submitHandler
        }
    }
}
</script>

<style>
</style>