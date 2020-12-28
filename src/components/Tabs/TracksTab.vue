<template>
  <div class="tab addedTracksTab">
    <div v-if="addedTracks.length > 1" class="trackActions">
      <div @click="soon('Am still working on this. Oh and its gonna be lit🔥')">
        <p>FX Mode</p>
        <img style="max-width:18px" src="@/assets/star_border.svg" alt="" />
      </div>
      <SortWidget />
    </div>
    <br />
    <br />
    <br />
    <br />
    <div v-if="addedTracks.length === 0" class="noMusic">
      <img src="@/assets/addIllustration.svg" alt="" />
      <h3>Click on the Plus Icon to add tracks or drop them here</h3>
      <button
        @click="loadMusicFolder"
        id="loadMusicFolderBt"
        style="width:180px"
      >
        Just load my Music Folder
      </button>
    </div>
    <transition-group
      enter-active-class="animated slideInLeft extrafaster"
      leave-active-class="animated slideOutRight extrafaster"
    >
      <TrackCard
        :cover="track.cover"
        :album="track.album"
        :title="track.title"
        :artist="track.artist"
        :length="track.formatedLength"
        :path="track.path"
        :trackIndex="index"
        v-for="(track, index) in addedTracks"
        :key="track.path"
      />
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
const electron = window.require("electron");
import SortWidget from "@/components/SortWidget.vue";
import TrackCard from "@/components/TrackCard.vue";
export default {
  components: {
    SortWidget,
    TrackCard,
  },
  computed: {
    ...mapGetters(["addedTracks", "removeFromAddedTracks"]),
  },
  methods: {
    ...mapMutations(["addTrack"]),
    loadMusicFolder() {
      electron.ipcRenderer.send("loadMusicFolder");
      document.querySelector("#loadMusicFolderBt").style.display = "none";
      const noti = this.$vs.notify({
        position: "top-center",
        title: "Loading your music folder...",
      });
    },
    soon(msg) {
      const noti = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: msg,
      });
    },
  },
  mounted() {
    electron.ipcRenderer.on("audioWithCover", (event, track) => {
      document.querySelector(".addedTracksTab").scrollTo(0, 0);
      document.querySelector("#addedTracks").click();
      this.addTrack(track);
    });
    electron.ipcRenderer.on("playNow", (event, track) => {
      if (document.querySelector(".addedTracksTab .TrackCard")) {
        document.querySelector(".addedTracksTab .TrackCard").click();
      }
    });
    electron.ipcRenderer.on("removePlayingTrack", () => {
      const index = parseInt(
        document.querySelector(".playingtrack").getAttribute("id")
      );
      this.removeFromAddedTracks(index);
      const currentTime = document.querySelector("audio").currentTime;
      if (document.querySelector(".addedTracksTab .TrackCard")) {
        document.querySelector(".addedTracksTab .TrackCard").click();
        document.querySelector("audio").currentTime = currentTime;
      }
    });
  },
};
</script>

<style></style>
