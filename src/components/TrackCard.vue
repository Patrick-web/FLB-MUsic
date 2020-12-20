<template>
  <div
    @contextmenu="showOptions($event)"
    @click="playTrack"
    :id="trackIndex"
    class="TrackCard"
  >
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
    <img class="cover" :src="cover" alt="" />
    <div class="info">
      <p class="trackTitle">
        {{
          title
            .replace(".m4a", "")
            .replace(".mp3", "")
            .replace(".ogg", "")
            .replace(".wav", "")
        }}
      </p>
      <div class="grid2">
        <div class="artist">{{ artist }}</div>
        <div class="duration">{{ length }}</div>
      </div>
    </div>
    <div class="options">
      <div @click.stop="addPlayNextClass($event)" class="option">
        <img width="15px" src="@/assets/arrow-undo-outline.png" alt="" />
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
export default {
  computed: {
    ...mapGetters(["queuedTracks"]),
  },
  data() {
    return {
      trackInfo: "",
    };
  },
  mounted() {
    this.trackInfo = {
      title: this.title,
      artist: this.artist,
      length: this.length,
      cover: this.cover,
      album: this.album,
      path: this.path,
    };
  },
  methods: {
    ...mapMutations([
      "setPlayingTrack",
      "addToRecents",
      "addToQueue",
      "selectATrack",
      "addSelectedTrackToPlaylist",
      "removeSelectedTrackToPlaylist",
      "removeFromQueue",
    ]),
    showOptions(e) {
      e.preventDefault();
      this.selectATrack(this.trackInfo);
      if (document.querySelector(".showOptions"))
        document.querySelector(".showOptions").classList.remove("showOptions");
      e.currentTarget.classList.add("showOptions");
    },
    showPlaylistAdder() {
      document.querySelector(".PlaylistAdder").classList.add("show");
    },
    removeFromPlaylist(e) {
      const playlistName = e.target.parentElement.parentElement.parentElement.parentElement.querySelector(
        ".titleArea"
      ).textContent;
      console.log(playlistName);
      this.removeSelectedTrackToPlaylist([playlistName, this.trackIndex]);
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
        position: "top-center",
        title: "Added to Favourites",
        text: `${this.trackInfo.title} added to Favourites`,
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
        position: "top-center",
        title: "Playing Next",
        text: `${this.trackInfo.title}`,
      });
      this.hideOptions(track);
    },
    playTrack(e) {
      document.querySelector("#search").value = "";
      document.querySelector(".playingPane").classList.remove("editMode");

      if (document.querySelector(".playingtrack"))
        document
          .querySelector(".playingtrack")
          .classList.remove("playingtrack");
      const track = e.currentTarget;
      track.classList.add("playingtrack");
      this.setPlayingTrack(this.trackInfo);
      this.addToRecents(this.trackInfo);
    },
    queueTrack(e) {
      document.querySelector(".queueTabIcon").click();
      const track = e.currentTarget.parentElement.parentElement;
      this.addToQueue(this.trackInfo);
      const n2 = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: "Added to Queue",
        text: `${this.title}`,
      });
      track.classList.add("queued");
      this.hideOptions(track);
    },
    hideOptions(currentElement) {
      currentElement.classList.remove("showOptions");
    },
  },
  props: {
    title: String,
    artist: String,
    length: String,
    cover: String,
    album: String,
    path: String,
    trackIndex: Number,
  },
};
</script>

<style lang="scss">
.disable__options {
  .options {
    display: none;
  }
  .delIcon {
    display: block !important;
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
.playingtrack {
  background: #0062ff !important;
  position: relative;
  z-index: 4;
  margin-top: -2px;
  border: none;
  box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.644);
  .info {
    padding-left: 20px !important;
  }
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
  overflow: hidden;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.589) !important;
  transition: 0.1s transform ease;
  .option {
    background: #171717;
    padding: 8px;
    padding-left: 10px;
    border-bottom: 1px solid #2e2e2e;
    font-family: roboto-light;
    cursor: pointer;
    transition: 0.2s ease;
    img {
      // width: 20px;
      margin-right: 10px;
    }
  }
  .option:hover {
    background: #2b2b2b;
    border-bottom: 1px solid #2b2b2b;
  }
}
.TrackCard {
  position: relative;
  background: #0f0f0f;
  border-bottom: 1px solid rgba(128, 128, 128, 0.356);
  display: flex;
  color: white;
  // height: 80px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  cursor: pointer;
  transition: 0.2s ease;
  font-family: roboto-light;
  .cover {
    width: 100px;
    transition: 0.2s ease;
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
}
.TrackCard:hover {
  background: #ffffff1c;
  .info {
    padding-left: 20px;
  }
  .cover {
    transform: scale(1.05) translate(10px, -10px);
    box-shadow: -4px 4px 15px rgba(0, 0, 0, 0.712);
  }
  .delIcon {
    transform: translateX(50%) translateY(-50%) scale(1);
  }
}
</style>