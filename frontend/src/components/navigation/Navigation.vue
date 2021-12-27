<template>
  <div v-if="navMode && !homePage">
    <div class="navigation">
      <router-link :to="{name: 'Home'}">
        <img src="@\assets\images\stream-pool-logo-outline-light.png" alt="Site Logo" >
      </router-link>
      <nav>
        <div class="nav-links">
          <router-link :to="{name: 'Movies'}">Movies</router-link>
          <router-link :to="{name: 'Tvs'}">Tvs Shows</router-link>
          <router-link :to="{name: 'About'}">About</router-link>
        </div>
        <div class="auth">
          <div class="option" v-show="showUserOption" @mouseleave="showUserOption = false">
            <router-link v-if="userInfo" :to="{name: 'Profile', params: {id: userInfo.id}}">Profile</router-link>
            <button class="btn btn-outline-dark" @click="logoutHandler">Sign Out</button>
          </div>
          <div class="auth-btn">
            <router-link v-if="!userInfo" :to="{name: 'Signin'}"><span>Sign In</span></router-link>
            <div class="icons" v-else @click="showUserOption = !showUserOption" >
              <i v-if="userInfo && userInfo.isAdmin" class="fas fa-user-tie"></i>
              <i v-else class="fas fa-user"></i>
            </div>
          </div>
      </div>
      </nav>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'Navigation',
    props: ['navMode', 'homePage'],
    setup() {
      const store = useStore()
      const router = useRouter()

      const showUserOption = ref(false)

      const userInfo = computed(() => store.getters.getUserInfo)
      const logoutSuccess = computed(() => store.getters.getSuccess)

      const logoutHandler = async () => {
        await store.dispatch('logout')

        if (logoutSuccess) {
          await router.push({name: 'Home'})
          window.location.reload()
        }
      }

      return {userInfo, logoutHandler, showUserOption}
    }
}
</script>

<style>

</style>