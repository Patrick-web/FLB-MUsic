<template>
  <div class="Modal" id="CoverSearcher">
    <h2>Cover Art Searcher</h2>
    <div class="newPlaylistForm">
      <p class="modalClose" @click="hideAdder">X</p>
      <input
        placeholder="e.g Oceans by Hillsong cover art"
        type="text"
        v-model="query"
        class="inputElem"
      />
      <button @click="searchForCover()" v-if="query">
        Search
      </button>
    </div>
    <br />
    <div class="coversWrapper">
      <div v-if="covers.length == 0 && isOnline" class="loadingArea">
        <div class="loadingIndicator"></div>
      </div>
      <img
        @click="selectCover(cover.url)"
        v-for="cover in covers"
        :src="cover.url"
        :key="cover.url"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import * as gis from "g-i-s";
export default {
  data() {
    return {
      query: "",
      covers: [],
      isOnline: false,
    };
  },
  computed: {},
  methods: {
    searchForCover() {
      if (navigator.onLine) {
        this.isOnline = true;
        gis(this.query, (error, results) => {
          console.log("Results from image search");
          if (error) {
            console.log(error);
          } else {
            if (results.length > 1) {
              this.covers = results.splice(10, 50);
            }
          }
        });
      } else {
        this.isOnline = false;
      }
    },
    selectCover(url) {
      document.querySelector("#coverArtTag").src = url;
    },
    hideAdder() {
      document.querySelector(".ModalShow").classList.remove("ModalShow");
    },
  },
};
</script>

<style lang="scss">
.ModalShow {
  transform: scaleY(1) !important;
  div {
    opacity: 1 !important;
  }
}
.Modal {
  position: fixed;
  top: 40%;
  left: 30%;
  z-index: 10;
  background: #171717;
  box-shadow: 0px 0px 50px black;
  transform: translate(0%, -50%);
  padding: 10px;
  border-radius: 15px;
  border-top-left-radius: 20px;
  color: white;
  font-family: roboto-light;
  text-align: center;
  max-height: 400px;
  overflow: hidden;
  overflow-y: scroll;
  transform-origin: bottom left;
  transform: scaleY(0);
  transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  div {
    opacity: 0;
  }
  .modalClose {
    position: absolute;
    right: 5px;
    top: 5px;
    transform: scale(0.8);
    background: crimson;
    border-radius: 50%;
    padding: 6px;
    padding-right: 10px;
    padding-left: 10px;
    box-shadow: 0px 0px 10px black;
    font-family: roboto-thick;
    cursor: pointer;
    transition: 0.2s ease;
  }
  .modalClose:hover {
    transform: scale(0.7);
  }
  input,
  button {
    font-size: 1.2em;
    color: white;
    transition: 0.2s ease;
  }
  input {
    background: #111111;
    padding: 5px;
    border: none;
    border-bottom: 0.5px solid rgb(255, 255, 255);
  }
  input:focus {
    border-bottom: 1px solid #1e74ff;
  }
}
#CoverSearcher {
  width: 300px;
  overflow: hidden;
  top: 30%;
  input {
    width: 100%;
  }
  ::placeholder {
    font-size: 0.8em;
  }
}
.coversWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 300px;
  overflow: hidden;
  overflow-y: scroll;
  img {
    width: 100%;
    margin-bottom: 2px;
    cursor: pointer;
  }
  img:hover {
    transform: scale(0.9);
  }
}
</style>
