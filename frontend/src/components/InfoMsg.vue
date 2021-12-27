<template>
  <div class="msg-container">
      <h3>{{text}}</h3>
  </div>
</template>

<script>
export default {
    name: 'InfoMsg',
    props: ['text']
}
</script>

<style lang="scss" scoped>
    .msg-container {
        background-color: rgb(221, 8, 107);
        width: 30%;
        min-width: 150px;
        text-align: center;
        padding: 30px 0;
        border-radius: 20px;
        box-shadow: 0 5px 12px rgb(0, 0, 0);
        color: aliceblue;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>