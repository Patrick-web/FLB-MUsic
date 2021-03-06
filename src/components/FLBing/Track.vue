<template>
  <div class="TrackCard track">
    <img
      class="coverArt"
      :src="trackInfo.album_cover || trackInfo.album.cover"
      alt=""
    />
    <div class="info">
      <h4 class="trackTitle">
        {{ trackInfo.title }}
      </h4>
      <div class="grid2">
        <p @click="getArtistData" class="artist">{{ trackInfo.artist_name }}</p>
        <div class="duration" v-if="trackInfo.duration">
          {{ JSON.stringify(trackInfo.duration).toHHMMSS() }}
        </div>
      </div>
    </div>
    <div @click="playPreview" class="trackBt">
      <img src="@/assets/playButton.svg" style="width:20px" alt="" />
    </div>
    <div @click="downloadTrack" class="trackBt">
      <img src="@/assets/save_alt.svg" style="width:20px" alt="" />
    </div>
  </div>
</template>

<script>
const electron = window.require("electron");
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      artistData: {
        name: null,
        cover: null,
        tracks: [],
        albums: [],
      },
    };
  },
  computed: {
    ...mapGetters(["bingAlbumInfo"]),
  },
  methods: {
    ...mapMutations(["setPlayingTrack", "setBingArtistInfo"]),
    playPreview() {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      fetch(`https://api.deezer.com/track/${this.trackInfo.id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const res = JSON.parse(result);
          this.setPlayingTrack({
            title: this.trackInfo.title,
            artist: this.trackInfo.artist_name,
            album: res.album.title,
            cover: this.trackInfo.album_cover || this.trackInfo.album.cover,
            path: res.preview,
          });
          const noti = this.$vs.notify({
            position: "top-center",
            title: `Loading the preview`,
          });
        })
        .catch((error) => {
          document.body.classList.remove("loading");
          console.log("error", error);
        });
    },
    getArtistData() {
      document.body.classList.add("loading");
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `https://api.deezer.com/artist/${this.trackInfo.artist_id}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          this.artistData.name = JSON.parse(result).name;
          this.artistData.cover = JSON.parse(result).picture_big;
          fetch(
            `https://api.deezer.com/artist/${this.trackInfo.artist_id}/top?limit=50`,
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => {
              this.artistData.tracks = JSON.parse(result).data;
            })
            .catch((error) => console.log("error", error));
          fetch(
            `https://api.deezer.com/artist/${this.trackInfo.artist_id}/albums`,
            requestOptions
          )
            .then((response) => response.text())
            .then((result) => {
              this.artistData.albums = JSON.parse(result).data;
              this.setBingArtistInfo(this.artistData);
              document.body.classList.remove("loading");
            })
            .catch((error) => console.log("error", error));
        })
        .catch((error) => {
          document.body.classList.remove("loading");
          console.log("error", error);
        });
    },
    downloadTrack() {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        "https://apiflbdeezer.herokuapp.com/download/?id=533609232",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          const link = JSON.parse(result).link;
          var requestOptions = {
            method: "GET",
            redirect: "follow",
          };

          fetch(link, requestOptions)
            .then((response) => response.text())
            .then((result) =>
              electron.ipcRenderer.send("downloadTrack", result)
            )
            .catch((error) => console.log("error", error));
        })
        .catch((error) => console.log("error", error));
    },
  },
  props: {
    trackInfo: Object,
  },
};
</script>

<style lang="scss">
.track {
  .coverArt {
    width: 50px;
  }
  .trackBt {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0);
    padding: 5px;
    border-radius: 15px;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 10px;
  }
  .artist {
    font-size: 1em;
    cursor: pointer;
  }
  .artist:hover {
    text-decoration: underline;
  }
  .duration {
    transform: translateY(-50%);
    margin-right: 10px;
  }
}
.track:hover {
  cursor: default !important;
  .trackBt:hover {
    cursor: pointer;
    border: 1px solid rgb(255, 255, 255);
  }
}
</style>
