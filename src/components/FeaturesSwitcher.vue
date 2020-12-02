<template>
  <div class="vMenu">
    <div class="activeFeatureIndicator"></div>
    <div @click="switchFeature($event, 'player')" class="vmenu-group">
      <img src="@/assets/play-circle.svg" alt />
      <p style="padding-left:25px" class="v-tooltip">Player</p>
    </div>
    <div @click="switchFeature($event, 'mixer')" class="tabActive vmenu-group">
      <img class="whiten" src="@/assets/gem.svg" alt />
      <p style="padding-left:30px" class="v-tooltip">Mixer</p>
    </div>
    <div @click="switchFeature($event, 'converter')" class="vmenu-group">
      <img src="@/assets/missed_video_call.svg" alt />
      <p class="v-tooltip">Converter</p>
    </div>
    <div @click="addMusic($event, 'addMusic')" class="vmenu-group">
      <img src="@/assets/plus.svg" alt />
      <p class="v-tooltip">Add Music</p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    switchFeature(e, tab) {
      document.body.classList.remove("showPodcastData");
      const indicator = document.querySelector(".activeFeatureIndicator");
      const element = e.currentTarget;
      //   const pagesWrapper = document.querySelector(".pagesWrapper");
      document.querySelector(".tabActive").classList.remove("tabActive");
      element.classList.add("tabActive");
      switch (tab) {
        case "player":
          indicator.style.top = "10%";
          //   pagesWrapper.style.top = "0%";
          document.body.classList.add("currentTabIsSubscribed");
          break;
        case "mixer":
          indicator.style.top = "36%";
          //   pagesWrapper.style.top = "-100%";
          document.body.classList.remove("currentTabIsSubscribed");
          break;
        case "converter":
          indicator.style.top = "62.5%";
          //   pagesWrapper.style.top = "-201%";
          break;
        default:
          break;
      }
    },
    addMusic() {},
  },
};
</script>

<style lang="scss">
.whiten {
  filter: brightness(0) invert(1);
}
.vMenu {
  align-self: center;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 8;
  width: 50px;
  background: #141414;
  height: 250px;
  padding: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  .vmenu-group {
    position: relative;
    .v-tooltip {
      background: white;
      position: absolute;
      top: 20%;
      right: -50%;
      transform: scale(0) translate(100%, 0%);
      opacity: 0;
      padding: 5px 10px 5px 10px;
      transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-weight: 600;
      color: black;
      width: 100px;
      border-radius: 20px;
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
    top: 10%;
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
</style>
