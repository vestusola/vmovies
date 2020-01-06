<template>
  <Page class="page">
    <ActionBar>
      <NavigationButton @tap="$navigateBack()" android.systemIcon="ic_menu_back" />
      <Label textWrap="true" :text="person.name" horizontalAlignment="center" />
    </ActionBar>

    <ScrollView>
      <StackLayout class="list-detail">
        <Image
          v-if="person.profile_path != null"
          :src="`https://image.tmdb.org/t/p/w92/${person.profile_path}`"
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
        <Label class="hr-light m-t-15 m-b-15" />

        <GridLayout rows="*,*,*,*,*,*,*,*,*,*,*,*,*,*,*" class="movie-group" orientation="vertical">
          <StackLayout row="0" class="movie-group-item">
            <Label text="Name:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <Label class="p-l-15 p-b-10 m-r-10" :text="person.name"></Label>
          </StackLayout>

          <StackLayout row="1" class="movie-group-item">
            <Label
              text="Department Known For:"
              class="p-l-10 p-b-10 m-r-10 movie-group-item-heading"
            />
            <Label class="p-l-15 p-b-10 m-r-10" textWrap="true" :text="person.known_for_department"></Label>
          </StackLayout>

          <StackLayout row="2" class="movie-group-item">
            <Label text="Known For:" class="p-l-10 p-b-10 m-r-10 movie-group-item-heading" />
            <StackLayout>
              <RadListView
                :items="person.known_for"
                layout="grid"
                class="item-group"
                :gridSpanCount="2"
                @itemTap="getKnownForDetails"
              >
                <ListViewLinearLayout v-tkListViewLayout scrollDirection="Vertical" />
                <v-template if="item.media_type == 'movie'">
                  <StackLayout class="list-group-item-content m-5">
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
                    <Label
                      class="list-group-item-text item-title"
                      :text="item.title"
                      textWrap="true"
                    ></Label>
                    <Label class="hr-light m-t-5 m-b-5" />
                  </StackLayout>
                </v-template>

                <v-template if="item.media_type == 'tv'">
                  <StackLayout class="list-group-item-content m-5">
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
                    <Label
                      class="list-group-item-text item-title"
                      :text="item.name"
                      textWrap="true"
                    ></Label>
                    <Label class="hr-light m-t-5 m-b-5" />
                  </StackLayout>
                </v-template>
              </RadListView>
            </StackLayout>
          </StackLayout>
        </GridLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import axios from "axios";
import api from "../shared/movie/api-service";
import TVSeriesDetails from "./TVSeriesDetails";
import MovieDetails from "./MovieDetails";
const connectivity = require("connectivity");
import NoConnectivity from "./NoConnectivity";
export default {
  props: ["person"],
  components: { NoConnectivity },
  data() {
    return {};
  },
  methods: {
    getKnownForDetails(e) {
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
