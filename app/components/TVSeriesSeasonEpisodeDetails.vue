<template>
  <Page class="page">
    <ActionBar>
      <NavigationButton @tap="$navigateBack()" android.systemIcon="ic_menu_back" />
      <Label
        textWrap="true"
        v-if="tvSeasonEpisodeData.name != ''"
        :text="`${tv_name} (${season_name} - Episode ${episode_number}: ${tvSeasonEpisodeData.name})`"
        horizontalAlignment="center"
      />
    </ActionBar>

    <ScrollView>
      <StackLayout class="list-detail" v-if="tvSeasonEpisodeData.name != null">
        <StackLayout
          v-if="tvSeasonEpisodeData.still_path != '' || tvSeasonEpisodeData.still_path != null"
        >
          <Image
            v-if="tvSeasonEpisodeData.still_path"
            :src="`https://image.tmdb.org/t/p/w342/${tvSeasonEpisodeData.still_path}`"
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
        </StackLayout>

        <GridLayout rows="*,*,*,*,*,*,*,*,*,*,*,*,*,*,*" class="movie-group" orientation="vertical">
          <StackLayout row="0" class="movie-group-item">
            <Label text="Title:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label class="p-l-15 p-b-10 m-r-10" :text="tvSeasonEpisodeData.name"></Label>
          </StackLayout>

          <StackLayout row="1" class="movie-group-item">
            <Label text="Overview:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label
              :text="tvSeasonEpisodeData.overview"
              textWrap="true"
              col="1"
              class="p-l-15 p-b-10 m-r-10"
            />
          </StackLayout>

          <StackLayout row="2" class="movie-group-item">
            <Label text="Air Date:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label
              :text="new Date(tvSeasonEpisodeData.air_date).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'long' })"
              class="p-l-15 p-b-10 m-r-10"
            />
          </StackLayout>

          <StackLayout row="3" class="movie-group-item" v-if="tvSeasonEpisodeData.crew.length">
            <Label text="Crew:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <RadListView
              :items="tvSeasonEpisodeData.crew"
              layout="grid"
              class="item-group"
              :gridSpanCount="2"
            >
              <ListViewLinearLayout v-tkListViewLayout scrollDirection="Vertical" />
              <v-template>
                <StackLayout class="list-group-item-content m-b-15">
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
                    class="list-group-item-text m-x-auto m-y-auto t-10"
                    :text="`Name: ${item.name}`"
                    horizontalAlignment="center"
                    textWrap="true"
                  ></Label>
                  <Label
                    class="list-group-item-text m-x-auto m-y-auto t-10"
                    :text="`Dept: ${item.department}`"
                    horizontalAlignment="center"
                    textWrap="true"
                  ></Label>
                  <Label
                    class="list-group-item-text m-x-auto m-y-auto m-b-5 t-10"
                    :text="`Job: ${item.job}`"
                    horizontalAlignment="center"
                    textWrap="true"
                  ></Label>
                </StackLayout>
              </v-template>
            </RadListView>
          </StackLayout>

          <StackLayout
            row="4"
            class="movie-group-item"
            v-if="tvSeasonEpisodeData.guest_stars.length"
          >
            <Label text="Guest Stars:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <RadListView
              :items="tvSeasonEpisodeData.guest_stars"
              layout="grid"
              class="item-group"
              :gridSpanCount="2"
            >
              <ListViewLinearLayout v-tkListViewLayout scrollDirection="Vertical" />
              <v-template>
                <StackLayout class="list-group-item-content m-b-15">
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
                    class="list-group-item-text m-x-auto m-y-auto t-10"
                    :text="`Name: ${item.name}`"
                    horizontalAlignment="center"
                    textWrap="true"
                  ></Label>
                  <Label
                    class="list-group-item-text m-x-auto m-y-auto t-10"
                    :text="`Acts: ${item.character}`"
                    horizontalAlignment="center"
                    textWrap="true"
                  ></Label>
                </StackLayout>
              </v-template>
            </RadListView>
          </StackLayout>
        </GridLayout>
      </StackLayout>

      <ActivityIndicator width="40" v-else height="40" color="green" busy />
    </ScrollView>
  </Page>
</template>

<script>
import axios from "axios";
import api from "../shared/movie/api-service";
import NoConnectivity from "./NoConnectivity";
const connectivity = require("connectivity");
export default {
  props: ["tv_id", "season_number", "episode_number", "tv_name", "season_name"],
  components: {
    NoConnectivity
  },
  data() {
    return {
      tvSeasonEpisodeData: {}
    };
  },
  methods: {
    getTVSeriesSeasonEpisodeDetails() {
      axios
        .get(
          `${api.url}/tv/${this.tv_id}/season/${this.season_number}/episode/${this.episode_number}?api_key=${api.key}`
        )
        .then(res => {
          this.tvSeasonEpisodeData = {
            id: res.data.id,
            name: res.data.name,
            still_path: res.data.still_path,
            overview: res.data.overview,
            air_date: res.data.air_date,
            guest_stars: res.data.guest_stars,
            crew: res.data.crew,
            season_number: res.data.season_number,
            episode_number: res.data.episode_number
          };
        })
        .catch(err => {
          console.log(err.message);
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
    this.getTVSeriesSeasonEpisodeDetails();
    this.monitorNetworkStart();
  },
  watch: {
    checkNetworkState() {
      this.checkNetworkState();
    }
  },
};
</script>
