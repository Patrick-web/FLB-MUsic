<template>
  <div class="Tabswitcher">
    <p id="addedTracks" class="activeTab" @click="moveIndicator('addedTracks')">
      Tracks
    </p>
    <p id="playlists" @click="moveIndicator('playlists')">Playlists</p>
    <p id="recentsTracks" @click="moveIndicator('recentsTracks')">Recents</p>
    <p id="albums" @click="moveIndicator('albums')">Albums</p>
    <p id="artists" @click="moveIndicator('artists')">Artists</p>
    <p id="discover" @click="moveIndicator('discover')">Stream</p>
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
      const tabsWrapper = document.querySelector(".tabsWrapper");
      if (
        document.querySelector(".MainGrid").classList.contains("tabIsDiscover")
      ) {
        document.querySelector(".MainGrid").classList.remove("tabIsDiscover");
        if (document.querySelector(".playIcon")) {
          document.querySelector(".playIcon").click();
        }
      }
      switch (pos) {
        case "addedTracks":
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(0%)";
          this.switchTab(pos);
          //resume playing if coming from streamer
          break;
        case "playlists":
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(-16.65%)";
          document.querySelector(".clearer").click();
          break;
        case "recentsTracks":
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(-33.32%)";
          this.switchTab(pos);
          break;
        case "albums":
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(-50%)";
          setTimeout(() => {
            this.populateByAlbumGroup();
          }, 500);
          break;
        case "artists":
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(-66.65%)";
          setTimeout(() => {
            this.populateByArtistGroup();
          }, 500);
          break;
        case "discover":
          this.switchTab("discoverTab");
          document.querySelector(".activeTab").classList.remove("activeTab");
          document.querySelector(`#${pos}`).classList.add("activeTab");
          tabsWrapper.style.transform = "translateX(-83.3%)";
          document.querySelector(".MainGrid").classList.add("tabIsDiscover");
          if (!navigator.onLine) {
            const noti = this.$vs.notify({
              position: "top-right",
              title: `Streaming requires internet connection?`,
              color: "danger",
            });
          } else {
            const webview = document.querySelector("webview");
            if (webview && webview.isLoading()) {
              const noti = this.$vs.notify({
                position: "top-center",
                title: `Loading Deezer...`,
              });
            }
          }
          //Pause Offline Music
          if (document.querySelector(".pauseIcon"))
            document.querySelector(".pauseIcon").click();
          break;

        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss">
.traditionalLayout {
  .Tabswitcher {
    width: 60%;
    margin: auto;
    .indicator {
      width: 100px;
    }
  }
}
.Tabswitcher {
  background: #1414146c;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  z-index: 22;
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
    font-weight: 800;
  }
  .activeTab {
    font-weight: 800;
    border-bottom: 2px solid white;
  }
  .activeTab:hover {
    color: white !important;
  }
}
@media (max-width: 700px) {
  .Tabswitcher {
    display: none;
  }
}
</style>
