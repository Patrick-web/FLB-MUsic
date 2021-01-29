<template>
  <div class="TrackInfo">
    <div class="tag">
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
    <button
      @click="UIcontrollerToggleProperty('showTagEditor')"
      class="iconBt"
      id="toggleTagEditor"
    >
      <img src="@/assets/pen.svg" alt="" />
    </button>
    <transition
      enter-active-class="animated slideInRight extrafaster"
      leave-active-class="animated slideOutUp extrafaster"
    >
      <TagEditor
        v-if="UIcontroller.showTagEditor"
        :albumArt="playingTrack.cover"
        :title="playingTrack.title"
        :album="playingTrack.album"
        :artist="playingTrack.artist"
        :trackPath="playingTrack.path"
      />
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import TagEditor from "./TagEditor.vue";

export default {
  computed: {
    ...mapGetters(["playingTrack", "UIcontroller"]),
  },
  methods: {
    ...mapMutations(["UIcontrollerToggleProperty"]),
  },
  components: {
    TagEditor,
  },
};
</script>

<style lang="scss">
.TrackInfo {
  padding: 10px;
  padding-top: 10px;
  position: relative;
  .tag {
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    padding: 10px;
    pre {
      font-size: 0.8em;
      background: black;
      padding: 3px;
      border-left: 1px solid white;
      display: inline;
    }
    p {
      margin-top: 5px;
      font-family: roboto-thin;
    }
  }
  #tag_albumArt {
    width: 200px;
    margin-left: 40px;
  }
  #toggleTagEditor {
    position: absolute;
    top: 90px;
    left: 40px;
    background-color: #0000004b;
    backdrop-filter: blur(10px);
  }
}
</style>
