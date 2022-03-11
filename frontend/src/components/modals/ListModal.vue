<template>
  <div v-show="showListModal" @click.self="hideListModal" class="list-modal-bg">
      <div v-if="userInfo" class="list-modal-container">
          <spinner v-show="listLoading" />
          <spinner v-show="addItemLoading" />
          <success-msg v-if="addItemSuccess" :msg="`Added, ${title.length > 15 ? title.substring(0, 15) + ' ...' : title}`" />
          <error-msg v-if="addItemError" :msg="`${title} is already in this list!`" />
          <div :class="['lists', lists && lists.length > 4 && 'scroll']">
              <p v-if="lists && lists.length === 0">No Lists!</p>
              <div v-else v-for="list in lists" :key="list._id" class="list">
                  <div :title="list.isInList ? 'View List' : 'Add to List'">
                    <i v-if="list.isInList" class="fas fa-folder-open"></i>
                    <i v-else class="fas fa-folder-plus"></i>
                    <h5 @click="addToListHandler(list._id, list.isInList)">{{list.title}}</h5>
                  </div>
                  <i @click="showConfigHandler(list._id)" class="fas fa-cog"></i>
              </div>
          </div>
          <hr>
          <div class="create-new-list">
              <button v-show="!showCreateInput" @click="showCreateInput = true" class="cr-btn">Create New List</button>
              <div v-show="showCreateInput" class="input">
                  <input type="text" placeholder="Name your list" v-model="listName">
                  <button @click="createListHandler" class="input-btn">Create</button>
                  <div @click="showCreateInput = false" class="close">
                    <span>X</span>
                  </div>
              </div>
          </div>
          <div v-show="showConfig" @click.self="showConfig = false" class="list-config-bg">
            <div class="list-config-container">
                <input type="text" placeholder="Update List Name" :value="listNameToUpdate" @input="e => listNameToUpdate = e.target.value" >
                <div class="btns">
                    <button @click="updateHandler" class="update">Update List</button>
                    <button @click="deleteHandler" class="delete">Delete List</button>
                </div>
            </div>
           </div>
      </div>

      <div v-else class="not-loggedin">
          <h3>Please <router-link @click="unsetOverflow" :to="{name: 'Signin'}">Sign In</router-link> to Add this to the List!</h3>
      </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import SuccessMsg from '../messages/SuccessMsg.vue'
import ErrorMsg from '../messages/ErrorMsg.vue'
import Spinner from '../Spinner.vue'
import { useRoute, useRouter } from 'vue-router'

export default { 
    name: 'ListModal',
    components: { SuccessMsg, ErrorMsg, Spinner },
    props: ['contentId', 'title', 'userId'],
    setup(props) {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        const showCreateInput = ref(false)
        const showConfig = ref(false)
        const listName = ref('')
        const listId = ref(null)
        const listNameToUpdate = ref('')

        const listLoading = computed(() => store.getters.getListLoading)
        const addItemLoading = computed(() => store.getters.getListItemCrLoading)
        const createListSuccess = computed(() => store.getters.getCreateListSuccess)
        const updateListSuccess = computed(() => store.getters.getUpdateListSuccess)
        const deleteListSuccess = computed(() => store.getters.getDeleteListSuccess)
        const addItemSuccess = computed(() => store.getters.getListItemSuccess)
        const addItemError = computed(() => store.getters.getListItemError)
        const lists = computed(() => store.getters.getAllLists)
        const showListModal = computed(() => store.getters.showListModal)
        const userInfo = computed(() => store.getters.getUserInfo)

        const hideListModal = () => store.commit('HIDE_LIST')
        const unsetOverflow = () => hideListModal()

        store.dispatch('getLists', {
            userId: props.userId,
            contentId: computed(() => route.params.id).value
        })

        const createListHandler = async () => {
            await store.dispatch('createList', listName.value)

            if (createListSuccess.value) {
                showCreateInput.value = false
                store.dispatch('getLists', {
                    userId: props.userId,
                    contentId: computed(() => route.params.id).value
                })
                listName.value = ''
            }
        }

        const showConfigHandler = (id) => {
            showConfig.value = true
            listId.value = id
            const val = lists.value.find(list => list._id === id)
            listNameToUpdate.value = val.title
        }

        const updateHandler = async () => {
            await store.dispatch('updateList', {
                id: listId.value, 
                title: listNameToUpdate.value
            })

            if (updateListSuccess.value) {
                showConfig.value = false
                store.dispatch('getLists', {
                    userId: props.userId,
                    contentId: computed(() => route.params.id).value
                })
            }
        }

        const deleteHandler = async () => {
            await store.dispatch('deleteList', listId.value)

            if (deleteListSuccess.value) {
                showConfig.value = false
                store.dispatch('getLists', {
                    userId: props.userId,
                    contentId: computed(() => route.params.id).value
                })
            }
        }

        const addToListHandler = async (id, isInList) => {
            if (!isInList) {
                await store.dispatch('createListItem', {
                    contentId: props.contentId,
                    listId: id
                })

                if (addItemSuccess.value || addItemError.value) {
                    setTimeout(() => {
                        store.commit('HIDE_MSG')
                    }, 2000)

                    if (addItemSuccess.value) {
                        store.dispatch('getLists', {
                            userId: props.userId,
                            contentId: computed(() => route.params.id).value
                        })
                    }
                }
            } else {
                router.push({name: 'ListDetails', params: {id}})
                hideListModal()
            }
        }

        return {
            showCreateInput, 
            listName, 
            createListHandler, 
            listLoading,
            addItemLoading, 
            addItemSuccess,
            addItemError,
            lists,
            showConfig,
            showConfigHandler,
            showListModal,
            hideListModal,
            listId,
            listNameToUpdate,
            updateHandler,
            deleteHandler,
            addToListHandler,
            userInfo,
            unsetOverflow
        }
    }
}
</script>
