<template>
  <div @click="cleanUp" class="MainGrid">
    <img
      id="logo"
      class="animated pulse infinite slow"
      @click="togglePersonalInfo"
      src="@/assets/FLBMusicLogo.svg"
      alt=""
    />
    <transition
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp"
    >
      <ProgressBar />
    </transition>
    <Profile />
    <Updates />
    <PlaylistAdder />
    <div class="featuresSwitcherArea">
      <FeaturesSwitcher />
      <img
        @click="showSettings"
        src="@/assets/settings.svg"
        alt=""
        id="settingsBt"
      />
      <img
        @click="showUpdates"
        src="@/assets/update.svg"
        alt=""
        id="updatesBt"
      />
      <Settings />
    </div>
    <div class="centralArea">
      <TitleArea />
      <TabSwitcher />
      <div @click="hideGems" class="tabsWrapper">
        <TracksTab />
        <PlaylistsTab />
        <RecentsTab />
        <AlbumsTab />
        <ArtistsTab />
        <DiscoverTab />
      </div>
      <Gems />
      <transition
        enter-active-class="animated faster slideInDown"
        leave-active-class="animated extrafaster slideOutUp"
      >
        <FxModeActions />
      </transition>
    </div>
    <div class="playingPaneArea">
      <div v-if="addedTracks.length !== 0" class="tabber">
        <div @click="hideQueue($event)" class="activeTab playingTabIcon">
          <img src="@/assets/music_note.svg" alt="" />
        </div>
        <div @click="showQueue($event)" class="queueTabIcon">
          <img src="@/assets/queue_music.png" alt="" />
        </div>
      </div>
      <PlayingPane />
      <QueuedTracks />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import TabSwitcher from "@/components/TabSwitcher.vue";
import TitleArea from "@/components/TitleArea.vue";
import FeaturesSwitcher from "@/components/FeaturesSwitcher.vue";
import PlayingPane from "@/components/PlayingPane.vue";
import PlaylistAdder from "@/components/PlaylistAdder.vue";
import QueuedTracks from "@/components/QueuedTracks.vue";
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
    PlaylistAdder,
    QueuedTracks,
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
    ]),
    showSettings() {
      document
        .querySelector(".featuresSwitcherArea")
        .classList.toggle("showSettings");
      document.querySelector(".MainGrid").classList.remove("showUpdates");
    },
    showUpdates() {
      document.querySelector(".MainGrid").classList.toggle("showUpdates");
    },
    togglePersonalInfo() {
      document.body.classList.toggle("showInfo");
      document.querySelector("#logo").classList.remove("animated");
    },
    hideGems() {
      document.querySelector("#playerFeaturebtn").click();
      document
        .querySelector(".featuresSwitcherArea")
        .classList.remove("showSettings");
    },
    cleanUp() {
      if (document.querySelector(".showOptions")) {
        document.querySelector(".showOptions").classList.remove("showOptions");
      }
    },
    showQueue(e) {
      document
        .querySelector(".playingPaneArea .activeTab")
        .classList.remove("activeTab");
      e.currentTarget.classList.add("activeTab");
      document.querySelector(".playingPaneArea").classList.add("showQueue");
      document.querySelector(".QueuedTracks").classList.add("slideInRight");
      document
        .querySelector(".QueuedTracks")
        .classList.replace("slideOutRight", "slideInRight");
    },
    hideQueue(e) {
      document
        .querySelector(".playingPaneArea .activeTab")
        .classList.remove("activeTab");
      e.currentTarget.classList.add("activeTab");
      document
        .querySelector(".QueuedTracks")
        .classList.replace("slideInRight", "slideOutRight");
      setTimeout(() => {
        document
          .querySelector(".playingPaneArea")
          .classList.remove("showQueue");
      }, 300);
    },
  },
  mounted() {
    electron.ipcRenderer.send("loadArguments");
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
  background: black;
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track-piece {
  background: black;
}
::-webkit-scrollbar-thumb {
  background: rgb(255, 255, 255);
  border-radius: 10px;
}
.MainGrid {
  display: grid;
  grid-template-columns: 0.2fr 4fr 1.2fr;
  column-gap: 50px;
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
@media (max-width: 900px) {
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
  grid-template-columns: 1fr;
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
  height: 83vh;
  overflow: hidden;
  overflow-y: scroll;
  padding-top: 10px;
}
.expanded {
  .body {
    max-height: 280px !important;
    padding: 10px;
  }
  .titleArea {
    box-shadow: 0px 8px 5px rgb(0, 0, 0) !important;
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
  background: #070707;
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
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0);
    position: relative;
    cursor: pointer;
    z-index: 2;
    .expandIcon {
      width: 20px;
      cursor: pointer;
      transition: 0.2s ease;
    }
  }
}
.ExpansionPanel:hover {
  .titleArea {
    background: #0062ff;
  }
}
.playingPaneArea {
  position: relative;
  .tabber {
    margin: auto;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    backdrop-filter: blur(10px);
    background-color: rgba(70, 70, 70, 0.274);
    width: 60px;
    position: absolute;
    z-index: 21;
    border-radius: 10px;
    top: 6px;
    left: 40%;
    overflow: hidden;
    div {
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    img {
      width: 20px;
    }
    .activeTab {
      background: #0062ff;
    }
  }
}
.discoverTab {
  padding-top: 0px;
  height: 100vh;
}
#settingsBt,
#updatesBt {
  position: absolute;
  bottom: 20px;
  width: 30px;
  margin-left: 10px;
  cursor: pointer;
  z-index: 10;
}
#settingsBt,
#updatesBt:hover {
  transform: rotate(45deg);
}
#updatesBt {
  bottom: 60px;
}
</style>
