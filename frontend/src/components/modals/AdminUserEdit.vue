<template>
  <div v-show="showAdminUserEdit" @click.self="hideAdminUserEdit" class="admin-user-edit-bg">
      <div class="admin-user-edit-container">
          <spinner v-if="loading" />
          <h2>Edit User</h2>
          <form @submit.prevent="submitHandler">
              <div class="input-box">
                  <label>Username</label>
                  <input type="text" placeholder="Edit Username" :value="user.username" @input="e => username = e.target.value">
              </div>
              <div class="input-box">
                  <label>Email</label>
                  <input type="email" placeholder="Edit Email" :value="user.email" @input="e => email = e.target.value" >
              </div>
              <div class="input-checkbox">
                  <label>Make User Admin</label>
                  <input type="checkbox" v-model="isAdmin" :checked="user.isAdmin" >
              </div>
              <button class="btn btn-outline-dark">Edit</button>
          </form>
      </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import Spinner from '../Spinner.vue'
import { watchEffect } from '@vue/runtime-core'

export default {
    name: 'AdminUserEdit',
    components: { Spinner },
    props: ['user', 'page'],
    setup(props) {
        const store = useStore()

        const username = ref('')
        const email = ref('')
        const isAdmin = ref(null)

        const showAdminUserEdit = computed(() => store.getters.showAdminUserEditModal)
        const loading = computed(() => store.getters.getEditUserLoading)
        const success = computed(() => store.getters.getSuccess)

        const hideAdminUserEdit = () => store.commit('SHOW_ADMIN_USER_EDIT', false)

        watchEffect(() => {
            if (showAdminUserEdit.value) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'unset'
            }
        })

        const submitHandler = async () => {
            await store.dispatch('adminEditUser', {
                id: props.user.id,
                username: username.value,
                email: email.value,
                isAdmin: isAdmin.value
            })

            if (success.value) {
                hideAdminUserEdit()
                store.dispatch('getUsers', {
                    sort: '',
                    search: '',
                    page: props.page || ''
                })
            }
        }

        return {
            showAdminUserEdit,
            hideAdminUserEdit,
            username,
            email,
            isAdmin,
            submitHandler,
            loading
        }
    }
}
</script>