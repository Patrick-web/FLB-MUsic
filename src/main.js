import Vue from "vue";
import App from "./App.vue";
import "./plugins/vuesax.js";
import store from "./store";
import VueParticles from "vue-particles";
import LyricScroll from "vue-lyric-scroll";
Vue.use(VueParticles);
Vue.use(LyricScroll);
Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
