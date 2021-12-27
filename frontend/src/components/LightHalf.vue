<template>
  <div v-if="navView">
    <div class="main-page-nav">
      <div class="auth">
        <div class="auth-btn">
          <router-link v-if="!user" :to="{name: 'Signin'}"><span>Sign In</span></router-link>
          <div class="icons" v-else @click="showUserOption = !showUserOption" >
            <i v-if="user && user.isAdmin" class="fas fa-user-tie"></i>
            <i v-else class="fas fa-user"></i>
          </div>
        </div>
        <div v-show="showUserOption" @mouseleave="showUserOption = false" class="option">
          <router-link v-if="user" :to="{name: 'Profile', params: {id: user.id}}"><span>Profile</span></router-link>
          <button class="btn btn-outline-light" @click="logoutHandler">Sign Out</button>
        </div>
      </div>
      <div class="nav-links">
        <router-link :to="{name: 'Movies'}"><span>Movies</span></router-link>
        <router-link :to="{name: 'Tvs'}"><span>Tv Shows</span></router-link>
        <router-link :to="{name: 'About'}"><span>About</span></router-link>
      </div>
    </div>
    <div class="light-side-body">
      <div class="text-box">
        <h1>Stream Pool</h1>
        <p>Place where you can watch any movies and tv shows</p>
      </div>
      <img src="@\assets\images\stream-pool-logo-outline-alt.png" alt="Site Logo">
    </div>
  </div>

</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { onMounted, onUnmounted, watchEffect } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default {
    name: 'LightHalf',
    components: {},
    setup() {
      const store = useStore()

      const showUserOption = ref(false)

      const navView = ref(false)
      const windowWidth = ref(window.innerWidth)

      const onWidthChange = () => windowWidth.value = window.innerWidth

      onMounted(() => window.addEventListener('resize', onWidthChange))
      onUnmounted(() => window.addEventListener('resize', onWidthChange))

      const user = computed(() => store.getters.getUserInfo)
      const logoutSuccess = computed(() => store.getters.getSuccess)

      watchEffect(() => {
        if (windowWidth.value >= 1000) {
          navView.value = true
        } else {
          navView.value = false
        }
      })

      const logoutHandler = async () => {
        await store.dispatch('logout')

        if (logoutSuccess) {
          window.location.reload()
        }
      }

      return {
        navView,
        logoutHandler,
        user,
        showUserOption
      }
    }
}
</script>
