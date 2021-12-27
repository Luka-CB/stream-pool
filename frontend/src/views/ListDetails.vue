<template>
  <div @click="showRes = false" class="list-details-container">
      <div class="header">
          <div v-show="activeState" class="active-state">
              <h1>{{list.title}}</h1>
              <div class="col-2">
                  <span class="cr-date">Created {{createdAt}} ago</span>
                  <div @click="[activeState = false, editState = true]" class="gear">
                      <i class="fas fa-cog"></i>
                  </div>
              </div>
          </div>
          <div v-show="editState" class="edit-state">
              <success-msg v-if="updateListSuccess" msg="List Name Updated" />
              <div class="update">
                <input type="text" placeholder="Update List Title" :value="list.title" @input="e => updTitle = e.target.value">
                <button @click="updateTitleHandler" class="upd-btn">{{listLoading ? 'Updating...' : 'Update'}}</button>
              </div>
              <div class="col-2">
                  <div class="search">
                      <input class="search-input" type="text" placeholder="Add movies or tv shows" v-model="searchText" @keyup="queryHandler">
                      <div v-show="showRes" @click="e => e.stopPropagation()" class="search-res">
                          <spinner v-if="listItemCreateLoading" />
                          <spinner v-if="searchLoading" />
                          <error-msg v-if="listItemError" :msg="listItemError"  />
                          <p class="no-res" v-if="result && result.length === 0">No Result!</p>
                          <div v-for="res in result" :key="res._id">
                            <h4 @click="addToListHandler(res._id)">{{res.title}} <small>( {{res.year}} )</small></h4>
                          </div>
                      </div>
                  </div>
                  <div class="btns">
                    <span 
                        @click="deleteItemsHandler" 
                        :class="listItemIds.length !== 0 ? 'del' : 'del-disabled'"
                    >
                        {{listItemDeleteLoading ? 'Deleting...' : listItemIds.length > 0 ? `Delete (${listItemIds.length})` : 'Delete'}}
                    </span>
                    <span @click="showDelWarn = true" class="del-list">Delete List</span>
                    <i @click="[editState = false, activeState = true]" class="fas fa-times-circle"></i>
                  </div>
              </div>
          </div>
      </div>
      <hr>
      <div class="list-body">
        <h3 v-if="listItems.length === 0" class="empty">The list is empty!</h3>
        <div class="item-header">
            <div class="left">
                <back :path="{name: 'Profile', params: {id: list.userId._id}}" color="color-dark" />
            </div>
            <div class="right">
                <div class="arrows">
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
                <h3>{{listCount}} <small>{{listCount === 1 || 0 ? 'title' : 'titles'}}</small></h3>
            </div>
        </div>
        <div class="list-items">
            <div v-for="item in listItems" :key="item._id" class="list-item">
                <input v-if="editState" type="checkbox" class="check" :value="item._id" v-model="listItemIds">
                <div class="image">
                    <img :src="item.contentId.posterUrl" :alt="item.contentId.title">
                </div>
                <div class="info">
                    <router-link :to="{name: 'Details', params: {type: item.contentId.type, id: item.contentId._id}}">
                        <div class="title">
                            <h2>{{item.contentId.title}}</h2>
                            <small>( {{item.contentId.year}} )</small>
                        </div>
                    </router-link>
                    <div class="ratings">
                        <div class="avg-rating">
                            <i class="fas fa-star"></i>
                            <span class="num">{{item.contentId.rating.avgRating.toFixed(1)}}</span>
                        </div>
                        <div @click="showRatingHandler(item.contentId._id)" class="user-rating">
                            <div v-for="rating in ratings" :key="rating._id">
                                <i v-if="rating.content === item.contentId._id" class="fas fa-star"></i>
                            </div>
                            <div v-for="rating in ratings" :key="rating._id">
                                <span v-if="rating.content === item.contentId._id" class="num">{{rating.value}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="genres">
                        <div v-for="(genre, i) in item.contentId.genres" :key="i">
                            <span>{{genre}}</span>
                        </div>
                    </div>
                    <p class="desc">{{item.contentId.description.substring(0, 250)}} ....</p>
                </div>

                <rating :contentId="contentId" :rate="rate" />
            </div>
        </div>
        <div v-if="paginationData.totalDocs > 30" class="paginate">
            <pagination :paginationData="paginationData" :count="listCount" contentNum="30" />
        </div>
      </div>

      <div v-show="showDelWarn" @click.self="showDelWarn = false" class="del-warning-bg">
          <div class="del-warning-container">
              <spinner v-if="listLoading" />
              <p>Are You Sure?</p>
              <div class="warn-btns">
                  <button @click="deleteListHandler" class="yes btn btn-outline-danger">Yes</button>
                  <button @click="showDelWarn = false" class="no btn btn-outline-dark">No</button>
              </div>
          </div>
      </div>
      
    </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import {formatDistanceToNow} from 'date-fns'
import SuccessMsg from '../components/messages/SuccessMsg.vue'
import ErrorMsg from '../components/messages/ErrorMsg.vue'
import Spinner from '../components/Spinner.vue'
import Pagination from '../components/Pagination.vue'
import { watchEffect } from '@vue/runtime-core'
import Rating from '../components/modals/Rating.vue'
import Back from '../components/Back.vue'
import {useHead} from "@vueuse/head"

export default {
    name: 'ListDetails',
    components: { SuccessMsg, ErrorMsg, Spinner, Pagination, Rating, Back },
    setup() {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        const editState = ref(false)
        const activeState = ref(true)
        const updTitle = ref('')
        const searchText = ref('')
        const showRes = ref(false)
        const showDelWarn = ref(false)
        const timeOut = ref(null)
        const listItemIds = ref([])
        const sort = ref('')

        const listId = computed(() => route.params.id)
        const page = computed(() => route.query.page)
        const list = computed(() => store.getters.getSingleList)
        const listLoading = computed(() => store.getters.getListLoading)
        const updateListSuccess = computed(() => store.getters.getUpdateListSuccess)
        const deleteListSuccess = computed(() => store.getters.getDeleteListSuccess)

        const listItemCreateLoading = computed(() => store.getters.getListItemCrLoading)
        const listItemDeleteLoading = computed(() => store.getters.getListItemDelLoading)
        const listItemSuccess = computed(() => store.getters.getListItemSuccess)
        const listItemError = computed(() => store.getters.getListItemError)

        const result = computed(() => store.getters.getListSearchResult)
        const searchLoading = computed(() => store.getters.getContentLoading)

        const paginationData = computed(() => store.getters.getListPaginationData)
        const listCount = computed(() => store.getters.getListCount)
        const listItems = computed(() => store.getters.getListitems)

        const ratings = computed(() => store.getters.getRatings)
        const rate = computed(() => store.getters.getRateNum)
        const showRatingModal = computed(() => store.getters.showRatingModal)
        const contentId = ref(null)

        useHead({
            title: computed(() => `${list.value && list.value.title} | (${listCount.value ? listCount.value : 0}) Items`)
        })

        const showRatingHandler = (id) => {
            contentId.value = id
            store.commit('SHOW_RATING')
            store.dispatch('getRating', id)
        }

        const createdAt = computed(() => formatDistanceToNow(new Date(list.value.createdAt)))


        store.dispatch('getList', listId.value)
        store.dispatch('getRatings')

        const updateTitleHandler = async () => {
            await store.dispatch('updateList', {
                id: listId.value,
                title: updTitle.value
            })

            if (updateListSuccess.value) {
                store.dispatch('getList', listId.value)

                setTimeout(() => {
                    store.commit('HIDE_LIST_MSG')
                }, 1500)
            }
        }

        const queryHandler = (e) => {
            if (e.target.value) {
                showRes.value = true
            } else {
                showRes.value = false
            }

            clearTimeout(timeOut.value)

            timeOut.value = setTimeout(() => {
                if (e.target.value) {
                    store.dispatch('getSearchedContent', e.target.value)
                }
            }, 300)
        }

        watchEffect(() => {
            if (showDelWarn.value || showRatingModal.value) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'unset'
            }

            store.dispatch('getListItems', {
                id: listId.value,
                page: page.value || '',
                sort: sort.value
            })
        })


        const addToListHandler = async (id) => {
            await store.dispatch('createListItem', {
                contentId: id,
                listId: listId.value
            })

            if (listItemError.value) {
                setTimeout(() => {
                    store.commit('HIDE_MSG')
                }, 1500)
            }

            if (listItemSuccess.value) {
                showRes.value = false
                searchText.value = ''
                store.dispatch('getListItems', {
                    id: listId.value,
                    page: page.value || '',
                    sort: sort.value
                })
            }
        }

        const deleteItemsHandler = async () => {
            if (listItemIds.value.length > 0 ) {
                await store.dispatch('deleteListItems', {
                    listId: listId.value,
                    itemIds: listItemIds.value
                })
            }


            if (listItemSuccess.value) {
                store.dispatch('getListItems', {
                    id: listId.value,
                    page: page.value || '',
                    sort: sort.value
                })
                listItemIds.value = []
            }
        }

        const deleteListHandler = async () => {
            await store.dispatch('deleteList', listId.value)

            if (deleteListSuccess.value) {
                router.push({name: 'Profile', params: {id: list.value.userId._id}})
            }
        }


        return {
            list,
            createdAt,
            editState,
            activeState,
            updTitle,
            searchText,
            updateTitleHandler,
            listLoading,
            updateListSuccess,
            queryHandler,
            showRes,
            result,
            addToListHandler,
            listItemError,
            listItemCreateLoading,
            listItemDeleteLoading,
            paginationData,
            listItems,
            listCount,
            searchLoading,
            listItemIds,
            deleteItemsHandler,
            deleteListHandler,
            showDelWarn,
            ratings,
            showRatingHandler,
            contentId,
            rate,
            sort
        }
    }
}
</script>
