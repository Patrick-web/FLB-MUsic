<template>
  <div class="tab recentsTab">
    <transition-group>
      <TrackCard
        :trackIndex="index"
        :track="track"
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
    ...mapMutations(["addToRecents"]),
    loadRecentsFromDB() {
      const recents = JSON.parse(localStorage.getItem("recentlyPlayed"));
      if (recents) {
        recents.forEach((track) => this.addToRecents(track));
      }
    },
  },
  mounted() {
    this.loadRecentsFromDB();
  },
};
</script>

<style></style>
