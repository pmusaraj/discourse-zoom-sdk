import loadScript from "discourse/lib/load-script";

function ensureZoom() {
  return loadScript("/plugins/discourse-zoom-sdk/react.min.js").then(() => {
    return loadScript("/plugins/discourse-zoom-sdk/react-dom.min.js").then(
      () => {
        return loadScript("/plugins/discourse-zoom-sdk/redux.min.js").then(
          () => {
            return loadScript(
              "/plugins/discourse-zoom-sdk/redux-thunk.min.js"
            ).then(() => {
              return loadScript(
                "/plugins/discourse-zoom-sdk/lodash.min.js"
              ).then(() => {
                return loadScript(
                  "/plugins/discourse-zoom-sdk/zoom-meeting-1.6.0.min.js"
                );
              });
            });
          }
        );
      }
    );
  });
}

export default {
  actions: {
    startMeeting() {
      ensureZoom().then(() => {
        // $("#zmmtg-root").appendTo("#zoom-event-holder");
        // console.log("checkSystemRequirements");
        // console.log(JSON.stringify(ZoomMtg.checkSystemRequirements()));

        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();

        var API_KEY = "Pcqj714ySu2YnnEc0otsGA";
        var API_SECRET = "kVcyil0pA4Bp6cogoHidntpvhXc59uAG7U2R";

        var meetConfig = {
          apiKey: API_KEY,
          apiSecret: API_SECRET,
          meetingNumber: this.get("webinarId"),
          userEmail: "john@smith.org",
          userName: this.currentUser.username,
          role: 0
        };

        var signature = ZoomMtg.generateSignature({
          meetingNumber: meetConfig.meetingNumber,
          apiKey: meetConfig.apiKey,
          apiSecret: meetConfig.apiSecret,
          role: meetConfig.role
        });

        ZoomMtg.init({
          leaveUrl: window.location.href,
          isSupportAV: true, // to enable audio and video for the meeting
          audioPanelAlwaysOpen: false, //optional
          success: function() {
            ZoomMtg.join({
              userEmail: meetConfig.userEmail,
              meetingNumber: meetConfig.meetingNumber,
              userName: meetConfig.userName,
              signature: signature,
              apiKey: meetConfig.apiKey,
              success: function(res) {
                console.log("join webinar success");
              },
              error: function(res) {
                console.log(res);
              }
            });
          }
        });
      });
    }
  },
  setupComponent(args, component) {
    this.set("webinarId", "351076431");
  }
};
