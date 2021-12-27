<template>
  <div class="success-msg">
      <p>{{msg}}</p>
  </div>
</template>

<script>
export default {
    name: 'SuccessMsg',
    props: ['msg']
}
</script>

<style lang="scss" scoped>
    .success-msg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #99d98c;
        width: 200px;
        padding: 10px 0;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 0 5px #5de442;
        color: black;
        text-shadow: 1px 0 2px gray;
        z-index: 2;

        @media (min-width: 1700px) {
            font-size: 2rem;
            width: 400px;
            box-shadow: 0 0 10px #5de442;
        }
    }
</style>