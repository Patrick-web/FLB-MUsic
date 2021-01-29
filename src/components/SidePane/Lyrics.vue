<template>
  <div class="LyricsContainer">
    <div v-if="!lyric" class="loadingArea centerContents">
      <div class="loadingIndicator"></div>
    </div>
    <div v-if="lyric" class="darkersWrapper">
      <div class="darkener darkener_bottom"></div>
      <div class="darkener darkener_top"></div>
    </div>
    <LyricScroll
      v-if="lyric"
      :lyric="lyric"
      :lyric-active-class="'lyric-active'"
      :lyric-center-class="'lyric-center'"
      :current-time="currentTime"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      lyric: null,
      currentTime: 0,
    };
  },
  methods: {
    searchAndParse() {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        "https://www.megalobiz.com/lrc/maker/download-music-lyrics-lrc-generated-files?qry=helplessly tatiana manaois",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          this.parse(result);
        })
        .catch((error) => console.log("error", error));
    },
    parse(htmlString) {
      const lyricsObj = {};
      const regex = /\[00:03.05].*\"\;/gm;
      let m;
      while ((m = regex.exec(htmlString)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        const lyricStrings = m[0].replace(/\\n/gm, "__").split("__");
        lyricStrings.forEach((string, index) => {
          const strip = string.split("]");
          const lyricStrip = {
            timestamp: this.timeStrToNum(strip[0].replace("[", "")),
            text: strip[1].replace(/";/g, ""),
          };
          lyricsObj[`${lyricStrip.timestamp}`] = lyricStrip.text;
        });
      }
      delete lyricsObj[Object.keys(lyricsObj)[0]];
      this.lyric = lyricsObj;
    },
    timeStrToNum(str) {
      const minute = Number(str.slice(0, 2));
      const second = Number(str.slice(3, 5));
      const minSec = Number(str.slice(6, 8));
      return minute * 60 + second + minSec / 100;
    },
  },
  mounted() {
    this.searchAndParse();
    document.querySelector("audio").addEventListener("timeupdate", (e) => {
      this.currentTime = document.querySelector("audio").currentTime;
    });
  },
};
</script>

<style lang="scss">
.LyricsContainer {
  position: absolute;
  top: 0;
  overflow: hidden;
  .lyric-view {
    margin-top: -430px;
    padding: 10px;
    overflow: visible !important;
    .lyric-active {
      color: rgb(255, 0, 0) !important;
    }
  }
  .darkersWrapper {
    height: 90vh;
    width: 100%;
    position: sticky;
    overflow: hidden;
    z-index: 1;
  }
  .darkener {
    position: absolute;
    width: 110%;
    left: -10px;
    height: 40%;
    z-index: 1;
    background: linear-gradient(
      180deg,
      rgb(0, 0, 0),
      rgba(0, 0, 0, 0.637),
      transparent
    );
    filter: blur(10px);
  }
  .darkener_top {
    top: 0px;
  }
  .darkener_bottom {
    transform: rotate(180deg);
    bottom: 0px;
  }
}
</style>
