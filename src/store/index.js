import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import * as microTasks from "../Utils/microTasks.js";
import { searchAndParse } from "../Utils/LyricsEngine.js";
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
    currentTab: "addedTracksTab",
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
    discoverAlbums: [],
    discoverTracks: [],
    discoverArtists: [],
    settings: {
      visuals: false,
      tableLayout: false,
    },
    bulkSelected: [],
    bingAlbums: [],
    bingArtists: [],
    bingTracks: [],
    bingArtistInfo: null,
    bingAlbumInfo: null,
    UIcontroller: {
      showGems: false,
      showSettings: false,
      showFileImporter: false,
      showTagEditor: false,
      showPlaylistWidget: false,
    },
    artistPictures: [],
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
    toggleIsPlaying: (state) => {
      state.isPlaying = !state.isPlaying;
      const audio = document.querySelector("audio");
      if (state.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    },
    toggleAutoplay: (state) => (state.autoplay = !state.autoplay),
    addToQueue: (state, track) => {
      state.queue.push(track);
      state.queue = removeDuplicates(state.queue, "path");
    },
    removeFromQueue(state, index) {
      console.log(index);
      state.queue.splice(index, 1);
    },
    purge: (state, trackPaths) => {
      state.addedTracks.forEach((track, index) => {
        trackPaths.forEach((trackPath) => {
          if (track.path == trackPath) {
            state.addedTracks.splice(index, 1);
          }
        });
      });
      localStorage.setItem("addedTracks", JSON.stringify(state.addedTracks));
    },
    addTrack: (state, track) => {
      state.addedTracks.unshift(track);
      state.addedTracks = removeDuplicates(state.addedTracks, "path");
    },
    removeFromAddedTracks: (state, index) => {
      state.addedTracks.splice(index, 1);
      console.log("Removing " + index);
    },
    sortArrayOfObjects: (state, [targetArray, param]) => {
      function compare(a, b) {
        if (a[`${param}`] < b[`${param}`]) {
          return -1;
        }
        if (a[`${param}`] > b[`${param}`]) {
          return 1;
        }
        return 0;
      }
      state[`${targetArray}`].sort(compare);
    },
    reverseAddedTracksArray: (state) => state.addedTracks.reverse(),
    setPlayingTrack: (state, track) => {
      state.playingTrack = track;
      state.isPlaying = true;
      //Wait for the PlayingPane component to get loaded
      setTimeout(() => {
        document.querySelector(".playingPane").classList.remove("favored");
        if (state.playlists[0]) {
          state.playlists[0].tracks.forEach((track, index) => {
            if (track.path == state.playingTrack.path) {
              state.indexInFavorites = index;
              document.querySelector(".playingPane").classList.add("favored");
            }
          });
        }
      }, 100);
      searchAndParse(track);
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
          JSON.stringify(state.recentsTracks)
        );
      }
    },
    populateByArtistGroup: async (state) => {
      const groupMap = groupBy(state.addedTracks, (track) => track.artist);
      state.groupedByArtist = Array.from(groupMap.entries()).sort();
      const artistNames = state.groupedByArtist.map(
        (artistArrayObj) => artistArrayObj[0]
      );
      state.artistPictures = JSON.parse(localStorage.getItem("artistPictures"));

      await microTasks.getArtistPhotos(artistNames).then((res) => {
        state.artistPictures = res;
      });
    },
    populateByAlbumGroup: (state) => {
      const groupMap = groupBy(state.addedTracks, (track) => track.album);
      state.groupedByAlbum = Array.from(groupMap.entries()).sort();
    },
    addPlaylist: (state, newPlaylist) => {
      state.playlists.forEach((playlist, index) => {
        if (playlist.name == newPlaylist.name) {
          state.playlists.splice(index, 1);
        }
      });
      state.playlists.unshift(newPlaylist);
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
      savePlaylistChanges(state.playlists);
    },
    removeSelectedTrackToPlaylist: (state, [playlistIndex, trackIndex]) => {
      console.log("Playlist Index" + playlistIndex);
      console.log("playlist is " + state.playlists[playlistIndex]);
      state.playlists[playlistIndex].tracks.splice(trackIndex, 1);
      savePlaylistChanges(state.playlists);
    },
    changePlaylistName(state, [plIndex, newPlName]) {
      console.log(plIndex);
      console.log(state.playlists[plIndex]);
      state.playlists[plIndex].name = newPlName;
      savePlaylistChanges(state.playlists);
    },
    deletePlaylist: (state, index) => {
      state.playlists.splice(index, 1);
      savePlaylistChanges(state.playlists);
    },
    clearRecentsAndPlaylists: (state) => {
      state.recentsTracks = [];
      state.playlists = [];
    },
    getAlbums(state, htmlData) {
      state.discoverAlbums = [];
      console.log("someyhong from albums");
      htmlData("div.resource-list--release-list-item").each((i, element) => {
        const albumName = element.children[1].children[1].firstChild.data;
        const artistName =
          element.children[3].children[1].children[1].firstChild.data;
        let albumCover;
        if (element.children[9].children[1]) {
          albumCover = element.children[9].children[1].children[1].attribs.src;
        } else {
          albumCover = element.children[7].children[1].children[1].attribs.src;
        }
        let linkToAlbumPage;
        if (element.children[11]) {
          linkToAlbumPage =
            "https://last.fm" + element.children[11].attribs.href;
        } else {
          linkToAlbumPage =
            "https://last.fm" + element.children[9].attribs.href;
        }
        const albumDetails = {
          albumName,
          albumCover,
          artistName,
          linkToAlbumPage,
        };
        state.discoverAlbums.unshift(albumDetails);
      });
    },
    getArtists(state, htmlData) {
      state.discoverArtists = [];
      htmlData("div.big-artist-list-item").each((i, element) => {
        const artistName = element.children[1].firstChild.children[0].data;
        const linkToArtistPage =
          "https://last.fm" + element.children[1].firstChild.attribs.href;
        const artistCoverImg = element.children[3].children[1].attribs.src;
        const artistDetails = {
          artistName,
          linkToArtistPage,
          artistCoverImg,
        };
        state.discoverArtists.unshift(artistDetails);
        // console.table(artistDetails);
      });
    },
    getTracks(state, htmlData) {
      state.discoverTracks = [];
      htmlData("tr.chartlist-row--with-artist").each((i, element) => {
        let ytLink;
        let artistName;
        let artistLink;
        let trackName;
        if (element.children[3].children[1]) {
          const attrs = element.children[3].children[1].attribs;
          ytLink = attrs["href"];
          artistName = attrs["data-artist-name"];
          artistLink = attrs["data-artist-url"];
          trackName = attrs["data-track-name"];
          const trackDetails = {
            ytLink,
            artistName,
            artistLink,
            trackName,
          };
          state.discoverTracks.unshift(trackDetails);
        } else {
          console.log("track is not playable");
        }
      });
    },
    toggleSetting(state, setting) {
      state.settings[`${setting}`] = !state.settings[`${setting}`];
    },
    bulkSelect: (state, track) => {
      let wasAlreadySelected = false;
      state.bulkSelected.forEach((bulkSelectedTrack, index) => {
        if (bulkSelectedTrack.path == track.path) {
          state.bulkSelected.splice(index, 1);
          wasAlreadySelected = true;
        }
      });
      if (!wasAlreadySelected) {
        state.bulkSelected.unshift(track);
      }
    },
    clearBulkSelect: (state) => {
      state.bulkSelected = [];
    },
    setBingTracks: (state, tracks) => (state.bingTracks = tracks),
    setBingArtists: (state, artists) => (state.bingArtists = artists),
    setBingAlbums: (state, albums) => (state.bingAlbums = albums),
    setBingArtistInfo: (state, info) => (state.bingArtistInfo = info),
    setBingAlbumInfo: (state, info) => (state.bingAlbumInfo = info),
    UIcontrollerToggleProperty: (state, property) => {
      state.UIcontroller[`${property}`] = !state.UIcontroller[`${property}`];
    },
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
    discoverArtists: (state) => state.discoverArtists,
    discoverAlbums: (state) => state.discoverAlbums,
    discoverTracks: (state) => state.discoverTracks,
    settings: (state) => state.settings,
    bulkSelected: (state) => state.bulkSelected,
    currentTab: (state) => state.currentTab,
    bingTracks: (state) => state.bingTracks,
    bingArtists: (state) => state.bingArtists,
    bingAlbums: (state) => state.bingAlbums,
    bingArtistInfo: (state) => state.bingArtistInfo,
    bingAlbumInfo: (state) => state.bingAlbumInfo,
    UIcontroller: (state) => state.UIcontroller,
    artistPictures: (state) => state.artistPictures,
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
      } else {
        if (document.querySelector(".playingtrack")) {
          const nextTrack = document.querySelector(".playingtrack").nextSibling;
          if (nextTrack) {
            nextTrack.click();
          } else {
            document.querySelector(".TrackCard").click();
          }
        }
      }
    },
    saveDataToLocalStorage(state) {
      const addedTracks = state.state.addedTracks;
      localStorage.setItem("addedTracks", JSON.stringify(addedTracks));
    },
  },
  modules: {},
});
function savePlaylistChanges(statePlaylists) {
  const playlistsData = [];
  statePlaylists.forEach((playlist) => {
    const playlistItem = {
      name: playlist.name,
      tracks: [],
    };
    playlist.tracks.forEach((track) => {
      playlistItem.tracks.unshift(track.path.replace("file://", ""));
    });
    playlistsData.push(playlistItem);
  });
  localStorage.setItem("playlists", JSON.stringify(playlistsData));
}
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
}
