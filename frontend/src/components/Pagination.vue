<template>
  <div class="pagination-container">
      <div v-show="count > contentNum" class="pagination">
          <div @click="firstPageHandler" :class="!paginationData.prevPage ? 'first-disabled' : 'first'">
              <i class="fas fa-angle-double-left"></i>
              <span>first</span>
          </div>
          <div @click="prevPageHandler" :class="!paginationData.prevPage ? 'left-disabled' : 'left'">
              <i class="fas fa-angle-left"></i>
              <span>{{!paginationData.prevPage ? '-' : paginationData.prevPage}}</span>
          </div>
          <div class="middle">
              <span>{{paginationData.page}}</span>
          </div>
          <div @click="nextPageHandler" :class="!paginationData.nextPage ? 'right-disabled' : 'right'">
              <span>{{!paginationData.nextPage ? '-' : paginationData.nextPage}}</span>
              <i class="fas fa-angle-right"></i>
          </div>
          <div @click="lastPageHandler" :class="!paginationData.nextPage ? 'last-disabled' : 'last'">
              <span>last</span>
              <i class="fas fa-angle-double-right"></i>
          </div>
          <div class="total">
              <h6 class="tp">Total pages:</h6>
              <h6 class="tp-m">TP:</h6>
              <div class="num">
                  <span>{{paginationData.totalPages}}</span>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
    name: 'Pagination',
    props: ['paginationData', 'count', 'pathName', 'contentNum'],
    setup(props) {
        const router = useRouter()

        const nextPageHandler = () => {
            if (props.paginationData.nextPage) {
                // router.push({name: props.pathName, query: {page: props.paginationData.nextPage}})
                window.history.pushState(null, null, `?page=${props.paginationData.nextPage}`)
                window.location.reload()
            }
        }

        const prevPageHandler = () => {
            if (props.paginationData.prevPage) {
                // router.push({name: props.pathName, query: {page: props.paginationData.prevPage}})
                window.history.pushState(null, null, `?page=${props.paginationData.prevPage}`)
                window.location.reload()
            }
        }

        const firstPageHandler = () => {
            if (props.paginationData.prevPage) {
                // router.push({name: props.pathName, query: {page: 1}})
                window.history.pushState(null, null, `?page=1`)
                window.location.reload()
            }
        }

        const lastPageHandler = () => {
            if (props.paginationData.nextPage) {
                // router.push({name: props.pathName, query: {page: props.paginationData.totalPages}})
                window.history.pushState(null, null, `?page=${props.paginationData.totalPages}`)
                window.location.reload()
            }
        }

        return {
            nextPageHandler,
            prevPageHandler,
            firstPageHandler,
            lastPageHandler
        }
    }
}
</script>