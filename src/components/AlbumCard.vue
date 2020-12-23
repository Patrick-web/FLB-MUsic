<template>
  <div class="AlbumCard CardBlock">
    <img :src="albumData.albumCover" alt="" />
    <div class="albumInfo">
      <p>{{ albumData.artistName }}</p>
      <h4>{{ albumData.albumName }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    albumData: Object,
  },
  mounted() {},
};
</script>

<style lang="scss">
.CardBlock {
  max-width: 200px;
  position: relative;
  margin-bottom: 10px;
  font-family: roboto-light;
  cursor: pointer;
  img {
    width: 100%;
  }
  .albumInfo {
    bottom: 100%;
    left: 0;
    width: 100%;
    background: #0f0f0f;
    padding: 5px;
    margin-top: -5px;
  }
}
.CardBlock:hover {
  .albumInfo {
    background: #ffffff1c;
  }
}
</style>
