<template>
  <div class="auth-container">
      <loader text="signing up" v-if="loading" />
      <h1>Sign Up</h1>
      <form @submit.prevent="signUpHandler">
          <div class="err">{{error}}</div>
          <div class="input-box">
              <label>User Name</label>
              <input type="text" placeholder="Enter User Name" v-model="username" required>
          </div>
          <div class="input-box">
              <label>Email</label>
              <input type="email" placeholder="Enter Existing Email" v-model="email" required>
          </div>
          <div class="input-box">
              <label>Password</label>
              <input type="password" placeholder="Enter Password" v-model="password" required>
          </div>
          <div class="input-box">
              <label>Confirm Password</label>
              <input type="password" placeholder="Retype Password" v-model="confirmPassword" required>
              <div class="err">{{errMsg}}</div>
          </div>
          <button class="btn btn-outline-primary" type="submit">Sign Up</button>
      </form>
      <h4>Already have an account? <router-link :to="{name: 'Signin'}">Sign In</router-link></h4>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Loader from '../components/Loader.vue'
import {useHead} from "@vueuse/head"

export default {
    name: 'signup',
    components: {Loader},
    setup() {
        const store = useStore()
        const router = useRouter()

        const username = ref('')
        const email = ref('')
        const password = ref('')
        const confirmPassword = ref('')
        const errMsg = ref('')

        useHead({
            title: 'Sign Up | Stream-Pool'
        })

        const loading = computed(() => store.getters.getLoading)
        const success = computed(() => store.getters.getSuccess)
        const error = computed(() => store.getters.getError)

        const signUpHandler = async () => {
            if (password.value !== confirmPassword.value) {
                errMsg.value = 'Passwords Do not Match!'
                return
            } 
                
            await store.dispatch('signup', {
                username: username.value,
                email: email.value,
                password: password.value
            })

            if (success.value) router.push({name: 'Home'})

        }

        return {
            username,
            email,
            password,
            confirmPassword,
            signUpHandler,
            error,
            loading,
            errMsg
        }
    }

}
</script>