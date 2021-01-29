<template>
  <div class="Player">
    <video
      src="C:\Users\X\Videos\Dark.Phoenix.2019.720p.BluRay.x264-[YTS.LT].mp4"
      controls
    ></video>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.Player {
  z-index: 50;
  top: 0%;
  left: 0%;
  width: 100%;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  video {
    width: 100%;
  }
}
</style>
