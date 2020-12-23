<template>
  <div ref="content" class="Discover">
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
  methods: {},
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
  },
};
</script>

<style lang="scss">
.Discover {
  padding-top: 10px;
  height: 100%;
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
