<template>
  <div class="container">
    <div class="progress no-round animate"></div>
  </div>
</template>

<style scoped>
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.container {
  position: absolute;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 102;
  background: rgba(0, 0, 0, 0.8);
}

.progress {
  --progress: 25;
  width: 70px;
  aspect-ratio: 1;
  position: relative;
  opacity: 1;
}

.progress:before,
.progress:after {
  content: "";
  position: absolute;
  border-radius: 50%;
}

.progress:before {
  inset: 0;
  transition-timing-function: cubic-bezier(0.36, 0.55, 0.63, 0.48);
  background: radial-gradient(farthest-side, blue 98%, #0000) top/10px 10px
      no-repeat,
    conic-gradient(blue calc(var(--progress) * 1%), rgb(201, 201, 201) 0);
  -webkit-mask: radial-gradient(
    farthest-side,
    #0000 calc(99% - 10px),
    #000 calc(100% - 10px)
  );
  mask: radial-gradient(
    farthest-side,
    #0000 calc(99% - 10px),
    #000 calc(100% - 10px)
  );
}

.animate {
  animation-name: rotation;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.no-round:before {
  background-size: 0 0, auto;
}

.no-round:after {
  content: none;
}
</style>