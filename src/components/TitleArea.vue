<template>
  <div class="Titlebar">
    <div class="pageNames">
      <h1>FLB Music</h1>
    </div>
    <div class="searchBar">
      <input
        v-on:keyup="search"
        v-model="query"
        id="search"
        placeholder="Search. . . 🎶  🎙️ 🎸 🎧"
        class="inputElem"
      />
      <div @click="clearSearch" class="iconLeft clearer">
        <img src="@/assets/x.svg" alt v-if="query" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      query: "",
    };
  },
  methods: {
    ...mapActions(["searchPodcast", "renderDataBeforeSearch"]),
    search() {
      const tracks = document.querySelectorAll(".TrackCard");
      const panels = document.querySelectorAll(".ExpansionPanel");
      tracks.forEach((track) => {
        if (
          !track.textContent.toLowerCase().includes(this.query.toLowerCase())
        ) {
          track.style.display = "none";
        } else {
          track.style.display = "flex";
        }
      });
      panels.forEach((panel) => {
        if (
          !panel
            .querySelector(".titleArea")
            .textContent.toLowerCase()
            .includes(this.query.toLowerCase())
        ) {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
      document
        .querySelectorAll(".ExpansionPanel")
        .forEach((panel) => panel.classList.add("expanded_for_search"));
      document.querySelector("#resetArtistTab").click();
    },
    clearSearch() {
      this.query = "";
      const tracks = document.querySelectorAll(".TrackCard");
      tracks.forEach((track) => {
        track.style.display = "flex";
      });
      const panels = document.querySelectorAll(".ExpansionPanel");
      panels.forEach((panel) => {
        panel.style.display = "block";
      });
      document
        .querySelectorAll(".ExpansionPanel")
        .forEach((panel) => panel.classList.remove("expanded_for_search"));
    },
  },
};
</script>

<style lang="scss">
.searchingState {
  .magnifier {
    pointer-events: none;
    transform: scale(0) !important;
    filter: grayscale(1);
  }
}
.fetchingInProgress input {
  cursor: wait !important;
}
.Titlebar {
  width: 850px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-top: 20px;
  width: 100%;
  position: relative;
  z-index: 23;
}
.searchBar {
  position: relative;
  .iconLeft {
    position: absolute;
    top: 50%;
    left: 5%;
    transform: scale(1) translateY(-50%);
    transition: 0.2s ease;
  }
  .clearer {
    top: 50%;
    position: absolute;
    transform: scale(1);
    left: -15%;
    margin-top: -10px;
    cursor: pointer;
    img {
      width: 20px;
    }
  }
  input {
    padding: 5px;
    padding-left: 10px;
    font-size: 1.3rem;
    border-radius: 0px;
    border: 1px solid transparent;
    outline: none;
    background: #0000006e;
    color: white;
    width: 250px;
    font-family: roboto-light;
    transition: 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  input:focus {
    padding-left: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    // width: 400px;
  }
  input:focus ~ .magnifier {
    left: 50%;
    transform: scale(0) translateY(0%);
  }

  input:hover {
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    cursor: pointer;
  }
}
.pageNames {
  height: 45px;
  color: white;
  overflow: hidden;
  h1 {
    font-family: roboto-thick;
    font-size: 2.4rem;
  }
}
.tabTitle {
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: rgb(var(--base-one), var(--base-two), var(--base-three));
}
@media (max-width: 900px) {
  .Titlebar {
    display: none;
  }
}
</style>
