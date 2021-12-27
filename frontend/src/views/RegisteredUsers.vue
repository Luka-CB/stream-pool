<template>
  <div class="reg-users-container">
    <div class="reg-users-header">
      <h1>Registered Users</h1>
      <div class="right">
        <div class="search-user">
          <input type="text" class="search-input" placeholder="Search by username or email" @keyup="queryHandler">
          <div @click="searchBox" class="search-btn">
            <i class="fas fa-search"></i>
          </div>
        </div>
        <div class="search-user-large">
          <input type="text" class="search-input" placeholder="Search by username or email" @keyup="queryHandler">
        </div>
        <div class="sort-count">
          <div class="sort">
            <div v-if="sort === 'asc'" @click="sort ='desc'" class="asc">
              <i class="fas fa-long-arrow-alt-up"></i>
              <i class="fas fa-long-arrow-alt-down"></i>
            </div>
            <div v-else-if="sort === 'desc'" @click="sort = 'asc'" class="desc">
                <i class="fas fa-long-arrow-alt-up"></i>
                <i class="fas fa-long-arrow-alt-down"></i>
            </div>
            <div v-else @click="sort = 'asc'" class="none">
                <i class="fas fa-long-arrow-alt-up"></i>
                <i class="fas fa-long-arrow-alt-down"></i>
            </div>
          </div>
          <div class="count">
            <h3>{{pagination.totalDocs}} <small>{{pagination.totalDocs > 1 ? 'Users' : 'User'}}</small></h3>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="user-list">
      <loader v-if="loading" text="loading" />
      <div class="ids">
        <h4>User Id</h4>
        <div v-for="user in usersFormated" :key="user._id" class="list">
          <span class="id">{{user._id}}</span>
        </div>
      </div>

      <div class="names">
        <h4>Username</h4>
        <div v-for="user in usersFormated" :key="user._id" class="list">
          <span :title="user.username" class="name">{{user.username.length > 16 ? user.username.substring(0, 16) + ' ...' : user.username}}</span>
        </div>
      </div>

      <div class="emails">
        <h4>User Email</h4>
        <div v-for="user in usersFormated" :key="user._id" class="list">
          <span :title="user.email" class="email">{{user.email.length > 16 ? user.email.substring(0, 16) + ' ...' : user.email}}</span>
        </div>
      </div>

      <div class="created-at">
        <h4>Created At</h4>
        <div v-for="user in usersFormated" :key="user._id" class="list">
          <span class="name">{{user.createdAt}}</span>
        </div>
      </div>

      <div class="is-admin">
        <h4>Is Admin</h4>
        <div v-for="user in usersFormated" :key="user._id" class="list">
          <span v-if="user.isAdmin"><i class="fas fa-check"></i></span>
          <span v-else ><i class="fas fa-times"></i></span>
          <div class="config">
            <i 
              @click="editUserHandler({
                id: user._id, 
                username: user.username, 
                email: user.email,
                isAdmin: user.isAdmin
              })" 
              class="fas fa-user-edit">
            </i>
            <i @click="showDeleteUserHandler(user._id)" class="fas fa-user-times"></i>
          </div>
        </div>
      </div>

    </div>

    <div v-if="pagination.totalDocs >= 30" class="user-pagination">
      <span @click="firstPageHandler" :class="!pagination.prevPage ? 'first-disabled' : 'first'">First</span>
      <span class="pagination-divider"></span>
      <span @click="prevPageHandler" :class="!pagination.prevPage ? 'prev-disabled' : 'prev'">Prev</span>
      <span class="page">{{pagination.page}} of {{pagination.totalPages}}</span>
      <span @click="nextPageHandler" :class="!pagination.nextPage ? 'next-disabled' : 'next'">Next</span>
    </div> 

    <admin-user-edit :user="userData" :page="page" />

    <div v-show="showDeleteUser" @click.self="showDeleteUser = false" class="delete-user-bg">
      <div class="delete-user-container">
        <spinner v-if="delUserLoading" />
        <p>Are You Sure?</p>
        <div class="btns">
          <button @click="adminDeleteUserHandler" class="btn btn-outline-danger yes">Yes</button>
          <button @click="showDeleteUser = false" class="btn btn-outline-dark no">No</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import {format} from 'date-fns'
import Loader from '../components/Loader.vue'
import { watchEffect } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import AdminUserEdit from '../components/modals/AdminUserEdit.vue'
import Spinner from '../components/Spinner.vue'
import {useHead} from "@vueuse/head"

export default {
    name: "RegisteredUser",
    components: { Loader, AdminUserEdit, Spinner },
    setup() {
      const store = useStore()
      const route = useRoute()

      const sort = ref('')
      const extendSearchBox = ref(false)
      const queryText = ref('')
      const timeOut = ref(null)
      const userData = ref({})
      const showDeleteUser = ref(false)
      const userId = ref(null)

      const page = computed(() => route.query.page)
      const users = computed(() => store.getters.getAllUsers)
      const pagination = computed(() => store.getters.getUserPagination)
      const loading = computed(() => store.getters.getLoading)
      const delUserLoading = computed(() => store.getters.getDeleteUserLoading)
      const success = computed(() => store.getters.getSuccess)

      useHead({
        title: computed(() => `Admin | All Users (${pagination.value.totalDocs ? pagination.value.totalDocs : 0})`)
      })

      const usersFormated = computed(() => {
        if (users.value) {
          return users.value.map(user => {
            let time = format(new Date(user.createdAt), 'dd/MM/yyyy')
            return {...user, createdAt: time}
          })
        }
      })

      watchEffect(() => {
        if (showDeleteUser.value) {
          document.body.style.overflow = 'hidden'
        } else {
          document.body.style.overflow = 'unset'
        }

        store.dispatch('getUsers', {
          sort: sort.value,
          search: '',
          page: page.value || ''
        })
      })

      const searchBox = () => {
        extendSearchBox.value = !extendSearchBox.value

        const searchBox = document.querySelector('.search-user')
        const searchInput = document.querySelector('.search-input')

        if (extendSearchBox.value) {
          searchBox.style.width = '200px'
          searchInput.style.display = 'block'
        } else {
          searchBox.style.width = '40px'
          searchInput.style.display = 'none'
        }
      }

      const queryHandler = (e) => {
        queryText.value = e.target.value

        clearTimeout(timeOut.value)

        timeOut.value = setTimeout(() => {
          store.dispatch('getUsers', {
            sort: sort.value,
            search: e.target.value,
            page: page.value || ''
          })
        }, 500)

      }

      const prevPageHandler = () => {
        if (pagination.value.prevPage) {
          window.history.pushState(null, null, `?page=${pagination.value.prevPage}`)
          window.location.reload()
        }
      }

      const nextPageHandler = () => {
        if (pagination.value.nextPage) {
          window.history.pushState(null, null, `?page=${pagination.value.nextPage}`)
          window.location.reload()
        }
      }

      const firstPageHandler = () => {
        if (pagination.value.prevPage) {
          window.history.pushState(null, null, `?page=1`)
          window.location.reload()
        }
      }

      const editUserHandler = (user) => {
        store.commit('SHOW_ADMIN_USER_EDIT', true)
        userData.value = user
      }

      const showDeleteUserHandler = (id) => {
        showDeleteUser.value = true
        userId.value = id
      }

      const adminDeleteUserHandler = async () => {
        await store.dispatch('adminDeleteUser', userId.value)

        if (success.value) {
          showDeleteUser.value = false
          store.dispatch('getUsers', {
            sort: sort.value,
            search: queryText.value || '',
            page: page.value || ''
          })
        }
      }


      return {
        usersFormated,
        loading,
        delUserLoading,
        sort,
        searchBox,
        queryHandler,
        pagination,
        prevPageHandler,
        nextPageHandler,
        firstPageHandler,
        editUserHandler,
        userData,
        page,
        showDeleteUser,
        userId,
        showDeleteUserHandler,
        adminDeleteUserHandler
      }
    }
}
</script>