<template>
  <div class="about">
    <div class="text">
      <h1>Stream-Pool</h1>
        <p>
          This website is created to be showcased in my
          <a
            href="https://my-portfolio-rosy-phi.vercel.app"
            target="_blank"
            rel="noreferrer"
          >
            portfolio
          </a>
          . Website is created using <span>Vue 3</span> as a frontend with
          <span>Vuex</span> for state management. <span>NodeJs</span> as a
          backend. <span>scss</span> is used for styling. <span>MongoDB</span>
          database is used with <span>Mongoose</span> .
        </p>
        <p>
          Code is available
          <a
            href="https://github.com/Luka-CB/stream-pool"
            target="_blank"
            rel="noreferrer"
          >
            HERE
          </a>
        </p>
    </div>
    <div class="image">
      <img src="/popcorn.png" alt="Popcorn png Image">
    </div>
  </div>
</template>

<script>
import {useHead} from '@vueuse/head'

export default {
  setup() {

    useHead({
      title: 'About Stream-Pool'
    })
  },
}
</script>