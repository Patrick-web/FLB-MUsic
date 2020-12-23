<template>
  <div @click="cleanUp" class="MainGrid">
    <img
      id="logo"
      class="animated pulse infinite slow"
      @click="toggleInfo"
      src="@/assets/FLBMusicLogo.svg"
      alt=""
    />
    <Profile />
    <PlaylistAdder />
    <div class="featuresSwitcherArea">
      <FeaturesSwitcher />
    </div>
    <div class="centralArea">
      <TitleArea />
      <TabSwitcher />
      <div @click="hideGems" class="tabsWrapper">
        <div class="tab addedTracksTab">
          <div v-if="addedTracks.length > 1" class="trackActions">
            <div>
              <p>FX Mode</p>
              <img
                style="max-width:18px"
                src="@/assets/star_border.svg"
                alt=""
              />
            </div>
            <SortWidget />
          </div>
          <br />
          <br />
          <br />
          <br />
          <transition-group
            enter-active-class="animated slideInLeft faster"
            leave-active-class="animated slideOutRight faster"
          >
            <TrackCard
              :cover="track.cover"
              :album="track.album"
              :title="track.title"
              :artist="track.artist"
              :length="track.formatedLength"
              :path="track.path"
              :trackIndex="index"
              v-for="(track, index) in addedTracks"
              :key="track.path"
            />
          </transition-group>
        </div>
        <div class="tab playlistsTab disable__options">
          <div
            v-for="playlist in playlists"
            :key="playlist.name"
            class="ExpansionPanel"
          >
            <div class="titleArea" @click="toggleExpansion($event)">
              <p>{{ playlist.name }}</p>
              <img class="expandIcon" src="@/assets/arrowDown.svg" alt="" />
            </div>
            <div class="body">
              <transition-group
                enter-active-class="animated slideInLeft faster"
                leave-active-class="animated slideOutRight faster"
              >
                <TrackCard
                  :cover="track.cover"
                  :album="track.album"
                  :title="track.title"
                  :artist="track.artist"
                  :length="track.formatedLength"
                  :path="track.path"
                  :trackIndex="index"
                  v-for="(track, index) in playlist.tracks"
                  :key="track.path"
                />
              </transition-group>
            </div>
          </div>
        </div>
        <div class="tab recentsTab">
          <transition-group
            enter-active-class="animated slideInLeft faster"
            leave-active-class="animated slideOutRight faster"
          >
            <TrackCard
              :cover="track.cover"
              :album="track.album"
              :title="track.title"
              :artist="track.artist"
              :length="track.formatedLength"
              :trackIndex="index"
              :path="track.path"
              v-for="(track, index) in recentsTracks"
              :key="track.path"
            />
          </transition-group>
        </div>
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
              <transition-group
                enter-active-class="animated slideInLeft faster"
                leave-active-class="animated slideOutRight faster"
              >
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
        <div class="tab artistsTab">
          <div
            v-for="group in tracksGroupedByArtist"
            :key="group[0]"
            class="ExpansionPanel"
          >
            <div class="titleArea" @click="toggleExpansion($event)">
              <p>{{ group[0] }}</p>
              <img class="expandIcon" src="@/assets/arrowDown.svg" alt="" />
            </div>
            <div class="body">
              <transition-group
                enter-active-class="animated slideInLeft faster"
                leave-active-class="animated slideOutRight faster"
              >
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
        <div class="tab discoverTab">
          <Discover />
        </div>
      </div>
      <Gems />
    </div>
    <div class="playingPaneArea">
      <div class="tabber">
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
import TabSwitcher from "@/components/TabSwitcher.vue";
import TitleArea from "@/components/TitleArea.vue";
import FeaturesSwitcher from "@/components/FeaturesSwitcher.vue";
import PlayingPane from "@/components/PlayingPane.vue";
import TrackCard from "@/components/TrackCard.vue";
import PlaylistAdder from "@/components/PlaylistAdder.vue";
import { mapMutations, mapGetters } from "vuex";
import SortWidget from "./components/SortWidget.vue";
import QueuedTracks from "./components/QueuedTracks.vue";
import Discover from "./components/Discover.vue";
import Gems from "./components/Gems.vue";
import Profile from "@/components/Profile.vue";

const electron = window.require("electron");

export default {
  name: "App",
  components: {
    TabSwitcher,
    TitleArea,
    FeaturesSwitcher,
    PlayingPane,
    TrackCard,
    PlaylistAdder,
    SortWidget,
    QueuedTracks,
    Discover,
    Gems,
    Profile,
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
    ]),
    loadRecentsAndPlaylists() {
      const playlists = JSON.parse(localStorage.getItem("playlists"));
      if (playlists) {
        electron.ipcRenderer.send("parsePlaylist", playlists);
      }
      const recents = JSON.parse(localStorage.getItem("recentlyPlayed"));
      if (recents) {
        electron.ipcRenderer.send("parseRecentlyPlayed", recents);
      }
    },
    toggleInfo() {
      document.body.classList.toggle("showInfo");
      document.querySelector("#logo").classList.remove("animated");
    },
    hideGems() {
      document.querySelector("#playerFeaturebtn").click();
    },
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
      setTimeout(() => {
        this.removeAnimationClasses();
      }, 300);
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
        this.removeAnimationClasses();
      }, 300);
    },
    removeAnimationClasses() {
      setTimeout(() => {
        document
          .querySelector(".QueuedTracks")
          .classList.remove("slineInRight", "slideOutRight");
      }, 500);
    },
  },
  mounted() {
    const thumbnail = require("./assets/Thumbnail.png");
    console.log(thumbnail);
    electron.ipcRenderer.on("playNow", (event, track) => {
      if (document.querySelector(".addedTracksTab .TrackCard")) {
        document.querySelector(".addedTracksTab .TrackCard").click();
      }
    });
    electron.ipcRenderer.on("audioWithCover", (event, track) => {
      document.querySelector(".addedTracksTab").scrollTo(0, 0);
      this.addTrack(track);
    });
    electron.ipcRenderer.on("addToRecents", (event, track) => {
      this.loadRecents(track);
    });
    electron.ipcRenderer.on("addPlaylist", (event, playlists) => {
      this.addPlaylist(playlists);
    });
    this.loadRecentsAndPlaylists();
    electron.ipcRenderer.on("tagWriteSuccessful", (e) => {
      const noti = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: "Song info succesfully changed",
      });
      this.loadRecentsAndPlaylists();
      setTimeout(() => {
        const currentTime = document.querySelector("#audioTag").currentTime;
        document.querySelector(".addedTracksTab .TrackCard").click();
        document.querySelector("#audioTag").currentTime = currentTime;
      }, 1000);
    });
    electron.ipcRenderer.send("loadArguments");

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
      const noti = this.$vs.notify({
        position: "top-center",
        title: "Processing added track(s)",
      });
      electron.ipcRenderer.send("processDroppedFiles", filePaths);
    });

    document.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener("dragenter", (event) => {
      console.log("File is in the Drop Space");
    });

    document.addEventListener("dragleave", (event) => {
      console.log("File has left the Drop Space");
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
.centralArea {
  overflow: hidden;
  .tabsWrapper {
    width: 600%;
    height: 50vh;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    transition: 0.2s ease-in-out;
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
  padding-top: 40px;
}
.addedTracksTab {
  padding-top: 0px;
  position: relative;
  .showHiddenActions {
    background: #0062ff !important;
    border-radius: 12px !important;
    .hiddenActions {
      display: block !important;
    }
  }
  .trackActions {
    position: absolute;
    background: black;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    padding: 10px;
    padding-right: 15px;
    padding-left: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .hiddenActions {
      display: none;
      box-shadow: 0px 0px 50px black;
    }
    div {
      background: #141414;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-radius: 40px;
      cursor: pointer;
      position: relative;
      .sortMode {
        position: absolute;
        bottom: -140px;
        left: -10px;
        background: #141414;
        padding: 8px;
        border-radius: 40px;
        border: 2px solid #0062ff00;
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
      .byDesc {
        #desc {
          display: block !important;
        }
        #asc {
          display: none !important;
        }
      }
      .sortMode:hover {
        border: 2px solid #0062ff;
      }
      .sortParams {
        bottom: -90px;
        border-radius: 20px;
        left: -10px;
        position: absolute;
        width: 100px;
        background: #141414;
        overflow: hidden;
        p {
          padding: 10px;
        }
        p:hover {
          background: #0062ff41;
        }
        .selectedParam {
          background: #0062ff;
        }
        .selectedParam:hover {
          background: #0062ff;
        }
      }
      img {
        margin-left: 10px;
        width: 20px;
      }
    }
    div:hover {
      background: #0062ff;
    }
  }
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
  .ExpansionPanel {
    .body {
      padding-right: 20px;
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
</style>
