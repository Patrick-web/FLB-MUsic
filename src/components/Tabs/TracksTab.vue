<template>
  <div class="tab addedTracksTab">
    <div v-if="addedTracks.length > 1" class="trackActions">
      <div class="fxModeToggle" @click="toggleFxMode()">
        <p id="enterFxMode">FX Mode</p>
        <p id="exitFxMode">Exit FX Mode</p>
        <img style="max-width:18px" src="@/assets/star_border.svg" alt="" />
      </div>
      <SortWidget />
    </div>
    <div v-if="addedTracks.length === 0" class="noMusic">
      <img src="@/assets/addIllustration.svg" alt="" />
      <h3>Click on the Plus Icon to add tracks or drop them here</h3>
      <button
        @click="loadMusicFolder"
        id="loadMusicFolderBt"
        style="width:180px"
      >
        Just load my Music Folder
      </button>
    </div>
    <transition-group>
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
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
const electron = window.require("electron");
import SortWidget from "@/components/SortWidget.vue";
import TrackCard from "@/components/TrackCard.vue";
export default {
  components: {
    SortWidget,
    TrackCard,
  },
  computed: {
    ...mapGetters(["addedTracks", "currentTab"]),
  },
  methods: {
    ...mapMutations(["addTrack", "removeFromAddedTracks", "clearBulkSelect"]),
    loadMusicFolder() {
      electron.ipcRenderer.send("loadMusicFolder");
      document.querySelector("#loadMusicFolderBt").style.display = "none";
      const noti = this.$vs.notify({
        position: "top-center",
        title: "Loading your music folder...",
      });
    },
    toggleFxMode() {
      document.querySelector(".addedTracksTab").classList.toggle("fxMode");
      if (
        !document.querySelector(".addedTracksTab").classList.contains("fxMode")
      ) {
        this.clearBulkSelect();
        document
          .querySelectorAll(".bulkSelected")
          .forEach((track) => track.classList.remove("bulkSelected"));
      }
    },
  },
  mounted() {
    if (localStorage.getItem("addedTracks")) {
      const addedTracks = JSON.parse(localStorage.getItem("addedTracks"));
      setTimeout(() => {
        electron.ipcRenderer.send("parseAddedTracks", addedTracks);
      }, 2000);
    }
    electron.ipcRenderer.on("audioWithCover", (event, track) => {
      document.querySelector(".addedTracksTab").scrollTo(0, 0);
      document.querySelector("#addedTracks").click();
      this.addTrack(track);
    });
    electron.ipcRenderer.on("playNow", (event, track) => {
      if (document.querySelector(".addedTracksTab .TrackCard")) {
        document.querySelector(".addedTracksTab .TrackCard").click();
      }
    });
    electron.ipcRenderer.on("removePlayingTrack", () => {
      const index = parseInt(
        document.querySelector(".playingtrack").getAttribute("id")
      );
      this.removeFromAddedTracks(index);
      const currentTime = document.querySelector("audio").currentTime;
    });
    electron.ipcRenderer.on("playFirstTrack", () => {
      console.log("playFirstTrack");
      console.log(document.querySelector(".addedTracksTab .TrackCard"));
      document.querySelector(".addedTracksTab .TrackCard").click();
      document
        .querySelector(".addedTracksTab .TrackCard")
        .classList.add("playingtrack");
    });
  },
};
</script>

<style lang="scss">
.fxMode {
  .fxModeToggle {
    background: rgb(255, 0, 76) !important;
  }
  #enterFxMode {
    display: none !important;
  }
  #exitFxMode {
    display: block !important;
  }
}
.addedTracksTab {
  padding-top: 0px !important;
  position: relative;
  .showHiddenActions {
    background: #0062ff !important;
    border-radius: 12px !important;
    .hiddenActions {
      display: block !important;
    }
  }
  .trackActions {
    position: sticky;
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
    margin: 0;
    .hiddenActions {
      display: none;
      box-shadow: 0px 0px 50px black;
    }
    #enterFxMode {
      display: block;
    }
    #exitFxMode {
      display: none;
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
@media (max-width: 900px) {
  .addedTracksTab {
    height: 100vh !important;
  }
  .trackActions {
    display: none !important;
  }
}
</style>
