<template>
  <div @click="toggleHiddenActions" class="sortOption actionBt">
    <p>Sort</p>
    <img id="sortIcon" src="@/assets/sort.svg" alt="" />
    <section class="hiddenActions animated faster sortParams">
      <p @click.stop="sortBy($event, 'title')">Name</p>
      <p @click.stop="sortBy($event, 'artist')">Artist</p>
      <p @click.stop="sortBy($event, 'duration')">Length</p>
      <p @click.stop="sortBy($event, 'dateAdded')">Date</p>
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
    ...mapMutations(["sortArrayOfObjects", "reverseAddedTracksArray"]),
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
      this.sortArrayOfObjects(["addedTracks", choice]);
    },
  },
};
</script>

<style lang="scss">
.flipped {
  transform: rotateY(180deg);
}
.hiddenActions {
  display: none;
  box-shadow: 0px 0px 50px black;
}
.sortOption {
  position: relative;
  .sortParams {
    bottom: -180px;
    border-radius: 20px;
    left: -5px;
    position: absolute;
    width: 90px;
    backdrop-filter: blur(10px) !important;
    // border: 1px solid rgba(255, 255, 255, 0.315);
    box-shadow: 0px 0px 50px black;
    background-color: rgb(0, 0, 0);
    overflow: hidden;
    p {
      padding: 10px;
      text-align: center;
      font-family: roboto-thin;
      border-bottom: 1px solid rgba(255, 255, 255, 0.192);
      backdrop-filter: blur(10px) !important;
    }
    p:hover {
      background-color: #ffffff1e;
      border-radius: 20px;
      margin: 5px;
    }
    .selectedParam {
      background: #0062ff;
    }
    .selectedParam:hover {
      background: #0062ff;
    }
  }
  .byDesc {
    #desc {
      display: block !important;
    }
    #asc {
      display: none !important;
    }
  }
  .sortMode:hover {
    background: #0062ff;
  }

  img {
    margin-left: 10px;
    width: 20px;
  }
  .sortMode {
    position: absolute;
    bottom: -230px;
    left: -5px;
    background-color: #000000;
    backdrop-filter: blur(10px);
    padding: 8px;
    border-radius: 10px;
    font-family: roboto-thin;
    p {
      display: none;
    }
    #desc {
      display: none;
    }
    #asc {
      display: block;
    }
  }
}
.sortOption:hover {
  background: #0062ff;
}
</style>
