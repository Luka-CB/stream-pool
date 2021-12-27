<template>
  <div class="bg">
        <div class="box">
            <div class="dot"></div>
        </div>
        <h3>{{text}}</h3>
    </div>
</template>

<script>
export default {
    name: 'Loader',
    props: ['text'],
}
</script>

<style lang="scss" scoped>
.bg {
  width: 30%;
  min-width: 150px;
  height: 90px;
  background-color: rgba(12, 12, 12, 0.925);
  border: 1px solid #b100e8;
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  z-index: 10;
}

h3 {
    color: white;
    letter-spacing: 5px;
    text-transform: uppercase;
    font-size: 0.8rem;
}

.box {
  width: 70%;
  height: 25px;
  border: 1px solid #7e0000;
  border-radius: 50px;
//   position: absolute;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: box 1s infinite;
}

@keyframes box {
  0% {
    border-color: #7e0000;
  }
  75% {
    border-color: #b60000;
    box-shadow: 0 0 7px #ff1111;
  }
  100% {
    border-color: #eb0000;
  }
}

.dot {
  width: 30px;
  height: 10px;
  border-radius: 50px;
  background-color: #570072;
  animation: move 1s linear infinite;
}

@keyframes move {
  0% {
    width: 30px;
    background-color: #570072;
  }
  25% {
    width: 60px;
  }
  50% {
    width: 80px;
  }
  75% {
    width: 100px;
    box-shadow: 0 0 4px #8900f2;
    background-color: #c81ffc;
  }
  100% {
    width: 30px;
  }
  /* 0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(100%);
  }

  75% {
    transform: translateX(-100%);
    box-shadow: 0 0 4px greenyellow;
    background-color: greenyellow;
  }
  100% {
    transform: translateX(0);
  } */
}
</style>