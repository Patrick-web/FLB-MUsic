<template>
  <div class="ArtistCard CardBlock">
    <img :src="artistData.artistCoverImg" alt="" />
    <div class="albumInfo">
      <h4>{{ artistData.artistName }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artistData: Object,
  },
};
</script>

<style lang="scss">
.ArtistCard {
  h4 {
    padding: 5px;
  }
}
</style>
