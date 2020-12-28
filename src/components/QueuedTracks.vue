<template>
  <div class="QueuedTracks animated faster disable__options">
    <h2 style="text-align:center;margin-bottom:5px">Queue</h2>
    <transition-group
      enter-active-class="animated slideInLeft faster"
      leave-active-class="animated slideOutRight faster"
    >
      <TrackCard
        :cover="track.cover"
        :album="track.album"
        :title="track.title"
        :artist="track.artist"
        :length="track.formatedLength"
        :path="track.path"
        :trackIndex="index"
        v-for="(track, index) in queuedTracks"
        :key="track.path"
      />
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TrackCard from "@/components/TrackCard.vue";

export default {
  components: {
    TrackCard,
  },
  methods: {
    moveDown(e) {
      console.log(e);
    },
    move(e) {
      console.log(e);
    },
  },
  computed: {
    ...mapGetters(["queuedTracks"]),
  },
};
</script>

<style lang="scss">
.showQueue {
  .QueuedTracks {
    display: block;
  }
}
.QueuedTracks {
  position: absolute;
  display: none;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.445);
  padding-top: 40px;
  top: 0px;
  left: 0px;
  z-index: 10;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  overflow-y: scroll;
  .TrackCard {
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.062);
    display: grid;
    grid-template-columns: 1fr 5fr;
    .cover {
      width: 40px;
      transform: scale(0.9);
      transition: 0.2s ease;
      justify-self: center;
      align-self: center;
    }
    p {
      font-size: 1em;
    }
    .grid2 {
      display: none;
    }
    .unQueueIcon {
      display: block;
    }
    .delIcon {
      display: none !important;
    }
  }
  .TrackCard:hover {
    background: #ffffff1c;
    .info {
      padding-left: 5px;
    }
    .cover {
      transform: scale(0.8);
      box-shadow: -4px 4px 15px rgba(0, 0, 0, 0.712);
    }
    .unQueueIcon {
      transform: translateX(0%) translateY(-50%) scale(0.8);
    }
    .unQueueIcon:hover {
      transform: translateX(0%) translateY(-50%) scale(1) !important;
    }
  }
  .playingtrack {
    z-index: 1;
    margin-top: 0px;
    box-shadow: none;
    .info {
      padding-left: 5px !important;
    }
    .cover {
      transform: scale(0.8);
      box-shadow: none;
      box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.123);
    }
    .options {
      display: none;
    }
    .unQueueIcon {
      display: none;
    }
  }
}
</style>
