<template>
  <StackLayout>
    <StackLayout class="dropdown-parent">
      <Label text="Sort By:" class="font-weight-bold"></Label>
      <DropDown
        ref="dropDownList"
        :items="tvSeriesCategories"
        @selectedIndexChanged="getAllTvSeries"
        selectedIndex="0"
        class="dropdown"
      ></DropDown>
    </StackLayout>

    <RadListView
      v-if="tvseries.length"
      ref="listview"
      for="item in tvseries"
      layout="grid"
      class="list-group"
      height="100%"
      :gridSpanCount="2"
      pullToRefresh="true"
      @pullToRefreshInitiated="pullToRefreshTVSeries"
      @itemTap="getTVDetails"
      loadOnDemandBufferSize="4"
      loadOnDemandMode="Auto"
      @loadMoreDataRequested="loadMoreTVSeries"
    >
      <ListViewLinearLayout v-tkListViewLayout scrollDirection="Vertical" />
      <v-template>
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
            height="180"
            loadMode="async"
          />
          <Label class="list-group-item-text item-title" :text="item.name" textWrap="true"></Label>
          <Label class="hr-light m-t-5 m-b-5" />
        </StackLayout>
      </v-template>
    </RadListView>

    <ActivityIndicator v-else width="30" height="30" busy />

    <Label
      v-if="no_record == true"
      text="No more data"
      textWrap="true"
      horizontalAlignment="middle"
      class="text-danger t-30 font-weight-bold m-t-30"
    ></Label>
  </StackLayout>
</template>

<script>
import axios from "axios";
import api from "../shared/movie/api-service";
import TVSeriesDetails from "./TVSeriesDetails";
import NoConnectivity from "./NoConnectivity";
const connectivity = require("connectivity");
export default {
  data() {
    return {
      tvseries: [],
      isLoading: true,
      page: 1,
      tvSeriesCategories: [
        {
          value: 0,
          name: "Popular",
          toString: () => {
            return "Popular";
          }
        },
        {
          value: 1,
          name: "Top Rated",
          toString: () => {
            return "Top Rated";
          }
        }
      ],
      no_record: false
    };
  },
  components: {
    NoConnectivity
  },
  mounted() {
    this.getAllTvSeries();
    this.monitorNetworkStart();
  },
  methods: {
    getAllTvSeries() {
      var vm = this;
      let selectedIndex = this.$refs.dropDownList.nativeView.selectedIndex;
      console.log(`Selected Index: ${selectedIndex}`);
      if (selectedIndex == 0) {
        axios
          .get(`${api.url}/tv/popular?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              this.tvseries = res.data.results;
              console.log(
                `Successfully fetched ${res.data.results.length} tvseries.`
              );
            }
          });
      } else if (selectedIndex == 1) {
        axios
          .get(`${api.url}/tv/top_rated?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              vm.tvseries = res.data.results;
              console.log(
                `Successfully fetched ${res.data.results.length} top rated tvseries.`
              );
            }
          });
      }
    },
    getTVDetails(e) {
      this.$emit("select", e.item);
      this.$navigateTo(TVSeriesDetails, {
        props: { tv_id: e.item.id },
        transition: { name: "slideRight" }
      });
      console.log(`Selected TV ID: ${e.item.id}, Title: ${e.item.name}`);
    },
    pullToRefreshTVSeries({ object }) {
      let selectedIndex = this.$refs.dropDownList.nativeView.selectedIndex;
      if (selectedIndex == 0) {
        console.log(`Refreshing all tv series...`);
        axios
          .get(`${api.url}/tv/popular?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              this.$nextTick(() => {
                this.tvseries = res.data.results;
              });
              console.log(`All tv series has finished refreshing.`);
              object.notifyPullToRefreshFinished();
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      } else if (selectedIndex == 1) {
        console.log(`Refreshing all top rated tvseries...`);
        axios
          .get(`${api.url}/tv/top_rated?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              this.$nextTick(() => {
                this.tvseries = res.data.results;
              });
              console.log(`Top rated tvseries has finished refreshing.`);
              object.notifyPullToRefreshFinished();
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    },
    loadMoreTVSeries({ object }) {
      this.page += 1;
      let selectedIndex = this.$refs.dropDownList.nativeView.selectedIndex;
      if (selectedIndex == 0) {
        console.log(`Loading all tv series for page [${this.page}] .....`);
        axios
          .get(`${api.url}/tv/popular?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              res.data.results.forEach((value, i) => {
                this.$nextTick(() => {
                  this.tvseries.push({
                    id: value.id,
                    original_title: value.original_title,
                    title: value.title,
                    first_air_date: value.first_air_date,
                    poster_path: value.poster_path
                  });
                });
              });
              console.log(
                `All tv series has finished loading for page [${this.page}].`
              );
              object.notifyLoadOnDemandFinished(false);
            } else {
              this.no_record = true;
              object.notifyLoadOnDemandFinished(true);
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      } else if (selectedIndex == 1) {
        console.log(`Loading top rated tvseries for page [${this.page}] .....`);
        axios
          .get(`${api.url}/tv/top_rated?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              res.data.results.forEach((value, i) => {
                this.$nextTick(() => {
                  this.tvseries.push({
                    id: value.id,
                    original_title: value.original_title,
                    title: value.title,
                    first_air_date: value.first_air_date,
                    poster_path: value.poster_path
                  });
                });
              });
              console.log(
                `Top rated tv series has finished loading for page [${this.page}].`
              );
              object.notifyLoadOnDemandFinished(false);
            } else {
              this.no_record = true;
              object.notifyLoadOnDemandFinished(true);
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    },
    checkNetwork() {
      const connectionType = connectivity.getConnectionType();
      switch (connectionType) {
        case connectivity.connectionType.none:
          alert("No network connection available!");
          break;
        case connectivity.connectionType.wifi:
          alert("You are on wifi!");
          break;
        case connectivity.connectionType.mobile:
          alert("You are on a mobile data network!");
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
  computed: {
    rows: function() {
      const rows = [];
      for (let i = 0; i < this.tvseries.length / 2; i++) {
        rows.push("*");
      }
      rows.join(",");
    },
  },
  watch: {
    monitorNetworkStart() {
      this.monitorNetworkStart();
    },
    checkNetworkState() {
      this.checkNetworkState();
    }
  },
};
</script>