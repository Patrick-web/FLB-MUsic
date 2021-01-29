<template>
  <div class="TagEditor">
    <p class="modalClose" @click="UIcontrollerToggleProperty('showTagEditor')">
      <img src="@/assets/x.svg" alt="" />
    </p>
    <h2 class="modalTitle">Tag Editor</h2>
    <div class="trackTags">
      <img id="coverArtTag" :src="newAlbumArt" alt="" />
      <button @click="importCover" id="selectCoverArt">
        <h4>Import Album Art</h4>
      </button>
      <div class="tag">
        <p>Title</p>
        <input v-model="newTitle" id="titleTag" class="inputElem" />
      </div>
      <div class="tag">
        <p>Artist</p>
        <input v-model="newArtist" class="inputElem" id="artistTag" />
      </div>
      <div class="tag">
        <p>Album</p>
        <input v-model="newAlbum" class="inputElem" id="albumTag" />
      </div>
      <div v-if="isOnline" class="possibleCovers">
        <p>Album Art Search</p>
        <input
          type="text"
          v-model="query"
          @keyup.enter="searchImage"
          class="inputElem"
        />
        <div v-if="possibleAlbumArt.length == 0" class="loadingArea">
          <div class="loadingIndicator"></div>
        </div>
        <div class="possibles">
          <img
            v-for="cover in possibleAlbumArt"
            :key="cover.url"
            :src="cover.url"
            alt=""
            @click="selectCover(cover.url)"
          />
        </div>
      </div>
    </div>
    <div class="animated faster">
      <button @click="saveChanges" id="saveChanges">
        <h3>Save Changes</h3>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
const electron = window.require("electron");
import * as gis from "g-i-s";

export default {
  data() {
    return {
      possibleAlbumArt: [],
      selectedCover: "",
      isOnline: false,
      newTitle: "",
      newAlbum: "",
      newArtist: "",
      newAlbumArt: "",
      query: "",
    };
  },
  computed: {
    ...mapGetters(["playingTrack", "indexInFavorites", "settings"]),
  },
  methods: {
    ...mapMutations(["UIcontrollerToggleProperty"]),
    openCoverSearcher() {
      document.querySelector("#CoverSearcher").classList.add("ModalShow");
    },
    selectCover(url) {
      this.selectedCover = url;
      document.querySelector("#coverArtTag").src = url;
    },
    importCover() {
      electron.ipcRenderer.send("importCoverArt");
    },
    saveChanges() {
      let newAlbumArtSrc = document.querySelector("#coverArtTag").src;
      let tags = {};
      if (this.title != this.newTitle) {
        tags["title"] = this.newTitle;
      }
      if (this.artist != this.newArtist) {
        tags["artist"] = this.newArtist;
      }
      if (this.album != this.newAlbum) {
        tags["album"] = this.newAlbum;
      }
      if (this.albumArt != newAlbumArtSrc) {
        tags.APIC = newAlbumArtSrc;
      }
      const data = {
        path: this.trackPath.replace("file://", ""),
        tags: tags,
      };
      if (Object.keys(data.tags).length !== 0) {
        this.$emit("changedTags", data);
        console.log("=======sent======");
        electron.ipcRenderer.send("updateTags", data);
      }
      this.UIcontrollerToggleProperty("showTagEditor");
    },
    searchImage() {
      console.log(this.query);
      this.possibleAlbumArt = [];
      gis(this.query, (error, results) => {
        console.log("logging results");
        if (error) {
          console.log(error);
        } else {
          if (results.length > 1) {
            this.possibleAlbumArt = results.slice(0, 10);
          }
        }
      });
    },
  },
  mounted() {
    this.newTitle = this.title;
    this.query = `${this.title} by ${this.artist} album art`;
    this.newArtist = this.artist;
    this.newAlbum = this.album;
    this.newAlbumArt = this.albumArt;
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
    this.isOnline = navigator.onLine;
    if (this.isOnline) {
      this.searchImage();
    }
    window.addEventListener("online", () => {
      this.isOnline = true;
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
    });
  },
  props: {
    albumArt: String,
    title: String,
    album: String,
    artist: String,
    trackPath: String,
  },
};
</script>

<style lang="scss">
.TagEditor {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.39);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.315);
  box-shadow: 0px 0px 50px black;
  padding: 10px;
  top: 8%;
  left: 60%;
  z-index: 50;
  width: 250px;
  color: white;

  p {
    font-family: roboto-thin;
    margin-bottom: 5px;
  }
  #coverArtTag {
    width: 200px;
    margin-top: 10px;
    margin-left: 15px;
  }
  .tag {
    padding: 10px;
  }

  .bt {
    padding: 5px;
    margin-bottom: 10px;
    padding-top: 8px;
    width: 100%;
    text-align: center;
    border-radius: 20px;
    font-size: 1.2em;
    font-family: roboto;
    transition: 0.2s ease;
    background: rgba(255, 255, 255, 0.055);
    cursor: pointer;
  }
  p:hover {
    border-radius: 12px;
  }
  .possibleCovers {
    padding: 10px;
    position: absolute;
    left: -2px;
    bottom: 0px;
    transform: translateX(-100%);
    background-color: rgb(0, 0, 0);
    backdrop-filter: blur(10px);
    width: 100%;
    .possibles {
      margin-top: 10px;
      height: 400px;
      overflow: hidden;
      overflow-y: scroll;
    }
    img {
      width: 100%;
      cursor: pointer;
    }
    img:hover {
      transform: scale(0.9);
    }
  }
}
</style>
