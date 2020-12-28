<template>
  <div class="info-card">
    <div class="gif">
      <img id="gif" src="@/assets/gif.gif" alt />
    </div>
    <br />
    <div class="infos">
      <div class="info-group">
        <div class="it">Made with 🤍 By</div>
        <div class="i">Patrick Waweru</div>
      </div>
      <div class="info-group">
        <div class="it">Follow Me on Twitter 🐦</div>
        <a target="_blank" href="https://twitter.com/PnTX10" class="i"
          >@PnTX10</a
        >
      </div>
      <div class="info-group">
        <div class="it">Email 📬</div>
        <a target="_blank" href="https://mail.google.com" class="i"
          >pntx200@gmail.com</a
        >
      </div>
      <div class="info-group">
        <div class="it">Github 🤖</div>
        <a target="_blank" href="https://github.com/Patrick-web" class="i">
          Patrick-web
        </a>
      </div>
      <div class="info-group">
        <div class="it">
          🦧 Don't be shy, go ahead and contact me. Am bored🤭
        </div>
      </div>
      <button style="background:white;">
        <a
          target="_blank"
          href="https://flbpodcasts.netlify.app"
          style="color:black"
          >Check Out FLB Podcast</a
        >
      </button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.darken {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.815);
  z-index: 40;
  transition: 0.2s ease;
  opacity: 0;
  pointer-events: none;
}
.info-card {
  position: fixed;
  z-index: 50;
  top: 50%;
  left: 50%;
  transform: scale(0) translate(-50%, -50%);
  background: linear-gradient(150deg, rgb(0, 193, 207), rgb(0, 110, 255));
  width: 350px;
  border-radius: 15px;
  padding: 10px;
  transform-origin: top left;
  opacity: 0;
  box-shadow: 0px 0px 50px black;
  transition: 0.2s cubic-bezier(0.91, 0.8, 0.54, 1.39);
  .info-group {
    padding-bottom: 5px;
    margin-bottom: 10px;
    margin-left: 10px;
    font-size: 1.2em;
    border-bottom: 1px solid rgba(255, 255, 255, 0.39);
    .it {
      font-family: roboto-light;
      font-weight: 300;
      font-size: 0.9em;
    }
    .i {
      font-size: 0.9em;
      font-family: roboto-light;
      font-weight: 300;
    }
    .i:hover {
      .itcursor: default;
    }
  }
}
.gif {
  text-align: center;
  margin-top: -70px;
}
#gif {
  width: 200px;
  border-radius: 10px;
  box-shadow: 4px 2px 10px rgba(8, 8, 8, 0.384);
}
.showInfo {
  .darken {
    opacity: 1;
    pointer-events: all;
  }
  .info-card {
    transform: scale(1) translate(-50%, -50%);
    opacity: 1;
  }
  #logo {
    transform: rotate(-45deg);
  }
}
</style>
