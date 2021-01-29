<template>
  <div @click="cleanUp" class="MainGrid tableLayout">
    <img :src="playingTrack.cover" id="bg_fancy" alt="" />
    <img
      id="logo"
      @click="togglePersonalInfo"
      src="@/assets/FLBMusicLogo.svg"
      alt=""
    />
    <ProgressBar />
    <Profile />
    <Updates />
    <transition
      enter-active-class="animated slideInUp extrafaster"
      leave-active-class="animated slideOutDown extrafaster"
    >
      <PlaylistWidget v-if="UIcontroller.showPlaylistWidget" />
    </transition>
    <div class="featuresSwitcherArea">
      <FeaturesSwitcher />
      <transition
        enter-active-class="animated slideInUp extrafaster"
        leave-active-class="animated slideOutDown extrafaster"
      >
        <Settings v-if="UIcontroller.showSettings" />
      </transition>
    </div>
    <div class="centralArea">
      <transition
        enter-active-class="animated extrafaster slideInUp"
        leave-active-class="animated extrafaster slideOutDown"
      >
        <Gems v-if="UIcontroller.showGems" />
      </transition>
      <TitleArea />
      <TabSwitcher />
      <div class="tabsWrapper">
        <TracksTab />
        <PlaylistsTab />
        <RecentsTab />
        <AlbumsTab />
        <ArtistsTab />
        <DiscoverTab />
      </div>
      <transition
        enter-active-class="animated faster slideInDown"
        leave-active-class="animated extrafaster slideOutUp"
      >
        <FxModeActions />
      </transition>
    </div>
    <div v-if="playingTrack.title" class="playingPaneArea">
      <PlayingPane />
      <SidePane />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import TabSwitcher from "@/components/TabSwitcher.vue";
import TitleArea from "@/components/TitleArea.vue";
import FeaturesSwitcher from "@/components/FeaturesSwitcher.vue";
import PlayingPane from "@/components/PlayingPane.vue";
import SidePane from "@/components/SidePane/SidePane.vue";
import PlaylistWidget from "@/components/PlaylistWidget.vue";
import Gems from "@/components/Gems.vue";
import Profile from "@/components/Profile.vue";
import Settings from "@/components/Settings.vue";
import Updates from "@/components/Updates.vue";
import TracksTab from "@/components/Tabs/TracksTab.vue";
import RecentsTab from "@/components/Tabs/RecentsTab.vue";
import AlbumsTab from "@/components/Tabs/AlbumsTab.vue";
import ArtistsTab from "@/components/Tabs/ArtistsTab.vue";
import PlaylistsTab from "@/components/Tabs/PlaylistsTab.vue";
import DiscoverTab from "@/components/Tabs/DiscoverTab.vue";
import FxModeActions from "@/components/FXModeActions";
import ProgressBar from "@/components/ProgressBar";
const electron = window.require("electron");

export default {
  name: "App",
  components: {
    TabSwitcher,
    TitleArea,
    FeaturesSwitcher,
    PlayingPane,
    SidePane,
    PlaylistWidget,
    Gems,
    Profile,
    Settings,
    Updates,
    TracksTab,
    RecentsTab,
    AlbumsTab,
    ArtistsTab,
    PlaylistsTab,
    DiscoverTab,
    FxModeActions,
    ProgressBar,
  },
  computed: {
    ...mapGetters([
      "playingTrack",
      "addedTracks",
      "recentsTracks",
      "tracksGroupedByArtist",
      "tracksGroupedByAlbum",
      "playlists",
      "UIcontroller",
    ]),
  },
  methods: {
    ...mapMutations([
      "toggleAutoplay",
      "addTrack",
      "addPlaylist",
      "loadRecents",
      "deletePlaylist",
      "changePlaylistName",
      "removeFromAddedTracks",
      "clearRecentsAndPlaylists",
      "addToRecents",
    ]),
    togglePersonalInfo() {
      document.body.classList.toggle("showInfo");
      document.querySelector("#logo").classList.remove("animated");
    },
    cleanUp() {
      if (document.querySelector(".showOptions")) {
        document.querySelector(".showOptions").classList.remove("showOptions");
      }
    },
  },
  mounted() {
    electron.ipcRenderer.send("loadArguments");
    setTimeout(() => {
      electron.ipcRenderer.on("addToRecents", (event, track) => {
        this.addToRecents(track);
      });
    }, 1400);
    electron.ipcRenderer.on("errorMsg", (e, msg) => {
      const noti = this.$vs.notify({
        color: "warning",
        position: "top-center",
        title: msg,
      });
    });
    electron.ipcRenderer.on("successMsg", (e, msg) => {
      const noti = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: msg,
      });
    });
    electron.ipcRenderer.on("normalMsg", (e, msg) => {
      const noti = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: msg,
      });
    });
    String.prototype.toHHMMSS = function() {
      var sec_num = parseInt(this, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - hours * 3600) / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return hours + ":" + minutes + ":" + seconds;
    };
    document.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const filePaths = Array.from(event.dataTransfer.files).map(
        (file) => file.path
      );
      electron.ipcRenderer.send("processDroppedFiles", filePaths);
    });

    document.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    window.addEventListener("online", () => {
      electron.ipcRenderer.send("downloadBinaries");
    });
  },
};
</script>

<style lang="scss">
@import "./assets/animate.css";
@import url("./global.css");
* {
  scroll-behavior: smooth;
}
body {
  background: black;
  font-family: roboto;
  height: 100vh;
  overflow: hidden;
}
::-webkit-scrollbar {
  background: rgba(0, 0, 0, 0.199);
  width: 5px;
}
::-webkit-scrollbar-track-piece {
  background: rgba(0, 0, 0, 0.514);
}
::-webkit-scrollbar-thumb {
  background: rgb(255, 255, 255);
  border-radius: 10px;
}
.MainGrid {
  display: grid;
  grid-template-columns: 0.2fr 4fr 1.2fr;
  .featuresSwitcherArea {
    margin-right: 30px;
  }
  #logo {
    position: fixed;
    width: 40px;
    top: 25px;
    left: 45px;
    z-index: 20;
  }
  #logo:hover {
    cursor: pointer;
  }
  #bg_fancy {
    position: fixed;
    top: -50%;
    left: 0;
    width: 120%;
    filter: blur(20px);
    opacity: 0.5;
  }
}
.noMusic {
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // background: yellow;
  img {
    margin-top: 80px;
    margin-bottom: 20px;
    width: 20%;
  }
}
.centralArea {
  overflow: hidden;
  position: relative;
  .tabsWrapper {
    width: 600%;
    height: 83vh;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    transition: 0.2s ease-in-out;
  }
}
@media (max-width: 700px) {
  .MainGrid {
    grid-template-columns: 4fr 1fr;
  }
  .featuresSwitcherArea {
    display: none !important;
  }
  #logo {
    display: none !important;
  }
}
.currentFeatureIsGems {
  .Gems {
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    pointer-events: all;
  }
}

.tabIsDiscover {
  grid-template-columns: 1fr !important;
  .Titlebar {
    height: 0;
    margin-bottom: 0px;
    overflow: hidden;
  }
  .playingPaneArea,
  .featuresSwitcherArea {
    display: none;
  }
  .centralArea {
    min-height: 100vh;
  }
  .Tabswitcher {
    max-width: 600px;
    margin: auto;
  }
  #refreshWebview {
    display: block;
  }
}
.featuresSwitcherArea {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  padding-left: 40px;
}

.tab {
  height: 69vh;
  overflow: hidden;
  overflow-y: scroll;
  padding-top: 10px;
}
.expanded {
  margin: 10px;
  overflow: hidden;
  .body {
    max-height: 380px !important;
  }
  .titleArea {
    box-shadow: 0px 10px 8px rgba(0, 0, 0, 0.438) !important;
    background: #0062ff !important;
    .expandIcon {
      transform: rotate(180deg);
    }
  }
}
.expanded_for_search {
  .body {
    max-height: 280px !important;
    padding: 10px;
  }
  .titleArea {
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.555) !important;
    .expandIcon {
      transform: rotate(180deg);
    }
  }
}
.playlistsTab {
  .showPlaylistOptions {
    .body {
      max-height: 280px !important;
      height: 180px;
      .plEditor {
        top: 20px !important;
      }
    }
  }
  .ExpansionPanel {
    .body {
      padding-right: 20px;
      position: relative;
      .plEditor {
        padding: 10px;
        position: absolute;
        width: 200px;
        left: 50%;
        top: -200px;
        transform: translateX(-50%);
        z-index: 4;
        border-radius: 15px;
        background: #171717;
        box-shadow: 0px 0px 50px black;
        input {
          background: #111111;
          padding: 5px;
          border: none;
          border-bottom: 0.5px solid rgb(255, 255, 255);
          margin-top: 5px;
        }
        input:focus {
          border-bottom: 1px solid #1e74ff;
        }
      }
    }
  }
}
.ExpansionPanel {
  background: #00000054;
  color: white;
  font-family: roboto-light;
  margin-bottom: 1px;
  .body {
    max-height: 0px;
    overflow: hidden;
    overflow-y: scroll;
    transition: 0.2s linear;
  }
  .titleArea {
    background: #6b6b6b15;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    position: relative;
    cursor: pointer;
    z-index: 2;
    transition: none;
    .expandIcon {
      width: 20px;
      cursor: pointer;
      transition: 0.2s ease;
    }
  }
}
.ExpansionPanel:hover {
  .titleArea {
    font-weight: 800;
  }
}
.traditionalLayout {
  .playingPaneArea {
  }
}
.playingPaneArea {
  position: relative;
}
.discoverTab {
  padding-top: 0px;
  height: 100vh;
}
</style>
