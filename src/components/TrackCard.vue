<template>
  <div
    @contextmenu="showOptions($event)"
    @click="playTrack"
    :id="trackIndex"
    class="TrackCard"
  >
    <div @click.stop="bulkSelectTrack($event)" class="fxSelectBt"></div>
    <img
      @click.stop="removeFromPlaylist($event)"
      class="delIcon"
      src="@/assets/trash-bin-outline.svg"
      alt=""
    />
    <img
      @click.stop="removeFromQueue(trackIndex)"
      class="unQueueIcon"
      src="@/assets/trash-bin-outline.svg"
      alt=""
    />
    <img class="cover" :src="track.cover" alt="" />
    <div class="info">
      <p class="trackTitle">
        {{ track.title }}
      </p>
      <div class="grid2">
        <div class="artist">{{ track.artist }}</div>
        <div class="duration" v-if="track.duration">
          {{ JSON.stringify(track.duration).toHHMMSS() }}
        </div>
        <div class="duration" v-if="!track.duration">_ _ : _ _</div>
        <div class="dateAdded" v-if="track.dateAdded">
          {{ track.dateAdded }}
        </div>
      </div>
    </div>
    <div class="options">
      <div @click.stop="addPlayNextClass($event)" class="option">
        <img width="15px" src="@/assets/arrow-undo-outline.svg" alt="" />
        <span>Play Next</span>
      </div>
      <div @click.stop="queueTrack($event)" class="option">
        <img width="15px" src="@/assets/queue_music.png" alt="" />
        <span>Add to Queue</span>
      </div>
      <div @click.stop="favour($event)" class="option">
        <img width="15px" src="@/assets/flash-outline.png" alt="" />
        <span>Add to Favourites</span>
      </div>
      <div @click.stop="showPlaylistAdder" class="option">
        <img width="20px" src="@/assets/list-circle-outline.png" alt="" />
        <span>Add to Playlist</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
const electron = window.require("electron");
import Wave from "wave-visualizer";

export default {
  computed: {
    ...mapGetters(["queuedTracks", "UIcontroller"]),
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    ...mapMutations([
      "setPlayingTrack",
      "addToRecents",
      "addToQueue",
      "selectATrack",
      "addSelectedTrackToPlaylist",
      "removeSelectedTrackToPlaylist",
      "removeFromQueue",
      "bulkSelect",
      "UIcontrollerToggleProperty",
    ]),
    showOptions(e) {
      e.preventDefault();
      this.selectATrack(this.track);
      if (document.querySelector(".showOptions"))
        document.querySelector(".showOptions").classList.remove("showOptions");
      e.currentTarget.classList.add("showOptions");
    },
    showPlaylistAdder() {
      document.querySelector("#PlaylistAdder").classList.add("ModalShow");
    },
    removeFromPlaylist(e) {
      const playlistName = e.target.parentElement.parentElement.parentElement.parentElement.querySelector(
        ".titleArea"
      ).textContent;
      this.removeSelectedTrackToPlaylist([this.playlistIndex, this.trackIndex]);
      const n2 = this.$vs.notify({
        position: "top-center",
        title: `Track Removed from ${playlistName} playlist`,
      });
    },
    favour(e) {
      const track = e.currentTarget.parentElement.parentElement;
      this.addSelectedTrackToPlaylist("Favorites");
      const noti = this.$vs.notify({
        color: "success",
        position: "top-right",
        title: "Added to Favourites",
        text: `${this.track.title} added to Favourites`,
      });
      this.hideOptions(track);
    },
    addPlayNextClass(e) {
      const nextToPlay = document.querySelector(".playingNext");
      if (nextToPlay) {
        nextToPlay.classList.remove("playingNext");
      }
      const track = e.currentTarget.parentElement.parentElement;
      track.classList.add("playingNext");
      const noti = this.$vs.notify({
        color: "success",
        position: "top-right",
        title: "Playing Next",
        text: `${this.track.title}`,
      });
      this.hideOptions(track);
    },
    playTrack(e) {
      document.querySelector("#search").value = "";
      //Remount Tag Editor
      if (this.UIcontroller.showTagEditor) {
        this.UIcontrollerToggleProperty("showTagEditor");
        setTimeout(() => {
          this.UIcontrollerToggleProperty("showTagEditor");
        }, 100);
      }
      if (document.querySelector(".playingtrack")) {
        document
          .querySelector(".playingtrack")
          .classList.remove("playingtrack");
      }
      const track = e.currentTarget;
      track.classList.add("playingtrack");
      this.setPlayingTrack(this.track);
      this.addToRecents(this.track);
      //Pause webview
      const webview = document.querySelector("webview");
      if (webview) {
        webview.executeJavaScript(
          `function pause () {
            if(document.querySelector('.svg-icon-pause')){
              document.querySelector('[aria-label="Pause"]').click()
          }
        }
       pause();`
        );
      }
      const wave = new Wave();
      wave.fromElement("audioTag", "visualizerArea", {
        colors: ["white"],
      });
      electron.ipcRenderer.send("playingTrack", this.track);
    },
    setEditModeValues() {
      if (document.querySelector("#titleTag")) {
        document.querySelector("#titleTag").textContent = this.title;
        document.querySelector("#artistTag").textContent = this.artist;
        document.querySelector("#albumTag").textContent = this.album;
        document.querySelector("#coverArtTag").src = this.cover;
      }
    },
    queueTrack(e) {
      document.querySelector(".queueTabIcon").click();
      const track = e.currentTarget.parentElement.parentElement;
      this.addToQueue(this.track);
      const n2 = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: "Added to Queue",
        text: `${this.track.title}`,
      });
      track.classList.add("queued");
      this.hideOptions(track);
    },
    hideOptions(currentElement) {
      currentElement.classList.remove("showOptions");
    },
    bulkSelectTrack(e) {
      e.currentTarget.parentElement.classList.toggle("bulkSelected");
      this.bulkSelect(this.track);
    },
  },
  props: {
    track: Object,
    trackIndex: Number,
    playlistIndex: Number,
  },
};
</script>

<style lang="scss">
.disable__options {
  .TrackCard {
    .options {
      display: none;
    }
    .delIcon {
      display: block !important;
    }
  }
}
.brockentrack {
  .trackTitle,
  .artist,
  .duration {
    text-decoration: line-through;
  }
  opacity: 0.6;
  pointer-events: none;
}
.fxMode {
  .TrackCard {
    margin-left: 30px;
    .fxSelectBt {
      opacity: 1;
    }
  }
  .TrackCard:hover {
    cursor: default;
    .info {
      padding-left: 0px;
    }
    .cover {
      transform: scale(0.9) translate(0px, 0px);
      box-shadow: -4px 4px 15px rgba(0, 0, 0, 0.712);
    }
    .fxSelectBt {
      border: 2px solid#0062ff;
      border-radius: 10px;
      cursor: pointer;
    }
  }
}
.bulkSelected {
  .fxSelectBt {
    border-radius: 10px;
    border: none !important;
    border-bottom: 2px solid#ffffff !important;
    border-top: 2px solid#ffffff !important;
    background: #0062ff !important;
  }
}
.playingtrack {
  background: #0062ff !important;
  position: relative;
  margin-top: -2px;
  border: none;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.644);
  .cover {
    transform: scale(1.1) translate(0px, 0px);
    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.712);
  }
  .options {
    display: none;
  }
}
.showOptions {
  .options {
    transform: translateY(80%) scaleY(1);
    pointer-events: all;
  }
}
.showOptions:hover {
  .cover {
    transform: scale(1) !important;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0) !important;
  }
}
.options {
  position: absolute;
  z-index: 10;
  right: 10px;
  bottom: 0;
  transform-origin: top left;
  transform: translateY(80%) scaleY(0);
  pointer-events: none;
  border-radius: 20px;
  width: 220px;
  background-color: #0000006b;
  backdrop-filter: blur(10px);
  overflow: hidden;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.349) !important;
  transition: 0.1s transform ease;
  .option {
    padding: 8px;
    padding-left: 10px;
    font-family: roboto-light;
    cursor: pointer;
    transition: 0.2s ease;
    img {
      margin-right: 10px;
    }
  }
  .option:hover {
    background-color: #ffffff1e;
    border-radius: 20px;
    margin: 5px;
  }
}
.TrackCard {
  position: relative;
  background: #0f0f0f7e;
  border-bottom: 1px solid rgba(128, 128, 128, 0.356);
  display: flex;
  color: white;
  // height: 80px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  cursor: pointer;
  transition: 0.2s ease;
  font-family: roboto-light;
  .fxSelectBt {
    position: absolute;
    top: 50%;
    left: -28px;
    transform: translateY(-50%);
    z-index: 4;
    background: rgba(0, 0, 0, 0.466);
    border: 1px solid rgba(255, 255, 255, 0.452);
    width: 20px;
    height: 20px;
    opacity: 0;
  }
  .cover {
    width: 50px;
    transform: scale(0.9);
    transition: 0.2s ease;
    justify-self: center;
    align-self: center;
  }
  p {
    font-size: 1.2em;
  }
  .info {
    padding: 5px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: 0.2s ease;
  }
  .grid2 {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 1em;
    font-family: roboto-thin;
  }
  .delIcon {
    position: absolute;
    top: 50%;
    right: 0;
    background: crimson;
    width: 30px;
    padding: 5px;
    transform-origin: center;
    transform: translateX(50%) translateY(-50%) scale(0);
    border-radius: 50%;
    transition: 0.4s ease;
    cursor: pointer;
    z-index: 4;
    display: none;
  }
  .delIcon:hover {
    transform: translateX(50%) translateY(-50%) scale(1.2) !important;
  }
  .unQueueIcon {
    position: absolute;
    top: 50%;
    right: 0;
    background: crimson;
    width: 30px;
    padding: 5px;
    transform-origin: center;
    transform: translateX(50%) translateY(-50%) scale(0);
    border-radius: 50%;
    transition: 0.4s ease;
    cursor: pointer;
    z-index: 4;
  }
  .dateAdded {
    display: none;
  }
}
.tableLayout {
  .TrackCard {
    .info {
      display: grid;
      grid-template-columns: 4fr 3fr;
      align-items: center;
      gap: 10px;
    }
    .grid2 {
      display: grid;
      grid-template-columns: 1fr 1fr 0.5fr;
      gap: 10px;
    }
    .dateAdded {
      display: block;
    }
    .cover {
      width: 50px;
      transform: scale(0.9);
      transition: 0.2s ease;
      justify-self: center;
      align-self: center;
    }
    p {
      font-size: 1em;
    }
  }
}
.TrackCard:hover {
  background: #ffffff1c;
  .delIcon {
    transform: translateX(50%) translateY(-50%) scale(1);
  }
}
</style>
