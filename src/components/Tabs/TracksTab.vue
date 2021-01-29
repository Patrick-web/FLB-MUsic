<template>
  <div class="tab addedTracksTab">
    <div v-if="addedTracks.length == 0" class="loadingArea">
      <div class="loadingIndicator"></div>
    </div>
    <div v-if="addedTracks.length > 1" class="trackActions">
      <div class="fxModeToggle actionBt" @click="toggleFxMode()">
        <p id="enterFxMode">FX Mode</p>
        <p id="exitFxMode">Exit FX Mode</p>
        <img style="max-width:18px" src="@/assets/star_border.svg" alt="" />
      </div>
      <SortWidget />
    </div>
    <!-- <Player /> -->
    <transition-group leave-active-class="animated faster slideOutLeft">
      <TrackCard
        :track="track"
        :trackIndex="index"
        v-for="(track, index) in addedTracks"
        :key="track.path"
      />
    </transition-group>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
const electron = window.require("electron");
import SortWidget from "@/components/SortWidget.vue";
import TrackCard from "@/components/TrackCard.vue";
// import Player from "@/components/VideoPlayer/Player.vue";

export default {
  components: {
    SortWidget,
    TrackCard,
    // Player,
  },
  computed: {
    ...mapGetters(["addedTracks", "currentTab"]),
  },
  methods: {
    ...mapMutations([
      "addTrack",
      "purge",
      "removeFromAddedTracks",
      "clearBulkSelect",
    ]),
    ...mapActions(["saveDataToLocalStorage"]),
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
      addedTracks.forEach((track) => this.addTrack(track));
      electron.ipcRenderer.send("verifyExistence", addedTracks);
    } else {
      electron.ipcRenderer.send("loadMusicFolder");
    }
    electron.ipcRenderer.on("saveDataToLocalStorage", (event) => {
      console.log("saveDataToLocalStorage");
      this.saveDataToLocalStorage();
    });
    electron.ipcRenderer.on("purgeFromCache", (event, tracks) => {
      this.purge(tracks);
    });
    electron.ipcRenderer.on("reparseFromCache", (event, tracks) => {
      this.reparse(tracks);
    });
    electron.ipcRenderer.on("audioWithCover", (event, track) => {
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
    background-color: rgba(0, 0, 0, 0.247);
    backdrop-filter: blur(10px);
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
    .actionBt {
      background-color: rgba(0, 0, 0, 0.295);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-radius: 40px;
      cursor: pointer;
    }
    .actionBt:hover {
      background-color: rgba(252, 252, 252, 0.089);
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
