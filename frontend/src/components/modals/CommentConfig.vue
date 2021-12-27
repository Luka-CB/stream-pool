<template>
  <div v-show="showCommentConfig" @click.self="hideConfigModal" class="comment-config-bg">
      <div class="comment-config-container">
          <loader v-if="loading" text="loading" />
          <div class="del-comment">
              <h2>Delete Comment</h2>
              <span>>>></span>
              <button class="del" @click="showWarning = true">Delete</button>
          </div>
          <hr>
          <div class="upd-comment">
              <textarea rows="4" placeholder="Update Comment" :value="text" @input="e => text = e.target.value" ></textarea>
              <div class="btns">
                  <button class="upd" @click="updateHandler">Update</button>
                  <button class="cancel" @click="hideConfigModal">Cancel</button>
              </div>
          </div>

          <div v-show="showWarning" @click.self="showWarning = false" class="warning-bg">
              <div class="warning">
                <p>Are you sure?</p>
                <div class="btns">
                    <button class="yes" @click="deleteHandler">Yes</button>
                    <button class="no" @click="showWarning = false">No</button>
                </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { watchEffect } from '@vue/runtime-core'
import Loader from '../Loader.vue'

export default {
    name: 'CommentUpdate',
    components: { Loader },
    props: ['commentId', 'contentId'],
    setup(props) {
        const store = useStore()

        const text = ref('')
        const showWarning = ref(false)

        const showCommentConfig = computed(() => store.getters.showCommentConfigModal)
        const comment = computed(() => store.getters.getSingleComment)
        const loading = computed(() => store.getters.getCommentLoading)
        const success = computed(() => store.getters.getCommentSuccess)

        watchEffect(() => {
            if (showCommentConfig.value) {
                document.body.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = 'unset'
            }

            if (comment.value) {
                text.value = comment.value.text
            }
        })

        const hideConfigModal = () => store.commit('HIDE_COMMENT_CONFIG')

        const updateHandler = async () => {
            await store.dispatch('updateComment', {
                id: props.commentId,
                text: text.value
            })

            if (success.value) {
                hideConfigModal()
                store.dispatch('getComments', props.contentId)
            }
        }

        const deleteHandler = async () => {
            await store.dispatch('deleteComment', props.commentId)

            if (success.value) {
                showWarning.value = false
                hideConfigModal()
                store.dispatch('getComments', props.contentId)
            } 
        }

        return {
            showCommentConfig,
            hideConfigModal,
            showWarning,
            text,
            updateHandler,
            deleteHandler,
            loading
        }
    }
}
</script>
