<template>
  <div class="ArtistPage">
    <div class="coverArea">
      <img :src="bingAlbumInfo.cover" alt="" class="blurred" />
      <img class="artistImage" :src="bingAlbumInfo.cover" alt="" />
      <h2>
        <pre>Album</pre>
        {{ bingAlbumInfo.name }}
      </h2>
    </div>
    <div class="artistPageResults">
      <div class="results trackResults">
        <h2>Tracks</h2>
        <div class="column">
          <Track
            v-for="track in bingAlbumInfo.tracks"
            :key="track.id"
            :trackInfo="track"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AlbumCard from "./AlbumCard.vue";
import Track from "./Track.vue";
export default {
  computed: {
    ...mapGetters(["bingAlbumInfo"]),
  },
  components: {
    AlbumCard,
    Track,
  },
};
</script>

<style lang="scss">
.ArtistPage {
  height: 100vh;
  .coverArea {
    height: 30%;
    width: 100%;
    overflow: hidden;
    position: relative;
    h2 {
      position: absolute;
      bottom: 0px;
      left: 0px;
      padding: 10px;
      background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.685));
      width: 100%;
      z-index: 4;
    }
    pre {
      font-size: 0.5em;
      background: black;
      width: 40px;
      padding: 3px;
      border-left: 1px solid white;
    }
    .blurred {
      width: 100%;
      filter: blur(10px);
    }
    .artistImage {
      position: absolute;
      z-index: 2;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 30%;
    }
  }
  .artistPageResults {
    padding: 10px;
    height: 70%;
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>
