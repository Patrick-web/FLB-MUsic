<template>
  <div class="playingPane animated faster">
    <img
      @click="expandPlayingPane"
      id="expandPlayingPane"
      src="@/assets/arrowDown.svg"
      alt=""
    />
    <div v-if="!playingTrack.title" class="noMusicPlaying"></div>
    <img :src="playingTrack.cover" alt="" id="blurred" />
    <img
      @dblclick="toggleFromFavourites"
      id="cover"
      :src="playingTrack.cover"
      alt=""
    />
    <div @click="toggleIsPlaying" id="pauseBt" class="iconsWrapper">
      <img
        v-if="!isPlaying"
        class="toggleIcons playIcon"
        src="@/assets/playButton.svg"
        alt
      />
      <img
        v-if="isPlaying"
        class="toggleIcons pauseIcon"
        src="@/assets/pause.svg"
        alt
      />
    </div>
    <div class="trackData">
      <div class="trackInfo">
        <p id="trackName">{{ playingTrack.title }}</p>
        <p @click="showArtistData" id="artistName">{{ playingTrack.artist }}</p>
      </div>
      <TrackBar />
    </div>

    <div class="controls">
      <div class="volumeRockerArea">
        <img src="@/assets/volume_down.svg" alt="" />
        <input
          id="volume"
          @change="adjustVolume"
          v-model="volume"
          type="range"
          min="0"
          max="1"
          step="0.1"
          name=""
        />
      </div>
      <div v-if="playingTrack.title" class="control play_controls">
        <button @click="playPrev" id="prevTrackBt" class="iconBt">
          <img
            style="transform:rotate(-180deg)"
            src="@/assets/play_arrow.svg"
            alt=""
          />
        </button>
        <button @click="toggleFromFavourites" id="favorIcon" class="iconBt">
          <img width="18px" src="@/assets/flash-outline.png" alt="" />
        </button>
        <button id="nextTrackBt" @click="determineNextTrack" class="iconBt">
          <img src="@/assets/play_arrow.svg" alt="" />
        </button>
      </div>
      <div class="control extra_controls" v-if="playingTrack.title">
        <button @click="showPlaylistAdder" id="playlistBt" class="iconBt">
          <img id="plIcon" src="@/assets/playlist_add.svg" alt="" />
        </button>
        <button @click="toggleRepeatMode" id="repeatIcon" class="iconBt">
          <img id="plIcon" src="@/assets/repeat_one.svg" alt="" />
        </button>
        <button @click="toggleShuffleMode" id="shuffleIcon" class="iconBt">
          <img src="@/assets/shuffle.svg" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TrackBar from "@/components/TrackBar.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import Wave from "wave-visualizer";
import particleBg from "@/components/particleBg.vue";

export default {
  computed: {
    ...mapGetters([
      "playingTrack",
      "isPlaying",
      "indexInFavorites",
      "settings",
    ]),
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
      visualsOffDueToBlur: false,
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
      "toggleIsPlaying",
      "UIcontrollerToggleProperty",
      "setSetting",
    ]),
    expandPlayingPane() {
      document
        .querySelector(".MainGrid")
        .classList.toggle("fullScreenPlayingPane");
    },
    adjustVolume() {
      document.querySelector("audio").volume = this.volume;
    },
    showArtistData() {
      document.querySelector("#artists").click();
      document.querySelector("#search").value = this.playingTrack.artist;
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
      this.UIcontrollerToggleProperty("showPlaylistWidget");
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
        this.removeSelectedTrackToPlaylist([0, this.indexInFavorites]);
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
      stroke: 1,
      colors: ["white"],
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
          if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
            document.querySelector("#volume").focus();
          }
        }
      }
    });
  },
  components: {
    TrackBar,
    particleBg,
  },
};
</script>

<style lang="scss">
.fullScreenPlayingPane {
  .playingPane {
    height: 100vh;
    left: 0;
    width: 100vw;
    z-index: 60;
    #particles-js {
      display: block !important;
    }
  }
  #visualizerArea {
    display: none;
  }
  #expandPlayingPane {
    left: 50%;
    transform: rotate(180deg);
  }
  #cover {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 400px !important;
    width: 400px;
    min-width: 200px !important;
    max-height: 800px !important;
  }
  #blurred {
    height: 100vh !important;
    top: 0% !important;
  }
  #trackName {
    position: absolute;
    bottom: 200px;
    left: 20px;
    font-size: 6rem;
    font-family: roboto-thick;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 99%;
  }
  #artistName {
    position: absolute;
    bottom: 120px;
    left: 25px;
    font-size: 3em;
  }
  #pauseBt {
    position: absolute;
    bottom: 50px;
    left: 50%;
    img {
      width: 50px;
    }
  }
  .volumeRockerArea {
    display: none !important;
  }
  .controls {
    position: absolute;
    bottom: 120px;
    right: 20px;
    #playlistBt {
      display: none;
    }
    button {
      transform: scale(1.3);
      margin: 20px;
      margin-bottom: 10px;
      margin-top: 10px;
    }
    .play_controls {
      border: none;
    }
  }
  .TrackBar {
    position: absolute;
    bottom: 0px;
    left: 20px;
    width: 98%;
    .seekBar {
      background: rgba(255, 255, 255, 0.082);
      border-radius: 0;
      height: 4px;
      .seekProgress {
        background: white;
        border-radius: 0;
      }
    }
    .seekBar:hover {
      height: 8px;
    }
  }
}
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
#particles-js {
  display: none;
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.playingPane {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 100px;
  width: 100vw;
  z-index: 20;
  background: black;
  display: grid;
  gap: 10px;
  grid-template-columns: 0.5fr 0.1fr 4fr 2fr;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  #cover {
    max-width: 150px;
    max-height: 90px;
    margin: auto;
    margin-left: 10px;
    align-self: center;
  }
  .trackInfo {
    display: flex;
    justify-content: space-between;
    #artistName {
      font-family: roboto-thin;
    }
    #artistName:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  #blurred {
    position: absolute;
    top: -20px;
    left: 0;
    width: 100%;
    height: 120%;
    filter: blur(15px);
    opacity: 0.5;
    z-index: -1;
  }
  .bordered {
    border: 2px solid white;
    border-radius: 15px;
    border-bottom-right-radius: 0px;
    padding: 5px;
  }
}
.controls {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    margin-left: 5px;
    margin-right: 5px;
  }
  .control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    transition: 0.2s ease;
  }
  .play_controls {
    border-right: 1px solid white;
  }
  .volumeRockerArea {
    position: absolute;
    left: 35px;
    bottom: -2px;
    width: 200px;
    transform: translate(0, 95%);
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    input {
      width: 65%;
      height: 2px;
      cursor: pointer;
      filter: grayscale(0.9);
    }
  }
  .volumeRockerArea:hover {
    input {
      opacity: 1;
    }
  }
}
#expandPlayingPane {
  position: absolute;
  top: 8px;
  left: 97%;
  width: 20px;
  cursor: pointer;
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
@media (max-width: 700px) {
  .playingPane {
    #cover {
      width: 100px;
    }
  }
  .volumeRockerArea {
    display: none;
  }
  .editModeBtns {
    display: none;
  }
  .control extra_controls {
    display: none !important;
  }
  #CoverSearcher {
    display: none;
  }
}
</style>
