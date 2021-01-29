<template>
  <div class="SidePane">
    <div class="tabber">
      <div
        @click.stop="tabTo($event, 'trackInfo')"
        class="activeTab playingTabIcon"
      >
        <img src="@/assets/music_note.svg" alt="" />
      </div>
      <div @click.stop="tabTo($event, 'queuedTracks')" class="queueTabIcon">
        <img src="@/assets/queue_music.png" alt="" />
      </div>
      <div @click.stop="tabTo($event, 'lyrics')" class="lyricsTabIcon">
        <img src="@/assets/lyrics.svg" alt="" />
      </div>
    </div>
    <TrackInfo v-if="currentTab == 'trackInfo'" />
    <QueuedTracks v-if="currentTab == 'queuedTracks'" />
    <Lyrics v-if="currentTab == 'lyrics'" />

    <canvas v-if="settings.visuals" id="visualizerArea"></canvas>
  </div>
</template>

<script>
import QueuedTracks from "./QueuedTracks.vue";
import TrackInfo from "./TrackInfo.vue";
import Lyrics from "./Lyrics.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      currentTab: "trackInfo",
    };
  },
  computed: {
    ...mapGetters(["settings", "UIcontroller"]),
  },
  methods: {
    ...mapMutations(["toggleSetting"]),
    tabTo(e, target) {
      document.querySelector(".activeTab").classList.remove("activeTab");
      e.currentTarget.classList.add("activeTab");
      this.currentTab = target;
      console.log(e.currentTarget);
    },
  },
  components: {
    QueuedTracks,
    TrackInfo,
    Lyrics,
  },
  mounted() {
    if (localStorage.getItem("tableLayout") == "true") {
      this.toggleSetting("tableLayout");
      document.querySelector(".MainGrid").classList.add("tableLayout");
    }
    if (localStorage.getItem("visuals") == "true") {
      this.toggleSetting("visuals");
    }
  },
};
</script>

<style lang="scss">
.SidePane {
  max-width: 300px;
  height: 100vh;
  position: relative;
  padding-bottom: 110px;
  overflow: hidden;
  .tabber {
    margin: auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 90px;
    backdrop-filter: blur(10px);
    background-color: rgba(0, 0, 0, 0.205);
    border-right: 1px solid white;
    border-left: 1px solid white;
    position: sticky;
    z-index: 21;
    border-radius: 20px;
    top: 6px;
    left: 40%;
    overflow: hidden;
    div {
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0);
      border-top: 1px solid rgba(255, 255, 255, 0);
      cursor: pointer;
    }
    img {
      width: 20px;
    }
    .activeTab {
      background: #f8f8f82d;
      border-bottom: 1px solid white;
      border-top: 1px solid white;
    }
  }
  #visualizerArea {
    position: absolute;
    top: 48%;
    right: 0;
    width: 100%;
    z-index: -1;
    opacity: 0.8;
    transform: rotate(90deg) translateY(-50%);
  }
}
</style>
