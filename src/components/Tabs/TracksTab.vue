<template>
  <div class="tab addedTracksTab">
    <div v-if="addedTracks.length > 1" class="trackActions">
      <div @click="soon('Am still working on this. Oh and its gonna be lit🔥')">
        <p>FX Mode</p>
        <img style="max-width:18px" src="@/assets/star_border.svg" alt="" />
      </div>
      <SortWidget />
    </div>
    <br />
    <br />
    <br />
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
    <transition-group
      enter-active-class="animated slideInLeft extrafaster"
      leave-active-class="animated slideOutRight extrafaster"
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
    ...mapGetters(["addedTracks"]),
  },
  methods: {
    ...mapMutations(["addTrack", "removeFromAddedTracks"]),
    loadMusicFolder() {
      electron.ipcRenderer.send("loadMusicFolder");
      document.querySelector("#loadMusicFolderBt").style.display = "none";
      const noti = this.$vs.notify({
        position: "top-center",
        title: "Loading your music folder...",
      });
    },
    soon(msg) {
      const noti = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: msg,
      });
    },
  },
  mounted() {
    if (localStorage.getItem("addedTracks")) {
      const addedTracks = JSON.parse(localStorage.getItem("addedTracks"));
      electron.ipcRenderer.send("parseAddedTracks", addedTracks);
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
    position: fixed;
    background: black;
    top: 0;
    left: 0;
    width: 16.8%;
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
</style>
