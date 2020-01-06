import Vue from "nativescript-vue";

import RadListView from "nativescript-ui-listview/vue";

Vue.registerElement("DropDown", () => require("nativescript-drop-down/drop-down").DropDown);

import BottomNavigationBar from "nativescript-bottom-navigation/vue";

import Pager from 'nativescript-accordion/vue';

Vue.use(Pager);


import App from "./components/App";

Vue.use(BottomNavigationBar);

Vue.use(RadListView);

Vue.config.silent = (TNS_ENV === "production");

new Vue({
    render: h => h("frame", [h(App)])
}).$start();