<template>
  <div class="Gems">
    <div class="converter">
      <h1>Video to Mp3</h1>
      <p id="selectedVideo">
        {{ videoToConvert }}
      </p>
      <div v-if="converting" class="progressArea">
        <div id="conversionProgress"></div>
        <p>{{ percetageProgress }}%</p>
      </div>
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
    <hr />
    <div class="callToCommunity">
      <p>I'm currently working on some more gems💎 like...</p>
      <div>
        <pre>🎵🥂🎵 Merging audio Files</pre>
        <pre>🌐🔊 Streaming audio from Network URL</pre>
        <pre>📔🖊️ A Lyrics Maker (this one am not quite sure)</pre>
        <pre>🤫 And others 🤫</pre>
      </div>
      <p>
        So hit me up on twitter🐤 and tell me....something, anything, anything
        at all (Damn, that sounds desperate)
      </p>
      <p>
        Hit me up or I'll delete your Music 👿. Ok, ok, relax, am just joking
        🤥. Or am I 💔 ...
      </p>
      <p>
        Ok. Am Bored. So am just adding some stupid stuff. Blah blah blah buga
        buga bada boom boom meow meow el solo lobo el casa blanco ? Aaaah
        whatever
      </p>
    </div>
  </div>
</template>

<script>
const electron = window.require("electron");

export default {
  data() {
    return {
      videoToConvert: "No Video Imported  📽",
      converting: false,
      percetageProgress: 0,
    };
  },
  components: {},
  methods: {
    importVideo() {
      electron.ipcRenderer.send("importVideoForConversion");
    },
    startConversion() {
      console.log("starting conversion");
      this.converting = true;
      electron.ipcRenderer.send("startConversionToMp3");
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
  top: 50%;
  left: 5%;
  transform: translate(-50%, -50%) scale(0);
  z-index: 50;
  padding: 10px;
  border-radius: 15px;
  background: #171717;
  box-shadow: 0px 0px 50px black;
  max-width: 430px;
  pointer-events: none;
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
  .callToCommunity {
    h3 {
      font-weight: 300;
      margin-bottom: 10px;
    }
    div {
      margin-left: 5px;
    }
    hr {
      margin-bottom: 2px;
      margin-top: 2px;
    }
    pre {
      font-size: 1.1em;
      padding: 5px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.185);
    }
    p {
      font-family: "Courier New", Courier, monospace;
    }
  }
}
</style>
