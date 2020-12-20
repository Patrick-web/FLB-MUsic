<template>
  <div @click="toggleHiddenActions" class="sortOption">
    <p>Sort</p>
    <img id="sortIcon" src="@/assets/sort.svg" alt="" />
    <section class="hiddenActions animated faster sortParams">
      <p @click.stop="sortBy($event, 'title')">By Name</p>
      <p @click.stop="sortBy($event, 'duration')">By Length</p>
    </section>
    <div
      @click.stop="toggleSortBy"
      class="hiddenActions animated faster sortMode"
    >
      <p id="asc">Ascending</p>
      <p id="desc">Descending</p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["sortTracks", "reverseAddedTracksArray"]),
    toggleHiddenActions() {
      document
        .querySelector(".sortOption")
        .classList.toggle("showHiddenActions");
      document
        .querySelectorAll(".hiddenActions")
        .forEach((e) => e.classList.toggle("slideInUp"));
    },
    toggleSortBy() {
      document.querySelector(".sortMode").classList.toggle("byDesc");
      document.querySelector("#sortIcon").classList.toggle("flipped");
      this.reverseAddedTracksArray();
    },
    sortBy(e, choice) {
      if (document.querySelector(".selectedParam")) {
        document
          .querySelector(".selectedParam")
          .classList.remove("selectedParam");
      }
      e.currentTarget.classList.add("selectedParam");
      this.sortTracks(choice);
    },
  },
};
</script>

<style lang="scss">
.flipped {
  transform: rotateY(180deg);
}
</style>
