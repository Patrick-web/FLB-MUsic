<template>
  <div id="PlaylistAdder">
    <p
      class="modalClose"
      @click="UIcontrollerToggleProperty('showPlaylistWidget')"
    >
      <img src="@/assets/x.svg" alt="" />
    </p>
    <h2 style="text-align:center">Select Playlist</h2>
    <div class="newPlaylistForm">
      <input
        class="inputElem"
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
    ...mapMutations([
      "createPlaylist",
      "addSelectedTrackToPlaylist",
      "UIcontrollerToggleProperty",
    ]),
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
      document.querySelector(".Modal").classList.remove("ModalShow");
    },
  },
};
</script>

<style lang="scss">
#PlaylistAdder {
  position: fixed;
  right: 80px;
  bottom: 120px;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.39);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.315);
  box-shadow: 0px 0px 50px black;
  padding: 10px;
}
.newPlaylistForm {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.playlistName {
  background: #11111150;
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
</style>
