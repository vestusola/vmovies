<template>
  <StackLayout>
    <SearchBar
      hint="Search..."
      v-model="search"
      @textChange="getSearchResults"
      @clear="onClear"
      @submit="getSearchResults"
    />

    <RadListView
      v-if="searchResults.length"
      ref="listview"
      :items="searchResults"
      layout="grid"
      class="list-group"
      rows="*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*"
      height="100%"
      :gridSpanCount="2"
      loadOnDemandBufferSize="4"
      loadOnDemandMode="Auto"
      @loadMoreDataRequested="loadMoreResults"
      @itemTap="getDetails"
    >
      <ListViewLinearLayout v-tkListViewLayout scrollDirection="Vertical" />
      <v-template if="item.media_type == 'movie'">
        <StackLayout class="list-group-item-content">
          <Image
            v-if="item.poster_path != null"
            :src="`https://image.tmdb.org/t/p/w185/${item.poster_path}`"
            stretch="aspectFill"
            class="img-thumbnail"
            height="180"
            loadMode="async"
          />
          <Image
            v-else
            src="~/images/no_movie.png"
            stretch="aspectFill"
            class="img-thumbnail"
            height="180"
            loadMode="async"
          />
          <Label class="list-group-item-text item-title" :text="item.title" textWrap="true"></Label>
          <Label class="hr-light m-t-5 m-b-5" />
        </StackLayout>
      </v-template>

      <v-template if="item.media_type == 'tv'">
        <StackLayout class="list-group-item-content">
          <Image
            v-if="item.poster_path != null"
            :src="`https://image.tmdb.org/t/p/w185/${item.poster_path}`"
            stretch="aspectFill"
            class="img-thumbnail"
            height="180"
            loadMode="async"
          />
          <Image
            v-else
            src="~/images/no_movie.png"
            stretch="aspectFill"
            class="img-thumbnail"
            height="180"
            loadMode="async"
          />
          <Label class="list-group-item-text item-title" :text="item.name" textWrap="true"></Label>
          <Label class="hr-light m-t-5 m-b-5" />
        </StackLayout>
      </v-template>

      <v-template if="item.media_type == 'person'">
        <StackLayout class="list-group-item-content">
          <Image
            v-if="item.profile_path != null"
            :src="`https://image.tmdb.org/t/p/w185/${item.profile_path}`"
            stretch="aspectFill"
            class="img-thumbnail"
            height="180"
            loadMode="async"
          />
          <Image
            v-else
            src="~/images/no_picture.png"
            stretch="aspectFill"
            class="img-thumbnail"
            height="180"
            loadMode="async"
          />
          <Label class="list-group-item-text item-title" :text="item.name" textWrap="true"></Label>
          <Label class="hr-light m-t-5 m-b-5" />
        </StackLayout>
      </v-template>
    </RadListView>

    <Label
      v-if="no_record == true"
      text="No more data"
      textWrap="true"
      class="text-danger text-center t-20 font-weight-bold m-t-30"
    ></Label>

    <Label
      v-if="not_found == true"
      text="Search not found!"
      textWrap="true"
      class="text-danger text-center t-20 font-weight-bold m-t-30"
    ></Label>
  </StackLayout>
</template>
<script>
import axios from "axios";
import api from "../shared/movie/api-service";
import { isIOS, isAndroid } from "platform";
import * as utils from "utils/utils";
import TVSeriesDetails from "./TVSeriesDetails";
import MovieDetails from "./MovieDetails";
import Person from "./Person";
import NoConnectivity from "./NoConnectivity";
const connectivity = require("connectivity");
export default {
  data() {
    return {
      search: "",
      searchResults: [],
      page: 1,
      no_record: false,
      not_found: false
    };
  },
  components: {
    NoConnectivity
  },
  methods: {
    onClear() {
      this.search = "";
      this.searchResults = [];
      this.no_record = false;
      this.not_found = false;
    },
    getSearchResults() {
      this.searchResults = [];
      this.no_record = false;
      this.not_found = false;
      if (this.search != "" || this.search.length > 0 || this.search != null) {
        var query = this.search;
        axios
          .get(
            `${api.url}/search/multi?api_key=${api.key}&page=${this.page}&query=${query}&include_adult=true`
          )
          .then(res => {
            if (res.data.results.length > 0) {
              this.searchResults = res.data.results;
              this.not_found = false;
              this.no_record = false;
            } else {
              this.searchResults = [];
              this.not_found = true;
              this.no_record = false;
            }
          })
          .catch(err => {
            console.log(err.message);
            this.searchResults = [];
            this.not_found = true;
            this.no_record = false;
          });
      } else {
        this.search = '';
      }
    },
    getDetails(e) {
      if (e.item.media_type == "tv") {
        this.$emit("select", e.item);
        this.$navigateTo(TVSeriesDetails, {
          props: { tv_id: e.item.id },
          transition: { name: "slideRight" }
        });
      } else if (e.item.media_type == "movie") {
        this.$emit("select", e.item);
        this.$navigateTo(MovieDetails, {
          props: { movie_id: e.item.id },
          transition: { name: "slideRight" }
        });
      } else if (e.item.media_type == "person") {
        this.$emit("select", e.item);
        this.$navigateTo(Person, {
          props: { person: e.item },
          transition: { name: "slideRight" }
        });
      }
    },
    loadMoreResults({ object }) {
      this.page += 1;
      this.no_record = false;
      this.not_found = false;
      if (this.search != "" || this.search.length > 0 || this.search != null) {
        var query = this.search;
        axios
          .get(
            `${api.url}/search/multi?api_key=${api.key}&page=${this.page}&query=${query}&include_adult=true`
          )
          .then(res => {
            if (res.data.results.length > 0) {
              this.$nextTick(() => {
                this.searchResults = res.data.results;
              });
              object.notifyLoadOnDemandFinished(false);
              this.no_record = false;
              this.not_found = false;
            } else {
              this.no_record = true;
              this.not_found = false;
              object.notifyLoadOnDemandFinished(true);
            }
          })
          .catch(err => {
            console.log(err.message);
            this.not_found = false;
            this.no_record = true;
          });
      }
    },
    checkNetwork() {
      const connectionType = connectivity.getConnectionType();
      switch (connectionType) {
        case connectivity.connectionType.none:
          this.$navigateTo(NoConnectivity, {
            transition: "SlideDown"
          });
          break;
        case connectivity.connectionType.wifi:
          console.log("You are on wifi!");
          break;
        case connectivity.connectionType.mobile:
          console.log("You are on a mobile data network!");
          break;
      }
    },
    monitorNetworkStart() {
      console.log("Monitoring network connection changes.");
      connectivity.startMonitoring(newConnectionType => {
        switch (newConnectionType) {
          case connectivity.connectionType.none:
            this.$navigateTo(NoConnectivity, {
              transition: "SlideDown"
            });
            console.log("No network connection available!");
            break;
          case connectivity.connectionType.wifi:
            console.log("You are now on wifi!");
            break;
          case connectivity.connectionType.mobile:
            console.log("You are now on a mobile data network!");
            break;
        }
      });
    },
    checkNetworkState() {
      if (navigator.onLine) {
        console.log('Network alive');
      } else {
        this.$navigateTo(NoConnectivity, {
          transition: "SlideDown"
        });
      }
    }
  },
  watch: {
    monitorNetworkStart() {
      this.monitorNetworkStart();
    },
    checkNetworkState() {
      this.checkNetworkState();
    }
  },
  created() {
    this.monitorNetworkStart();
  }
};
</script>