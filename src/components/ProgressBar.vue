<template>
  <div v-if="converting" class="ProgressBar">
    <h3>{{ action }}</h3>
    <div @click="converting = false" id="hideBar">
      <p></p>
    </div>
    <div class="progressArea">
      <div id="conversionProgress"></div>
      <p>{{ percetageProgress }}%</p>
    </div>
  </div>
</template>

<script>
const electron = window.require("electron");

export default {
  data() {
    return {
      action: null,
      percetageProgress: 0,
      converting: false,
    };
  },
  mounted() {
    electron.ipcRenderer.on("progressActionName", (e, actionName) => {
      this.action = actionName;
      this.converting = true;
    });
    electron.ipcRenderer.on("progressInfo", (e, progress) => {
      document.querySelector(
        "#conversionProgress"
      ).style.width = `${progress}%`;
      this.percetageProgress = progress;
      if (progress > 98) {
        document.querySelector("#conversionProgress").style.width = `0%`;
        setTimeout(() => {
          this.converting = false;
        }, 500);
      }
    });
  },
};
</script>

<style lang="scss">
.ProgressBar {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgb(10, 10, 10);
  padding: 10px;
  border-radius: 10px;
  width: 300px;
  z-index: 30;
  background: #171717;

  h3 {
    text-align: center;
  }
  #hideBar {
    width: 20px;
    height: 20px;
    background: rgb(0, 0, 0);
    position: absolute;
    top: 5px;
    right: 5px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    cursor: pointer;
    p {
      width: 10px;
      height: 2px;
      background: rgb(255, 255, 255);
    }
  }
  #hideBar:hover {
    filter: invert(1);
  }
  .progressArea {
    width: 100%;
    height: 20px;
    margin-top: 5px;
    margin-bottom: -5px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.075);
    position: relative;
    p {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    #conversionProgress {
      background: #0062ff;
      border-radius: 10px;
      height: 100%;
      width: 10%;
    }
  }
}
</style>
