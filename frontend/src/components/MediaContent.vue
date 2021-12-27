<template>
  <div class="media">
    <div v-for="data in media" :key="data._id">
      <router-link
        :to="{ name: 'Details', params: { type: data.type, id: data._id } }"
      >
        <div class="box">
          <img :src="data.posterUrl" :alt="data.title" />
          <div class="info-bg">
            <div class="info">
              <span class="title">{{ data.title }}</span>
              <span class="year">( {{ data.year }} )</span>
              <div class="rating">
                <div class="avg">
                  <i class="fas fa-star"></i>
                  <span v-if="data.rating.avgRating !== null" class="avg-num">{{
                    data.rating.avgRating.toFixed(1)
                  }}</span>
                </div>
                <div class="user-rating">
                  <div v-for="rating in ratings" :key="rating._id">
                    <i
                      v-if="rating.content === data._id"
                      class="fas fa-star"
                    ></i>
                  </div>
                  <div v-for="rating in ratings" :key="rating._id">
                    <span v-if="rating.content === data._id" class="user-num">{{
                      rating.value
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box-mobile">
          <img :src="data.posterUrl" :alt="data.title" />
          <div class="info-bg">
            <div class="info">
              <span class="title">{{
                data.title.length > 20
                  ? data.title.substring(0, 20) + " ..."
                  : data.title
              }}</span>
              <span class="year">( {{ data.year }} )</span>
              <div class="rating">
                <div class="avg">
                  <i class="fas fa-star"></i>
                  <span v-if="data.rating.avgRating !== null" class="avg-num">{{
                    data.rating.avgRating.toFixed(1)
                  }}</span>
                </div>
                <div class="user-rating">
                  <div v-for="rating in ratings" :key="rating._id">
                    <i
                      v-if="rating.content === data._id"
                      class="fas fa-star"
                    ></i>
                  </div>
                  <div v-for="rating in ratings" :key="rating._id">
                    <span v-if="rating.content === data._id" class="user-num">{{
                      rating.value
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "MediaContent",
  props: ["media", "ratings"],
  setup() {},
};
</script>

<style></style>
