<template>
  <div class="addOptions animated faster">
    <p
      class="modalClose"
      @click="UIcontrollerToggleProperty('showFileImporter')"
    >
      <img src="@/assets/x.svg" alt="" />
    </p>
    <h2 style="text-align:center;margin-bottom:5px">Import</h2>
    <div class="opts">
      <div @click="emitOption('file')" class="opt">
        <img src="@/assets/music_note.svg" alt="" />
        <p>File (s)</p>
      </div>
      <div @click="emitOption('folder')" class="opt">
        <img src="@/assets/folder.svg" alt="" />
        <p>Folder</p>
      </div>
    </div>
    <!-- <button @click="includeVideo = !includeVideo" class="switch">
      <p>Include Music Videos</p>
      <h4 v-if="includeVideo" class="iconBt">On</h4>
      <h4 v-if="!includeVideo" class="iconBt">Off</h4>
    </button> -->
  </div>
</template>

<script>
import { mapMutations } from "vuex";
const electron = window.require("electron");

export default {
  data() {
    return {
      includeVideo: false,
    };
  },
  methods: {
    ...mapMutations(["UIcontrollerToggleProperty"]),
    emitOption(choice) {
      if (choice === "file") {
        electron.ipcRenderer.send("addMusicFromFile", this.includeVideo);
      } else {
        electron.ipcRenderer.send("addMusicFromFolder", this.includeVideo);
      }
      this.UIcontrollerToggleProperty("showFileImporter");
    },
  },
};
</script>

<style lang="scss">
.addOptions {
  position: fixed;
  z-index: 10;
  top: 30%;
  left: 35%;
  width: 250px;
  background-color: rgba(0, 0, 0, 0.555);
  backdrop-filter: blur(10px);
  padding: 10px;
  box-shadow: 0px 0px 50px black;
  border: 1px solid rgba(255, 255, 255, 0.315);
  .switch {
    background-color: rgba(255, 255, 255, 0.11);
    padding: 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    button {
      transform: scale(0.7);
    }
    p {
      font-size: 0.8em;
      font-family: roboto-thin;
      margin-left: 10px;
    }
    h4 {
      font-size: 0.8em;
      font-family: roboto-thin;
      background-color: rgba(0, 0, 0, 0.11);
      padding: 10px;
    }
  }
  .opts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    color: white;
    .opt {
      background: rgba(255, 255, 255, 0.041);
      border-radius: 20px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: roboto-thin;
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
</style>
