<template>
  <div class="vMenu">
    <div class="activeFeatureIndicator"></div>
    <div
      @click="switchFeature($event, 'player')"
      id="playerFeaturebtn"
      class="tabActive vmenu-group"
    >
      <img src="@/assets/play-circle.svg" alt />
      <p style="padding-left:25px" class="v-tooltip">Player</p>
    </div>
    <div @click="switchFeature($event, 'gems')" class="vmenu-group">
      <img class="whiten" src="@/assets/gem.svg" alt />
      <p style="padding-left:30px" class="v-tooltip">Gems</p>
    </div>
    <div @click="toggleAddOptions()" class="vmenu-group">
      <img src="@/assets/plus.svg" alt />
      <p class="v-tooltip">Add Music</p>
    </div>
    <div class="addOptions animated faster">
      <div class="opts">
        <div @click="emitOption('file')" class="opt">
          <img src="@/assets/music_note.svg" alt="" />
          <p>Select file(s)</p>
        </div>
        <div @click="emitOption('folder')" class="opt">
          <img src="@/assets/folder.svg" alt="" />
          <p>Select Folder</p>
        </div>
      </div>
      <button @click="toggleAddOptions">Cancel</button>
    </div>
  </div>
</template>

<script>
const electron = window.require("electron");
import { mapMutations } from "vuex";
export default {
  methods: {
    ...mapMutations(["loadPreviouslyAddedTracks"]),
    switchFeature(e, tab) {
      document.body.classList.remove("showPodcastData");
      const indicator = document.querySelector(".activeFeatureIndicator");
      const element = e.currentTarget;
      //   const pagesWrapper = document.querySelector(".pagesWrapper");
      document.querySelector(".tabActive").classList.remove("tabActive");
      element.classList.add("tabActive");
      document.querySelector(".MainGrid").classList.add("currentFeatureIsGems");
      switch (tab) {
        case "player":
          indicator.style.top = "12.5%";
          document
            .querySelector(".MainGrid")
            .classList.remove("currentFeatureIsGems");
          break;
        case "gems":
          indicator.style.top = "48%";
          break;
      }
    },
    emitOption(choice) {
      if (choice === "file") {
        electron.ipcRenderer.send("addMusicFromFile");
      } else {
        electron.ipcRenderer.send("addMusicFromFolder");
      }
      this.toggleAddOptions();
    },
    toggleAddOptions() {
      const optionsBox = document.querySelector(".addOptions");
      optionsBox.classList.toggle("showAddOptions");
      optionsBox.classList.toggle("slideInDown");
      document.querySelector("#addedTracks").click();
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
.whiten {
  filter: brightness(0) invert(1);
}
.vMenu {
  align-self: center;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 8;
  width: 50px;
  background: #141414;
  height: 200px;
  padding: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  .vmenu-group {
    position: relative;
    .v-tooltip {
      background: white;
      position: absolute;
      top: 0%;
      right: -50%;
      transform: scale(0) translate(100%, 0%);
      opacity: 0;
      padding: 5px 10px 5px 10px;
      transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-weight: 600;
      color: black;
      width: 100px;
      border-radius: 20px;
    }
  }
  .vmenu-group:hover {
    cursor: pointer;
    .v-tooltip {
      opacity: 1;
      transform: scale(1) translate(100%, 0%);
    }
  }
  img {
    width: 30px;
  }
  .activeFeatureIndicator {
    position: absolute;
    top: 12.5%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: 0.2s ease-in-out;
    background: #006eff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
  .tabActive {
    .v-tooltip {
      display: none;
    }
    filter: hue-rotate(280deg);
  }
}
.showAddOptions {
  display: block !important;
}
.addOptions {
  position: fixed;
  z-index: 10;
  top: 43%;
  left: 35%;
  transform: translate(-50%, -50%);
  background: rgb(31, 31, 31);
  padding: 10px;
  border-radius: 20px;
  box-shadow: 0px 0px 50px black;
  display: none;
  .opts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    color: white;
    .opt {
      border-radius: 20px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .opt:hover {
      background: #0062ff;
    }
  }
  button {
    width: 100%;
    color: white;
    font-size: 1.2em;
  }
}
@media (max-width: 900px) {
  .vMenu {
    display: none;
  }
}
</style>
