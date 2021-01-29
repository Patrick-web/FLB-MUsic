<template>
  <div class="Settings">
    <h1 id="SettingsTitle">Settings</h1>
    <p class="modalClose" @click="UIcontrollerToggleProperty('showSettings')">
      <img src="@/assets/x.svg" alt="" />
    </p>
    <div class="settings">
      <div @click="toggleTableLayout" id="tableLayoutToggle" class="setting">
        <p>Table Layout</p>
        <button class="iconBt">
          <h4 v-if="!settings.tableLayout">Off</h4>
          <h4 v-if="settings.tableLayout">On</h4>
        </button>
      </div>
      <div @click.stop="toggleVisuals" id="visualsToggle" class="setting">
        <p>Visuals</p>
        <button class="iconBt">
          <h4 v-if="!settings.visuals">Off</h4>
          <h4 v-if="settings.visuals">On</h4>
        </button>
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
        <h2>Reset</h2>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Wave from "wave-visualizer";
export default {
  data() {
    return {
      visualsOffDueToBlur: false,
    };
  },
  computed: {
    ...mapGetters(["settings"]),
  },
  methods: {
    ...mapMutations(["toggleSetting", "UIcontrollerToggleProperty"]),
    toggleTableLayout() {
      this.toggleSetting("tableLayout");
      document.querySelector(".MainGrid").classList.toggle("tableLayout");
      localStorage.setItem("tableLayout", this.settings.tableLayout);
    },
    toggleVisuals() {
      this.toggleSetting("visuals");
      localStorage.setItem("visuals", this.settings.visuals);
      const wave = new Wave();
      wave.fromElement("audioTag", "visualizerArea", {
        colors: ["white"],
      });
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
  mounted() {},
};
</script>

<style lang="scss">
.Settings {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.39);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.315);
  box-shadow: 0px 0px 50px black;
  padding: 10px;
  overflow: hidden;
  top: 8%;
  left: 30%;
  max-height: 800px;
  z-index: 50;
  width: 300px;
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
    padding: 5px;
    padding-left: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    border-radius: 0px;
    cursor: pointer;
    p {
      font-family: roboto-light;
      margin-right: 5px;
    }
  }
  .setting:hover {
    background-color: #ffffff1e;
    border-radius: 20px;
    margin: 5px;
  }
  .shortcut {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    padding-bottom: 5px;
    font-family: roboto-light;
    pre {
      background: rgb(0, 0, 0);
      padding: 5px;
      border-radius: 8px;
    }
  }
}
</style>
