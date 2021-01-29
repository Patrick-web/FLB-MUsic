<template>
  <vue-particles
    color="#dedede"
    :particleOpacity="0.8"
    :particlesNumber="10"
    shapeType="triangle"
    :particleSize="2"
    linesColor="#dedede"
    :linesWidth="1"
    :lineLinked="true"
    :lineOpacity="0.8"
    :linesDistance="50"
    :moveSpeed="2"
    :hoverEffect="false"
    :clickEffect="false"
  >
  </vue-particles>
</template>

<script>
export default {
  mounted() {},
};
</script>

<style>
.bg {
  color: rgb(255, 0, 255);
}
#particles-js {
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: -1;
}
</style>
