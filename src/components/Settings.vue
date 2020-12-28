<template>
  <div class="Settings">
    <h1>Settings</h1>
    <div class="settings">
      <div @click="toggleCompactMode" id="compactModeToggle" class="setting">
        <p>Compact Mode</p>
        <vs-switch disabled="true" v-model="compactMode">
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      compactMode: false,
      fakeLightMode: false,
      visualizer: true,
    };
  },
  methods: {
    toggleFakeLightMode() {
      this.fakeLightMode = !this.fakeLightMode;
      document.querySelector("html").classList.toggle("fakeLightMode");
      localStorage.setItem("fakeLightMode", this.fakeLightMode);
    },
    toggleCompactMode() {
      this.compactMode = !this.compactMode;
      document.querySelector(".MainGrid").classList.toggle("compactMode");
      localStorage.setItem("compactMode", this.compactMode);
    },
    toggleVisualizer() {
      this.visualizer = !this.visualizer;
      document.querySelector(".MainGrid").classList.toggle("visualizerOff");
      localStorage.setItem("visualizer", this.visualizer);
    },
  },
  mounted() {
    console.clear();
    if (JSON.parse(localStorage.getItem("compactMode")) == true) {
      document.querySelector("#compactModeToggle").click();
    }
    if (JSON.parse(localStorage.getItem("fakeLightMode")) == true) {
      document.querySelector("#fakeLightModeToggle").click();
    }
    if (JSON.parse(localStorage.getItem("visualizer")) == false) {
      document.querySelector(".MainGrid").classList.add("visualizerOff");
      this.visualizer = false;
    }
  },
};
</script>

<style lang="scss">
.showSettings {
  .Settings {
    width: 300px;
    max-height: 600px;
    visibility: initial;
  }
}
.Settings {
  position: absolute;
  z-index: 10;
  width: 300px;
  width: 0;
  max-height: 0;
  background: rgb(24, 24, 24);
  box-shadow: 0px 0px 50px black;
  bottom: 60px;
  padding: 10px;
  border-radius: 20px;
  visibility: hidden;
  overflow: hidden;
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
