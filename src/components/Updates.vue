<template>
  <div class="Updates">
    <h2>Update Tweets</h2>
    <p v-if="!isOnline" style="padding:10px">
      Enable Internet Connection To Fetch Tweets on Various Updates and My
      thoughts 🥸
    </p>
    <div v-if="updatesTweets.length == 0 && isOnline" class="loadingArea">
      <div class="loadingIndicator"></div>
    </div>
    <div v-for="tweet in updatesTweets" :key="tweet.link" class="tweetCard">
      <a
        class="tool"
        data-tip="open in twitter"
        :href="tweet.link"
        target="_blank"
      >
        <img src="@/assets/twitterLogo.svg" alt="" />
      </a>
      <p class="tweetText">{{ tweet.text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      updatesTweets: [],
      isOnline: false,
    };
  },
  methods: {
    fetchTweets() {
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        "Bearer <insert bearer token from twitter>"
      );
      myHeaders.append(
        "Cookie",
        'personalization_id="v1_cirnpNbZCUGUEGOPlxs4yg=="; guest_id=v1%3A160899397194669360'
      );

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      if (navigator.onLine) {
        this.isOnline = true;
        fetch(
          "https://api.twitter.com/2/users/1342899124518137858/tweets",
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            const tweets = JSON.parse(result).data.filter((tweet) =>
              tweet.text.includes("#FLBUpdates")
            );
            console.log(tweets);
            tweets.forEach((tweet) => {
              tweet["link"] = "https://twitter.com/MediaFlb/status/" + tweet.id;
              tweet.text = tweet.text
                .replace(/#\w+\s*/g, "")
                .replace(/@\w+\s*/g, "")
                .replace(/https:\/\/t.co.*/, "");
              console.log(tweet);
              this.updatesTweets.push(tweet);
            });
          })
          .catch((error) => this.fetchTweets());
      }
    },
  },
  mounted() {
    if (navigator.onLine) {
      this.fetchTweets();
    } else {
      window.addEventListener("online", () => {
        this.fetchTweets();
      });
    }
  },
};
</script>

<style lang="scss">
.showUpdates {
  .Updates {
    max-height: 82vh;
    width: 350px;
  }
}
.Updates {
  position: absolute;
  max-height: 82vh;
  width: 0px;
  height: 82vh;
  top: 3%;
  left: 40px;
  background: rgb(24, 24, 24);
  z-index: 30;
  padding-top: 5px;
  border-radius: 20px;
  box-shadow: 0px 0px 50px black;
  overflow: hidden;
  overflow-y: scroll;
  h2 {
    text-align: center;
  }
  .tweetCard {
    width: 100%;
    padding: 10px;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.192);
    .tweetText {
      font-size: 0.9em;
      font-family: roboto-light;
    }
    img {
      width: 50%;
    }
    a {
      position: absolute;
      bottom: 5px;
      right: 5px;
      background: black;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    a:hover {
      transform: scale(1.05);
      background: white;
    }
    a::after {
      font-size: 0.8em;
      bottom: 10%;
      transform: translateX(150%);
      font-family: roboto-thin;
    }
  }
}
</style>
