<template>
  <div class="TrackInfo">
    <div class="tag">
      <pre>Album art</pre>
      <img :src="playingTrack.cover" id="tag_albumArt" alt="" />
    </div>
    <div class="tag">
      <pre>Title</pre>
      <p>{{ playingTrack.title }}</p>
    </div>
    <div class="tag">
      <pre>Artist</pre>
      <p>{{ playingTrack.artist }}</p>
    </div>
    <div class="tag">
      <pre>Album</pre>
      <p>{{ playingTrack.album }}</p>
    </div>
    <div v-if="playingTrack.duration" class="tag">
      <pre>Length</pre>
      <p>{{ JSON.stringify(playingTrack.duration).toHHMMSS() }}</p>
    </div>
    <div class="tag">
      <pre>Date Added</pre>
      <p>{{ playingTrack.dateAdded }}</p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["playingTrack"]),
  },
};
</script>

<style lang="scss">
.TrackInfo {
  padding: 10px;
  padding-top: 10px;
  .tag {
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    padding: 10px;
    pre {
      font-size: 0.9em;
      background: black;
      padding: 3px;
      padding-left: 5px;
      border-left: 1px solid white;
      display: inline;
    }
    p {
      margin-top: 5px;
      font-family: roboto-light;
    }
  }
  #tag_albumArt {
    width: 200px;
    margin-left: 40px;
  }
}
</style>
