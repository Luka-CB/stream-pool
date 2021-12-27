<template>
  <navigation :nav-mode="navView" :home-page="isHomePage" />
  <mobile-navigation :mobile-mode="mobView" />
  <router-view />
</template>

<script>
import { ref } from '@vue/reactivity'
import { onMounted, onUnmounted, watchEffect } from '@vue/runtime-core'
import {useRoute} from 'vue-router'
import Navigation from './components/navigation/Navigation.vue'
import MobileNavigation from './components/navigation/MobileNavigation.vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  components: {
    Navigation,
    MobileNavigation
  },

  setup() {
    const mobView = ref(false)
    const navView = ref(false)
    const isHomePage = ref(false)
    const windowWidth = ref(window.innerWidth)

    const route = useRoute()
    const store = useStore()

    const onWidthChange = () => windowWidth.value = window.innerWidth

    onMounted(() => window.addEventListener('resize', onWidthChange))
    onUnmounted(() => window.addEventListener('resize', onWidthChange))

    watchEffect(() => {
      if (windowWidth.value <= 1000) {
        mobView.value = true
        navView.value = false
      } else {
        navView.value = true
        mobView.value = false
      }
    })

    watchEffect(() => {
      if (route.name === 'Home') {
        isHomePage.value = true
      } else {
        isHomePage.value = false
      }
    })

    return {
      mobView,
      navView,
      isHomePage
    }
  },
}
</script>

<style></style>
