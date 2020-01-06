<template>
  <Page class="page">
    <ActionBar>
      <NavigationButton @tap="$navigateBack()" android.systemIcon="ic_menu_back" />
      <Label textWrap="true" :text="movieData.original_title" horizontalAlignment="center" />
    </ActionBar>

    <ScrollView>
      <StackLayout class="list-detail" v-if="movieData.title != null">
        <Image
          :src="`https://image.tmdb.org/t/p/original/${movieData.poster_path}`"
          class="img-thumbnail"
          stretch="aspectFit"
          height="400"
        />

        <Label class="hr-light m-t-15 m-b-15" />

        <GridLayout rows="*,*,*,*,*,*,*,*,*,*" class="movie-group" orientation="vertical">
          <StackLayout row="0" class="movie-group-item">
            <Label text="Title:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label class="p-l-15 p-b-10 m-r-10" :text="movieData.original_title"></Label>
          </StackLayout>

          <StackLayout row="1" class="movie-group-item">
            <Label text="Genres:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label class="p-l-15 p-b-10 m-r-10" textWrap="true" :text="movieData.genres"></Label>
          </StackLayout>

          <StackLayout row="2" class="movie-group-item">
            <Label text="Overview:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label
              :text="movieData.overview"
              textWrap="true"
              textAlignment="justify"
              col="1"
              class="p-l-15 p-b-10 m-r-10"
            />
          </StackLayout>

          <StackLayout row="3" class="movie-group-item">
            <Label text="Release Date:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label
              :text="new Date(movieData.release_date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'long' })"
              class="p-l-15 p-b-10 m-r-10"
            />
          </StackLayout>

          <StackLayout row="4" class="movie-group-item">
            <Label text="Language:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label :text="movieData.original_language" class="p-l-15 p-b-10 m-r-10" />
          </StackLayout>

          <StackLayout row="5" class="movie-group-item">
            <Label
              text="Production Countries:"
              class="p-l-10 p-b-10 m-r-10 movie-group-item-heading"
            />
            <Label
              class="p-l-15 p-b-10 m-r-10"
              textWrap="true"
              :text="movieData.production_countries"
            ></Label>
          </StackLayout>

          <StackLayout row="6" class="movie-group-item">
            <Label
              text="Production Companies:"
              class="p-l-10 p-b-10 m-r-10 movie-group-item-heading"
            />
            <Label
              class="p-l-15 p-b-10 m-r-10"
              textWrap="true"
              :text="movieData.production_companies"
            ></Label>
          </StackLayout>

          <StackLayout row="7" class="movie-group-item">
            <Label text="Runtime:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label :text="movieData.runtime" class="p-l-15 p-b-10 m-r-10" />
          </StackLayout>

          <StackLayout row="8" class="movie-group-item" if="movieData.tagline != null">
            <Label text="Tagline:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label :text="movieData.tagline" class="p-l-15 p-b-10 m-r-10" />
          </StackLayout>

          <StackLayout row="9" class="movie-group-item">
            <Label text="Status:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label :text="movieData.status" class="p-l-15 p-b-10 m-r-10" />
          </StackLayout>
        </GridLayout>
      </StackLayout>

      <ActivityIndicator width="40" height="40" busy v-else />
    </ScrollView>
  </Page>
</template>

<script>
import axios from "axios";
import api from "../shared/movie/api-service";
import NoConnectivity from "./NoConnectivity";
const connectivity = require("connectivity");
export default {
  props: ["movie_id"],
  data() {
    return {
      movieData: {}
    };
  },
  components: {
    NoConnectivity
  },
  methods: {
    getMovieDetail() {
      axios
        .get(`${api.url}/movie/${this.movie_id}?api_key=${api.key}`)
        .then(res => {
          this.movieData = {
            id: res.data.id,
            title: res.data.title,
            original_title: res.data.original_title,
            poster_path: res.data.poster_path,
            production_companies: this.convert(res.data.production_companies),
            genres: this.convert(res.data.genres),
            status: res.data.status,
            release_date: res.data.release_date,
            production_countries: this.convert(res.data.production_countries),
            overview: res.data.overview,
            original_language: res.data.original_language,
            runtime: this.convertToHourMin(res.data.runtime),
            tagline: res.data.tagline
          };
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    convert([...object]) {
      return object.map(item => item.name).join(", ");
    },
    convertToHourMin(time) {
      var hour = time / 60;
      var min = time % 60;
      return `${parseInt(hour)}hr ${min} mins`;
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
  created() {
    this.getMovieDetail();
    this.monitorNetworkStart();
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
