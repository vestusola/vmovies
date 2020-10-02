<template>
  <Page class="page">
    <ActionBar>
      <Label class="actionbar-title" text="VMovies" horizontalAlignment="center" />
    </ActionBar>

    <BottomNavigation selectedIndex="0">
      <TabStrip highlightColor="blue">
        <TabStripItem>
          <Image src="res://ic_movie_black_24" class="t-30"></Image>
          <Label text="Movies" class="t-30"></Label>
        </TabStripItem>
        <TabStripItem>
          <Image src="res://ic_tv_black_24" class="t-30"></Image>
          <Label text="TV Series" class="t-30"></Label>
        </TabStripItem>
        <TabStripItem>
          <Image src="res://ic_search_black_24" class="t-30"></Image>
          <Label text="Search" class="t-30"></Label>
        </TabStripItem>
        <TabStripItem>
          <Image src="res://ic_info_black_24" class="t-30"></Image>
          <Label text="About" class="t-30"></Label>
        </TabStripItem>
      </TabStrip>

      <TabContentItem>
        <MovieList />
      </TabContentItem>
      <TabContentItem>
        <TVSeriesList />
      </TabContentItem>
      <TabContentItem>
        <Search />
      </TabContentItem>
      <TabContentItem>
        <About />
      </TabContentItem>
    </BottomNavigation>
  </Page>
</template>

<script>
import axios from "axios";
import MovieList from "./MovieList";
import TVSeriesList from "./TVSeriesList";
import Search from "./Search";
import About from "./About";
import api from "../shared/movie/api-service";
import NoConnectivity from "./NoConnectivity";
const connectivity = require("connectivity");
export default {
  components: {
    MovieList,
    TVSeriesList,
    Search,
    NoConnectivity,
    About
  },
  data() {
    return {
      network_state: 0
    };
  },
  methods: {
    monitorNetworkStart() {
      console.log("Monitoring network connection changes on App.");
      connectivity.startMonitoring(newConnectionType => {
        switch (newConnectionType) {
          case connectivity.connectionType.none:
            this.network_state = 0;
            break;
          case connectivity.connectionType.wifi:
            console.log("You are now on wifi!");
            this.network_state = 1;
            break;
          case connectivity.connectionType.mobile:
            this.network_state = 2;
            break;
          case connectivity.connectionType.ethernet:
            this.network_state = 3;
            break;
        }
      });
    }
  },
  watch: {
    network_state() {
      this.monitorNetworkStart();
    }
  }
};
</script>

<style lang="scss">
// Start custom common variables
@import "../app-variables";

ActionBar {
  background-color: #fff;
  border-bottom-color: #333c4e;
  border-bottom-style: solid;
  border-bottom-width: 1;
  color: lightseagreen;
}
TabStrip {
  border-top-color: #000;
  border-top-style: solid;
  border-top-width: 1;
}
TabStripItem {
  background-color: #fff;
  color: #000;
}
.bottom-nav-text :active {
  color: lightskyblue;
}
// Custom styles
.list-group {
  margin-top: 5px;
  .list-group-item-content {
    padding: 5 10 5 10;
    background-color: $background-light;
  }

  .list-group-item-text {
    margin: 2 2;
  }

  label {
    font-size: 12px;
  }
}

.item-title {
  color: black;
}
.item-calendar {
  color: $accent-light;
}
.fa-brands {
  font-family: "FontAwesome5Free", "fa-brands-400";
}
.far {
  font-family: "FontAwesome5Free", "fa-regular-400";
  font-weight: 400;
}
.fas {
  font-family: "FontAwesome5Free", "fa-solid-900";
  font-weight: 900;
}
.actionbar-title {
  color: lightskyblue;
  font-weight: 700;
  font-size: 16px;
}
.list-detail {
  margin: 10px;
}
.movie-group {
  margin: 2px;
}
.movie-group-item {
  border-bottom-width: 1px;
  border-color: #333c4e;
}
.movie-group-item-heading {
  font-size: 15px;
  color: $blue-light;
}
.item-group {
  margin-top: 5px;
  margin-right: 5px;
  margin-left: 5px;
}
.dropdown {
  font-size: 14;
}
.dropdown-parent {
  padding: 10 10;
  border-radius: 2%;
  border-bottom-style: solid;
  border-bottom-width: 1;
  border-bottom-color: #000;
}
.item-dropdown-list {
  margin-left: 20px;
  margin-right: 5px;
}
.t-54 {
  font-size: 54px;
}
</style>