<template>
  <div @click="playTrack()" class="TrackCard2">
    <img src="@/assets/Thumbnail.png" alt="" />
    <div class="trackInfo">
      <h4>
        {{ trackData.trackName }}
      </h4>
      <p>{{ trackData.artistName }}</p>
    </div>
  </div>
</template>

<script>
const electron = window.require("electron");

export default {
  props: {
    trackData: Object,
  },
  methods: {
    playTrack() {
      electron.ipcRenderer.send("getYTStreamURL", this.trackData.ytLink);
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
.TrackCard2 {
  background: #0f0f0f;
  border-bottom: 1px solid rgba(128, 128, 128, 0.356);
  font-family: roboto-light;
  cursor: pointer;
  display: flex;
  align-items: center;
  div {
    padding: 10px;
  }
  img {
    width: 60px;
  }
  h4 {
    margin-bottom: 5px;
  }
  p {
    font-size: 0.9em;
  }
}
.TrackCard2:hover {
  background: #ffffff1c;
}
</style>
