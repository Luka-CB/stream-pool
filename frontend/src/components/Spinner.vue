<template>
  <div>
      <div class="container">
          <div class="ring">
              <span></span>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    name: 'Spinner'

}
</script>

<style lang="scss" scoped>
    .container {
        width: 60px;
        // background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        height: 60px;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 10;
        transform: translate(-50%, -50%);

        .ring {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            background: transparent;
            border: 3px solid #3c3c3c;
            border-radius: 50%;
            text-align: center;
            line-height: 150px;
            font-family: sans-serif;
            font-size: 20px;
            color: #b100e8;
            letter-spacing: 4px;
            text-transform: uppercase;
            text-shadow: 0 0 10px #b100e8;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);

            &::before {
                content: '';
                position: absolute;
                top: -3px;
                left: -3px;
                width: 100%;
                height: 100%;
                border: 3px solid transparent;
                border-top: 3px solid #8900f2;
                border-right: 3px solid #8900f2;
                border-radius: 50%;
                animation: animateCircle 1s linear infinite;
            }

            span {
                display: block;
                position: absolute;
                top: calc(50% - 2px);
                left: 50%;
                width: 50%;
                height: 4px;
                background: transparent;
                transform-origin: left;
                animation: animate 1s linear infinite;

                &::before {
                    content: '';
                    position: absolute;
                    width: 9px;
                    height: 9px;
                    border-radius: 50%;
                    background: #8900f2;
                    top: -4px;
                    right: -5px;
                    box-shadow: 0 0 20px #8900f2;
                }
            }
        }
    }

    @keyframes animateCircle {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

@keyframes animate {
        0% {
            transform: rotate(45deg);
        }
        100% {
            transform: rotate(405deg);
        }
    }
</style>