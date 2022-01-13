import Vue from "vue";
import { Workbox } from "workbox-window";
import * as Sentry from "@sentry/browser";
// import * as Cesium from "Cesium/Cesium";

import App from "./App.vue";
import router from "./components/Router";

if (window.location.href.includes("satvis.space")) {
  Sentry.init({ dsn: "https://0c7d1a82eedb48ee8b83d87bf09ad144@sentry.io/1541793" });
}

const app = new Vue({
  el: "#app",
  components: {
    app: App,
  },
  render: (h) => h("app"),
  router,
});

// Export Vue for debugger
window.app = app;

/* global cc */
cc.sats.addFromTleUrl("data/tle/ext/wfs.txt", ["WFS"]);
cc.sats.addFromTleUrl("data/tle/ext/wfsf.txt", ["WFSF"]);
cc.sats.addFromTleUrl("data/tle/ext/ot.txt", ["OT"]);
cc.sats.addFromTleUrl("data/tle/norad/spire.txt", ["Spire"]);
cc.sats.addFromTleUrl("data/tle/norad/planet.txt", ["Planet"]);
cc.sats.addFromTleUrl("data/tle/norad/starlink.txt", ["Starlink"]);
cc.sats.addFromTleUrl("data/tle/norad/globalstar.txt", ["Globalstar"]);
cc.sats.addFromTleUrl("data/tle/norad/transporter-3.txt", ["Transporter-3"]);

if (cc.sats.enabledTags.length === 0) {
  // cc.setTime("2019-07-01");
  // cc.sats.enableTag("OT144-12");
  // cc.sats.enableTag("Globalstar");
  // cc.sats.disableComponent("Label");
  // cc.imageryProvider = "ArcGis";
  // setTimeout(() => {
  //   cc.sats.getSatellitesWithTag("OT144-12").forEach((sat) => { sat.enableComponent("Orbit"); sat.enableComponent("SensorCone"); });
  //   cc.sats.getSatellitesWithTag("OT144-12").forEach((sat) => { sat.entities.Orbit.path.material = Cesium.Color.WHITE.withAlpha(0.01); });
  //   cc.sats.getSatellitesWithTag("Globalstar").forEach((sat) => { sat.entities.Point.point.color = Cesium.Color.RED; sat.entities.Point.point.pixelSize = 5; });
  // }, 2000);
}

// Register service worker
if ("serviceWorker" in navigator) {
  const wb = new Workbox("sw.js");
  wb.addEventListener("waiting", () => {
    wb.addEventListener("controlling", () => {
      console.log("Reloading page for latest content");
      window.location.reload();
    });
    wb.messageSW({ type: "SKIP_WAITING" });
    // Old serviceworker message for migration, can be removed in the future
    wb.messageSW("SKIP_WAITING");
  });
  wb.register();
}
