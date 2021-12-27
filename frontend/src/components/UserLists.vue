<template>
  <div>
    <div class="header">
      <h2>
        Your Lists <small>( {{ lists.length }} )</small>
      </h2>
      <div @click="showCreateList = true" class="cr-btn">
        <span>Create New List</span>
      </div>
    </div>
    <hr />
    <div class="body">
      <p v-if="lists.length === 0" class="no-list">No Lists!</p>
      <div v-for="list in lists" :key="list._id" class="list">
        <router-link :to="{ name: 'ListDetails', params: { id: list._id } }">
          <div class="image">
            <img v-if="list.image" :src="list.image" :alt="list.title">
            <i v-else class="far fa-image"></i>
          </div>
          <div :title="list.title" class="info">
            <h4>
              {{
                list.title.length > 18
                  ? list.title.substring(0, 15) + " ..."
                  : list.title
              }}
            </h4>
            <h6>items | {{ list.listItems.length }}</h6>
          </div>
        </router-link>
      </div>
    </div>

    <div
      v-show="showCreateList"
      @click.self="showCreateList = false"
      class="create-list-bg"
    >
      <div class="create-list-container">
        <spinner v-if="loading" />
        <input type="text" placeholder="Name Your List" v-model="title" />
        <div class="btns">
          <button @click="showCreateList = false" class="cancel">Cancel</button>
          <button @click="createListHandler" class="create">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";
import { useStore } from "vuex";
import Spinner from "./Spinner.vue";

export default {
  name: "CreateList",
  props: ["lists", "userId"],
  components: { Spinner },
  setup(props) {
    const store = useStore();

    const showCreateList = ref(false);
    const title = ref("");

    const success = computed(() => store.getters.getCreateListSuccess);
    const loading = computed(() => store.getters.getListLoading);

    watchEffect(() => {
      if (showCreateList.value) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    });

    const createListHandler = async () => {
      await store.dispatch("createList", title.value);

      if (success.value) {
        showCreateList.value = false;
        title.value = "";
        store.dispatch('getLists', props.userId)
      }
    };

    return {
      showCreateList,
      title,
      createListHandler,
      loading,
    };
  },
};
</script>
