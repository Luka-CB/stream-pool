<template>
  <div v-show="show" @click.self="hide" class="rating-bg">
      <div v-if="userInfo" class="rating-container">
          <loader v-if="loading" text="rating" />
          <div class="rated-val">
              <span class="num">{{rating ? rating : rate ? rate.value : '?'}}</span>
          </div>
          <div class="stars">
              <div v-for="(val, i) in rateVal" :key="i">
                  <label>
                    <input type="radio" name="rating" :value="i + 1" @click="getValue" >
                    <div v-if="i + 1 <= (hover || rating || (rate && rate.value)) " class="star-fill" @mouseenter="hover = i + 1" @mouseleave="hover = null">
                        <i class="fas fa-star"></i>
                    </div>
                    <div v-else class="star" @mouseenter="hover = i + 1" @mouseleave="hover = null">
                        <i class="far fa-star"></i>
                    </div>
                  </label>
              </div>
          </div>
          <div class="btns">
              <button :class="[!rating ? 'disabled' : 'rate-btn']" @click="saveRating" :disabled="!rating">Rate</button>
              <button :class="[!rate ? 'disabled' : 'del-btn']" @click="deleteRatingHandler" :disabled="!rate">Delete</button>
          </div>
      </div>
 
      <div v-else class="not-loggedin">
          <h3>Please <router-link @click="unsetOverflow" :to="{name: 'Signin'}">Sign In</router-link> to Be Able to Rate!</h3>
      </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import Loader from '../Loader.vue'

export default {
    name: 'Rating',
    components: {Loader},
    props: ['contentId', 'rate'],
    setup(props) {
        const store = useStore()

        const rateVal = ref([...Array(10)])
        const rating = ref(null)
        const hover = ref(null)

        const getValue = (e) => rating.value = e.target.value

        const loading = computed(() => store.getters.getRatingLoading)
        const success = computed(() => store.getters.getRatingSuccess)
        const show = computed(() => store.getters.showRatingModal)
        const userInfo = computed(() => store.getters.getUserInfo)

        const hide = () => store.commit('HIDE_RATING')
        const unsetOverflow = () => hide()

        const saveRating = async () => {
            await store.dispatch('createRating', {
                rateNum: rating.value, 
                contentId: props.contentId
            })

            if (success.value) {
                hide()
                rating.value = null
            }
        }

        const deleteRatingHandler = async () => {
            await store.dispatch('deleteRating', props.rate._id)

            if (success.value) {
                hide()
                window.location.reload()
            }
        }


        return {
            rateVal, 
            show, 
            hide, 
            rating, 
            getValue, 
            hover, 
            saveRating, 
            loading, 
            deleteRatingHandler,
            userInfo,
            unsetOverflow
        }
    }
}
</script>
