<template>
  <Page class="page" @load="network_state">
    <StackLayout verticalAlignment="middle" horizontalAlignment="center">
      <Label text="No Internet Detected!!!" class="t-20 font-weight-bold text-danger"></Label>
    </StackLayout>
  </Page>
</template>
<script>
const connectivity = require("connectivity");
export default {
  data() {
    return {
      network_state: ""
    }
  },
  methods: {
    monitorNetworkStart() {
      console.log("Monitoring network connection changes.");
      connectivity.startMonitoring(newConnectionType => {
        switch (newConnectionType) {
          case connectivity.connectionType.wifi:
            this.network_state = "Connected to wifi!";
            this.$navigateBack();
            break;
          case connectivity.connectionType.mobile:
            this.network_state = "Connected to mobile!";
            this.$navigateBack();
            break;
          case connectivity.connectionType.ethernet:
            this.network_state = "Connected to ethernet!";
            this.$navigateBack();
            break;
        }
      });
    },
  },
  watch: {
    network_state() {
      this.monitorNetworkStart();
    },
  },
}