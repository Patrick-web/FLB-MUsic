<template>
  <div class="TrackBar">
    <audio :src="playingTrack.path" id="audioTag" autoplay></audio>

    <div @click="seek($event)" class="seekBar">
      <div class="seekProgress"></div>
      <div class="progressInfoCard">
        <div class="progressInfoWrapper">
          <div>
            <span>Now</span>
            <span>{{ currentTime }}</span>
          </div>
          <div>
            <span>Length</span>
            <span>{{ duration }}</span>
          </div>
          <div>
            <span>Hovering</span>
            <span>{{ hoverTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <div @click="toggleIsPlaying" class="iconsWrapper">
      <img
        v-if="!isPlaying"
        @click="play"
        class="toggleIcons playIcon"
        src="@/assets/playButton.svg"
        alt
      />
      <img
        v-if="isPlaying"
        @click="pause"
        class="toggleIcons pauseIcon"
        src="@/assets/pause.svg"
        alt
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

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
    },
    pause() {
      document.querySelector("audio").pause();
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
      const length = e.clientY - track.getBoundingClientRect().y;
      //   console.log(e.clientY);
      const progress = document.querySelector(".seekProgress");
      if (length > -1 && length <= 900) {
        progress.style.height = length + "px";
      }
      const percentageSeek = Math.ceil(
        (length / window.getComputedStyle(track).height.substring(0, 3)) * 100
      );
      const audio = document.querySelector("#audioTag");

      audio.currentTime = (percentageSeek * audio.duration) / 100;
      audio.play();
      console.log((percentageSeek * audio.duration) / 100);
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
    const audio = document.querySelector("#audioTag");
    console.log(audio.currentTime);
    setInterval(() => {
      if (audio.currentTime) {
        this.currentTime = this.timeFormatter(audio.currentTime);
      }
      const percent = Math.floor((audio.currentTime / audio.duration) * 100);
      seekProgress.style.height = `${percent}%`;

      if (audio.currentTime == audio.duration && this.autoplay) {
        this.determineNextTrack();
      }
    }, 1000);
    // setInterval(() => {
    //   if (audio.currentTime == 0) {
    //     if (document.querySelector(".playingtrack")) {
    //       const target = document.querySelector(".playingtrack");
    //       target.classList.add("brockentrack");
    //       // target.nextSibling.click();
    //       document
    //         .querySelector(".playingtrack")
    //         .classList.remove("playingtrack");
    //       _this.notify("Error", "This audio file is brocken");
    //     }
    //   }
    // }, 10000);
    progressBar.addEventListener("mousemove", (e) => {
      const posY = e.clientY - progressBar.getBoundingClientRect().y;
      progressInfoCard.style.top = `${posY - 30}px`;
      this.duration = this.timeFormatter(audio.duration);
      const percentageSeek = Math.ceil(
        (posY / window.getComputedStyle(progressBar).height.substring(0, 3)) *
          100
      );
      this.hoverTime = this.timeFormatter(
        (percentageSeek * audio.duration) / 100
      );
      if (percentageSeek > 100) {
        progressInfoCard.style.display = "none";
        progressInfoCard.style.pointerEvents = "none";
        progressInfoCard.style.marginTop = "0px";
      } else if (percentageSeek < 10) {
        progressInfoCard.style.display = "block";
        progressInfoCard.style.pointerEvents = "none";
        progressInfoCard.style.marginTop = "30px";
      } else {
        progressInfoCard.style.display = "block";
        progressInfoCard.style.pointerEvents = "none";
        progressInfoCard.style.marginTop = "0px";
      }
    });
  },
};
</script>

<style lang="scss">
.TrackBar {
  position: absolute;
  z-index: 5;
  left: 0px;
  transform: translateX(-100%);
  height: 100vh;
  width: 30px;
  padding-top: 10px;
  padding-right: 8px;
  background: #0f0f0f;
}
.seekBar {
  background: #1b1b1b;
  min-height: 93%;
  margin: auto;
  margin-bottom: 5px;
  margin-left: 10px;
  width: 10px;
  position: relative;
  border-radius: 10px;
  .seekProgress {
    border-radius: 10px;
    position: absolute;
    height: 0%;
    max-height: 100%;
    width: 100%;
    background: #006eff;
    transition: 0.2s linear;
  }
}
.seekBar:hover {
  cursor: pointer;
  .progressInfoCard {
    opacity: 1;
  }
}

.iconsWrapper {
  height: 30px;
  width: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 0px;
  margin-top: 10px;
  margin-bottom: 5px;
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
  right: -50%;
  transform: scale(1) translateX(100%);
  transform-origin: center;
  opacity: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 130px;
  .progressInfoWrapper {
    position: relative;
    z-index: 10;
    background: #006eff;
    border-radius: 10px;
    color: rgb(255, 255, 255);
    padding: 5px;
    font-size: 0.8rem;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.404);
    backdrop-filter: saturate(180%) blur(15px);
    div {
      margin-bottom: 2px;
      display: flex;
      justify-content: space-between;
      span {
        margin-left: 5px;
        font-weight: 600;
      }
    }
  }
}
</style>
