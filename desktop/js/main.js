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
    mdguides: mdguides,
    mdconverter: mdconverter,
    docContent: "",
    savedDocContent: "",
    openedFile: "",
    slides: {
      slideshow: null,
      names: []
    },
    renderOptions: {
      docOrPres: 0
    },
    feMainAction: {
      name: "",
      fcn: () => {},
      validate: () => true
    },
    hljsTheme: {
      all: []
    },
    font: {
      all: []
    },
    preferences: {
      editorFont: {
        "font-family": "Roboto Mono",
        "font-weight": "400",
        "font-size": "12px"
      },
      docDisplayFont: {
        "font-family": "Arial",
        "font-weight": "400",
        "font-size": "12px"
      },
      presDisplayFont: {
        "font-family": "Arial",
        "font-weight": "400",
        "font-size": "12px"
      },
      codeBlockTheme: "default",
      customCSS: ""
    }
  },
  computed: {
    compiledDocContent: function () {
      return mdconverter.makeHtml(this.docContent);
    }
  },
  watch: {
    "renderOptions.docOrPres": function () {
      this.$nextTick(() => {
        if (this.renderOptions.docOrPres == 1) this.createSlideShow(); 
      });
    },
    "docContent": function () {
      if (this.renderOptions.docOrPres == 1) this.createSlideShow();
    }
  },
  mounted: function () {
    changeSplit(window);
    window.addEventListener("resize", (ev) => {
      changeSplit(ev.currentTarget);
    });
    this.updateCodeBlockTheme();
    this.updateCustomCSS();
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
    ipcRenderer.on("render-as-document", () => { this.renderOptions.docOrPres = 0; });
    ipcRenderer.on("render-as-slides", () => { this.renderOptions.docOrPres = 1; });
    ipcRenderer.send("app-ready");
    this.hljsTheme.all = ipcRenderer.sendSync("get-hljs-themes");
    ipcRenderer.on("update-available-fonts", (ev, arg) => {
      this.font.all = arg;
    });
    ipcRenderer.send("get-available-fonts");
    ipcRenderer.on("update-preferences", (ev, arg) => {
      this.preferences.editorFont = arg.editorFont || this.preferences.editorFont;
      this.preferences.docDisplayFont = arg.docDisplayFont || this.preferences.docDisplayFont;
      this.preferences.presDisplayFont = arg.presDisplayFont || this.preferences.presDisplayFont;
      this.preferences.codeBlockTheme = arg.codeBlockTheme || this.preferences.codeBlockTheme;
      this.preferences.customCSS = arg.customCSS || this.preferences.customCSS;
      this.updateCodeBlockTheme();
      this.updateCustomCSS();
    });
    ipcRenderer.send("get-preferences");
    ipcRenderer.on("open-preferences", ev => {
      if (!this.$refs.preference.$el.classList.contains("active")) this.$refs.preference.toggle();
    });
    ipcRenderer.on("open-help", ev => {
      if (!this.$refs.help.$el.classList.contains("active")) this.$refs.help.toggle();
    });
    // for clone window
    window.addEventListener("message", (ev) => {
      if (ev.data == "clone-loaded") {
        ev.source.postMessage({
          msg: "set-source",
          content: this.docContent,
          font: this.preferences.presDisplayFont,
          codeBlockTheme: this.preferences.codeBlockTheme,
          customCSS: this.preferences.customCSS
        }, "*");
      } else if (ev.data.startsWith("gotoSlide") || ev.data == "toggleBlackout") {
        if (this.slides.slideshow !== null) this.slides.slideshow.events.emit("message", ev);
      }
    }, false)
  },
  methods: {
    updateCodeBlockTheme: function () {
      let head = document.querySelector("head");
      let eel = head.querySelector("#hljstheme");
      if (eel) head.removeChild(eel);
      let el = document.createElement("link");
      el.id = "hljstheme";
      el.rel = "stylesheet";
      el.href = "./css/highlight/" + this.preferences.codeBlockTheme + ".css";
      head.appendChild(el);
    },
    updateCustomCSS: function () {
      let head = document.querySelector("head");
      let eel = head.querySelector("#customcss");
      if (eel) head.removeChild(eel);
      let el = document.createElement("style");
      el.id = "customcss";
      el.innerHTML = this.preferences.customCSS;
      head.appendChild(el);
    },
    showDisplay: function () {
      this.$refs.editPanel.classList.add("hide-md");
      this.$refs.displayPanel.classList.remove("hide-md");
      if (this.slides.slideshow) this.slides.slideshow.events.emit("resize");
    },
    showEdit: function () {
      this.$refs.editPanel.classList.remove("hide-md");
      this.$refs.displayPanel.classList.add("hide-md");
    },
    saveFile: function () {
      if (this.openedFile) {
        ipcRenderer.send("save-file", this.openedFile, this.docContent);
      } else {
        this.feMainAction.name = "Save";
        this.feMainAction.fcn = (newFilePath) => {
          ipcRenderer.send("save-file", newFilePath, this.docContent);
          this.openedFile = newFilePath;
          this.$refs.fileExplorer.toggle();
        };
        this.feMainAction.validate = (self, name, fullpath) => {
          let x = self.directoryContent.filter(el => el.name == name);
          if (x.length < 1 || x[0].isDirectory) return true;
          else return { msg: "Duplicated file name. File will be replaced if saved.", classes: ["bg-warning", "text-black"], preventExec: false };
        }
        if (!this.$refs.fileExplorer.isActive()) this.$refs.fileExplorer.toggle();
      }
    },
    openFileUi: function () {
      this.feMainAction.name = "Open";
      this.feMainAction.fcn = this.openFileFromExplorer;
      this.feMainAction.validate = (self, name, fullpath) => {
        let x = self.directoryContent.filter(el => el.name == name);
        if (x.length > 0) return true;
        else return { msg: "File does not exist", classes: ["bg-danger", "text-white"], preventExec: true };
      }
      if (!this.$refs.fileExplorer.isActive()) this.$refs.fileExplorer.toggle();
    },
    openFileFromExplorer: function (file) {
      this.$refs.fileExplorer.toggle();
      // save current folder as recently opened folder
      this.openFile(file);
    },
    openFile: function (file) {
      ipcRenderer.send("open-file", file);
    },
    newFile: function () {
      ipcRenderer.send("new-file");
    },
    openExternal: function (dpath) {
      ipcRenderer.send("open-external", dpath);
    },
    execCommand: function (cmd) {
      document.execCommand(cmd);
    },
    savePreferences: function (pref) {
      ipcRenderer.send("save-preferences", pref);
      this.preferences = pref;
      this.updateCodeBlockTheme();
      this.updateCustomCSS();
    },
    addTab: function (ev) {
      let ta = ev.target;
      let ss = ta.selectionStart;
      let se = ta.selectionEnd;
      ta.value = ta.value.slice(0,ss) + "  " + ta.value.slice(ss);
      ta.selectionStart = ss + 2;
      ta.selectionEnd = se + 2;
    },
    addBold: function (ev) {
      let ta = ev.target;
      let ss = ta.selectionStart;
      let se = ta.selectionEnd;
      ta.value = ta.value.slice(0,ss) + "**" + ta.value.slice(ss,se) + "**";
      ta.selectionStart = ss + 2;
      ta.selectionEnd = se + 2;
    },
    addItalic: function (ev) {
      let ta = ev.target;
      let ss = ta.selectionStart;
      let se = ta.selectionEnd;
      ta.value = ta.value.slice(0,ss) + "*" + ta.value.slice(ss,se) + "*";
      ta.selectionStart = ss + 1;
      ta.selectionEnd = se + 1;
    },
    createSlideShow: function () {
      let slideIdx;
      if (this.slides.slideshow !== null) {
        slideIdx = this.slides.slideshow.getCurrentSlideIndex();
      }
      let outer = this.$refs.presentationDisplay;
      while (outer.firstChild) outer.removeChild(outer.firstChild);
      outer.classList.remove("remark-container");
      this.slides.slideshow = remark.create({
        container: outer,
        source: this.docContent,
        converter: mdconverter,
        externalHighlighter: true
      });
      this.slides.names = this.slides.slideshow.getSlides().map(s => s.properties.name);
      if (slideIdx) { this.slides.slideshow.gotoSlideNumber(this.slides.slideshow.getSlides()[slideIdx].getSlideNumber()); }
      this.slides.slideshow.events._events.createClone = this.createClone;
    },
    createClone: function () {
      if (!this.slides.slideshow.clone || this.slides.slideshow.clone.closed) {
        this.slides.slideshow.clone = window.open(path.join(__dirname, "snippets", "cloned-slides.html"), this.slides.slideshow.getCloneTarget(), 'location=no');
      }
      else {
        this.slides.slideshow.clone.focus();
      }
    }
  }
})