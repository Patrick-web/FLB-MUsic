<template>
  <div class="Modal" id="PlaylistAdder">
    <h2>Select Playlist</h2>
    <p class="modalClose" @click="hideAdder">X</p>
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
      document.querySelector(".Modal").classList.remove("ModalShow");
    },
  },
};
</script>

<style lang="scss">
.newPlaylistForm {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
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
</style>
