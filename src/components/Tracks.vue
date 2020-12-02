<template>
  <div class="Tracks">
    <TrackCard
      :cover="track.cover"
      :title="track.title"
      :artist="track.artist"
      :length="track.formatedLength"
      :trackIndex="index"
      v-for="(track, index) in allTracks"
      :key="track.path"
    />
  </div>
</template>

<script>
import TrackCard from "@/components/TrackCard.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
const electron = window.require("electron");
export default {
  computed: {
    ...mapGetters(["allTracks"]),
  },
  methods: {
    ...mapMutations(["addTrack"]),
  },
  components: {
    TrackCard,
  },
  mounted() {
    console.log("Am here");
    electron.ipcRenderer.on("audioWithCover", (event, track) => {
      this.addTrack(track);
    });
  },
};
</script>

<style>
.Tracks {
  padding: 10px;
  height: 74.5vh;
  overflow-y: scroll;
}
</style>
