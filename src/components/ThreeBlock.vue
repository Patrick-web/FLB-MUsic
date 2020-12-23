<template>
  <div class="ThreeBlock animated faster">
    <div class="sectionSwitcher">
      <div
        @click="scrollTo($event, 'ArtistsWrapper')"
        class="switchBt activated"
      >
        <img src="@/assets/people_outline.svg" alt="" />
      </div>
      <div @click="scrollTo($event, 'TracksWrapper')" class="switchBt">
        <img src="@/assets/music_note.svg" alt="" />
      </div>
      <div @click="scrollTo($event, 'AlbumsWrapper')" class="switchBt">
        <img src="@/assets/album.svg" alt="" />
      </div>
    </div>

    <div @click="hideThreeBlock" class="arrowBack">
      <img src="@/assets/arrow_back.svg" alt="" />
    </div>

    <div class="ArtistsWrapper">
      <h1 class="wrapperTitle" id="artistsWrapperTitle">Artists</h1>
      <div class="wrapperBody grid4">
        <ArtistCard
          v-for="artist in discoverArtists"
          :key="artist.artistName"
          :artistData="artist"
        />
      </div>
    </div>
    <div class="TracksWrapper">
      <h1 class="wrapperTitle" id="tracksWrapperTitle">Tracks</h1>
      <div class="wrapperBody">
        <TrackCard2
          v-for="track in discoverTracks"
          :key="track.ytLink"
          :trackData="track"
        />
      </div>
    </div>
    <div class="AlbumsWrapper">
      <h1 class="wrapperTitle" id="albumsWrapperTitle">Albums</h1>
      <div class="wrapperBody grid4">
        <AlbumCard
          v-for="album in discoverAlbums"
          :key="album.albumName"
          :albumData="album"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AlbumCard from "./AlbumCard.vue";
import TrackCard2 from "./TrackCard2.vue";
import ArtistCard from "./ArtistCard.vue";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["discoverAlbums", "discoverTracks", "discoverArtists"]),
  },
  methods: {
    scrollTo(e, section) {
      document.querySelector(`.${section}`).scrollIntoView();
      document.querySelector(".activated").classList.remove("activated");
      e.currentTarget.classList.add("activated");
    },
    hideThreeBlock() {
      document
        .querySelector(".ThreeBlock")
        .classList.replace("slideInUp", "slideOutDown");
      setTimeout(() => {
        document.querySelector(".Discover").classList.remove("showThreeBlock");
      }, 300);
    },
  },
  components: {
    AlbumCard,
    TrackCard2,
    ArtistCard,
  },
};
</script>

<style lang="scss">
.ThreeBlock {
  background: black;
  display: none;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  .arrowBack {
    position: absolute;
    z-index: 5;
    background: rgba(0, 0, 0, 0.192);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    border: 5px solid rgba(255, 255, 255, 0.11);
    box-shadow: 0px 0px 20px black;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 300px;
    left: 0px;
    padding: 10px;
    cursor: pointer;
  }
  .arrowBack:hover {
    background: #0062ff;
    border: 5px solid #0062ff;
  }
  .sectionSwitcher {
    background: rgba(0, 0, 0, 0.192);
    backdrop-filter: blur(10px);
    width: 40px;
    border-radius: 20px;
    position: absolute;
    top: 250px;
    right: 30px;
    z-index: 5;
    overflow: hidden;
    border: 5px solid rgba(255, 255, 255, 0.11);
    box-shadow: 0px 0px 20px black;
    div {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
      border-radius: 20px;
      margin-bottom: 5px;
    }
    .activated {
      background: #0062ff;
    }
    div:hover {
      background: #0062ff;
    }
  }
}
.wrapperTitle {
  margin-bottom: 10px;
}
.grid4 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
}
</style>
