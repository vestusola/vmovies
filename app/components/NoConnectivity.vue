<template>
  <Page class="page">
    <ActionBar>
      <Label
        textWrap="true"
        text="VMovies"
        class="t-15 font-weight-bold"
        horizontalAlignment="center"
      />
    </ActionBar>

    <StackLayout verticalAlignment="center" horizontalAlignment="center">
      <Label text="No Internet Detected!!!" class="t-20 font-weight-bold text-danger"></Label>
    </StackLayout>
  </Page>
</template>
<script>
const connectivity = require("connectivity");
export default {
  components: {},
  props: ['network_state'],
  data() {
    return {

    };
  },
  methods: {
    monitorNetworkStart() {
      console.log("Monitoring network changes on NoConnectivity Page.");
      connectivity.startMonitoring(newConnectionType => {
        switch (newConnectionType) {
          case connectivity.connectionType.none:
            this.network_state = 0;
            console.log("Connection is down!");
            break;
          case connectivity.connectionType.wifi:
            console.log("Network is now alive!");
            this.network_state = 1;
            this.$navigateBack();
            break;
          case connectivity.connectionType.mobile:
            console.log("Network is now alive!");
            this.network_state = 2;
            this.$navigateBack();
            break;
          case connectivity.connectionType.ethernet:
            console.log("Network is now alive!");
            this.network_state = 3;
            this.$navigateBack();
            break;
        }
      });
    }
  },
  beforeMount() {
    this.monitorNetworkStart();
  },
  watch: {
    network_state() {
      this.monitorNetworkStart();
    }
  }
};
