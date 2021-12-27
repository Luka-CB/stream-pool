<template>
  <div class="profile-container">
    <div class="user-info">
      <div class="profile-pic">
        <img src="/dummy-profile.png" alt="Dummy Profile Picture">
      </div>
      <div class="col-2">
        <div class="info">
          <h2>{{profileInfo.username}} <span>( {{profileInfo.email}} )</span></h2>
          <h4>Registered <small>{{registeredAt}} ago</small></h4>
        </div>
        <div class="config">
          <router-link v-if="userInfo && userInfo.isAdmin" :to="{name: 'RegisteredUsers'}">
            <button class="users">Registered Users</button>
          </router-link>
          <button @click="showUpdModalHandler" class="upd-account">Update Account</button>
          <button @click="showDelModalHandler" class="del-account">Delete Account</button>
        </div>
      </div>
    </div>

    <update-account :profInfo="profileInfo" />
    <delete-account />

<!-- USER ACTIVITIES -->
    <div class="user-activities">
      <div class="rated-items">
        <h2>Your Ratings</h2>

        <div v-if="smItemView" class="list">
          <div class="items">
            <div v-for="item in displayItemsSm" :key="item._id">
              <div class="poster">
                <img :src="item.content.posterUrl" :alt="item.content.title">
                <div class="ratings">
                  <div :title="`${item.content.rating.avgRating.toFixed(1)} based on ${item.content.rating.count} votes`" class="avg-rating">
                    <i class="fas fa-star"></i>
                    <span class="num">{{item.content.rating.avgRating.toFixed(1)}}</span>
                  </div>
                  <div class="user-rating">
                    <i class="fas fa-star"></i>
                    <span class="num">{{item.value}}</span>
                  </div>
                </div>
              </div>
              <div class="info">
                <router-link :to="{name: 'Details', params: {type: item.content.type, id: item.content._id}}">
                  <h4>{{item.content.title.length > 17 ? item.content.title.substring(0, 17) + ' ...' : item.content.title}}</h4>
                </router-link>
                <h6>( {{item.content.year}} )</h6>
              </div>
            </div>
          </div>
          <div class="see-all">
            <router-link :to="{name: 'UserRatedContent', params: {id: profileInfo._id}}">See all {{ratedItemsCount}} ratings</router-link>
          </div>
        </div>

        <div v-else-if="xsItemView" class="list">
          <div class="items">
            <div v-for="item in displayItemsXs" :key="item._id">
              <div class="poster">
                <img :src="item.content.posterUrl" :alt="item.content.title">
                <div class="ratings">
                  <div :title="`${item.content.rating.avgRating.toFixed(1)} based on ${item.content.rating.count} votes`" class="avg-rating">
                    <i class="fas fa-star"></i>
                    <span class="num">{{item.content.rating.avgRating.toFixed(1)}}</span>
                  </div>
                  <div class="user-rating">
                    <i class="fas fa-star"></i>
                    <span class="num">{{item.value}}</span>
                  </div>
                </div>
              </div>
              <div class="info">
                <router-link :to="{name: 'Details', params: {type: item.content.type, id: item.content._id}}">
                  <h4>{{item.content.title.length > 17 ? item.content.title.substring(0, 17) + ' ...' : item.content.title}}</h4>
                </router-link>
                <h6>( {{item.content.year}} )</h6>
              </div>
            </div>
          </div>
          <div class="see-all">
            <router-link :to="{name: 'UserRatedContent', params: {id: profileInfo._id}}">See all {{ratedItemsCount}} ratings</router-link>
          </div>
        </div>

        <div v-else class="list">
          <div class="items">
            <div v-for="item in displayItems" :key="item._id">
              <div class="poster">
                <img :src="item.content.posterUrl" :alt="item.content.title">
                <div class="ratings">
                  <div :title="`${item.content.rating.avgRating.toFixed(1)} based on ${item.content.rating.count} votes`" class="avg-rating">
                    <i class="fas fa-star"></i>
                    <span class="num">{{item.content.rating.avgRating.toFixed(1)}}</span>
                  </div>
                  <div class="user-rating">
                    <i class="fas fa-star"></i>
                    <span class="num">{{item.value}}</span>
                  </div>
                </div>
              </div>
              <div class="info">
                <router-link :to="{name: 'Details', params: {type: item.content.type, id: item.content._id}}">
                  <h4>{{item.content.title.length > 17 ? item.content.title.substring(0, 17) + ' ...' : item.content.title}}</h4>
                </router-link>
                <h6>( {{item.content.year}} )</h6>
              </div>
            </div>
          </div>
          <div class="see-all">
            <router-link :to="{name: 'UserRatedContent', params: {id: profileInfo._id}}">See all {{ratedItemsCount}} ratings</router-link>
          </div>
        </div>
      </div>

      <div class="user-lists">
        <user-lists :lists="lists" :userId="userId" />
      </div>
    </div>
  </div>
</template>  

<script>
import { computed, reactive, ref } from '@vue/reactivity'
import { onMounted, onUnmounted, watchEffect } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import {formatDistanceToNow} from 'date-fns'
import UserLists from '../components/UserLists.vue'
import UpdateAccount from '../components/modals/updateAccount.vue'
import DeleteAccount from '../components/modals/DeleteAccount.vue'
import {useHead} from '@vueuse/head'

export default {
  name: 'Profile',
  components: { UserLists, UpdateAccount, DeleteAccount },
  setup() {
    const store = useStore()
    const route = useRoute()

    const profileInfo = computed(() => store.getters.getProfileInfo)
    const userInfo = computed(() => store.getters.getUserInfo)
    const ratedItemsCount = computed(() => store.getters.getRatedContentCount)
    const lists = computed(() => store.getters.getAllLists)
    const displayItems = computed(() => store.getters.getRatedContentForDisplay)
    const displayItemsSm = computed(() => store.getters.getRatedContentForDisplaySm)
    const displayItemsXs = computed(() => store.getters.getRatedContentForDisplayXs)
    const userId = computed(() => route.params.id)

    const registeredAt = computed(() => formatDistanceToNow(new Date(profileInfo.value.createdAt)))

    const meta = reactive({
      title: `Profile | ${userInfo ? userInfo.value.username : 'User'}`
    })

    useHead({
      title: computed(() => meta.title)
    })

    const smItemView = ref(false)
    const xsItemView = ref(false)
    const windowWidth = ref(window.innerWidth)
    const onWidthChange = () => windowWidth.value = window.innerWidth

    onMounted(() => window.addEventListener('resize', onWidthChange))
    onUnmounted(() => window.addEventListener('resize', onWidthChange))

    watchEffect(() => {
      if (windowWidth.value <= 650 && windowWidth.value >= 400) {
        smItemView.value = true
      } else if (windowWidth.value <= 400) {
        smItemView.value = false
        xsItemView.value = true
      } else {
        smItemView.value = false
        xsItemView.value = false
      }

      store.dispatch('getRatedContent', {
        rating: '',
        sort: '',
        page: ''
      })
    })

    const showUpdModalHandler = () => store.commit('SHOW_UPDATE_ACCOUNT', true)
    const showDelModalHandler = () => store.commit('SHOW_DELETE_ACCOUNT', true)

    store.dispatch('userProfile')
    store.dispatch('getLists', userId.value)


    return {
      profileInfo,
      userInfo,
      registeredAt,
      displayItems,
      displayItemsSm,
      displayItemsXs,
      ratedItemsCount,
      lists,
      userId,
      smItemView,
      xsItemView,
      showUpdModalHandler,
      showDelModalHandler
    }
  }
}
</script>