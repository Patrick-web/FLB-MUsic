<template>
  <div class="Tabswitcher">
    <p id="addedTracks" class="activeTab" @click="moveIndicator('addedTracks')">
      Tracks
    </p>
    <p id="playlists" @click="moveIndicator('playlists')">Playlists</p>
    <p id="recentsTracks" @click="moveIndicator('recentsTracks')">Recents</p>
    <p id="albums" @click="moveIndicator('albums')">Albums</p>
    <p id="artists" @click="moveIndicator('artists')">Artists</p>
    <p id="discover" @click="moveIndicator('discover')">Discover</p>
    <div class="indicator"></div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "TabSwitcher",
  methods: {
    ...mapMutations([
      "switchTab",
      "populateByArtistGroup",
      "populateByGenreroup",
      "populateByAlbumGroup",
    ]),
    moveIndicator(pos) {
      const indicator = document.querySelector(".indicator");
      const tabsWrapper = document.querySelector(".tabsWrapper");
      switch (pos) {
        case "addedTracks":
          indicator.style.left = "0%";
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(0%)";
          this.switchTab(pos);
          break;
        case "playlists":
          indicator.style.left = "17%";
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(-16.65%)";
          document.querySelector(".clearer").click();
          break;
        case "recentsTracks":
          indicator.style.left = "34%";
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(-33.32%)";
          this.switchTab(pos);
          break;
        case "albums":
          indicator.style.left = "50.5%";
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(-50%)";
          setTimeout(() => {
            this.populateByAlbumGroup();
          }, 200);
          break;
        case "artists":
          indicator.style.left = "67.5%";
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(-66.65%)";
          setTimeout(() => {
            this.populateByArtistGroup();
          }, 200);
          break;
        case "discover":
          indicator.style.left = "85%";
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(-83.3%)";
          break;

        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.Tabswitcher {
  background: #141414;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  border-radius: 20px;
  position: relative;
  p {
    text-align: center;
    position: relative;
    z-index: 2;
    padding: 8px;
    color: white;
    cursor: pointer;
    transition: 0.2s ease;
    font-family: roboto-light;
  }
  p:hover {
    color: #1c73ff;
  }
  .activeTab:hover {
    color: white !important;
  }
  .indicator {
    position: absolute;
    border-radius: 50px;
    z-index: 1;
    left: 0;
    top: 0;
    width: 130px;
    height: 100%;
    background: #0062ff;
    transform-origin: center;
    transition: 0.2s ease-in-out;
  }
}
</style>
