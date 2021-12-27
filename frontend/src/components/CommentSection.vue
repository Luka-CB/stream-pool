<template>
    <div class="comment-section">
        <loader v-if="createLoading" text="loading" />
        <div class="col-1">
            <textarea rows="5" :placeholder="!userInfo ? 'You need to be logged in to comment!' : 'Leave a Comment...'" :disabled="!userInfo" v-model="text"></textarea>
            <button @click="createCommentHandler" :class="!text ? 'disabled' : 'comment-btn'" :disabled="!text">Add Comment</button>
        </div>
        <div class="col-2">
            <p v-if="comments && comments.length === 0" class="no-comments">No Comments!</p>
            <div v-for="comment in commentsFormated" :key="comment._id">
                <div class="top">
                    <div class="avatar">
                        <span class="letter">{{comment.user.username.charAt(0).toUpperCase()}}</span>
                    </div>
                    <div class="user">
                        <div class="info">
                            <span class="name">{{comment.user.username}}</span>
                            <div class="date">{{comment.createdAt}}</div>
                        </div>
                        <div v-show="userInfo && userInfo.id === comment.user._id" class="config" @click="showConfigModal(comment._id)">
                            <i class="fas fa-cog"></i>
                        </div>
                    </div>
                </div>
                <p class="comment-text">
                    {{comment.text}}
                </p>
            </div>
        </div>

        <comment-config :commentId="commentId" :contentId="contentId" />
    </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import Loader from './Loader.vue'
import {formatDistanceToNow} from 'date-fns'
import CommentConfig from './modals/CommentConfig.vue'

export default {
    name: 'CommentSection',
    props: ['contentId'],
    components: { 
        Loader,
        CommentConfig
    },
    setup(props) {

        const store = useStore()

        const text = ref('')
        const commentId = ref(null)

        const createLoading = computed(() => store.getters.getCommentLoading)
        const createSuccess = computed(() => store.getters.getCommentSuccess)
        const comments = computed(() => store.getters.getAllComments)
        const count = computed(() => store.getters.getCount)
        const userInfo = computed(() => store.getters.getUserInfo)

        const commentsFormated = computed(() => {
            if (comments.value) {
                return comments.value.map(comm => {
                    let time = formatDistanceToNow(new Date(comm.createdAt))
                    return {...comm, createdAt: time}
                })
            }
        })

        store.dispatch('getComments', props.contentId)

        const createCommentHandler = async () => {
            await store.dispatch('createComment', {
                contentId: props.contentId,
                text: text.value
            })

            if (createSuccess.value) {
                text.value = ''
                store.dispatch('getComments', props.contentId)
            }
        }

        const showConfigModal = (id) => {
            store.commit('SHOW_COMMENT_CONFIG')
            commentId.value = id
            store.dispatch('getComment', id)
        }

        return {
            text,
            createCommentHandler,
            createLoading,
            comments,
            commentsFormated,
            userInfo,
            showConfigModal,
            commentId,
        }
    }
}
</script>

<style>

</style>