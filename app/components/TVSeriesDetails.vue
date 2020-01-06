<template>
  <Page class="page">
    <ActionBar>
      <NavigationButton @tap="$navigateBack()" android.systemIcon="ic_menu_back" />
      <Label textWrap="true" :text="tvData.name" horizontalAlignment="center" />
    </ActionBar>

    <ScrollView>
      <StackLayout class="list-detail" v-if="tvData.name != null">
        <Image
          v-if="tvData.poster_path != null"
          :src="`https://image.tmdb.org/t/p/w500/${tvData.poster_path}`"
          class="img-thumbnail"
          stretch="aspectFit"
          height="400"
        />
        <Image
          v-else
          src="~/images/no_movie.png"
          class="img-thumbnail"
          stretch="aspectFit"
          height="400"
        />
        <Label class="hr-light m-t-15 m-b-15" />

        <GridLayout rows="*,*,*,*,*,*,*,*,*,*,*,*,*,*,*" class="movie-group" orientation="vertical">
          <StackLayout row="0" class="movie-group-item">
            <Label text="Title:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label class="p-l-15 p-b-10 m-r-10" :text="tvData.name"></Label>
          </StackLayout>

          <StackLayout row="1" class="movie-group-item">
            <Label text="Created By:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <RadListView
              :items="tvData.created_by"
              layout="grid"
              class="item-group"
              :gridSpanCount="3"
            >
              <ListViewLinearLayout v-tkListViewLayout scrollDirection="Vertical" />
              <v-template>
                <StackLayout class="list-group-item-content">
                  <Image
                    v-if="item.profile_path != null"
                    :src="`https://image.tmdb.org/t/p/w92/${item.profile_path}`"
                    class="m-x-auto m-y-auto img-circle"
                    style="height: 90; width: 90; border-radius: 100%;"
                    loadMode="async"
                  />
                  <Image
                    v-else
                    src="~/images/no_picture.png"
                    class="m-x-auto m-y-auto img-circle"
                    style="height: 90; width: 90; border-radius: 100%;"
                    loadMode="async"
                  />
                  <Label
                    class="list-group-item-text m-x-auto m-y-auto t-11 m-b-10"
                    :text="item.name"
                    horizontalAlignment="center"
                    textWrap="true"
                  ></Label>
                </StackLayout>
              </v-template>
            </RadListView>
          </StackLayout>

          <StackLayout row="2" class="movie-group-item">
            <Label text="Genres:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label class="p-l-15 p-b-10 m-r-10" textWrap="true" :text="tvData.genres"></Label>
          </StackLayout>

          <StackLayout row="3" class="movie-group-item">
            <Label text="Overview:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label :text="tvData.overview" textWrap="true" col="1" class="p-l-15 p-b-10 m-r-10" />
          </StackLayout>

          <StackLayout row="4" class="movie-group-item">
            <Label text="First Air Date:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label
              :text="new Date(tvData.first_air_date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'long' })"
              class="p-l-15 p-b-10 m-r-10"
            />
          </StackLayout>

          <StackLayout row="5" class="movie-group-item">
            <Label text="Last Air Date:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label
              :text="new Date(tvData.last_air_date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'long' })"
              class="p-l-15 p-b-10 m-r-10"
            />
          </StackLayout>

          <StackLayout row="6" class="movie-group-item">
            <Label text="Language:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label :text="tvData.original_language" class="p-l-15 p-b-10 m-r-10" />
          </StackLayout>

          <StackLayout row="7" class="movie-group-item">
            <Label
              text="Production Companies:"
              class="p-l-10 p-b-10 m-r-10 movie-group-item-heading"
            />
            <Label class="p-l-15 p-b-10 m-r-10" textWrap="true" :text="tvData.production_companies"></Label>
          </StackLayout>

          <StackLayout row="8" class="movie-group-item">
            <Label text="Episode Runtime:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label :text="tvData.episode_run_time" class="p-l-15 p-b-10 m-r-10" />
          </StackLayout>

          <StackLayout row="9" class="movie-group-item" if="tvData.tagline != null">
            <Label text="Number of Seasons:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label :text="tvData.number_of_seasons" class="p-l-15 p-b-10 m-r-10" />
          </StackLayout>

          <StackLayout row="10" class="movie-group-item" if="tvData.tagline != null">
            <Label
              text="Number of Episodes:"
              class="p-l-10 p-b-10 m-r-10 movie-group-item-heading"
            />
            <Label :text="tvData.number_of_episodes" class="p-l-15 p-b-10 m-r-10" />
          </StackLayout>

          <StackLayout row="11" class="movie-group-item">
            <Label text="Seasons:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <StackLayout>
              <RadListView
                :items="tvData.seasons"
                layout="grid"
                class="item-group"
                :gridSpanCount="1"
                @itemTap="onSeasonTap"
              >
                <ListViewLinearLayout v-tkListViewLayout scrollDirection="Vertical" />
                <v-template>
                  <StackLayout class="m-l-15 m-b-10">
                    <Label
                      style="color: blue;"
                      v-if="item.season_number != 0"
                      :text="`${item.name} (Episodes: ${item.episode_count})`"
                    />
                  </StackLayout>
                </v-template>
              </RadListView>
            </StackLayout>
          </StackLayout>

          <StackLayout row="12" class="movie-group-item">
            <Label text="Status:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label :text="tvData.status" class="p-l-15 p-b-10 m-r-10" />
          </StackLayout>
        </GridLayout>
      </StackLayout>

      <ActivityIndicator v-else width="40" height="40" busy />
    </ScrollView>
  </Page>
</template>

<script>
import axios from "axios";
import api from "../shared/movie/api-service";
import TVSeriesSeasonDetails from "./TVSeriesSeasonDetails";
import NoConnectivity from "./NoConnectivity";
const connectivity = require("connectivity");
export default {
  props: ["tv_id"],
  components: {
    TVSeriesSeasonDetails,
    NoConnectivity
  },
  data() {
    return {
      tvData: {}
    };
  },
  methods: {
    getTVSeriesDetails() {
      axios
        .get(`${api.url}/tv/${this.tv_id}?api_key=${api.key}`)
        .then(res => {
          this.tvData = {
            id: res.data.id,
            name: res.data.name,
            original_name: res.data.original_name,
            poster_path: res.data.poster_path,
            production_companies: this.convert(res.data.production_companies),
            genres: this.convert(res.data.genres),
            status: res.data.status,
            first_air_date: res.data.first_air_date,
            last_air_date: res.data.last_air_date,
            overview: res.data.overview,
            original_language: res.data.original_language,
            episode_run_time: this.getEpisodeRuntime(res.data.episode_run_time),
            created_by: res.data.created_by,
            seasons: res.data.seasons,
            next_episode_to_air: res.data.next_episode_to_air,
            last_episode_to_air: res.data.last_episode_to_air,
            networks: res.data.networks,
            number_of_episodes: res.data.number_of_episodes,
            number_of_seasons: res.data.number_of_seasons
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
    getEpisodeRuntime([...object]) {
      return object
        .map(item => {
          var hour = item / 60;
          var min = item % 60;
          var data = `${parseInt(hour)}hr ${min} mins`;
          return data;
        })
        .join(", ");
    },
    onSeasonTap(e) {
      this.$emit("select", e.item);
      this.$navigateTo(TVSeriesSeasonDetails, {
        props: {
          tv_id: this.tv_id,
          season_number: e.item.season_number,
          tv_name: this.tvData.name
        },
        transition: { name: "slideRight" }
      });
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
    this.getTVSeriesDetails();
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
