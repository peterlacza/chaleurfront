import '@babel/polyfill'
import 'mutationobserver-shim'

import Vue from 'vue'
import Buefy from 'buefy'
import { store } from "./store/index";
import router from "./router";
import 'buefy/dist/buefy.css'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueResource from "vue-resource";

library.add(fas);
Vue.component('vue-fontawesome', FontAwesomeIcon);


Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: "fas"
});
Vue.use(VueResource);

import App from './App.vue'

Vue.config.productionTip = false



Vue.http.interceptors.push(function(request) {
  // modify headers
  let user = JSON.parse(localStorage.getItem('user'));
  request.headers.set({ 'Authorization': 'Basic ' + user.authdata });

});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
