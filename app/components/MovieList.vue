<template>
  <StackLayout>
    <StackLayout class="dropdown-parent">
      <Label text="Sort By:" class="font-weight-bold"></Label>
      <DropDown
        ref="dropDownList"
        :items="movieCategories"
        @selectedIndexChanged="getAllMovies"
        selectedIndex="0"
        class="dropdown"
      ></DropDown>
    </StackLayout>

    <RadListView
      v-if="movies.length"
      ref="listview"
      for="item in movies"
      layout="grid"
      class="list-group"
      height="100%"
      :gridSpanCount="2"
      pullToRefresh="true"
      @itemTap="getMovieDetails"
      @pullToRefreshInitiated="pullToRefreshMovies"
      loadOnDemandBufferSize="4"
      loadOnDemandMode="Auto"
      @loadMoreDataRequested="loadMoreMovies"
    >
      <ListViewLinearLayout v-tkListViewLayout scrollDirection="Vertical" />
      <v-template>
        <StackLayout class="list-group-item-content">
          <Image
            v-if="item.poster_path != null"
            :src="`https://image.tmdb.org/t/p/w185/${item.poster_path}`"
            stretch="aspectFill"
            height="180"
            loadMode="async"
          />
          <Image
            v-else
            src="~/images/no_mvoie.png"
            stretch="aspectFill"
            height="180"
            loadMode="async"
          />
          <Label class="list-group-item-text item-title" :text="item.title" textWrap="true"></Label>
          <Label
            class="list-group-item-text item-calendar"
            :text="new Date(item.release_date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'long' })"
            textWrap="true"
          ></Label>
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
import MovieDetails from "./MovieDetails";
const connectivity = require("connectivity");
import NoConnectivity from "./NoConnectivity";
export default {
  data() {
    return {
      movies: [],
      isLoading: true,
      page: 1,
      movieCategories: [
        {
          value: 0,
          name: "All",
          toString: () => {
            return "All";
          }
        },
        {
          value: 1,
          name: "Top Rated",
          toString: () => {
            return "Top Rated";
          }
        },
        {
          value: 2,
          name: "Upcoming",
          toString: () => {
            return "Upcoming";
          }
        }
      ],
      no_record: false
    };
  },
  components: {
    NoConnectivity
  },
  created() {
    this.monitorNetworkStart();
  },
  mounted() {
    this.getAllMovies();
  },
  methods: {
    onItemTap(e) {
      this.$emit("select", e.item);
      this.$navigateTo(MovieDetails, { props: { movie: e.item } });
    },
    getAllMovies() {
      var vm = this;
      let selectedIndex = this.$refs.dropDownList.nativeView.selectedIndex;
      console.log(`Selected Index: ${selectedIndex}`);
      if (selectedIndex == 0) {
        axios
          .get(`${api.url}/discover/movie?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              this.movies = res.data.results;
              console.log(
                `Successfully fetched ${res.data.results.length} movies.`
              );
            }
          });
      } else if (selectedIndex == 1) {
        axios
          .get(
            `${api.url}/movie/top_rated?api_key=${api.key}&page=${this.page}`
          )
          .then(res => {
            if (res.data.results.length) {
              vm.movies = res.data.results;
              console.log(
                `Successfully fetched ${res.data.results.length} top rated movies.`
              );
            }
          });
      } else if (selectedIndex == 2) {
        axios
          .get(`${api.url}/movie/upcoming?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              vm.movies = res.data.results;
              console.log(
                `Successfully fetched ${res.data.results.length} upcoming movies.`
              );
            }
          });
      }
    },
    getMovieDetails(e) {
      this.$emit("select", e.item);
      this.$navigateTo(MovieDetails, {
        props: { movie_id: e.item.id },
        transition: { name: "slideRight" }
      });
      console.log(`Selected Movie ID: ${e.item.id}; Title: ${e.item.title}`);
    },
    pullToRefreshMovies({ object }) {
      let selectedIndex = this.$refs.dropDownList.nativeView.selectedIndex;
      if (selectedIndex == 0) {
        console.log(`Refreshing all movies...`);
        axios
          .get(`${api.url}/discover/movie?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              this.$nextTick(() => {
                this.movies = res.data.results;
              });
              console.log(`All movies has finished refreshing.`);
              object.notifyPullToRefreshFinished();
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      } else if (selectedIndex == 1) {
        console.log(`Refreshing all top rated movies...`);
        axios
          .get(
            `${api.url}/movie/top_rated?api_key=${api.key}&page=${this.page}`
          )
          .then(res => {
            if (res.data.results.length) {
              this.$nextTick(() => {
                this.movies = res.data.results;
              });
              console.log(`Top rated movies has finished refreshing.`);
              object.notifyPullToRefreshFinished();
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      } else if (selectedIndex == 2) {
        console.log(`Refreshing all upcoming movies...`);
        axios
          .get(`${api.url}/movie/upcoming?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              this.$nextTick(() => {
                this.movies = res.data.results;
              });
              console.log(`Upcoming movies has finished refreshing.`);
              object.notifyPullToRefreshFinished();
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    },
    loadMoreMovies({ object }) {
      this.page += 1;
      let selectedIndex = this.$refs.dropDownList.nativeView.selectedIndex;
      if (selectedIndex == 0) {
        console.log(`Loading all movies for page [${this.page}] .....`);
        axios
          .get(`${api.url}/discover/movie?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              res.data.results.forEach((value, i) => {
                this.$nextTick(() => {
                  this.movies.push({
                    id: value.id,
                    original_title: value.original_title,
                    title: value.title,
                    release_date: value.release_date,
                    poster_path: value.poster_path
                  });
                });
              });
              console.log(
                `All movies has finished loading for page [${this.page}].`
              );
              object.notifyLoadOnDemandFinished(false);
            } else {
              object.notifyLoadOnDemandFinished(true);
              this.no_record = true;
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      } else if (selectedIndex == 1) {
        console.log(`Loading top rated movies for page [${this.page}] .....`);
        axios
          .get(
            `${api.url}/movie/top_rated?api_key=${api.key}&page=${this.page}`
          )
          .then(res => {
            if (res.data.results.length) {
              res.data.results.forEach((value, i) => {
                this.$nextTick(() => {
                  this.movies.push({
                    id: value.id,
                    original_title: value.original_title,
                    title: value.title,
                    release_date: value.release_date,
                    poster_path: value.poster_path
                  });
                });
              });
              console.log(
                `Top rated movies has finished loading for page [${this.page}].`
              );
              object.notifyLoadOnDemandFinished(false);
            } else {
              object.notifyLoadOnDemandFinished(true);
              this.no_record = true;
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      } else if (selectedIndex == 2) {
        console.log(`Loading upcoming movies for page [${this.page}] .....`);
        axios
          .get(`${api.url}/movie/upcoming?api_key=${api.key}&page=${this.page}`)
          .then(res => {
            if (res.data.results.length) {
              res.data.results.forEach((value, i) => {
                this.$nextTick(() => {
                  this.movies.push({
                    id: value.id,
                    original_title: value.original_title,
                    title: value.title,
                    release_date: value.release_date,
                    poster_path: value.poster_path
                  });
                });
              });
              console.log(
                `Upcoming movies has finished loading for page [${this.page}].`
              );
              object.notifyLoadOnDemandFinished(false);
            } else {
              object.notifyLoadOnDemandFinished(true);
              this.no_record = true;
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
      for (let i = 0; i < this.movies.length / 2; i++) {
        rows.push("*");
      }
      rows.join(",");
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
};
</script>