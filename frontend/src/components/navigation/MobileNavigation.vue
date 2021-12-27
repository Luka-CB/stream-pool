<template>
  <div v-if="mobileMode" class="mobile-nav">
    <router-link :to="{name: 'Home'}">
        <img src="@\assets\images\stream-pool-logo-outline-light.png" alt="Site Logo">
    </router-link>
    <i @click="showNavigation" class="fas fa-bars" title="Show Navigation"></i>
    <div v-show="showNav" @click.self="hideNavigation" class="nav-bg">
      <transition name="mobNav">
        <div v-show="showNav" class="nav-container">
          <div class="nav-links">
            <router-link :to="{name: 'Movies'}">Movies</router-link>
            <router-link :to="{name: 'Tvs'}">Tv Shows</router-link>
            <router-link :to="{name: 'About'}">About</router-link>
            <router-link v-if="userInfo" :to="{name: 'Profile', params: {id: userInfo.id}}">Profile</router-link>
          </div>
          <router-link id="nav-btn" :to="{name: 'Signin'}">
            <button v-if="!userInfo" class="btn-outline-dark rounded">Sign In</button>
            <button v-else class="btn-outline-dark rounded" @click="logoutHandler">Sign Out</button>
          </router-link>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { watchEffect } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    name: 'MobileNavigation',
    props: ['mobileMode'],
    setup() {
        const store = useStore()
        const router = useRouter()

        const showNav = ref(false)

        const showNavigation = () => showNav.value = true
        const hideNavigation = () => showNav.value = false

        watchEffect(() => {
            if (showNav.value) {
            document.body.style.overflow = 'hidden'
            } else {
            document.body.style.overflow = 'unset'
            }
        })

        const userInfo = computed(() => store.getters.getUserInfo)
        const logoutSuccess = computed(() => store.getters.getSuccess)

        const logoutHandler = async () => {
          await store.dispatch('logout')

          if (logoutSuccess) {
            await router.push({name: 'Home'})
            window.location.reload()
          }
        }

        return {
            showNav,
            showNavigation,
            hideNavigation,
            userInfo,
            logoutHandler
        }
    }

}
</script>

<style>
  .mobNav-enter-from,
  .mobNav-leave-to {
    opacity: 0;
    transform: translateX(-250px);
  }
  .mobNav-enter-to,
  .mobNav-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
  .mobNav-enter-active,
  .mobNav-enter-active {
    transition: all 0.5s ease-in-out;
  }
</style>