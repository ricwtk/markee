const fs = require("fs");

module.exports = {
  props: ["hljsTheme", "font", "savedPref"],
  data: function () {
    return {
      editorFont: {
        "font-family": "Arial",
        "font-weight": "400",
        "font-size": "12px"
      },
      displayFont: {
        "font-family": "Arial",
        "font-weight": "400",
        "font-size": "12px"
      },
      codeBlockTheme: "default",
      customCSS: ""
    }
  },
  computed: {
    fontFamilies: function () {
      return Object.keys(this.font.all);
    },
    codeBlockExample: function () {
      return "./snippets/code-block-example.html?hljsTheme=" + this.codeBlockTheme;
    }
  },
  methods: {
    toggle: function () {
      this.$el.classList.toggle("active");
      if (this.$el.classList.contains("active")) {
        this.editorFont = this.savedPref.editorFont ? JSON.parse(JSON.stringify(this.savedPref.editorFont)) 
          : { "font-family": "Arial", "font-weight": "400", "font-size": "12px"};
        this.displayFont = this.savedPref.displayFont ? JSON.parse(JSON.stringify(this.savedPref.displayFont)) 
          : { "font-family": "Arial", "font-weight": "400", "font-size": "12px"};
        this.codeBlockTheme = this.savedPref.codeBlockTheme || "default";
        this.customCSS = this.savedPref.customCSS || "";
        this.$el.querySelector(".modal-body").scrollTop = 0;
      }
    },
    fontWeights: function (font) {
      let weights = this.font.all[font['font-family']] || [];
      if (!weights.includes(font['font-weight'])) {
        font['font-weight'] = weights[0] || "";
      }
      return weights;
    },
  },
  template: `
  <div class="modal">
    <div class="modal-overlay" @click="toggle"></div>
    <div class="modal-container">
      <div class="modal-title">
        <div class="grow">Preference</div>
        <div class="mdi mdi-24px mdi-close c-hand" @click="toggle"></div>
      </div>
      <div class="modal-body v-box p-1">
        <div class="text-gray mb-1">Editor font</div>
        <div class="h-box">
          <label class="form-select-wrapper grow mr-1">
            <select class="form-select grow" v-model="editorFont['font-family']">
              <option v-for="fn in fontFamilies" :value="fn">{{ fn }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>
          </label>
          <label class="form-select-wrapper mr-1">
            <select class="form-select" v-model="editorFont['font-weight']">
              <option v-for="w in fontWeights(editorFont)" :value="w">{{ w }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
          </label>
          <label class="form-select-wrapper">
            <select class="form-select" v-model="editorFont['font-size']">
              <option v-for="n in [10, 12, 14, 15, 16, 17, 18]" :value="n+'px'">{{ n + 'px' }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
          </label>
        </div>
        <div class="b-1 bd-gray b-solid br-1 mt-1 p-2" :style="editorFont">
          The quick brown fox jumps over the lazy dog. 0123456789
        </div>
        <div class="text-gray mb-1 mt-2">Base font for display</div>
        <div class="h-box">
          <label class="form-select-wrapper grow mr-1">
            <select class="form-select grow" v-model="displayFont['font-family']">
              <option v-for="fn in fontFamilies" :value="fn">{{ fn }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>
          </label>
          <label class="form-select-wrapper mr-1">
            <select class="form-select" v-model="displayFont['font-weight']">
              <option v-for="w in fontWeights(displayFont)" :value="w">{{ w }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
          </label>
          <label class="form-select-wrapper">
            <select class="form-select" v-model="displayFont['font-size']">
              <option v-for="n in [10, 12, 14, 15, 16, 17, 18]" :value="n+'px'">{{ n + 'px' }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
          </label>
        </div>
        <div class="b-1 bd-gray b-solid br-1 mt-1 p-2" :style="displayFont">
          The quick brown fox jumps over the lazy dog. 0123456789
        </div>
        <div class="text-gray mb-1 mt-2">Code block highlight theme</div>
        <div class="h-box">
          <label class="form-select-wrapper grow">
            <select class="form-select grow" v-model="codeBlockTheme">
              <option v-for="t in hljsTheme.all">{{ t }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>
          </label>
        </div>
        <object :data="codeBlockExample" type="text/html" height="220px"></object>
        <div class="text-gray mb-1 mt-2">Custom CSS</div>
        <textarea class="form-textarea no-resize br-1 p-1" v-model="customCSS"></textarea>
      </div>
      <div class="modal-footer">
        <div class="grow"></div>
        <div class="button-group">
        <button class="btn form-btn">Save</button>
        <button class="btn form-btn" @click="toggle">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  `
}