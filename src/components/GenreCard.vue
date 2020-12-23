<template>
  <div @click="fetchByGenre(genreName)" class="GenreCard CardBlock">
    <img :src="genreImage" alt="" />
    <div class="albumInfo">
      <h4>{{ genreName }}</h4>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import * as cheerio from "cheerio";

export default {
  props: {
    genreName: String,
    genreImage: String,
  },
  methods: {
    ...mapMutations(["getAlbums", "getArtists", "getTracks"]),
    fetchByGenre(tag) {
      document.querySelector(".Discover").classList.add("showThreeBlock");
      document.querySelector(".ThreeBlock").classList.add("slideInUp");
      document
        .querySelector(".ThreeBlock")
        .classList.replace("slideOutDown", "slideInUp");
      var myHeaders = new Headers();
      myHeaders.append(
        "accept",
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
      );

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`https://www.last.fm/tag/${tag}/artists`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const $ = cheerio.load(result);
          this.getArtists($);
        })
        .catch((error) => console.log("error", error));
      fetch(`https://www.last.fm/tag/${tag}/albums`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const $ = cheerio.load(result);
          this.getAlbums($);
        })
        .catch((error) => console.log("error", error));
      fetch(`https://www.last.fm/tag/${tag}/tracks`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const $ = cheerio.load(result);
          this.getTracks($);
        })
        .catch((error) => console.log("error", error));
    },
  },
};
</script>

<style lang="scss">
.GenreCard {
  h4 {
    padding: 5px;
    font-size: 1.2rem;
    text-align: center;
  }
}
</style>
