module.exports = {
  data: function () {
    return {
      os: require("os"),
      path: require("path"),
      fs: require("fs"),
      directoryPath: "",
      displayType: [{
        value: "all",
        display: "All files"
      },{
        value: "folder+md",
        display: "Folders and Markdown (.md) files"
      },{
        value: "md",
        display: "Markdown (.md) files only"
      }],
      selectedDisplayType: "",
      dbclkTarget: null
    }
  },
  mounted: function () {
    this.directoryPath = this.os.homedir();
    this.selectedDisplayType = this.displayType[1].value;
  },
  computed: {
    directoryPathArray: function () {
      if (!this.directoryPath) { return []; }
      let p = this.path.parse(this.directoryPath);
      let res = [];
      res.push(p.root, ...p.dir.split(this.path.sep).filter(el => el !== ""), p.base);
      return res.filter(el => el !== "");
    },
    directoryContent: function () {
      if (!this.directoryPath) { return []; }
      return this.fs.readdirSync(this.directoryPath).map(f => {
        return {
          name: f,
          isDirectory: this.fs.statSync(this.path.join(this.directoryPath, f)).isDirectory(),
          isMd: this.path.parse(f).ext == ".md"
        }
      }).filter(f => {
        let res = false;
        switch (this.selectedDisplayType) {
          case this.displayType[0].value:
            res = true;
            break;
          case this.displayType[1].value:
            res = res || f.isDirectory;
          case this.displayType[1].value:
          case this.displayType[2].value:
            res = res || f.isMd;
            break;
          default:
            res = true;
        }
        return res;
      });
    }
  },
  methods: {
    toggle: function () {
      this.$el.classList.toggle("active");
    },
    navigate: function (ev) {
      let i = parseInt(ev.target.dataset.i);
      let pa = this.directoryPathArray.slice(0, i+1);
      if (pa.length > 1) this.directoryPath = pa[0] + this.path.join(...pa.slice(1));
      else this.directoryPath = pa[0];
    },
    getItemWrapper: function (el) {
      while (!el.classList.contains("item-wrapper")) {
        el = el.parentNode;
      }
      return el;
    },
    selectItem: function (ev) {
      this.$el.querySelectorAll(".selected").forEach(el => {
        el.classList.remove("selected", "bd-gray");
      })
      let target = this.getItemWrapper(ev.target);
      target.classList.add("selected", "bd-gray");
      if (this.dbclkTarget == target) {
        let item = JSON.parse(target.dataset.item);
        this.execItem(item);
      } else {
        this.dbclkTarget = target;
        setTimeout(() => {
          this.dbclkTarget = null;
        }, 250);
      }
    },
    execItem: function (item) {
      let itemPath = this.path.join(this.directoryPath, item.name);
      if (item.isDirectory) {
        this.directoryPath = itemPath;
      } else {
        this.$emit("open-file", itemPath);
      }
    },
    getItemIcon: function (item) {
      if (item.isDirectory) {
        return "mdi-folder";
      } else if (item.isMd) {
        return "mdi-markdown";
      } else {
        return "mdi-file-outline";
      }
    }
  },
  template: `
  <div class="modal">
    <div class="modal-overlay" @click="toggle"></div>
    <div class="modal-container">
      <div class="modal-title">
        <div class="grow">
          <span class="breadcrumb">
            <span class="bc-item" v-for="(p,i) in directoryPathArray" :data-i="i" @click="navigate">{{ p }}</span>
          </span>
        </div>
        <div class="mdi mdi-24px mdi-close c-hand" @click="toggle"></div>
      </div>
      <div class="modal-body bg-white p-1">
        <template v-for="n in 2">
          <span class="b-1 b-solid bd-white p-2 hv-bg-gray-light no-select item-wrapper" v-for="f in directoryContent" v-if="n == 1 ? f.isDirectory : !f.isDirectory" @click="selectItem" :data-item="JSON.stringify(f)">
            <i :class="['mdi', getItemIcon(f)]"></i>
            {{ f.name }}
          </span>
        </template>
      </div>
      <div class="modal-footer">
        <label class="form-select-wrapper">
          <select class="form-select" v-model="selectedDisplayType">
            <option v-for="dt in displayType" :value="dt.value">{{ dt.display }}</option>
          </select>
          <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>
        </label>
        <div class="grow"></div>
        <div class="button-group">
          <button class="btn form-btn">Open</button>
          <button class="btn form-btn" @click="toggle">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  `
}