<template>
  <div class="BigSearchBar">
    <div class="searchBar">
      <input
        v-model="query"
        id="search"
        placeholder="🔍  🎶  🎙️ 🎸 🎧"
        class="inputElem"
      />
      <div class="iconLeft clearer">
        <img src="@/assets/x.svg" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: "",
    };
  },
};
</script>

<style lang="scss">
.BigSearchBar {
  padding-right: 10px;
  margin-bottom: 20px;
  input {
    width: 100%;
    border-radius: 0px;
  }
  .searchBar {
    input:focus {
      border-radius: 10px !important;
    }
  }
}
</style>
