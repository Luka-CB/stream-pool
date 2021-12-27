<template>
  <div v-show="showDelModal" @click.self="hideDelModalHandler" class="del-account-bg">
      <div class="del-account-container">
          <spinner v-if="loading" />
          <h3>Are you sure? - Your ratings, comments and lists will also be deleted!</h3>
          <div class="btns">
              <button @click="deleteAccountHandler" class="btn btn-outline-danger delete">Delete</button>
              <button @click="hideDelModalHandler" class="btn btn-outline-dark cancel">Cancel</button>
          </div>
      </div>
  </div>
</template>

<script>
import { computed } from '@vue/reactivity'
import { useStore } from 'vuex'
import { watchEffect } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import Spinner from '../Spinner.vue'

export default {
    name: 'DeleteAccount',
    components: { Spinner },
    setup() {
        const store = useStore()
        const router = useRouter()

        const showDelModal = computed(() => store.getters.showDeleteAccountModal)
        const loading = computed(() => store.getters.getLoading)
        const success = computed(() => store.getters.getSuccess)

        const hideDelModalHandler = () => store.commit('SHOW_DELETE_ACCOUNT', false)

        watchEffect(() => {
            if (showDelModal.value) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'unset'
            }
        })

        const deleteAccountHandler = async () => {
            await store.dispatch('deleteUser')

            if (success.value) {
                await router.push({name: 'Home'})
                window.location.reload()
            }
        }

        return {
            showDelModal,
            hideDelModalHandler,
            deleteAccountHandler,
            loading
        }
    }
}
</script>