<template>
    <div v-show="showUpdModal" @click.self="hideUpdModalHandler" class="update-account-bg">
        <div class="update-account-container">
            <loader v-if="loading" text="updating" />
            <h1>Update Account Credentials</h1>
            <form @submit.prevent="submitHandler">
                <div class="input-box">
                    <label>User Name</label>
                    <input type="text" placeholder="Enter User Name" :value="profInfo.username" @input="e => username = e.target.value">
                </div>
                <div class="input-box">
                    <label>Email</label>
                    <input type="email" placeholder="Enter Existing Email" :value="profInfo.email" @input="e => email = e.target.value">
                </div>
                <div class="input-box">
                    <label>Password</label>
                    <input type="password" placeholder="Enter Password" v-model="password">
                </div>
                <button class="btn btn-outline-primary upd-btn" type="submit">Update</button>
            </form>
        </div>
    </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { watchEffect } from '@vue/runtime-core'
import Loader from '../Loader.vue'

export default {
    name: 'UpdateAccount',
    components: {Loader},
    props: ['profInfo'],
    setup() {
        const store = useStore()

        const username = ref('')
        const email = ref('')
        const password = ref('')

        const showUpdModal = computed(() => store.getters.showUpdateAccountModal)
        const loading = computed(() => store.getters.getLoading)
        const success = computed(() => store.getters.getSuccess)

        watchEffect(() => {
            if (showUpdModal.value) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'unset'
            }
        })

        const hideUpdModalHandler = () => store.commit('SHOW_UPDATE_ACCOUNT', false)

        const submitHandler = async () => {
            await store.dispatch('updateUser', {
                username: username.value,
                email: email.value,
                password: password.value
            })

            if (success.value) {
                hideUpdModalHandler()
                password.value = ''
                store.dispatch('userProfile')
            }
        }

        return {
            showUpdModal,
            hideUpdModalHandler,
            username,
            email,
            password,
            submitHandler,
            loading
        }
    }
}
</script>