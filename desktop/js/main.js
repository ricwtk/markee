const path = require("path");
const Vue = require(path.join(__dirname, "js", "vue.js"));
const Split = require("split.js");
// const {mdconverter, mdguides} = require(path.join(__dirname, "js", "md.js"));
const os = require("os");
const fs = require("fs");
const {ipcRenderer} = require("electron");
const showdown = require("showdown");
require(path.join(__dirname, "js", "showdown-timeline-ext.js"));
require(path.join(__dirname, "js", "showdown-highlightjs-ext.js"));
const mdconverter = require(path.join(__dirname, "js", "md-converter.js"));
const emojiList = require(path.join(__dirname, "js", "emoji.js"));
const mdguides = require(path.join(__dirname, "js", "md-guides.js"));

// split
var split;
function setSplit() {
  if (split) { 
    split.destroy();
    split = null; 
  }
  split = Split([
    document.querySelector("#edit-panel"),
    document.querySelector("#display-panel")
  ], {
    sizes: [50,50],
    gutterSize: 10,
    gutter: (index, direction) => {
      const gutter = document.createElement('div');
      gutter.className = `gutter gutter-${direction} bg-gray-light`;
      // gutter.dataset.tooltip = "Click and drag to change size";
      return gutter;
    }
  });
}

function changeSplit(target) {
  if (target.innerWidth < 840) {
    if (split) {
      split.destroy();
      split = null;
    }
    [document.querySelector("#edit-panel"),
    document.querySelector("#display-panel")].forEach(el => {
      el.classList.add("grow");
    })
  } else {
    [document.querySelector("#edit-panel"),
    document.querySelector("#display-panel")].forEach(el => {
      el.classList.remove("grow");
    })
    if (!split) {
      setSplit();
    }
  }
}

// vue
Vue.component("preference", require(path.join(__dirname, "js", "v-pref.js")));
Vue.component("help", require(path.join(__dirname, "js", "v-help.js")));
Vue.component("file-explorer", require(path.join(__dirname, "js", "v-file-explorer.js")));
var main = new Vue({
  el: "#main",
  data: {
    mdguides: mdguides,//mdguides,
    mdconverter: mdconverter,
    docContent: "",
    savedDocContent: "",
    openedFile: ""
  },
  computed: {
    compiledDocContent: function () {
      return mdconverter.makeHtml(this.docContent);
    }
  },
  mounted: function () {
    changeSplit(window);
    window.addEventListener("resize", (ev) => {
      changeSplit(ev.currentTarget);
    });
    ipcRenderer.on("file-content", (ev, arg) => {
      this.savedDocContent = arg;
      this.docContent = arg;
    });
    ipcRenderer.on("open-file-ui", (ev, arg) => {
      this.openFileUi();
    });
    ipcRenderer.on("save-file", (ev, arg) => {
      this.saveFile();
    });
    ipcRenderer.on("save-file-success", (ev, arg) => {
      this.savedDocContent = arg;
    });
  },
  methods: {
    showDisplay: function () {
      this.$refs.editPanel.classList.add("hide-md");
      this.$refs.displayPanel.classList.remove("hide-md");
    },
    showEdit: function () {
      this.$refs.editPanel.classList.remove("hide-md");
      this.$refs.displayPanel.classList.add("hide-md");
    },
    saveFile: function () {
      if (this.openedFile) {
        ipcRenderer.send("save-file", this.openedFile, this.docContent);
      }
    },
    openFileUi: function () {
      this.$refs.fileExplorer.toggle();
    },
    openFileFromExplorer: function (file) {
      // close explorer
      this.$refs.fileExplorer.toggle();
      // save current folder as recently opened folder
      this.openFile(file);
    },
    openFile: function (file) {
      console.log("opening" + file);
      this.openedFile = file;
      ipcRenderer.send("open-file", file);
    }
  }
})