<template>
  <div v-if="currentTab == 'discoverTab'" class="tab discoverTab">
    <Deezer />
  </div>
</template>

<script>
import Deezer from "@/components/Deezer.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters(["currentTab"]),
  },
  components: {
    Deezer,
  },
};
</script>

<style></style>
