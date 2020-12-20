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
    repeat: false,
    shuffle: false,
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
    addToQueue: (state, track) => {
      state.queue.push(track);
    },
    removeFromQueue(state, index) {
      console.log(index);
      state.queue.splice(index, 1);
    },
    addTrack: (state, track) => state.addedTracks.unshift(track),
    sortTracks: (state, param) => {
      function compare(a, b) {
        if (a[`${param}`] < b[`${param}`]) {
          return -1;
        }
        if (a[`${param}`] > b[`${param}`]) {
          return 1;
        }
        return 0;
      }
      state.addedTracks.sort(compare);
    },
    reverseAddedTracksArray: (state) => state.addedTracks.reverse(),
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
    setRepeat: (state) => (state.repeat = !state.repeat),
    toggleShuffler: (state) => {
      console.log(state.shuffle);
      state.shuffle = !state.shuffle;
    },
    addToRecents: (state, track) => {
      if (state.currentTab !== "recentsTracks") {
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
      }
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
      if (state.state.repeat) return;
      if (state.state.shuffle) {
        selectRandomTrack();
        return;
      }
      const nextToPlay = document.querySelector(".playingNext");
      if (nextToPlay && state.currentTab != "recentTracks") {
        nextToPlay.click();
        nextToPlay.classList.remove("playingNext");
        nextToPlay.scrollIntoView();
      } else {
        const nextTrack = document.querySelector(".playingtrack").nextSibling;
        if (nextTrack) {
          nextTrack.click();
        } else {
          document.querySelector(".TrackCard").click();
        }
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

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
function getRandom(max) {
  return Math.floor(Math.random() * max);
}
function selectRandomTrack() {
  const parent = document.querySelector(".playingtrack").parentElement
    .parentElement;
  console.log(parent);
  const candidateTracks = document
    .querySelector(".playingtrack")
    .parentElement.parentElement.querySelectorAll(".TrackCard");
  const selectedTrack = candidateTracks[getRandom(candidateTracks.length)];
  selectedTrack.click();
  selectedTrack.scrollIntoView();
}
