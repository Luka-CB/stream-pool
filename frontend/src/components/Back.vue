<template>
  <div @click="goBack" :class="['arrow-back', color]">
      <i class="far fa-arrow-alt-circle-left"></i>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
    name: 'Back',
    props: ['path', 'color'],
    setup(props) {
        const router = useRouter()

        const goBack = () => {
            if (props.path) {
                router.push(props.path)
            } else {
                router.go(-1)
            }
        }

        return {goBack}
    }
}
</script>

<style lang="scss" scoped>
    .arrow-back {
        font-size: 2rem;
        transition: 0.3s ease-in-out;
        cursor: pointer;

        @media (min-width: 1700px) {
            font-size: 3.5rem;
        }
    }

    .color-dark {
        color: gray;

        &:hover {
            color: black;
        }
    }

    .color-light {
        color: gray;

        &:hover {
            color: white;
        }
    }
</style>