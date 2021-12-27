<template>
  <div v-show="showCreate" @click.self="hideCreateModal" class="config-content-bg">
      <div class="config-content-container">
          <loader v-if="loading" text="Loading" />
          <h2>Create New {{contentType}}</h2>
          <form class="form" @submit.prevent="submitHandler">
              <div class="col-1">
                <input type="text" placeholder="Enter Title" v-model="title" required>
                <input type="text" placeholder="Enter Year" v-model="year" required>
                <textarea type="text" rows="5" placeholder="Enter Description" v-model="description" required></textarea>
                <input type="text" placeholder="Enter Poster Url" v-model="posterUrl" required>
                <input type="text" placeholder="Enter Video Url" v-model="videoUrl">
              </div>
              <div class="col-2">
                <div class="radio">
                    <h5>Choose Content Type</h5>
                    <div class="types">
                        <div class="type">
                            <input type="radio" name="type" value="movie" v-model="type">
                            <label>Movie</label>
                        </div>
                        <div class="type">
                            <input type="radio" name="type" value="tv" v-model="type">
                            <label>Tv</label>
                        </div>
                    </div>
                </div>
                <div class="genres">
                    <span @click="showGenres = true" class="genre-btn">Pick Genres</span>
                    <div v-show="genreValue.length > 0" :class="['picked', genreValue.length > 6 && 'scroll']">
                        <div v-for="(genre, i) in genreValue" :key="i" class="pill">
                            <span>{{genre}}</span>
                        </div>
                    </div>
                    <div v-show="showGenres" @click.self="showGenres = false" class="genre-container-bg">
                        <div class="genre-container">
                            <div class="genres-to-pick">
                                <div class="box">
                                    <input type="checkbox" value="action" v-model="genreValue">
                                    <label>Action</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="adventure" v-model="genreValue">
                                    <label>Adventure</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="animation" v-model="genreValue">
                                    <label>Animation</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="Biography" v-model="genreValue">
                                    <label>Biography</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="comedy" v-model="genreValue">
                                    <label>Comedy</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="crime" v-model="genreValue">
                                    <label>Crime</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="documentary" v-model="genreValue">
                                    <label>Documentary</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="drama" v-model="genreValue">
                                    <label>Drama</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="family" v-model="genreValue">
                                    <label>Family</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="fantasy" v-model="genreValue">
                                    <label>Fantasy</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="history" v-model="genreValue">
                                    <label>History</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="horror" v-model="genreValue">
                                    <label>Horror</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="music" v-model="genreValue">
                                    <label>Music</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="musical" v-model="genreValue">
                                    <label>Musical</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="mystery" v-model="genreValue">
                                    <label>Mystery</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="romance" v-model="genreValue">
                                    <label>Romance</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="sci-fi" v-model="genreValue">
                                    <label>Sci-Fi</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="sport" v-model="genreValue">
                                    <label>Sport</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="thriller" v-model="genreValue">
                                    <label>Thriller</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="war" v-model="genreValue">
                                    <label>War</label>
                                </div>
                                <div class="box">
                                    <input type="checkbox" value="western" v-model="genreValue">
                                    <label>Western</label>
                                </div>
                            </div>
                            <div class="btns">
                                <span @click="showGenres = false" class="cancel">Cancel</span>
                                <span @click="getPickedGenres" :class="genreValue.length === 0 ? 'done-disabled' : 'done'">Done</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="btn btn-bg-dark" type="submit">Create New {{contentType}}</button>
              </div>
          </form>
      </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { watchEffect } from '@vue/runtime-core'
import Loader from '../Loader.vue'
import { useRoute } from 'vue-router'

export default {
    name: 'CreateContentModal',
    components: {Loader},
    props: ['contentType', 'page'],
    setup(props) {
        const store = useStore()
        const route = useRoute()

        const showGenres = ref(false)
        const title = ref('')
        const year = ref('')
        const description = ref('')
        const posterUrl = ref('')
        const videoUrl = ref('')
        const type = ref(null)
        const genreValue = ref([])


        const getPickedGenres = () => {
            if (genreValue.value.length === 0) return
            
            showGenres.value = false
        }

        const showCreate = computed(() => store.getters.showModal)
        const loading = computed(() => store.getters.getContentLoading)
        const success = computed(() => store.getters.getContentSuccess)
        // const error = computed(() => store.getters.getError)

        const hideCreateModal = () => store.commit('HIDE_CREATE')

        watchEffect(() => {
            if (showCreate.value) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'unset'
            }
        })

        const submitHandler = async () => {
            await store.dispatch('createContent', {
                title: title.value,
                year: year.value,
                description: description.value,
                posterUrl: posterUrl.value,
                videoUrl: videoUrl.value,
                type: type.value,
                genres: genreValue.value
            })

            if (success.value) {
                hideCreateModal()

                if (route.name === 'Movies') {
                    store.dispatch('getMovies', {
                        genre: '',
                        year: '',
                        sort: '',
                        page: props.page || 1
                    })
                } else {
                    store.dispatch('getTvs', {
                        genre: '',
                        year: '',
                        sort: '',
                        page: props.page || 1
                    })
                }

                title.value = ''
                year.value = ''
                description.value = ''
                posterUrl.value = ''
                videoUrl.value = ''
                type.value = null
                genreValue.value = []
            }

        }


        return {
            showGenres, 
            showCreate,
            type,
            genreValue, 
            submitHandler, 
            title,
            year,
            description,
            posterUrl,
            videoUrl,
            getPickedGenres,
            hideCreateModal,
            loading
        }
    }
}
</script>
