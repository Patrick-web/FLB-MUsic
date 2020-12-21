<template>
  <div class="Discover"></div>
</template>

<script>
import * as cheerio from "cheerio";

export default {
  methods: {
    loadHtml(html) {
      const $ = cheerio.load(html);
      //   this.getAlbums($);
      //   this.getArtists($);
      this.getTracks($);
    },
    getAlbums(htmlData) {
      htmlData("div.resource-list--release-list-item").each((i, element) => {
        const albumName = element.children[1].children[1].firstChild.data;
        const artist =
          element.children[3].children[1].children[1].firstChild.data;
        let albumCover;
        if (element.children[9].children[1]) {
          albumCover = element.children[9].children[1].children[1].attribs.src;
        } else {
          albumCover = element.children[7].children[1].children[1].attribs.src;
        }
        let linkToAlbumPage;
        if (element.children[11]) {
          linkToAlbumPage =
            "https://last.fm" + element.children[11].attribs.href;
        } else {
          linkToAlbumPage =
            "https://last.fm" + element.children[9].attribs.href;
        }
        const albumDetails = {
          albumName,
          albumCover,
          artist,
          linkToAlbumPage,
        };
        console.table(albumDetails);
        // console.log(element.children[3].children[1].firstChild.data);
      });
    },
    getArtists(htmlData) {
      console.clear();
      htmlData("div.big-artist-list-item").each((i, element) => {
        const artist = element.children[1].firstChild.children[0].data;
        const linkToArtistPage =
          "https://last.fm" + element.children[1].firstChild.attribs.href;
        const artistCoverImg = element.children[3].children[1].attribs.src;
        const artistDetails = {
          artist,
          linkToArtistPage,
          artistCoverImg,
        };
        console.table(artistDetails);
      });
    },
    getTracks(htmlData) {
      console.clear();
      htmlData("tr.chartlist-row--with-artist").each((i, element) => {
        // const ytLink = element.children[3].children[1].href;
        //   const trackName = element.children[3].children[1].data-track-name
        // console.log(ytLink);
        let ytLink;
        let artist;
        let artistLink;
        let trackName;
        if (element.children[3].children[1]) {
          const attrs = element.children[3].children[1].attribs;
          ytLink = attrs["href"];
          artist = attrs["data-artist-name"];
          artistLink = attrs["data-artist-url"];
          trackName = attrs["data-track-name"];
          //   console.log(element.children[3].children[1].attribs);
          const trackDetails = {
            ytLink,
            artist,
            artistLink,
            trackName,
          };
          console.table(trackDetails);
        } else {
          console.log("track is not playable");
        }
      });
    },
  },
  mounted() {
    var myHeaders = new Headers();
    myHeaders.append("authority", "www.last.fm");
    myHeaders.append(
      "accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://www.last.fm/search/tracks?q=dance+monkey", requestOptions)
      .then((response) => response.text())
      .then((result) => this.loadHtml(result))
      .catch((error) => console.log("error", error));
  },
};
</script>

<style></style>
