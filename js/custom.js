var gd;
var signedInStatus = {
  google: false,
  onedrive: false,
  dropbox: false
}
var urlParams = (new URL(location)).searchParams;
var notiObj = {
  notifications: [],
  notify(msg, stat) {
    this.notifications.push({
      statusClass: stat ? "toast-" + stat : "",
      message: msg
    })
  }
}
var signedInUser = {
  name: "",
  email: "",
  profilePic: ""
}
var openedFile = {
  name: "Unsaved.md",
  id: "",
  paths: [],
  pathsInName: [],
  parents: [],
  canEdit: true,
  raw: "",
  saved: ""
}
var fileExplorerOptions = {
  type: 0,
  TYPE: {
    CREATENEW: 0,
    OPENFILE: 1,
    SAVEAS: 2
  }
}

const initialText = 
`# This is a h1 heading

This is normal text.

Paragraphs are separated with two newlines.

1. This is an ordered list.
2. There are two items on this list.

- This is an unordered list.
- There are also two items on this list.

\`\`\`
This is a code block
with multiple lines
\`\`\`

Supported markdown syntax can be found on the guide bar.
`;
openedFile.raw = initialText;

var modalLoading = new Vue({
  el: "#modal-loading",
  data: {
    activate: false,
    loadingText: "Loading more words",
    fontSizeStyle: {
      "font-size": "1000%"
    }
  },
  mounted: function () {
    window.addEventListener("resize", this.setFontSize);
    this.setFontSize();
  },
  beforeDestroy: function () {
    window.removeEventListener("resize", this.setFontSize);
  },
  watch: {
    "activate": function (val) {
      if (val) {
        this.setFontSize();
      }
    },
    "loadingText": function () {
      this.setFontSize();
    }
  },
  methods: {
    setFontSize: function () {
      let fs = parseInt(this.fontSizeStyle["font-size"].match(/\d+/g));
      let ww = window.innerWidth - 30;
      let tw = parseInt(window.getComputedStyle(this.$refs.loadingText).getPropertyValue("width").match(/\d+/g));
      let newfs = ww / tw * fs;
      if (!isNaN(newfs)) {
        this.fontSizeStyle["font-size"] = (ww / tw * fs) + "%";
      }
    }
  }
})

new Vue({
  el: "#navbar",
  data: {
    guides: mdguides,
    nguideshown: 3,
    openedFile: openedFile,
    notiObj: notiObj,
    saving: false,
    savingashtml: false
  },
  computed: {
    fileDot: function () {
      return {
        color: this.openedFile.raw == this.openedFile.saved ? "#8BC34A" : "#F44336"
      }
    },
    fileSavedString: function () {
      return this.openedFile.raw == this.openedFile.saved ? "File saved" : "File unsaved";
    }
  },
  methods: {
    clickUser: function () {
      document.querySelector("#modal-user").classList.toggle("active")
    },
    hideHeader: function () {
      this.$refs.titleBar.classList.add("hide");
      this.$refs.guideBar.classList.add("hide");
      this.$refs.hideHeaderAction.classList.add("hide");
      this.$refs.showHeaderAction.classList.remove("hide");
    },
    showHeader: function () {
      this.$refs.titleBar.classList.remove("hide");
      this.$refs.guideBar.classList.remove("hide");
      this.$refs.hideHeaderAction.classList.remove("hide");
      this.$refs.showHeaderAction.classList.add("hide");
    },
    getN: function (str) {
      if (str == "") return 0
      return parseInt(str.match(/\d+/g))
    },
    updateNGuideShown: function () {
      let barStyle = window.getComputedStyle(this.$el.querySelector("#md-guide"))
      let totalXPadding = this.getN(barStyle.getPropertyValue("padding")) + this.getN(barStyle.getPropertyValue("padding-left")) + this.getN(barStyle.getPropertyValue("padding-right"))
      this.nguideshown = (this.getN(barStyle.getPropertyValue("width")) - totalXPadding - 24) / (24+8)
    },
    clickGuide: function (g) {
      modalGuide.title = g.tooltip
      modalGuide.rawContent = g.guide
      modalGuide.toggleModal()
    },
    createNewFile: function () {
      fileExplorerOptions.type = fileExplorerOptions.TYPE.CREATENEW;
      modalFileExplorer.toggleModal();
    },
    saveFile: function () {
      if (this.openedFile.id) {
        this.saving = true;
        gd.updateFileContent(this.openedFile.id, this.openedFile.raw).then((res) => {
          if (res.status == 200) {
            this.openedFile.saved = this.openedFile.raw;
          } else {
            notiObj.notify(res.body, "error");
          }
          this.saving = false;
        });
      } else {
        this.saveAs();
      }
    },
    saveAs: function () {
      fileExplorerOptions.type = fileExplorerOptions.TYPE.SAVEAS;
      modalFileExplorer.toggleModal();
    },
    openFile: function () {
      fileExplorerOptions.type = fileExplorerOptions.TYPE.OPENFILE;
      modalFileExplorer.toggleModal();
    },
    saveAsHtml: function () {
      this.savingashtml = true;
      gd.saveFileAsHtml(openedFile.parents[0], openedFile.name, content.compiledDoc)
        .then((res) => {
          notiObj.notify("Compiled HTML is saved in " + res.result.name, "success");
          this.savingashtml = false;
        });
    }
  },
  mounted: function () {
    Vue.nextTick(() => {
      window.addEventListener("resize", this.updateNGuideShown)
      this.updateNGuideShown()
    })
  }
})


var modalUser = new Vue({
  el: "#modal-user",
  data: {
    signedIn: signedInStatus,
    signedInUser: signedInUser
  },
  methods: {
    closeModal: function () {
      if (Object.values(signedInStatus).some(el => el))
        this.$el.classList.toggle("active")
    },
    openPrivacyPolicy: function () {
      window.location = "privacy-policy.html";
    },
    signInGoogle: function () {
      gd.handleSignInClick();
    },
    signOut: function () {
      gd.handleSignOutClick();
    }
  }
})

var modalGuide = new Vue({
  el: "#modal-guide",
  data: {
    title: "Guide title",
    rawContent: "",
    mdTheme: "default"
  },
  computed: {
    compiledContent: function () {
      return mdconverter.makeHtml(this.rawContent)
    }
  },
  methods: {
    toggleModal: function () {
      this.$el.classList.toggle("active")
    }
  }
})

var modalFileExplorer = new Vue({
  el: "#modal-file-explorer",
  data: {
    options: fileExplorerOptions,
    list: [],
    folder: {
      name: "Folder name",
      id: ""
    },
    nextPageToken: "",
    loadingNextPage: false,
    selectedFile: null,
    loadingList: false,
    loadingFolder: false
  },
  computed: {
    title: function () {
      switch (this.options.type) {
        case this.options.TYPE.CREATENEW:
          return "Create new file";
        case this.options.TYPE.OPENFILE:
          return "Open file";
        case this.options.TYPE.SAVEAS:
          return "Save as";
      }
    },
    actionTitle: function () {
      switch (this.options.type) {
        case this.options.TYPE.CREATENEW:
          return "Save here";
        case this.options.TYPE.OPENFILE:
          return "Open";
        case this.options.TYPE.SAVEAS:
          return "Save here";
      }
    }
  },
  mounted: function () {
    this.$refs.fileList.addEventListener("scroll", (ev) => {
      if (this.$refs.fileList.scrollTop >= (this.$refs.fileList.scrollHeight - this.$refs.fileList.offsetHeight)) {
        if (!this.loadingNextPage && this.nextPageToken !== "") {
          this.loadingNextPage = true;
          gd.getChildren(this.folder.id, this.nextPageToken)
            .then((res) => {
              this.list.push(...res.result.files);
              if (res.result.nextPageToken) {
                this.nextPageToken = res.result.nextPageToken;
              } else {
                this.nextPageToken = "";
              }
              this.loadingNextPage = false;
            })
        }
      }
    })
  },
  methods: {
    toggleModal: function () {
      this.$el.classList.toggle("active");
      if (this.$el.classList.contains("active")) {
        if (openedFile.parents.length > 0) {
          this.updateFileExplorer(openedFile.parents[0]);
        } else {
          this.updateFileExplorer("root");
        }
      }
    },
    updateFileExplorer: function (folderId) {
      this.$el.querySelectorAll(".file-tile.selected").forEach((el) => {
        el.classList.remove("selected");
      });
      this.loadingFolder = true;
      gd.getFileMetadata(folderId)
        .then((res) => {
          this.folder = res.result;
          this.loadingFolder = false;
        });
      this.loadingList = true;
      gd.getChildren(folderId)
        .then((res) => {
          this.list = res.result.files;
          if (res.result.nextPageToken) {
            this.nextPageToken = res.result.nextPageToken;
          } else {
            this.nextPageToken = "";
          }
          this.loadingList = false;
        })
    },
    onClickFile: function (file, target) {
      this.$el.querySelectorAll(".file-tile.selected").forEach((el) => {
        el.classList.remove("selected");
      });
      this.$refs[target][0].classList.add("selected");
      if (file.mimeType.includes("vnd.google-apps.folder")) {
        this.selectedFile = null;
        this.updateFileExplorer(file.id);
      } else {
        if (this.options.type == this.options.TYPE.OPENFILE) {
          this.selectedFile = file;
        } else {
          
        }
      }
    },
    goUpALevel: function () {
      this.updateFileExplorer(this.folder.parents[0]);
    },
    clickAction: function () {
      if (this.options.type == this.options.TYPE.CREATENEW) {
        if (this.$refs.fileNameToSave.textContent) {
          this.$el.classList.remove("active");
          modalLoading.loadingText = "Creating file";
          modalLoading.activate = true;
          gd.createFile(this.folder.id, this.$refs.fileNameToSave.textContent, initialText)
            .then((res) => {
              if (res.status == 200) {
                modalLoading.loadingText = "Opening file";
                modalLoading.activate = true;
                gd.openFile(res.result.id);
              }
            });
        }
      } else if (this.options.type == this.options.TYPE.OPENFILE) {
        if (this.selectedFile) {
          this.$el.classList.remove("active");
          modalLoading.loadingText = "Opening file";
          modalLoading.activate = true;
          gd.openFile(this.selectedFile.id);
        }
      } else if(this.options.type == this.options.TYPE.SAVEAS) {
        if (this.$refs.fileNameToSave.textContent) {
          this.$el.classList.remove("active");
          modalLoading.loadingText = "Creating and saving file";
          modalLoading.activate = true;
          gd.createFile(this.folder.id, this.$refs.fileNameToSave.textContent, openedFile.raw)
            .then((res) => {
              if (res.status == 200) {
                modalLoading.loadingText = "Opening file";
                modalLoading.activate = true;
                gd.openFile(res.result.id);
              }
            });
        }
      }  
    }
  },
})

var contentContainer = {
  props: ["contenteditable", "wrapperId", "hideMd", "content", "contentTheme", "maximisable", "actionLocation"],
  data: function () {
    return {
      height: 80,
      heightd: 3,
      heightmin: 30,
      wrapperClass: {
        "h-box": true,
        "grow": true,
        "p-1": true,
        // "column": true,
        // "col-6": true,
        // "col-sm-12": true,
        "hide-md": this.hideMd
      }
    }
  },
  computed: {
    style: function () {
      return {
        height: this.height + "vh"
      }
    }
  },
  methods: {
    sendEditedContent: function (ev) {
      this.$emit("input", ev.target.value)
    },
    addTab: function (e) {
      e.preventDefault()
      this.$emit("addtab", this.$refs.textarea)
    },
    boldText: function (e) {
      e.preventDefault()
      this.$emit("boldtext", this.$refs.textarea)
    },
    italicText: function (e) {
      e.preventDefault()
      this.$emit("italictext", this.$refs.textarea)
    },
    toggleMaximised: function () {
      this.$refs.maximisedDisplay.classList.toggle("active");
    },
    emitAction: function () {
      this.$emit("action");
    }
  },
  template: `
  <span :id="wrapperId" :class="wrapperClass">
    <div class="h-box v-center c-hand mdi mdi-chevron-left show-md px-1" v-if="actionLocation=='left'" @click="emitAction"></div>
    <div :class="['actual', 'grow', 'relative', 'md-'+contentTheme, 'v-box']">
      <textarea v-if="contenteditable" class="p-1 grow" ref="textarea" 
        :value="content" 
        @input="sendEditedContent" 
        @keydown.tab="addTab"
        @keyup.ctrl.66.exact="boldText"
        @keydown.ctrl.66.exact="e => e.preventDefault()"
        @keyup.ctrl.73.exact="italicText"
        @keydown.ctrl.73.exact="e => e.preventDefault()">
      </textarea>
      <div v-else v-html="content" class="p-1 grow" style="overflow-y: scroll">
      </div>
      <span class="controls absolute pr-2 mr-2">
        <div v-if="maximisable" class="height-minus mdi mdi-24px mdi-fullscreen c-hand tooltip tooltip-left pr-2" data-tooltip="Display this only" @click="toggleMaximised"></div>
      </span>
      <div class="modal modal-lg" id="maximised-display" v-if="maximisable" ref="maximisedDisplay">
        <span class="modal-overlay"></span>
        <div class="modal-container py-2">
          <div class="c-hand mdi mdi-24px mdi-fullscreen-exit float-right tooltip tooltip-left" aria-label="Close" data-tooltip="Exit fullscreen" @click="toggleMaximised"></div>
          <div v-html="content"></div>
        </div>
      </div>
    </div>
    <div class="h-box v-center c-hand mdi mdi-chevron-right show-md px-1" v-if="actionLocation=='right'" @click="emitAction"></div>
  </span>
  `
}

var content = new Vue({
  el: "#content",
  data: {
    openedFile: openedFile,
  },
  computed: {
    compiledDoc: function () {
      return mdconverter.makeHtml(this.openedFile.raw)
    }
  },
  components: {
    "content-container": contentContainer
  },
  methods: {
    switchTo: function (target) {
      let allChildren = document.querySelector("#content #actual-content").children
      for (let i = 0; i < allChildren.length; i++) {
        if (allChildren[i].id == target) allChildren[i].classList.remove("hide-md")
        else allChildren[i].classList.add("hide-md")
      }
    },
    updateRaw: function (raw) {
      this.openedFile.raw = raw
    },
    addTab: function (ta) {
      this.openedFile.raw = this.openedFile.raw.slice(0, ta.selectionStart+1) + "    " + this.openedFile.raw.slice(ta.selectionEnd)
      ta.selectionStart += 4;
      ta.selectionEnd += 4;
    },
    boldText: function (ta) {
      this.openedFile.raw = this.openedFile.raw.slice(0, ta.selectionStart) + "**" + this.openedFile.raw.slice(ta.selectionStart, ta.selectionEnd+1) + "**" + this.openedFile.raw.slice(ta.selectionEnd)
      ta.selectionStart += 2;
      ta.selectionEnd += 2;
    },
    italicText: function (ta) {
      this.openedFile.raw = this.openedFile.raw.slice(0, ta.selectionStart) + "*" + this.openedFile.raw.slice(ta.selectionStart, ta.selectionEnd+1) + "*" + this.openedFile.raw.slice(ta.selectionEnd)
      ta.selectionStart += 1;
      ta.selectionEnd += 1;
    }
  }
})

// initiation
function initApis() {
  modalLoading.loadingText = "Loading API";
  modalLoading.activate = true;
  gd = new GDrive();
  gd.signedInFunction = () => {
    signedInStatus.google = true;
    let gUser = gd.getUserProfile();
    signedInUser.name = gUser.getName();
    signedInUser.email = gUser.getEmail();
    signedInUser.profilePic = gUser.getImageUrl();
    // if no user is provided on url
    if (urlParams.get("user")) {
      // check if the signed in user is the same user
      if (gUser.getId() == urlParams.get("user")) {
        // open file if action is open
        if (urlParams.get("action") == "open") {
          if (urlParams.get("file")) {
            modalLoading.loadingText = "Opening file";
            modalLoading.activate = true;
            gd.getFileMetadata(urlParams.get("file")).then((res) => {
              gd.getFileContent(res.result.id).then((res) => {
                openedFile.raw = res.body;
                openedFile.saved = res.body;
                modalLoading.activate = false;
              });
              openedFile.name = res.result.name;
              openedFile.id = res.result.id;
              openedFile.paths = [];
              openedFile.parents = res.result.parents;
              openedFile.canEdit = res.result.capabilities.canEdit;

              if (!openedFile.canEdit) {
                notiObj.notify("This file is not editable.", "error");
              }
  
              async function findParents(currentPath, currentPathInName, parents) {
                if (!parents) {
                  openedFile.paths.push(currentPath);
                  openedFile.pathsInName.push(currentPathInName);
                  // console.log(openedFile.paths, openedFile.pathsInName);
                } else {
                  for (let i = 0; i < parents.length; i++) {
                    gd.getFileMetadata(parents[i]).then((res) => {
                      findParents(currentPath.concat(res.result.id), currentPathInName.concat(res.result.name), res.result.parents);
                    })
                  }
                }
              }
              findParents([res.result.id], [res.result.name], res.result.parents);
            });  
          }
        } else {  // if action is create
          if (urlParams.get("folder")) {
            modalLoading.loadingText = "Creating file";
            modalLoading.activate = true;
            gd.createFile(urlParams.get("folder"), "Untitled.md", initialText)
              .then((res) => {
                if (res.status == 200) {
                  gd.openFile(res.result.id);
                  modalLoading.activate = false;
                }
              });
          }
        }
      } else {
        notiObj.notify(`The signed in user is not the same as the user who opened this page. You can solve this by
          (1) signing out and signing in as the user who opened this page, or
          (2) opening a file or creating a new file from this page as the signed in user.
        `, "error");
        modalLoading.activate = false;
      }
    } else { // no user id on url, assuming not landing from google drive using create new or open with
      modalLoading.activate = false;
    }
  }
  gd.signedOutFunction = () => {
    signedInStatus.google = false;
    modalLoading.activate = false;
  }
  gd.signedInAtInit = () => {
    document.querySelector("#modal-user").classList.remove("active");
  }
  gd.signedOutAtInit = () => {
    document.querySelector("#modal-user").classList.add("active");
  }
}

// open modal-user to prompt user to sign in
// document.querySelector("#modal-user").classList.add("active");
// console.log(urlParams.get("user"), urlParams.get("file"), urlParams.get("action"));