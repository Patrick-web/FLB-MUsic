<template>
  <div class="PlaylistAdder">
    <h2>Select Playlist</h2>
    <div class="newPlaylistForm">
      <p @click="hideAdder">X</p>
      <input
        placeholder="Create new playlist"
        type="text"
        v-model="newPlaylistName"
      />
      <button @click="createNewPlaylist()" v-if="newPlaylistName">
        Create
      </button>
    </div>
    <br />
    <p
      @click="addToPlaylist(playlist.name)"
      v-for="playlist in playlists"
      :key="playlist.name"
      class="playlistName"
    >
      {{ playlist.name }}
    </p>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      newPlaylistName: "",
    };
  },
  computed: {
    ...mapGetters(["playlists"]),
  },
  methods: {
    ...mapMutations(["createPlaylist", "addSelectedTrackToPlaylist"]),
    createNewPlaylist() {
      this.createPlaylist(this.newPlaylistName);
      this.newPlaylistName = "";
    },
    addToPlaylist(playlistName) {
      this.addSelectedTrackToPlaylist(playlistName);
      const noti = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: `Added to ${playlistName} playlist`,
      });
      this.hideAdder();
    },
    hideAdder() {
      document.querySelector(".PlaylistAdder").classList.remove("show");
    },
  },
};
</script>

<style lang="scss">
.show {
  transform: scale(1) !important;
}
.PlaylistAdder {
  position: fixed;
  top: 40%;
  left: 30%;
  z-index: 10;
  background: #171717;
  transform: translate(0%, -50%);
  padding: 10px;
  border-radius: 15px;
  border-top-left-radius: 20px;
  color: white;
  font-family: roboto-light;
  text-align: center;
  box-shadow: 0px 0px 50px black;
  max-height: 400px;
  overflow: hidden;
  overflow-y: scroll;
  transform: scale(0);
  transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  .newPlaylistForm {
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    p {
      position: absolute;
      left: 0;
      transform: translate(-10px, -110%) scale(0.8);
      background: crimson;
      border-radius: 50%;
      padding: 10px;
      padding-right: 14px;
      padding-left: 14px;
      box-shadow: 0px 0px 10px black;
      font-family: roboto-thick;
      cursor: pointer;
      transition: 0.2s ease;
    }
    p:hover {
      padding: 14px;
      padding-right: 18px;
      padding-left: 18px;
      transform: translate(-25px, -110%) scale(0.8);
    }
    input,
    button {
      border: none;
      font-size: 1.2em;
      color: white;
      transition: 0.2s ease;
    }
    input {
      background: #111111;
      padding: 5px;
      border-bottom: 0.5px solid rgb(255, 255, 255);
    }
    input:focus {
      border-bottom: 1px solid #1e74ff;
    }
    button {
      cursor: pointer;
      border-radius: 20px;
      background: #ffffff17;
      padding: 7px;
      font-family: roboto;
      margin-top: 10px;
      width: 100%;
    }
    button:hover {
      border-radius: 10px;
      background: #0062ff;
    }
  }
  .playlistName {
    background: #111111;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.226);
    padding: 5px;
    font-size: 1.2em;
    transition: 0.2s ease;
    cursor: pointer;
    text-align: left;
  }
  .playlistName:hover {
    background: #0062ff;
    border-bottom: 1px solid rgba(128, 128, 128, 0);
  }
}
</style>
