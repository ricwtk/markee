(function (window) {
  function GDrive () {
    this.clientId = "623667008977-hsdjgfsve1cj8m19traqm3hshh8o995s.apps.googleusercontent.com";
    this.apiKey = "AIzaSyDMQVW72MRoWlANqcx0CjbFzeIKisRuAhc";
    this.appId = "623667008977";
    this.discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
    this.scopes = [
      "https://www.googleapis.com/auth/drive.install",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/drive.readonly"
    ].join(" ");
    this.initialised = false;
    this.initialising = false;
    this.accessToken = "";

    this.init = () => {
      this.initialising = true;
      gapi.load('client:auth2:picker', this.initClient);
    }

    this.initClient = () => {
      gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        discoveryDocs: this.discoveryDocs,
        scope: this.scopes
      }).then(() => {
        this.initialised = true;
        this.initialising = false;
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          this.accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true).access_token;
          this.signedInAtInit();
        } else {
          this.signedOutAtInit();
        }
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
        // Handle the initial sign-in state.
        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    }
    this.updateSigninStatus = (signedIn) => {
      console.log("signed in status (Google): ", signedIn);
      this.accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse(true).access_token;
      if (signedIn) this.signedInFunction();
      else this.signedOutFunction();
    }

    this.signedInFunction = () => {}
    this.signedOutFunction = () => {}
    this.signedInAtInit = () => {}
    this.signedOutAtInit = () => {}

    this.handleSignInClick = () => {
      gapi.auth2.getAuthInstance().signIn();
    }

    this.handleSignOutClick = () => {
      gapi.auth2.getAuthInstance().signOut();
    }

    this.getUserId = () => {
      if (this.accessToken) {
        return gapi.auth2.getAuthInstance().currentUser.get().getId();
      } else {
        return "";
      }
    }

    this.getFile = (fileId) => {
      if (this.accessToken) {
        return gapi.client.drive.files.get({
          fileId: fileId,
          // alt: "media",
          fields: "parents, name, id"
        });
      } else {
        return null;
      }
    }

    this.openPicker = () => {
      if (this.accessToken) {
        var view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes("text/plain");
        var picker = new google.picker.PickerBuilder()
          .enableFeature(google.picker.Feature.NAV_HIDDEN)
          .setAppId(this.appId)
          .setOAuthToken(this.accessToken)
          .addView(view)
          .addView(new google.picker.DocsUploadView())
          .setDeveloperKey(this.apiKey)
          .setCallback(this.pickerCallback)
          .build();
        picker.setVisible(true);
      }
    }

    this.pickerCallback = (data) => {
      if (data.action == google.picker.Action.PICKED) {
        var fileId = data.docs[0].id;
        var url = new URL(location);
        url.searchParams.set("user", this.getUserId());
        url.searchParams.set("file", data.docs[0].id);
        url.searchParams.set("action", "open");
        window.location = url.toString();
      }
    }

    this.init();
  }

  if(typeof(window.GDrive) === 'undefined'){
    window.GDrive = GDrive;
  }


})(window)