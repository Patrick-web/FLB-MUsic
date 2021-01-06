<template>
  <div class="tab recentsTab">
    <transition-group>
      <TrackCard
        :cover="track.cover"
        :album="track.album"
        :title="track.title"
        :artist="track.artist"
        :length="track.formatedLength"
        :trackIndex="index"
        :path="track.path"
        v-for="(track, index) in recentsTracks"
        :key="track.path"
      />
    </transition-group>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
const electron = window.require("electron");
import TrackCard from "@/components/TrackCard.vue";

export default {
  computed: {
    ...mapGetters(["recentsTracks"]),
  },
  components: {
    TrackCard,
  },
  methods: {
    ...mapMutations(["addToRecents", "clearRecentsAndPlaylists"]),
    loadRecentsFromDB() {
      const recents = JSON.parse(localStorage.getItem("recentlyPlayed"));
      if (recents) {
        setTimeout(() => {
          electron.ipcRenderer.send("parseRecentlyPlayed", recents);
        }, 2500);
      }
    },
  },
  mounted() {
    electron.ipcRenderer.on("addToRecents", (event, track) => {
      this.addToRecents(track);
    });
    electron.ipcRenderer.on("removePlayingTrack", (event, track) => {
      this.clearRecentsAndPlaylists();
      setTimeout(() => {
        this.loadRecentsFromDB(track);
      }, 100);
    });
    electron.ipcRenderer.on("deleteComplete", (event, track) => {
      this.clearRecentsAndPlaylists();
      setTimeout(() => {
        this.loadRecentsFromDB(track);
      }, 100);
    });
    this.loadRecentsFromDB();
  },
};
</script>

<style></style>
