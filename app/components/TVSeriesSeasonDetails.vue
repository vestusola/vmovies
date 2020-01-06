<template>
  <Page class="page">
    <ActionBar>
      <NavigationButton @tap="$navigateBack()" android.systemIcon="ic_menu_back" />
      <Label textWrap="true" v-if="tvSeasonData.name !=''" :text="`${tv_name} (${tvSeasonData.name})`" horizontalAlignment="center" />
    </ActionBar>

    <ScrollView>
      <StackLayout class="list-detail" v-if="tvSeasonData.name != null">
        <Image
          v-if="tvSeasonData.profile_path"
          :src="`https://image.tmdb.org/t/p/w342/${tvSeasonData.poster_path}`"
          class="img-thumbnail"
          stretch="aspectFit"
          height="342"
        />
        <Image
          v-else
          src="~/images/no_movie.png"
          class="img-thumbnail"
          stretch="aspectFit"
          height="342"
        />
        <Label class="hr-light m-t-15 m-b-15" />

        <GridLayout rows="*,*,*,*,*,*,*,*,*,*,*,*,*,*,*" class="movie-group" orientation="vertical">
          <StackLayout row="0" class="movie-group-item">
            <Label text="Title:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label class="p-l-15 p-b-10 m-r-10" :text="tvSeasonData.name"></Label>
          </StackLayout>

          <StackLayout row="1" class="movie-group-item">
            <Label text="Overview:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label :text="tvSeasonData.overview" textWrap="true" col="1" class="p-l-15 p-b-10 m-r-10" />
          </StackLayout>

          <StackLayout row="2" class="movie-group-item">
            <Label text="Air Date:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label
              :text="new Date(tvSeasonData.air_date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'long' })"
              class="p-l-15 p-b-10 m-r-10"
            />
          </StackLayout>

          <StackLayout row="3" class="movie-group-item">
            <Label text="Episodes:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <StackLayout>
              <RadListView
                :items="tvSeasonData.episodes"
                layout="grid"
                :gridSpanCount="1"
                class="item-group"
                @itemTap="onEpisodeTap"
              >
                <ListViewLinearLayout v-tkListViewLayout scrollDirection="Vertical" />
                <v-template>
                  <StackLayout class="list-group-item-content m-l-15 m-b-10">
                    <Label
                      style="color: blue;"
                      :text="`Episode ${item.episode_number} (${item.name})`"
                    />
                  </StackLayout>
                </v-template>
              </RadListView>
            </StackLayout>
          </StackLayout>
        </GridLayout>
      </StackLayout>

      <ActivityIndicator width="40" v-else height="40" busy />
    </ScrollView>
  </Page>
</template>

<script>
import axios from "axios";
import api from "../shared/movie/api-service";
import TVSeriesSeasonEpisodeDetails from "./TVSeriesSeasonEpisodeDetails";
import NoConnectivity from "./NoConnectivity";
const connectivity = require("connectivity");
export default {
  props: ["tv_id", "season_number", "tv_name"],
  components:{
    TVSeriesSeasonEpisodeDetails,
    NoConnectivity
  },
  data() {
    return {
      tvSeasonData: {},
    };
  },
  methods: {
    getTVSeriesSeasonDetails() {
      axios
        .get(`${api.url}/tv/${this.tv_id}/season/${this.season_number}?api_key=${api.key}`)
        .then(res => {
          this.tvSeasonData = {
            id: res.data.id,
            name: res.data.name,
            poster_path: res.data.poster_path,
            overview: res.data.overview,
            air_date: res.data.air_date,
            episodes: res.data.episodes
          };
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    onEpisodeTap(e) {
      console.log(`You have selected Episode ${e.item.episode_number}`)
      this.$emit("select", e.item);
      this.$navigateTo(TVSeriesSeasonEpisodeDetails, {
        props: {
          tv_id: this.tv_id,
          season_number: this.season_number,
          season_name: this.tvSeasonData.name,
          episode_number: e.item.episode_number,
          tv_name: this.tv_name
        },
        transition: { name: "slideRight" }
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
  },
  created() {
    this.getTVSeriesSeasonDetails();
    this.monitorNetworkStart();
  },
  watch: {
    checkNetworkState() {
      this.checkNetworkState();
    },
    monitorNetworkStart() {
      this.monitorNetworkStart();
    },
  },
};
</script>
