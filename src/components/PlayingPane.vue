<template>
  <div class="playingPane animated faster">
    <div class="trackTags">
      <img id="coverArtTag" :src="playingTrack.cover" alt="" />
      <h4 id="selectCoverArt">Select Cover Art</h4>
      <div>
        <h4>Name</h4>
        <p id="titleTag" contenteditable>
          {{ playingTrack.title }}
        </p>
      </div>
      <div v-if="playingTrack.artist">
        <h4>Artist</h4>
        <p contenteditable id="artistTag">{{ playingTrack.artist }}</p>
      </div>
      <div>
        <h4>Album</h4>
        <p contenteditable id="albumTag">{{ playingTrack.album }}</p>
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
    <div class="editModeBtns">
      <p @click="saveChanges" id="saveChanges">Save Changes</p>
      <p @click="exitEditMode" id="exitEditMode">Exit Edit Mode</p>
    </div>
    <div class="p_options" v-if="playingTrack.title">
      <div @click="showPlaylistAdder" class="iconBt">
        <img
          width="27px"
          id="plIcon"
          src="@/assets/list-circle-outline.png"
          alt=""
        />
      </div>
      <div @click="enterEditMode" id="penIcon" class="iconBt">
        <img width="18px" src="@/assets/pen.svg" alt="" />
      </div>
    </div>
    <div v-if="playingTrack.title" class="controls">
      <div @click="playPrev" class="iconBt">
        <img width="15px" src="@/assets/prev.png" alt="" />
      </div>
      <div @click="toggleFromFavourites" id="favorIcon" class="iconBt">
        <img width="18px" src="@/assets/flash-outline.png" alt="" />
      </div>
      <div @click="determineNextTrack" class="iconBt">
        <img width="15px" src="@/assets/next.png" alt="" />
      </div>
    </div>
    <TrackBar />
  </div>
</template>

<script>
import TrackBar from "@/components/TrackBar.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
const electron = window.require("electron");

export default {
  // computed: mapGetters([]),
  computed: {
    ...mapGetters(["playingTrack", "indexInFavorites"]),
  },
  data() {
    return {
      elements: ["songName", "artistName", "albumName"],
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
    ]),
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
      document.querySelector(".PlaylistAdder").classList.add("show");
    },
    enterEditMode() {
      document.querySelector(".playingPane").classList.add("editMode");
      document.querySelector("#titleTag").focus();
    },
    exitEditMode() {
      document.querySelector(".playingPane").classList.remove("editMode");
    },
    saveChanges() {
      const title = document.querySelector("#titleTag").textContent;
      const artist = document.querySelector("#artistTag").textContent;
      const album = document.querySelector("#albumTag").textContent;
      const coverArt = document.querySelector(".coverArtTag").src;
      console.log(title, artist, album, coverArt);
      const data = {
        path: this.playingTrack.path.replace("file://", ""),
        title,
        artist,
        album,
        coverArt,
      };
      // electron.ipcRenderer.send("updateTrackInfo", data);
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
    electron.ipcRenderer.on("tagWriteSuccessful", () => {
      const noti = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: "Song info succesfully changed",
      });
      // this.updateSongInfo()
    });
    electron.ipcRenderer.on("tagWriteError", () => {
      const noti = this.$vs.notify({
        color: "danger",
        position: "top-center",
        title: "An error occured while changing song info",
      });
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight") {
      }
    });
  },
  components: {
    TrackBar,
  },
};
</script>

<style lang="scss">
.favored {
  #favorIcon {
    cursor: pointer;
    background: rgb(0, 64, 255);
  }
}
.editMode {
  .p_options,
  .controls {
    transform: scale(0) !important;
  }
  .editModeBtns,
  .trackTags {
    transform: translateY(0%);
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
  #cover {
    position: relative;
    z-index: 3;
    width: 85%;
    margin-top: 20px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.205);
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
    background: #0f0f0f;
    border-radius: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    transition: 0.2s ease;
    .iconBt {
      padding: 10px;
      border-radius: 40px;
      background: rgba(0, 64, 255, 0);
      transition: 0.2s ease-in-out;
    }
    .iconBt:hover {
      cursor: pointer;
      background: rgb(0, 64, 255);
    }
  }
}
.p_options {
  width: 40% !important;
  bottom: 70px !important;
  padding-right: 0px;
  padding-left: 0px;
  #plIcon {
    padding-top: 5px;
  }
}
.trackTags {
  background: black;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
  color: white;
  transform: translateY(-100%);
  transition: 0.2s ease;
  #selectCoverArt {
    position: relative;
    z-index: 5;
    text-align: center;
    transform: translateY(-150%) translateX(-50%);
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
    width: 85%;
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
  left: 0%;
  bottom: 0px;
  width: 100%;
  height: 100px;
  padding: 10px;
  transform: translateY(100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  transition: 0.2s ease;
  color: white;
  background: black;
  p {
    padding: 5px;
    width: 100%;
    text-align: center;
    border-radius: 10px;
    font-size: 1.2em;
    font-family: roboto;
    transition: 0.2s ease;
    cursor: pointer;
  }
  p:hover {
    border-radius: 20px;
  }
  #saveChanges {
    background: rgb(0, 68, 255);
  }
  #exitEditMode {
    background: crimson;
  }
}
</style>
