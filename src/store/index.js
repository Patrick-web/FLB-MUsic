import Vue from "vue";
import Vuex from "vuex";
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
    switchTab: (state, tab) => {
      state.currentTab = tab;
    },
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
      if (state.playlists[0]) {
        state.playlists[0].tracks.forEach((track, index) => {
          if (track.path == state.playingTrack.path) {
            state.indexInFavorites = index;
            document.querySelector(".playingPane").classList.add("favored");
          }
        });
      }
    },
    addToRecents: (state, track) => {
      state.recentsTracks.unshift(track);
      state.recentsTracks = removeDuplicates(state.recentsTracks, "path");
      if (state.recentsTracks.length > 15) {
        state.recentsTracks.pop();
      }
      localStorage.setItem(
        "recentlyPlayed",
        JSON.stringify(
          state.recentsTracks.map((recentTrack) =>
            recentTrack.path.replace("file://", "")
          )
        )
      );
    },
    loadRecents: (state, track) => {
      state.recentsTracks.push(track);
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

      const playlistsData = [];
      state.playlists.forEach((playlist) => {
        const playlistItem = {
          name: playlist.name,
          tracks: [],
        };
        playlist.tracks.forEach((track) => {
          console.log(track);
          playlistItem.tracks.unshift(track.path.replace("file://", ""));
        });
        playlistsData.push(playlistItem);
      });
      localStorage.setItem("playlists", JSON.stringify(playlistsData));
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
      const playlistsData = [];
      state.playlists.forEach((playlist) => {
        const playlistItem = {
          name: playlist.name,
          tracks: [],
        };
        playlist.tracks.forEach((track) => {
          console.log(track);
          playlistItem.tracks.unshift(track.path.replace("file://", ""));
        });
        playlistsData.push(playlistItem);
      });
      localStorage.setItem("playlists", JSON.stringify(playlistsData));
    },
    addPlaylist: (state, newPlaylist) => {
      state.playlists.forEach((playlist, index) => {
        if (playlist.name == newPlaylist.name) {
          state.playlists.splice(index, 1);
        }
      });
      state.playlists.unshift(newPlaylist);
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
