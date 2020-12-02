import Vue from "vue";
import Vuex from "vuex";
import localforage from "localforage";
import { stat } from "fs";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    addedTracks: [],
    recentsTracks: [],
    queue: [],
    playlists: [
      {
        name: "Favorites",
        tracks: [],
      },
    ],
    groupedByArtist: [],
    groupedByAlbum: [],
    groupedByGenre: [],
    currentTab: "addedTracks",
    selectedTrack: null,
    playingTrack: {
      title: "",
      artist: "",
      path: "",
      cover: "",
      album: "",
      length: "",
    },
    indexInFavorites: null,
    autoplay: true,
    isPlaying: false,
  },
  mutations: {
    switchTab: (state, tab) => (state.currentTab = tab),
    selectATrack: (state, track) => {
      if (track) {
        state.selectedTrack = track;
      } else {
        state.selectedTrack = state.playingTrack;
      }
    },
    toggleIsPlaying: (state) => (state.isPlaying = !state.isPlaying),
    toggleAutoplay: (state) => (state.autoplay = !state.autoplay),
    addToQueue: (state, element) => {
      state.queue.push(element);
    },
    addTrack: (state, track) => state.addedTracks.unshift(track),
    setPlayingTrack: (state, track) => {
      state.playingTrack = track;
      state.isPlaying = true;
      document.querySelector(".playingPane").classList.remove("favored");
      state.playlists[0].tracks.forEach((track, index) => {
        if (track.path == state.playingTrack.path) {
          state.indexInFavorites = index;
          document.querySelector(".playingPane").classList.add("favored");
        }
      });
    },
    addToRecents: (state, track) => {
      let recents = JSON.parse(localStorage.getItem("recentlyPlayed"));
      if (!recents) {
        recents = [];
      }
      recents.unshift(track);
      recents = removeDuplicates(recents, "path");
      if (recents.length > 15) {
        const spliced = recents.pop();
      }
      state.recentsTracks = recents;
      localStorage.setItem("recentlyPlayed", JSON.stringify(recents));
    },
    populateByArtistGroup: (state) => {
      const groupMap = groupBy(state.addedTracks, (track) => track.artist);
      state.groupedByArtist = Array.from(groupMap.entries());
    },
    populateByAlbumGroup: (state) => {
      const groupMap = groupBy(state.addedTracks, (track) => track.album);
      state.groupedByAlbum = Array.from(groupMap.entries());
    },
    createPlaylist: (state, playlistName) => {
      const newPlaylist = {
        name: playlistName,
        tracks: [],
      };
      state.playlists.push(newPlaylist);

      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    addSelectedTrackToPlaylist: (state, playlistName) => {
      state.playlists.forEach((playlist, index) => {
        if (playlist.name === playlistName) {
          state.playlists[index].tracks.unshift(state.selectedTrack);
          state.playlists[index].tracks = removeDuplicates(
            state.playlists[index].tracks,
            "path"
          );
        }
      });
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    removeSelectedTrackToPlaylist: (state, [playlistName, trackIndex]) => {
      state.playlists.forEach((playlist, playlistIndex) => {
        if (playlist.name === playlistName) {
          state.playlists[playlistIndex].tracks.splice(trackIndex, 1);
          if (
            playlistName === "Favorites" &&
            trackIndex === state.indexInFavorites
          ) {
            console.log("Unfavoring");
            document.querySelector(".playingPane").classList.remove("favored");
          }
        }
      });

      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    readRecentsFromDB: (state) => {
      const recentsTracks = JSON.parse(localStorage.getItem("recentlyPlayed"));
      if (recentsTracks) {
        state.recentsTracks = recentsTracks;
      }
    },
    readPlaylistsFromDB: (state) => {
      const playlists = JSON.parse(localStorage.getItem("playlists"));
      if (playlists) {
        state.playlists = playlists;
      }
    },
    updateTrack: (state, path) => {},
  },
  getters: {
    queuedTracks: (state) => state.queue,
    isPlaying: (state) => state.isPlaying,
    autoplay: (state) => state.autoplay,
    playingTrack: (state) => state.playingTrack,
    indexInFavorites: (state) => state.indexInFavorites,
    addedTracks: (state) => state.addedTracks,
    recentsTracks: (state) => state.recentsTracks,
    playlists: (state) => state.playlists,
    tracksGroupedByArtist: (state) => state.groupedByArtist,
    tracksGroupedByAlbum: (state) => state.groupedByAlbum,
  },
  actions: {
    determineNextTrack(state) {
      const nextToPlay = document.querySelector(".playingNext");
      if (!nextToPlay && state.currentTab != "recentTracks") {
        const nextTrack = document.querySelector(".playingtrack").nextSibling;
        if (nextTrack) {
          nextTrack.click();
          document.querySelector(".addedTracksTab").scrollBy(0, 91);
        } else {
          document.querySelector(".TrackCard").click();
        }
      } else {
        nextToPlay.click();
        nextToPlay.classList.remove("playingNext");
        nextToPlay.scrollIntoView();
      }
    },
  },
  modules: {},
});

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}
function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
