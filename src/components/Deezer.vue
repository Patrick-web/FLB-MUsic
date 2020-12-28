<template>
  <div ref="content" class="Discover">
    <button
      class="tool"
      data-tip="Reload Deezer"
      @click="reloadWebview"
      id="refreshWebview"
    >
      <img class="animated infinite fast" src="@/assets/refresh.svg" alt="" />
    </button>
    <webview
      src="https://www.deezer.com/"
      useragent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
      disablewebsecurity
      style="height:90%;"
    >
    </webview>
  </div>
</template>

<script>
import * as cheerio from "cheerio";
export default {
  components: {},
  methods: {
    reloadWebview() {
      document.querySelector("webview").reload();
      document.querySelector("#refreshWebview img").classList.add("rotateOut");
      setTimeout(() => {
        document
          .querySelector("#refreshWebview img")
          .classList.remove("rotateOut");
      }, 5000);
    },
  },
  mounted() {
    const webview = document.querySelector("webview");

    webview.addEventListener("dom-ready", (e) => {
      webview.executeJavaScript(
        `function toggleDarkMode () {
          setInterval(() => {
            if(document.querySelector('.ads-bottom')){
                document.querySelector('.ads-bottom').style.display = 'none'
            }
            if(document.querySelector('.conversion-banner')){
              document.querySelector('.conversion-banner').style.display = 'none';            
            }
            document.querySelector('html').style.filter = 'invert(1) hue-rotate(180deg)';  
            document.querySelectorAll('html img').forEach(img=>img.style.filter="invert(1) hue-rotate(180deg)")
          }, 1000);
        }
        toggleDarkMode();`
      );
    });

    webview.addEventListener("did-fail-load", () => {
      webview.reload();
    });
    window.addEventListener("online", () => webview.reload());
  },
};
</script>

<style lang="scss">
.Discover {
  padding-top: 10px;
  height: 100%;
  #refreshWebview {
    display: none;
    position: absolute;
    right: 10px;
    width: 40px;
    height: 40px;
    background: rgb(10, 10, 10);
    border-radius: 50%;
    top: 0;
    transform: translateY(-50%);
  }
  #refreshWebview:hover {
    background: #0062ff;
  }
}
.showThreeBlock {
  .ThreeBlock {
    display: block;
  }
  .GenreSelect {
    display: none;
  }
}
</style>
