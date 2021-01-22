<template>
  <div class="SidePane">
    <div class="tabber">
      <div @click="tabTo($event, 'trackInfo')" class="activeTab playingTabIcon">
        <img src="@/assets/music_note.svg" alt="" />
      </div>
      <div @click="tabTo($event, 'queuedTracks')" class="queueTabIcon">
        <img src="@/assets/queue_music.png" alt="" />
      </div>
      <div @click="tabTo($event, 'lyrics')" class="lyricsTabIcon">
        <img src="@/assets/lyrics.svg" alt="" />
      </div>
    </div>
    <QueuedTracks v-if="currentTab == 'queuedTracks'" />
    <TrackInfo v-if="currentTab == 'trackInfo'" />
    <canvas v-if="settings.visualizer" id="visualizerArea"></canvas>
  </div>
</template>

<script>
import QueuedTracks from "./QueuedTracks.vue";
import TrackInfo from "./TrackInfo.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      currentTab: "trackInfo",
    };
  },
  computed: {
    ...mapGetters(["settings"]),
  },
  methods: {
    tabTo(e, target) {
      document.querySelector(".activeTab").classList.remove("activeTab");
      e.currentTarget.classList.add("activeTab");
      this.currentTab = target;
    },
  },
  components: {
    QueuedTracks,
    TrackInfo,
  },
};
</script>

<style lang="scss">
.SidePane {
  width: 100%;
  height: 100vh;
  position: relative;
  .tabber {
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90px;
    backdrop-filter: blur(10px);
    background-color: rgba(70, 70, 70, 0.274);
    position: sticky;
    z-index: 21;
    border-radius: 10px;
    top: 6px;
    left: 40%;
    overflow: hidden;
    div {
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    img {
      width: 20px;
    }
    .activeTab {
      background: #0062ff;
    }
  }
  #visualizerArea {
    position: absolute;
    top: 65%;
    width: 100%;
    z-index: 5;
    opacity: 0.5;
  }
}
</style>
