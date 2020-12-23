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
        <div class="it">Twitter 🐦</div>
        <div class="i">@PnTX10</div>
      </div>
      <div class="info-group">
        <div class="it">Email 📬</div>
        <div class="i">pntx200@gmail.com</div>
      </div>
      <div class="info-group">
        <div class="it">Github 🤖</div>
        <div class="i">
          https://github.com/Patrick-web
        </div>
      </div>
      <div class="info-group">
        <div class="i">🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧🦧</div>
        <div class="it">
          Don't be shy, go ahead and contact me. Am bored🤭
        </div>
        <div class="i">🐒🐒🐒🐒🐒🐒🐒🐒🐒🐒🐒🐒🐒🐒</div>
      </div>
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
    margin-bottom: 20px;
    margin-left: 10px;
    font-size: 1.2em;
    .it {
      font-weight: 400;
      font-size: 1em;
    }
    .i {
      font-weight: 300;
    }
    .i:hover {
      cursor: default;
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
  #flbLogo {
    filter: invert(100%);
  }
}
</style>
