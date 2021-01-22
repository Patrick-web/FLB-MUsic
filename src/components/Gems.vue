<template>
  <div class="Gems">
    <div class="gemTabber">
      <p class="activeGemTab">FLBing</p>
      <p>Converter</p>
    </div>
    <div v-if="currentGem == 'converter'" class="converter">
      <h1>Video to Mp3</h1>
      <p id="selectedVideo">
        {{ videoToConvert }}
      </p>
      <button @click="importVideo">
        <h2>Import Video</h2>
      </button>
      <button
        v-if="videoToConvert != 'No Video Imported  📽'"
        @click="startConversion"
      >
        <h2>Convert</h2>
      </button>
      <div class="outputs"></div>
    </div>
    <FLBing />
  </div>
</template>

<script>
const electron = window.require("electron");
import FLBing from "@/components/FLBing/FLBing.vue";
export default {
  data() {
    return {
      currentGem: "FLBBing",
      videoToConvert: "No Video Imported  📽",
    };
  },
  components: {
    FLBing,
  },
  methods: {
    importVideo() {
      electron.ipcRenderer.send("importVideoForConversion");
    },
    startConversion() {
      electron.ipcRenderer.send("convertFile", {
        path: this.videoToConvert.replace("file://", ""),
        outputFileType: "mp3",
      });
      document.querySelector("#playerFeaturebtn").click();
    },
    mounted() {
      if (navigator.onLine) {
        electron.ipcRenderer.send("downloadBinaries");
      } else {
        window.addEventListener("online", () =>
          electron.ipcRenderer.send("downloadBinaries")
        );
      }
    },
  },
  mounted() {
    electron.ipcRenderer.on(
      "importedVideo",
      (e, video) => (this.videoToConvert = video)
    );
    electron.ipcRenderer.on("conversionProgress", (e, progress) => {
      document.querySelector(
        "#conversionProgress"
      ).style.width = `${progress}%`;
      this.percetageProgress = progress;
      if (progress == 100) {
        this.converting = true;
        const noti = this.$vs.notify({
          color: "success",
          position: "top-center",
          title: "Conversion Complete",
          text: "Saved to your Music Folder",
        });
        setTimeout(() => {
          document.querySelector("#conversionProgress").style.width = `0%`;
          setTimeout(() => {
            this.converting = false;
          }, 500);
        }, 1000);
      }
    });
  },
};
</script>

<style lang="scss">
.Gems {
  position: absolute;
  top: 0%;
  height: 100vh;
  left: 0%;
  z-index: 50;
  background: #171717;
  box-shadow: 0px 0px 50px black;
  width: 100%;
  .gemTabber {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: black;
    margin: auto;
    border-radius: 20px;
    position: sticky;
    width: 150px;
    overflow: hidden;
    transform: translateY(50%);
    p {
      padding: 8px;
      cursor: pointer;
    }
    .activeGemTab {
      background: rgb(0, 102, 255);
    }
  }
  hr {
    border: 1px solid #ffffff1c;
    height: 1px;
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .converter {
    h1 {
      text-align: center;
    }
    #selectedVideo {
      font-family: roboto-light;
      background: rgb(0, 0, 0);
      padding: 10px;
      border-radius: 10px;
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
}
</style>
