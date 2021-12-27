<template>
  <div class="auth-container">
      <loader text="Signing In" v-if="loading" />
      <h1>Sign In</h1>
      <form @submit.prevent="signInHandler">
          <div class="input-box">
              <label>Email</label>
              <input type="email" placeholder="Enter Existing Email" v-model="email" required>
          </div>
          <div class="input-box">
              <label>Password</label>
              <input type="password" placeholder="Enter Password" v-model="password" required>
          </div>
          <div class="err">{{error}}</div>
          <button class="btn btn-outline-primary" type="submit">Sign In</button>
      </form>
      <h4>Don't have an account? <router-link :to="{name: 'Signup'}">Sign Up</router-link></h4>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import Loader from '../components/Loader.vue'
import {useHead} from "@vueuse/head"

export default {
    name: 'Signin',
    components: {Loader},
    setup() {
        const store = useStore()

        const email = ref('')
        const password = ref('')

        useHead({
            title: 'Sign In | Stream-Pool'
        })

        const loading = computed(() => store.getters.getLoading)
        const success = computed(() => store.getters.getSuccess)
        const error = computed(() => store.getters.getError)

        const signInHandler = async () => {
            await store.dispatch('signin', {
                email: email.value,
                password: password.value
            })

            if (success.value) window.location.reload()
        }

        return {
            loading,
            error,
            email,
            password,
            signInHandler
        }
    }
}
</script>
