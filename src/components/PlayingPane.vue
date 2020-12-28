<template>
  <div class="playingPane animated faster">
    <div v-if="!playingTrack.title" class="noMusicPlaying"></div>
    <div class="trackTags animated faster">
      <img id="coverArtTag" :src="playingTrack.cover" alt="" />
      <h4 @click="importCover" id="selectCoverArt">Import Cover Art</h4>
      <div>
        <h4>Name</h4>
        <p
          id="titleTag"
          class="inputElem"
          @change="changeAlbumSearchQuery"
          contenteditable
        >
          {{ playingTrack.title }}
        </p>
      </div>
      <div>
        <h4>Artist</h4>
        <p contenteditable class="inputElem" id="artistTag">
          {{ playingTrack.artist }}
        </p>
      </div>
      <div>
        <h4>Album</h4>
        <p contenteditable class="inputElem" id="albumTag">
          {{ playingTrack.album }}
        </p>
      </div>
      <div class="possibleCovers">
        <button @click="openCoverSearcher">
          <h3 style="text-align:center">Open Cover Searcher📔</h3>
        </button>
        <br />
        <div
          v-if="possibleThumbnails.length == 0 && isOnline"
          class="loadingArea"
        >
          <div class="loadingIndicator"></div>
        </div>
        <img
          v-for="cover in possibleThumbnails"
          :key="cover.url"
          :src="cover.url"
          alt=""
          @click="selectCover(cover.url)"
        />
      </div>
    </div>
    <img :src="playingTrack.cover" alt="" id="blurred" />
    <img id="cover" :src="playingTrack.cover" alt="" />
    <div class="songInfo">
      <p id="songName">{{ playingTrack.title }}</p>
      <p v-if="playingTrack.artist">
        Artist : <span id="artistName">{{ playingTrack.artist }}</span>
      </p>
      <p v-if="playingTrack.album">
        Album : <span id="albumName">{{ playingTrack.album }}</span>
      </p>
    </div>

    <div class="editModeBtns animated faster">
      <p @click="saveChanges" id="saveChanges">Save Changes</p>
      <p @click="exitEditMode" id="exitEditMode">Exit Edit Mode</p>
    </div>

    <canvas id="visualizerArea"></canvas>
    <div class="volumeRockerArea">
      <img src="@/assets/volume_down.svg" alt="" />
      <input
        class="inputElem"
        @change="adjustVolume"
        v-model="volume"
        type="range"
        min="0"
        max="1"
        step="0.1"
        name=""
        id=""
      />
    </div>

    <div class="p_options" v-if="playingTrack.title">
      <div @click="showPlaylistAdder" class="iconBt">
        <img id="plIcon" src="@/assets/playlist_add.svg" alt="" />
      </div>
      <div @click="enterEditMode" id="penIcon" class="iconBt">
        <img src="@/assets/edit.svg" alt="" />
      </div>
      <div @click="toggleRepeatMode" id="repeatIcon" class="iconBt">
        <img id="plIcon" src="@/assets/repeat_one.svg" alt="" />
      </div>
      <div @click="toggleShuffleMode" id="shuffleIcon" class="iconBt">
        <img src="@/assets/shuffle.svg" alt="" />
      </div>
    </div>

    <div v-if="playingTrack.title" class="controls">
      <div @click="playPrev" id="prevTrackBt" class="iconBt">
        <img
          style="transform:rotate(-180deg)"
          src="@/assets/play_arrow.svg"
          alt=""
        />
      </div>
      <div @click="toggleFromFavourites" id="favorIcon" class="iconBt">
        <img width="18px" src="@/assets/flash-outline.png" alt="" />
      </div>
      <div id="nextTrackBt" @click="determineNextTrack" class="iconBt">
        <img src="@/assets/play_arrow.svg" alt="" />
      </div>
    </div>
    <CoverSearcher />
    <TrackBar />
  </div>
</template>

<script>
import TrackBar from "@/components/TrackBar.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import Wave from "wave-visualizer";
import * as gis from "g-i-s";
import CoverSearcher from "./CoverSearcher.vue";
const electron = window.require("electron");

export default {
  computed: {
    ...mapGetters(["playingTrack", "indexInFavorites"]),
  },
  data() {
    return {
      elements: ["songName", "artistName", "albumName"],
      repeat: false,
      shuffle: false,
      possibleThumbnails: [],
      selectedCover: "",
      volume: 1,
      isOnline: false,
    };
  },
  methods: {
    ...mapActions(["determineNextTrack"]),
    ...mapMutations([
      "addToFavorites",
      "removeFromFavorites",
      "selectATrack",
      "addSelectedTrackToPlaylist",
      "removeSelectedTrackToPlaylist",
      "setRepeat",
      "toggleShuffler",
    ]),
    adjustVolume() {
      document.querySelector("audio").volume = this.volume;
    },
    playPrev() {
      const prevTrack = document.querySelector(".playingtrack").previousSibling;
      if (prevTrack) {
        prevTrack.click();
      } else {
        const tracks = document.querySelectorAll(".TrackCard");
        tracks[tracks.length - 1].click();
      }
    },
    showPlaylistAdder() {
      this.selectATrack();
      document.querySelector("#PlaylistAdder").classList.add("ModalShow");
    },
    selectCover(url) {
      this.selectedCover = url;
      document.querySelector("#coverArtTag").src = url;
    },
    importCover() {
      electron.ipcRenderer.send("importCoverArt");
    },
    openCoverSearcher() {
      document.querySelector("#CoverSearcher").classList.add("ModalShow");
    },
    enterEditMode() {
      document.querySelector("#pauseBt img").click();
      document.querySelector(".playingPane").classList.add("editMode");
      document.querySelector("#titleTag").focus();
      document.querySelector(".trackTags").classList.add("slideInDown");
      document.querySelector(".editModeBtns").classList.add("slideInUp");
      if (navigator.onLine) {
        this.isOnline = true;
        const noti = this.$vs.notify({
          position: "top-center",
          title: `Fetching possible cover art`,
          color: "success",
        });
        this.possibleThumbnails = [];
        this.searchImage(this.playingTrack.title);
      } else {
        this.isOnline = false;
        const noti = this.$vs.notify({
          position: "top-center",
          title: `Connect to Internet to fetch possible thumbnails`,
          color: "danger",
        });
      }
    },
    exitEditMode() {
      document.querySelector("#pauseBt img").click();
      document
        .querySelector(".editModeBtns")
        .classList.replace("slideInUp", "slideOutDown");
      document
        .querySelector(".trackTags")
        .classList.replace("slideInDown", "slideOutUp");
      setTimeout(() => {
        document.querySelector(".playingPane").classList.remove("editMode");
        document
          .querySelector(".editModeBtns")
          .classList.remove("slideOutDown");
        document.querySelector(".trackTags").classList.remove("slideOutUp");
      }, 300);
    },
    searchImage(title) {
      console.log("Searching+++" + title);
      gis(title, (error, results) => {
        console.log("logging results");
        if (error) {
          console.log(error);
        } else {
          if (results.length > 1) {
            this.possibleThumbnails = results.splice(10, 99);
          }
        }
      });
    },
    changeAlbumSearchQuery() {
      console.log("Changing Search");
    },
    toggleShuffleMode() {
      document.querySelector(".playingPane").classList.toggle("shuffleMode");
      this.toggleShuffler();
      this.shuffle = !this.shuffle;
      const state = this.shuffle ? "On" : "Off";
      const noti = this.$vs.notify({
        position: "top-center",
        title: `Shuffle ${state}`,
      });
    },
    toggleRepeatMode() {
      this.repeat = !this.repeat;
      this.setRepeat();
      document.querySelector(".playingPane").classList.toggle("repeatMode");
      document.querySelector("audio").loop = this.repeat;
      const state = this.repeat ? "On" : "Off";
      const noti = this.$vs.notify({
        position: "top-center",
        title: `Repeat ${state}`,
      });
    },
    saveChanges() {
      const title = document.querySelector("#titleTag").textContent.trim();
      const artist = document.querySelector("#artistTag").textContent;
      const album = document.querySelector("#albumTag").textContent;
      let cover = document.querySelector("#coverArtTag").src;
      let tags = {};
      if (title != this.playingTrack.title.trim()) {
        tags["title"] = title;
      }
      if (artist != this.playingTrack.artist) {
        tags["artist"] = artist;
      }
      if (album != this.playingTrack.album) {
        tags["album"] = album;
      }
      if (cover != this.playingTrack.cover) {
        tags.APIC = document.querySelector("#coverArtTag").src;
      }
      const data = {
        path: this.playingTrack.path.replace("file://", ""),
        tags: tags,
      };
      console.log(Object.keys(data.tags).length);
      if (Object.keys(data.tags).length !== 0) {
        electron.ipcRenderer.send("updateTrackInfo", data);
        console.log("=======sent======");
      }
      this.exitEditMode();
    },
    toggleFromFavourites() {
      this.selectATrack();
      if (
        document.querySelector(".playingPane").classList.contains("favored")
      ) {
        const noti = this.$vs.notify({
          color: "danger",
          position: "top-center",
          title: "Removed from Favourites",
          text: `${this.playingTrack.title} removed from Favourites`,
        });
        this.removeSelectedTrackToPlaylist([
          "Favorites",
          this.indexInFavorites,
        ]);
        document.querySelector(".playingPane").classList.remove("favored");
      } else {
        this.addSelectedTrackToPlaylist("Favorites");
        const noti = this.$vs.notify({
          color: "success",
          position: "top-center",
          title: "Added to Favourites",
          text: `${this.playingTrack.title} added to Favourites`,
        });
        document.querySelector(".playingPane").classList.add("favored");
      }
    },
  },
  mounted() {
    const wave = new Wave();
    wave.fromElement("audioTag", "visualizerArea", {
      type: "wave",
      colors: ["white"],
    });
    electron.ipcRenderer.on("tagWriteError", () => {
      const noti = this.$vs.notify({
        color: "danger",
        position: "top-center",
        title: "An error occured while changing song info",
      });
    });
    electron.ipcRenderer.on("importedCoverArt", (e, data) => {
      document.querySelector("#coverArtTag").src = data;
    });
    window.addEventListener("keydown", (e) => {
      if (!document.activeElement.classList.contains("inputElem")) {
        if (this.playingTrack.title) {
          if (e.code === "Space") {
            e.preventDefault();
            document.querySelector("#pauseBt img").click();
          }
          if (e.code === "KeyN") {
            document.querySelector("#nextTrackBt").click();
          }
          if (e.code === "KeyP") {
            document.querySelector("#prevTrackBt").click();
          }
          if (e.code === "KeyS") {
            document.querySelector("#search").focus();
          }
        }
      }
    });
  },
  components: {
    TrackBar,
    CoverSearcher,
  },
};
</script>

<style lang="scss">
.favored {
  #favorIcon {
    cursor: pointer;
    background: rgb(255, 255, 255);
    img {
      filter: invert(100%);
    }
  }
}
.repeatMode {
  #repeatIcon {
    cursor: pointer;
    background: rgb(255, 255, 255);
    img {
      filter: invert(100%);
    }
  }
}
.shuffleMode {
  #shuffleIcon {
    cursor: pointer;
    background: rgb(255, 255, 255);
    img {
      filter: invert(100%);
    }
  }
}
.editMode {
  .p_options,
  .controls {
    display: block;
  }
  .trackTags {
    display: block;
  }
  .editModeBtns {
    display: flex;
    z-index: 5;
  }
}
.playingPane {
  position: relative;
  height: 100vh;
  z-index: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 285px;
  min-width: 100px;
  #visualizerArea {
    position: absolute;
    width: 100%;
    height: 25%;
    bottom: 15%;
  }
  #cover {
    position: relative;
    z-index: 3;
    width: 85%;
    max-width: 240px;
    margin-top: 45px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.205);
  }
  .possibleCovers {
    width: 100%;
    overflow: hidden;
    overflow-y: scroll;
    max-height: 130px;
    img {
      width: 100%;
      cursor: pointer;
    }
    img:hover {
      transform: scale(0.9);
    }
  }
  #blurred {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: blur(20px);
    opacity: 0.7;
  }
  .songInfo {
    position: relative;
    z-index: 5;
    color: white;
    width: 100%;
    padding: 25px;
    p {
      margin-bottom: 15px;
      font-family: roboto-light;
    }
    #songName {
      font-family: roboto;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    #artistName {
      font-size: 0.9em;
    }
    #albumName {
      font-size: 0.9em;
    }
    .bordered {
      border: 2px solid white;
      border-radius: 15px;
      border-bottom-right-radius: 0px;
      padding: 5px;
    }
  }
  .controls,
  .p_options {
    position: absolute;
    left: 50%;
    bottom: 10px;
    width: 80%;
    transform: translateX(-50%);
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.062);
    border-radius: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    transition: 0.2s ease;
    .iconBt {
      padding: 5px;
      margin: 5px;
      border-radius: 40px;
      background: rgba(0, 64, 255, 0);
      transition: 0.2s ease-in-out;
      border: 1px solid rgba(255, 255, 255, 0);
    }
    .iconBt:hover {
      cursor: pointer;
      border: 1px solid rgb(255, 255, 255);
      img {
        // filter: invert(100%);
      }
    }
  }
}
.p_options {
  width: 80% !important;
  bottom: 70px !important;
  padding-right: 0px;
  padding-left: 0px;
}
.volumeRockerArea {
  position: absolute;
  bottom: 130px;
  width: 10%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  background-color: rgba(100, 100, 100, 0.062);
  border-radius: 10px;
  padding: 5px;
  input {
    display: none;
    width: 85%;
    height: 2px;
  }
}
.volumeRockerArea:hover {
  width: 80%;
  input {
    display: block;
    cursor: pointer;
  }
}
.trackTags {
  backdrop-filter: blur(10px);
  background-color: rgba(100, 100, 100, 0.062);
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
  color: white;
  display: none;
  transition: 0.2s ease;
  #selectCoverArt {
    position: relative;
    z-index: 5;
    text-align: center;
    transform: translateY(50%) translateX(-50%);
    backdrop-filter: blur(10px);
    width: 50%;
    left: 50%;
    padding: 5px;
    border-radius: 10px;
    background: rgba(12, 12, 12, 0.863);
    cursor: pointer;
    transition: 0.2s ease;
  }
  #selectCoverArt:hover {
    border-radius: 20px;
    background: #0062ff;
  }
  #coverArtTag {
    width: 230px;
    margin-top: 10px;
    margin-bottom: -30px;
    margin-left: 20px;
  }
  div {
    padding: 10px;
    border-bottom: 1px solid gray;
    p {
      font-family: roboto-light;
    }
  }
}
.editModeBtns {
  position: absolute;
  z-index: 4;
  left: 0%;
  bottom: 0px;
  width: 100%;
  height: 140px;
  padding: 10px;
  display: none;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
  transition: 0.2s ease;
  color: white;
  backdrop-filter: blur(10px);
  background-color: rgba(100, 100, 100, 0.062);
  p {
    padding: 5px;
    padding-top: 8px;
    padding-bottom: 8px;
    width: 100%;
    text-align: center;
    border-radius: 20px;
    font-size: 1.2em;
    font-family: roboto;
    transition: 0.2s ease;
    cursor: pointer;
  }
  p:hover {
    border-radius: 12px;
  }
  #saveChanges {
    background: rgb(255, 255, 255);
    color: black;
  }
  #exitEditMode {
    background: rgb(209, 1, 46);
  }
}
.noMusicPlaying {
  position: absolute;
  z-index: 4;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
}
</style>
