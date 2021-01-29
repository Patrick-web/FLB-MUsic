<template>
  <div class="tab artistsTab">
    <p class="modalClose" id="resetArtistTab" @click="resetTab()">
      <img src="@/assets/x.svg" alt="" />
    </p>
    <div v-if="!tracksGroupedByArtist[0]" class="loadingArea">
      <div class="loadingIndicator"></div>
    </div>
    <div class="picturesArea">
      <span
        v-for="artist in artistPictures"
        :key="artist.picture"
        class="picCard"
        @click="selectArtist($event)"
      >
        <img :src="artist.picture" class="picCard_img" alt="" />
        <img :src="artist.picture" class="hidden_until_artistSelect" alt="" />
        <p>{{ artist.artist }}</p>
      </span>
    </div>
    <div class="panelsArea">
      <div
        v-for="group in tracksGroupedByArtist"
        :key="group[0]"
        class="ExpansionPanel"
      >
        <div class="titleArea" @click.stop="toggleExpansion($event)">
          <p style="pointer-events:none">{{ group[0] }}</p>
          <img
            style="pointer-events:none"
            class="expandIcon"
            src="@/assets/arrowDown.svg"
            alt=""
          />
        </div>
        <div class="body">
          <transition-group>
            <TrackCard
              :track="track"
              :trackIndex="index"
              v-for="(track, index) in group[1]"
              :key="track.path"
            />
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TrackCard from "@/components/TrackCard.vue";
import * as gis from "g-i-s";

export default {
  methods: {
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
    selectArtist(e) {
      const artistName = e.currentTarget.textContent.toLowerCase();
      if (document.querySelector(".picCardSelected")) {
        document
          .querySelector(".picCardSelected")
          .classList.remove("picCardSelected");
      }
      document.querySelector(".artistsTab").classList.add("artistSelected");
      const panels = document.querySelectorAll(".artistsTab .ExpansionPanel");
      panels.forEach((panel) => {
        if (
          !panel
            .querySelector(".titleArea")
            .textContent.toLowerCase()
            .includes(artistName)
        ) {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
      e.currentTarget.classList.add("picCardSelected");
    },
    resetTab() {
      document
        .querySelector(".picCardSelected")
        .classList.remove("picCardSelected");
      document.querySelector(".artistsTab").classList.remove("artistSelected");
      const panels = document.querySelectorAll(".artistsTab .ExpansionPanel");
      panels.forEach((panel) => {
        panel.style.display = "block";
      });
    },
  },
  computed: {
    ...mapGetters(["tracksGroupedByArtist", "artistPictures"]),
  },
  components: {
    TrackCard,
  },
  mounted() {},
};
</script>

<style lang="scss">
.artistsTab {
  position: relative;
  .modalClose {
    opacity: 0;
    z-index: 10 !important;
    top: 30px;
    right: 20px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.377);
  }
}
.artistSelected {
  .modalClose {
    opacity: 1 !important;
  }
  .picturesArea {
    display: block;
  }
  .picCardSelected {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    cursor: default !important;
    p {
      position: relative;
      z-index: 3;
      width: 100%;
      font-size: 4em;
      font-family: roboto-thick;
      text-align: left;
    }
    .picCard_img {
      width: 200px !important;
      transform: translateY(40px) scale(1.2);
      position: relative;
      z-index: 2;
    }
    .hidden_until_artistSelect {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      // z-index: -1;
      width: 100%;
      filter: blur(10px);
    }
  }
  .picCardSelected:hover {
    background: rgba(0, 0, 0, 0.308) !important;
    .picCard_img {
      transform: translateY(40px) scale(1.2) !important;
    }
  }
  .picCard {
    display: none;
  }
  .ExpansionPanel {
    background: transparent !important;
    .titleArea {
      display: none;
    }
    .body {
      max-height: 800px !important;
      padding: 10px;
      padding-top: 0px;
      .TrackCard {
        background: rgba(0, 0, 0, 0.096);
        .artist {
          opacity: 0;
        }
      }
      .TrackCard:hover {
        background: rgba(107, 95, 95, 0.096);
      }
    }
  }
}
.picturesArea {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
  padding: 5px;
  .picCard {
    font-family: roboto-thin;
    background: rgba(0, 0, 0, 0.308);
    overflow: hidden;
    cursor: pointer;
    .picCard_img {
      width: 100%;
    }
    p {
      padding: 10px;
    }
    // display: inline-block;
  }
  .picCard:hover {
    background: rgba(255, 255, 255, 0.13);
    .picCard_img {
      transform: scale(1.05);
    }
  }
  .hidden_until_artistSelect {
    display: none;
  }
}
</style>
