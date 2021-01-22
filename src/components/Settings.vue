<template>
  <div class="Settings Modal">
    <h1 id="SettingsTitle">Settings</h1>
    <p class="modalClose" @click="hideSettings">X</p>
    <div class="settings">
      <div @click="toggleTableLayout" id="tableLayoutToggle" class="setting">
        <p>Table Layout</p>
        <vs-switch disabled="true" v-model="tableLayout">
          <template #off>
            Off
          </template>
          <template #on>
            On
          </template>
        </vs-switch>
      </div>
      <div
        @click="toggleFakeLightMode"
        id="fakeLightModeToggle"
        class="setting"
      >
        <p>Fake Light Mode (Experimental)</p>
        <vs-switch disabled="true" v-model="fakeLightMode">
          <template #off>
            Off
          </template>
          <template #on>
            On
          </template>
        </vs-switch>
      </div>
      <div @click="toggleVisualizer" id="visualizerToggle" class="setting">
        <p>Visualizer</p>
        <vs-switch disabled="true" v-model="visualizer">
          <template #off>
            Off
          </template>
          <template #on>
            On
          </template>
        </vs-switch>
      </div>
      <div
        @click="toggleDeezerDarkMode"
        id="deezerDarkModeToggle"
        class="setting"
      >
        <p>Force Deezer Dark Mode</p>
        <vs-switch disabled="true" v-model="forceDeezerDarkMode">
          <template #off>
            Off
          </template>
          <template #on>
            On
          </template>
        </vs-switch>
      </div>
    </div>
    <div class="shortcuts">
      <h3>Shortcuts</h3>
      <div class="shortcut">
        <p>Pause/Play</p>
        <pre>Space</pre>
      </div>
      <div class="shortcut">
        <p>Next Track</p>
        <pre>N</pre>
      </div>
      <div class="shortcut">
        <p>Previous Track</p>
        <pre>P</pre>
      </div>
      <div class="shortcut">
        <p>Search Tracks</p>
        <pre>S</pre>
      </div>
      <div class="shortcut">
        <p>Reload App</p>
        <pre>Ctrl + R</pre>
      </div>
      <button @click="clearAddedTracks" class="dangerBt">
        <h4>Clear Cached Tracks</h4>
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import Wave from "wave-visualizer";
export default {
  data() {
    return {
      tableLayout: false,
      fakeLightMode: false,
      visualizer: true,
      forceDeezerDarkMode: false,
    };
  },
  methods: {
    ...mapMutations(["setSetting"]),
    hideSettings() {
      document.querySelector(".Settings").classList.remove("ModalShow");
    },
    toggleFakeLightMode() {
      this.fakeLightMode = !this.fakeLightMode;
      document.querySelector("html").classList.toggle("fakeLightMode");
      localStorage.setItem("fakeLightMode", this.fakeLightMode);
      this.setSetting(["fakeLightMode", this.fakeLightMode]);
    },
    toggleTableLayout() {
      this.tableLayout = !this.tableLayout;
      document.querySelector(".MainGrid").classList.toggle("tableLayout");
      localStorage.setItem("tableLayout", this.tableLayout);
      this.setSetting(["tableLayout", this.tableLayout]);
    },
    toggleVisualizer() {
      this.visualizer = !this.visualizer;
      localStorage.setItem("visualizer", this.visualizer);
      this.setSetting(["visualizer", this.visualizer]);
      if (this.visualizer) {
        const wave = new Wave();
        wave.fromElement("audioTag", "visualizerArea", {
          colors: ["white"],
        });
      }
    },
    toggleDeezerDarkMode() {
      this.forceDeezerDarkMode = !this.forceDeezerDarkMode;
      localStorage.setItem("forceDeezerDarkMode", this.forceDeezerDarkMode);
      const noti = this.$vs.notify({
        position: "top-center",
        title: "Reload Deezer to apply this change",
      });
      this.setSetting(["forceDeezerDarkMode", this.forceDeezerDarkMode]);
    },
    clearAddedTracks() {
      localStorage.removeItem("addedTracks");
      const noti = this.$vs.notify({
        position: "top-center",
        color: "warning",
        title: "Added tracks have been cleared",
        text: "Reload to view changes",
      });
    },
  },
  mounted() {
    if (JSON.parse(localStorage.getItem("tableLayout")) == true) {
      document.querySelector("#tableLayoutToggle").click();
    }
    if (JSON.parse(localStorage.getItem("fakeLightMode")) == true) {
      document.querySelector("#fakeLightModeToggle").click();
    }
    if (JSON.parse(localStorage.getItem("forceDeezerDarkMode")) == true) {
      document.querySelector("#deezerDarkModeToggle").click();
    }
    if (JSON.parse(localStorage.getItem("visualizer")) == true) {
      (this.visualizer = true), this.setSetting(["visualizer", true]);
    } else {
      (this.visualizer = false), this.setSetting(["visualizer", false]);
    }
    if (JSON.parse(localStorage.getItem("perfomanceMode")) == true) {
      (this.perfomanceMode = true), this.setSetting(["perfomanceMode", true]);
      (this.visualizer = false), this.setSetting(["visualizer", false]);
    } else {
      (this.perfomanceMode = false), this.setSetting(["perfomanceMode", false]);
    }
  },
};
</script>

<style lang="scss">
.Settings {
  background-color: rgba(0, 0, 0, 0.39);
  backdrop-filter: blur(10px);
  box-shadow: 0px 0px 50px black;
  padding: 10px;
  border-radius: 20px;
  overflow: hidden;
  top: 5% !important;
  max-height: 800px;
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.315);
  h1 {
    text-align: center;
  }
  h3 {
    margin-top: 10px;
    text-align: center;
  }
  .setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
    padding: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    border-radius: 0px;
    cursor: pointer;
  }
  .setting:hover {
    border-radius: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0);
    background: rgba(56, 86, 255, 0.356);
  }
  .shortcut {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    padding-bottom: 5px;
    pre {
      background: rgb(0, 0, 0);
      padding: 5px;
      border-radius: 8px;
    }
  }
}
</style>
