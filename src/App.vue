<template>
  <div @click="cleanUp" class="Grid">

    <PlaylistAdder />

    <div class="featuresSwitcherArea">
      <FeaturesSwitcher />
    </div>
    <div class="centralArea">
      <TitleArea />
      <TabSwitcher />
      <br />
      <br />
      <div class="tabsWrapper">
        <div class="tab addedTracksTab">
          <TrackCard
            :cover="track.cover"
            :album="track.album"
            :title="track.title"
            :artist="track.artist"
            :length="track.formatedLength"
            :path="track.path"
            v-for="track in addedTracks"
            :key="track.path"
          />
        </div>
        <div class="tab playlistsTab disable__options">
          <div
            v-for="playlist in playlists"
            :key="playlist.name"
            class="ExpansionPanel"
          >
            <div class="titleArea" @click="toggleExpansion($event)">
              <p>{{ playlist.name }}</p>
              <img class="expandIcon" src="@/assets/arrowDown.svg" alt="" />
            </div>
            <div class="body">
              <TrackCard
                :cover="track.cover"
                :album="track.album"
                :title="track.title"
                :artist="track.artist"
                :length="track.formatedLength"
                :path="track.path"
                :trackIndex="index"
                v-for="(track, index) in playlist.tracks"
                :key="track.path"
              />
            </div>
          </div>
        </div>
        <div class="tab recentsTab">
          <TrackCard
            :cover="track.cover"
            :album="track.album"
            :title="track.title"
            :artist="track.artist"
            :length="track.formatedLength"
            :path="track.path"
            v-for="track in recentsTracks"
            :key="track.path"
          />
        </div>
        <div class="tab albumsTab">
          <div
            v-for="group in tracksGroupedByAlbum"
            :key="group[0]"
            class="ExpansionPanel"
          >
            <div class="titleArea" @click="toggleExpansion($event)">
              <p>{{ group[0] }}</p>
              <img class="expandIcon" src="@/assets/arrowDown.svg" alt="" />
            </div>
            <div class="body">
              <TrackCard
                :cover="track.cover"
                :album="track.album"
                :title="track.title"
                :artist="track.artist"
                :length="track.formatedLength"
                :path="track.path"
                v-for="track in group[1]"
                :key="track.path"
              />
            </div>
          </div>
        </div>
        <div class="tab artistsTab">
          <div
            v-for="group in tracksGroupedByArtist"
            :key="group[0]"
            class="ExpansionPanel"
          >
            <div class="titleArea" @click="toggleExpansion($event)">
              <p>{{ group[0] }}</p>
              <img class="expandIcon" src="@/assets/arrowDown.svg" alt="" />
            </div>
            <div class="body">
              <TrackCard
                :cover="track.cover"
                :album="track.album"
                :title="track.title"
                :artist="track.artist"
                :length="track.formatedLength"
                :path="track.path"
                v-for="track in group[1]"
                :key="track.path"
              />
            </div>
          </div>
        </div>
        <div class="tab genresTab">genresTab</div>
      </div>
    </div>
    <div class="playingPaneArea">
      <PlayingPane />
    </div>
  </div>
</template>

<script>
import TabSwitcher from "@/components/TabSwitcher.vue";
import TitleArea from "@/components/TitleArea.vue";
import FeaturesSwitcher from "@/components/FeaturesSwitcher.vue";
import Tracks from "@/components/Tracks.vue";
import PlayingPane from "@/components/PlayingPane.vue";
import TrackCard from "@/components/TrackCard.vue";
import PlaylistAdder from "@/components/PlaylistAdder.vue";
import { mapMutations, mapGetters } from "vuex";
const electron = window.require("electron");

export default {
  name: "App",
  data() {
    return { playAll: true };
  },
  components: {
    TabSwitcher,
    TitleArea,
    FeaturesSwitcher,
    Tracks,
    PlayingPane,
    TrackCard,
    PlaylistAdder,
  },
  computed: {
    ...mapGetters([
      "autoplay",
      "addedTracks",
      "recentsTracks",
      "tracksGroupedByArtist",
      "tracksGroupedByAlbum",
      "playlists",
    ]),
  },
  methods: {
    ...mapMutations([
      "toggleAutoplay",
      "addTrack",
      "readRecentsFromDB",
      "readPlaylistsFromDB",
    ]),
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
    cleanUp() {
      if (document.querySelector(".showOptions")) {
        document.querySelector(".showOptions").classList.remove("showOptions");
      }
    },
  },
  mounted() {
    electron.ipcRenderer.on("audioWithCover", (event, track) => {
      this.addTrack(track);
    });
    this.readRecentsFromDB();
    this.readPlaylistsFromDB();
    String.prototype.toHHMMSS = function() {
      var sec_num = parseInt(this, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - hours * 3600) / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return hours + ":" + minutes + ":" + seconds;
    };
  },
};
</script>

<style lang="scss">
@import "./assets/animate.css";
@import url("./global.css");
* {
  scroll-behavior: smooth;
}
body {
  background: black;
  font-family: roboto;
  height: 100vh;
  overflow: hidden;
}
::-webkit-scrollbar {
  background: black;
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track-piece {
  background: black;
}
::-webkit-scrollbar-thumb {
  background: rgb(255, 255, 255);
  border-radius: 10px;
}
.Grid {
  display: grid;
  grid-template-columns: 0.6fr 4fr 1.2fr;
}
.centralArea {
  overflow: hidden;
  padding-right: 40px;
  .tabsWrapper {
    width: 600%;
    height: 50vh;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    transition: 0.2s ease-in-out;
  }
}

.featuresSwitcherArea {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  padding-left: 20px;
}
.tab {
  padding: 10px;
  height: 74.5vh;
  overflow: hidden;
  overflow-y: scroll;
}
.addedTracksTab {
  padding-top: 5px;
}
.expanded {
  .body {
    max-height: 280px !important;
    padding: 10px;
  }
  .titleArea {
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.555) !important;
    background: #0062ff !important;
    .expandIcon {
      transform: rotate(180deg);
    }
  }
}
.expanded_for_search {
  .body {
    max-height: 280px !important;
    padding: 10px;
  }
  .titleArea {
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.555) !important;
    .expandIcon {
      transform: rotate(180deg);
    }
  }
}
.playlistsTab {
  .ExpansionPanel {
    .body {
      padding-right: 20px;
    }
  }
}
.ExpansionPanel {
  background: #070707;
  color: white;
  font-family: roboto-light;
  margin-bottom: 1px;
  .body {
    max-height: 0px;
    overflow: hidden;
    overflow-y: scroll;
    transition: 0.2s linear;
  }
  .titleArea {
    background: #6b6b6b15;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0);
    position: relative;
    cursor: pointer;
    z-index: 2;
    .expandIcon {
      width: 20px;
      cursor: pointer;
      transition: 0.2s ease;
    }
  }
}
.ExpansionPanel:hover {
  .titleArea {
    background: #0062ff;
  }
}
#foo {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
}
</style>
