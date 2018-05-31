const path = require("path");
const Vue = require(path.join(__dirname, "js", "vue.js"));
const Split = require("split.js");
const tt = require('electron-tooltip');
const {mdconverter, mdguides} = require(path.join(__dirname, "js", "md.js"));
const os = require("os");

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

// electron-tooltip
// tt({
//   position: "bottom"
// });

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
    test: function () {
      console.log(this.$refs);
    }
  }
})