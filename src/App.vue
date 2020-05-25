<template>
  <div id="app">
    <navbar></navbar>
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'


export default {
  name: 'App',
  components: {
    Navbar,
  },

}
</script>

<style lang="scss">
  $progress-text-color: rgba(0, 0, 0, 1);

  $navbar-item-img-max-height: 2.5rem;
  $navbar-height: 5rem;

  $rate-color: rgba(75, 75, 75, 0.53);

  @import "~bulma/sass/utilities/_all";
  @import "~bulma";
  @import "~buefy/src/scss/buefy";

  html, body {
    background: url("http://laczapeter95.web.elte.hu/kepek/bg3.jpg") no-repeat top right;
    background-size: cover;
  }

</style>
