<template>
  <div class="GenreSelect grid4">
    <GenreCard
      v-for="genre in genres"
      :key="genre.name"
      :genreName="genre.name"
      :genreImage="genre.image"
    />
  </div>
</template>

<script>
import GenreCard from "./GenreCard.vue";
export default {
  data() {
    return {
      genres: [
        {
          name: "Lofi",
          image:
            "https://i.pinimg.com/originals/47/79/8e/47798ec4bf7f873c07cd245088329524.png",
        },
        {
          name: "Jazz",
          image:
            "https://lastfm.freetls.fastly.net/i/u/avatar300s/77be9d4f51949813088eba8d87db8235.webp",
        },
        {
          name: "Indie",
          image:
            "https://lastfm.freetls.fastly.net/i/u/avatar300s/710fb79a63ddd422e4912f1c3d65ab6c.webp",
        },
        {
          name: "Alternative",
          image:
            "https://lastfm.freetls.fastly.net/i/u/avatar300s/325954902c0042f3b589a941b8ba6365.webp",
        },
        {
          name: "Country",
          image:
            "https://lastfm.freetls.fastly.net/i/u/avatar300s/9704156b9f414bc98403cbd30a537db1.webp",
        },
        {
          name: "Blues",
          image:
            "https://lastfm.freetls.fastly.net/i/u/avatar300s/aa329aac77504de38654a399d28f127a.webp",
        },
        {
          name: "Classical",
          image:
            "https://lastfm.freetls.fastly.net/i/u/avatar300s/64e335e5e52b4eba88b1f005d8f62fcd.webp",
        },
        {
          name: "Acoustic",
          image:
            "https://lastfm.freetls.fastly.net/i/u/avatar300s/f5c67f5941e78a99370f794d3b0970b8.webp",
        },
      ],
    };
  },
  components: { GenreCard },
};
</script>

<style></style>
