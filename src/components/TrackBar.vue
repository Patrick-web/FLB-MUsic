<template>
  <div class="TrackBar">
    <div v-if="!playingTrack.path" class="noMusicPlaying"></div>
    <audio :src="playingTrack.path" id="audioTag" autoplay></audio>
    <div @click="seek($event)" class="seekBar">
      <div class="seekProgress"></div>
      <p id="hoverTime">{{ hoverTime }}</p>
    </div>
    <div class="progressInfoCard">
      <p>
        {{ currentTime }}
      </p>
      <p>
        {{ duration }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import Wave from "wave-visualizer";

export default {
  computed: {
    ...mapGetters(["playingTrack", "autoplay", "isPlaying"]),
  },
  data() {
    return {
      currentTime: "00:00",
      duration: "00:00",
      hoverTime: "00:00",
    };
  },

  methods: {
    ...mapActions(["determineNextTrack"]),
    ...mapMutations(["toggleIsPlaying"]),
    notify(title, text) {
      const noti = this.$vs.notify({
        color: "danger",
        position: "top-center",
        title,
        text,
      });
    },
    play() {
      document.querySelector("audio").play();
      if (document.querySelector("#visualizerArea")) {
        const wave = new Wave();
        wave.fromElement("audioTag", "visualizerArea", {
          colors: ["white"],
        });
      }
      const webview = document.querySelector("webview");
      if (webview) {
        webview.executeJavaScript(
          `function pause () {
            if(document.querySelector('.svg-icon-pause')){
              document.querySelector('[aria-label="Pause"]').click()
          }
          }
          pause();`
        );
      }
    },
    pause() {
      document.querySelector("audio").pause();
      if (document.querySelector("#visualizerArea")) {
        const wave = new Wave();
        wave.fromElement("audioTag", "visualizerArea", {
          colors: ["white"],
        });
      }
    },
    seekBack() {
      const audio = document.querySelector("#audioTag");
      audio.currentTime = audio.currentTime - 30;
    },
    seekForward() {
      const audio = document.querySelector("#audioTag");
      audio.currentTime = audio.currentTime + 30;
    },
    seek(e) {
      const track = document.querySelector(".seekBar");
      const seekProgress = document.querySelector(".seekProgress");
      let length;
      length = e.clientX - track.getBoundingClientRect().x;
      const percentageSeek = Math.ceil(
        (length / window.getComputedStyle(track).width.substring(0, 3)) * 100
      );
      seekProgress.style.width = `${percentageSeek}%`;
      const audio = document.querySelector("#audioTag");

      audio.currentTime = (percentageSeek * audio.duration) / 100;
      audio.play();
    },
    timeFormatter(duration) {
      // Hours, minutes and seconds
      var hrs = ~~(duration / 3600);
      var mins = ~~((duration % 3600) / 60);
      var secs = ~~duration % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";

      if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }

      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
    },
  },
  mounted() {
    const _this = this;
    const progressBar = document.querySelector(".seekBar");
    const seekProgress = document.querySelector(".seekProgress");
    const progressInfoCard = document.querySelector(".progressInfoCard");
    const audio = document.querySelector("audio");
    console.log(audio.currentTime);
    setInterval(() => {
      if (audio.currentTime) {
        this.currentTime = this.timeFormatter(audio.currentTime);
        this.duration = this.timeFormatter(audio.duration);
      }
      const percent = Math.floor((audio.currentTime / audio.duration) * 100);
      seekProgress.style.width = `${percent}%`;
      if (audio.currentTime == audio.duration) {
        this.determineNextTrack();
      }
    }, 1000);
    progressBar.addEventListener("mousemove", (e) => {
      const posX = e.clientX - progressBar.getBoundingClientRect().x;
      const percentageSeek = Math.ceil(
        (posX / window.getComputedStyle(progressBar).width.substring(0, 3)) *
          100
      );
      this.hoverTime = this.timeFormatter(
        (percentageSeek * audio.duration) / 100
      );
      document.querySelector("#hoverTime").style.left = `${percentageSeek -
        3}%`;
    });
  },
};
</script>

<style lang="scss">
.TrackBar {
  position: relative;
  z-index: 25;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transform: translateY(20%);
}

.seekBar {
  background: #00000069;
  width: 100%;
  height: 10px;
  position: relative;
  border-radius: 10px;
  .seekProgress {
    border-radius: 10px;
    position: absolute;
    height: 100%;
    max-height: 100%;
    width: 0%;
    background: #006eff;
    transition: 0.2s linear;
  }
}
.seekBar:hover {
  cursor: pointer;
  .progressInfoCard {
    opacity: 1;
  }
  #hoverTime {
    transform: translateY(-130%) !important;
    opacity: 1 !important;
  }
}

.iconsWrapper {
  height: 30px;
  width: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.iconsWrapper:hover {
  cursor: pointer;
}
.toggleIcons {
  width: 25px;
}
.playingState {
}
.progressInfoCard {
  position: absolute;
  display: flex;
  justify-content: space-between;
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 100%;
  top: 0%;
  left: 0%;
  transform: translateY(-10%);
  p {
    font-family: roboto-light;
    font-size: 0.8em;
  }
}
#hoverTime {
  position: absolute;
  top: 0;
  transform: translateY(-50%);
  opacity: 0;
  left: 0%;
  z-index: 2;
  font-family: roboto-light;
  font-size: 0.8em;
  padding: 2px 5px 2px 5px;
  border-radius: 10px;
  text-align: center;
  background: rgb(0, 0, 0);
  pointer-events: none;
}
</style>
