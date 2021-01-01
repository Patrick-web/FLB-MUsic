<template>
  <div class="tab albumsTab">
    <div
      v-for="group in tracksGroupedByAlbum"
      :key="group[0]"
      class="ExpansionPanel"
    >
      <div class="titleArea" @click="toggleExpansion($event)">
        <p>{{ group[0] }}</p>
        <img class="expandIcon" src="@/assets/arrowDown.svg" alt="" />
      </div>
      <div class="body">
        <transition-group>
          <TrackCard
            :cover="track.cover"
            :album="track.album"
            :title="track.title"
            :artist="track.artist"
            :length="track.formatedLength"
            :path="track.path"
            :trackIndex="index"
            v-for="(track, index) in group[1]"
            :key="track.path"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TrackCard from "@/components/TrackCard.vue";

export default {
  methods: {
    toggleExpansion(e) {
      const panel = e.target.parentElement;
      if (!panel.classList.contains("expanded")) {
        if (document.querySelector(".expanded")) {
          document.querySelector(".expanded").classList.remove("expanded");
        }
        panel.classList.add("expanded");
      } else {
        panel.classList.remove("expanded");
      }
    },
  },
  computed: {
    ...mapGetters(["tracksGroupedByAlbum"]),
  },
  components: {
    TrackCard,
  },
};
</script>

<style></style>
