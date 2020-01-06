<template>
  <StackLayout height="100%" verticalAlignment="middle">
    <StackLayout>
      <Image src="res://logo" class="text-center img-rounded"/>
    </StackLayout>

    <Label :text="'Version '+version_name" class="text-center font-weight-bold m-b-5"></Label>

    <Label class="text-center text-secondary font-weight-bold m-b-5">&copy; {{ year }}</Label>
  </StackLayout>
</template>
<script>
const AppInfo = require("nativescript-appinfo");
const connectivity = require("connectivity");
import NoConnectivity from './NoConnectivity';
export default {
  data() {
    return {
      platform_details: "",
      version_name: "",
      year: ""
    };
  },
  components: {
    NoConnectivity,
  },
  methods: {
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
  created() {
    AppInfo.getVersionName().then(version => (this.version_name = version));
    this.year = new Date().getFullYear();
    this.monitorNetworkStart();
  },
  watch: {
    monitorNetworkStart() {
      this.monitorNetworkStart();
    },
    checkNetworkState() {
      this.checkNetworkState();
    }
  }
};
</script>