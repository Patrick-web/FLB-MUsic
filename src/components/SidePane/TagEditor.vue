<template>
  <div class="TagEditor">
    <div class="trackTags">
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
    <div class="editModeBtns animated faster">
      <p @click="saveChanges" id="saveChanges">Save Changes</p>
      <p @click="exitEditMode" id="exitEditMode">Exit Edit Mode</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    ...mapGetters(["playingTrack", "indexInFavorites", "settings"]),
  },
  methods: {
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
  },
};
</script>

<style>
.trackTags {
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
</style>
