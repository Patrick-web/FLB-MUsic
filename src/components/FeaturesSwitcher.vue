<template>
  <div class="vMenu">
    <div @click="toggleAddOptions()" class="vmenu-group">
      <img src="@/assets/plus.svg" alt />
      <p style="width:100px" class="v-tooltip">Add Music</p>
    </div>
    <div class="vmenu-group">
      <img class="whiten" src="@/assets/gem.svg" alt />
      <p style="width:60px" class="v-tooltip">Gems</p>
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
    <div class="vmenu-group">
      <img
        @click="showSettings"
        src="@/assets/settings.svg"
        alt=""
        class="tool vmenu-group"
        id="settingsBt"
        data-tip="Settings"
      />
      <p style="width:80px" class="v-tooltip">Settings</p>
    </div>
    <div class="vmenu-group">
      <img @click="showUpdates" src="@/assets/update.svg" alt="" />
      <p style="width:80px" class="v-tooltip">Updates</p>
    </div>
  </div>
</template>

<script>
const electron = window.require("electron");
import { mapMutations } from "vuex";
export default {
  methods: {
    ...mapMutations(["loadPreviouslyAddedTracks"]),
    showSettings() {
      document.querySelector(".Settings").classList.toggle("ModalShow");
      document.querySelector(".MainGrid").classList.remove("showUpdates");
    },
    showUpdates() {
      document.querySelector(".MainGrid").classList.toggle("showUpdates");
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
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 8;
  width: 50px;
  background: #0f0f0f3f;
  height: 250px;
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
      border-radius: 20px;
      text-align: center;
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
  background-color: rgba(0, 0, 0, 0.39);
  backdrop-filter: blur(10px);
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
@media (max-width: 700px) {
  .vMenu {
    display: none;
  }
}
</style>
