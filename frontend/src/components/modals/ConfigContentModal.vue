<template>
  <div v-show="showConfig" @click.self="hideConfigHandler" class="config-content-bg">
      <div class="config-content-container">
          <loader v-if="loading" text="loading" />
          <div class="del-content">
              <h3>
                Delete
                <span> {{content.title.length > 25 ? content.title.substring(0, 25) + ' ....' : content.title }}</span>
             </h3>
             <small>>>>></small>
             <button @click="showWarning = true">Delete</button>
          </div>
          <div v-show="showWarning" @click.self="showWarning = false" class="warning-bg">
              <div class="warning">
                <h4>Are You Sure?</h4>
                <div class="btns">
                    <button @click="deleteHandler" class="yes">Yes</button>
                    <button @click="showWarning = false" class="no">No</button>
                </div>
              </div>
          </div>
          <hr>
          <div class="conf-form">
              <div class="col-1">
                <input type="text" placeholder="Enter Title" :value="title" @input="e => title = e.target.value" required>
                <input type="text" placeholder="Enter Year" :value="year" @input="e => year = e.target.value" required>
                <textarea type="text" rows="5" placeholder="Enter Description" :value="description" @input="e => description = e.target.value" required></textarea>
                <input type="text" placeholder="Enter Poster Url" :value="posterUrl" @input="e => posterUrl = e.target.value" required>
                <input type="text" placeholder="Enter Video Url" :value="videoUrl" @input="e => videoUrl = e.target.value">
              </div>
              <div class="col-2">
                <div class="radio">
                    <h5>Choose Content Type</h5>
                    <div class="types">
                        <div class="type">
                            <input type="radio" name="type" value="movie" v-model="type" :checked="content.type === 'movie'">
                            <label>Movie</label>
                        </div>
                        <div class="type">
                            <input type="radio" name="type" value="tv" v-model="type" :checked="content.type === 'tv'">
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
                <button class="btn btn-bg-dark" @click="updateHandler">Update "{{content.title.length > 20 ? content.title.substring(0, 20) + ' ....' : content.title}}"</button>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { watchEffect } from '@vue/runtime-core'
import Loader from '../Loader.vue'
import { useRouter } from 'vue-router'

export default {
    name: 'ConfigContentModal',
    components: {Loader},
    props: ['contentType', 'content'],
    setup(props) {
        const store = useStore()
        const router = useRouter()

        const showGenres = ref(false)
        const showWarning = ref(false)
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

        const showConfig = computed(() => store.getters.showContentConfigModal)
        const loading = computed(() => store.getters.getContentLoading)
        const success = computed(() => store.getters.getContentSuccess)
        // const error = computed(() => store.getters.getError)

        const hideConfigHandler = () => store.commit('SHOW_CONTENT_CONFIG', false)

        watchEffect(() => {
            if (showConfig.value) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'unset'
            }

            if (props.content) {
                title.value = props.content.title
                year.value = props.content.year
                description.value = props.content.description
                posterUrl.value = props.content.posterUrl
                videoUrl.value = props.content.videoUrl
                genreValue.value = props.content.genres
                type.value = props.content.type
            }
        })

        const updateHandler = async () => {
            await store.dispatch('updateContent', {
                id: props.content._id,
                title: title.value,
                year: year.value,
                description: description.value,
                posterUrl: posterUrl.value,
                videoUrl: videoUrl.value,
                type: type.value,
                genres: genreValue.value
            })

            if (success.value) {
                hideConfigHandler()
                store.dispatch('getSingleContent', props.content._id)
            }
        }

        const deleteHandler = async () => {
            await store.dispatch('deleteContent', props.content._id)

            if (success.value) {
                hideConfigHandler()
                router.go(-1)
            }
        }


        return {
            showGenres, 
            showConfig,
            showWarning,
            type,
            genreValue, 
            updateHandler, 
            deleteHandler,
            title,
            year,
            description,
            posterUrl,
            videoUrl,
            getPickedGenres,
            hideConfigHandler,
            loading
        }
    }
}
</script>
