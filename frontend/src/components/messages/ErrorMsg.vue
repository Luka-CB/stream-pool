<template>
  <div class="error-msg">
      <p>{{msg}}</p>
  </div>
</template>

<script>
export default {
    name: 'ErrorMsg',
    props: ['msg']
}
</script>

<style lang="scss" scoped>
    .error-msg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #d50000;
        width: 200px;
        padding: 10px 0;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 0 5px #ff1111;
        color: white;
        text-shadow: 1px 0 2px gray;

        p {
            word-wrap: break-word;
        }

        @media (min-width: 1700px) {
            font-size: 2rem;
            width: 400px;
            box-shadow: 0 0 10px #ff1111;
        }
    }
</style>