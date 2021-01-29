<template>
  <div class="tab playlistsTab disable__options">
    <div
      v-for="(playlist, plIndex) in playlists"
      :key="playlist.name"
      class="ExpansionPanel"
    >
      <div
        class="titleArea"
        @contextmenu="showPlaylistOptions($event)"
        @click="toggleExpansion($event)"
      >
        <p style="pointer-events:none">{{ playlist.name }}</p>
        <img
          style="pointer-events:none"
          class="expandIcon"
          src="@/assets/arrowDown.svg"
          alt=""
        />
        <div
          style="max-width:150px"
          v-if="playlist.name !== 'Favorites'"
          class="options"
        >
          <div @click.stop="delPlaylist(plIndex)" class="option">
            <img width="15px" src="@/assets/trash-bin-outline.svg" alt="" />
            <span>Delete Playlist</span>
          </div>
          <div @click.stop="togglePlaylistEditor" class="option">
            <img width="15px" src="@/assets/pen.svg" alt="" />
            <span>Edit Playlist</span>
          </div>
        </div>
      </div>
      <div class="body">
        <div class="plEditor">
          <p>New Playlist Name</p>
          <input
            v-model="newPlName"
            class="inputElem"
            id="newPlName"
            type="text"
          />
          <button v-if="newPlName" @click="editPlaylist(plIndex)">Save</button>
          <button @click="togglePlaylistEditor">Cancel</button>
        </div>
        <transition-group>
          <TrackCard
            :track="track"
            :trackIndex="index"
            :playlistIndex="plIndex"
            v-for="(track, index) in playlist.tracks"
            :key="track.path"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
const electron = window.require("electron");
import TrackCard from "@/components/TrackCard.vue";

export default {
  data() {
    return {
      newPlName: "",
    };
  },
  methods: {
    ...mapMutations(["addPlaylist", "deletePlaylist", "changePlaylistName"]),
    loadPlaylistsFromDB() {
      const playlists = JSON.parse(localStorage.getItem("playlists"));
      if (playlists) {
        playlists.forEach((playlist) => this.addplaylist(playlist));
      }
    },
    showPlaylistOptions(e) {
      const panel = e.target.parentElement;
      panel.classList.add("expanded");
      e.preventDefault();
      // this.selectATrack(this.trackInfo);
      if (document.querySelector(".showOptions"))
        document.querySelector(".showOptions").classList.remove("showOptions");
      e.currentTarget.classList.add("showOptions");
    },
    togglePlaylistEditor(e) {
      e.target.parentElement.parentElement.parentElement.classList.remove(
        "showOptions"
      );
      if (document.querySelector(".showPlaylistOptions")) {
        document
          .querySelector(".showPlaylistOptions")
          .classList.remove("showPlaylistOptions");
      } else {
        e.target.parentElement.parentElement.parentElement.parentElement.classList.add(
          "showPlaylistOptions"
        );
      }
    },
    editPlaylist(plIndex) {
      this.changePlaylistName([plIndex, this.newPlName]);
      const noti = this.$vs.notify({
        color: "success",
        position: "top-center",
        title: `Playlist name changed to ${this.newPlName}`,
      });
    },
    delPlaylist(index) {
      this.deletePlaylist(index);
      const noti = this.$vs.notify({
        color: "warning",
        position: "top-center",
        title: "Playlist Deleted",
      });
    },
    toggleExpansion(e) {
      const panel = e.target.parentElement;
      if (!panel.classList.contains("expanded")) {
        if (document.querySelector(".expanded")) {
          document.querySelector(".expanded").classList.remove("expanded");
        }
        panel.classList.add("expanded");
      } else {
        panel.classList.remove("expanded");
      }
    },
  },
  computed: {
    ...mapGetters(["playlists"]),
  },
  components: {
    TrackCard,
  },
  mounted() {
    setTimeout(() => {
      this.loadPlaylistsFromDB();
    }, 2000);
    electron.ipcRenderer.on("addPlaylist", (event, playlists) => {
      this.addPlaylist(playlists);
    });
    electron.ipcRenderer.on("removePlayingTrack", (event, track) => {
      this.clearRecentsAndPlaylists();
      setTimeout(() => {
        this.loadPlaylistsFromDB(track);
      }, 100);
    });
  },
};
</script>

<style></style>
