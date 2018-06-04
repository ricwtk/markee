const fs = require("fs");

module.exports = {
  props: ["hljsTheme", "font", "savedPref"],
  data: function () {
    return {
      editorFont: {},
      docDisplayFont: {},
      presDisplayFont: {},
      codeBlockTheme: "",
      customCSS: "",
      fontSizes: [...Array(21).keys()].slice(8)
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
        this.editorFont = JSON.parse(JSON.stringify(this.savedPref.editorFont));
        this.docDisplayFont = JSON.parse(JSON.stringify(this.savedPref.docDisplayFont));
        this.presDisplayFont = JSON.parse(JSON.stringify(this.savedPref.presDisplayFont));
        this.codeBlockTheme = this.savedPref.codeBlockTheme;
        this.customCSS = this.savedPref.customCSS;
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
    save: function () {
      let pref = {
        editorFont: JSON.parse(JSON.stringify(this.editorFont)),
        docDisplayFont: JSON.parse(JSON.stringify(this.docDisplayFont)),
        presDisplayFont: JSON.parse(JSON.stringify(this.presDisplayFont)),
        codeBlockTheme: this.codeBlockTheme,
        customCSS: this.customCSS
      }
      this.$emit("save-pref", pref);
      this.toggle();
    }
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
              <option v-for="n in fontSizes" :value="n+'px'">{{ n + 'px' }}</option>
            </select>
            <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
          </label>
        </div>
        <div class="b-1 bd-gray b-solid br-1 mt-1 p-2 h-center" :style="editorFont">
          The quick brown fox jumps over the lazy dog. 0123456789
        </div>
        <div class="text-gray mb-1 mt-2">Base font for display</div>
        <div class="v-box pl-2">
          <div class="text-gray mb-1 mt-1">Document</div>
          <div class="h-box">
            <label class="form-select-wrapper grow mr-1">
              <select class="form-select grow" v-model="docDisplayFont['font-family']">
                <option v-for="fn in fontFamilies" :value="fn">{{ fn }}</option>
              </select>
              <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>
            </label>
            <label class="form-select-wrapper mr-1">
              <select class="form-select" v-model="docDisplayFont['font-weight']">
                <option v-for="w in fontWeights(docDisplayFont)" :value="w">{{ w }}</option>
              </select>
              <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
            </label>
            <label class="form-select-wrapper">
              <select class="form-select" v-model="docDisplayFont['font-size']">
                <option v-for="n in fontSizes" :value="n+'px'">{{ n + 'px' }}</option>
              </select>
              <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
            </label>
          </div>
          <div class="b-1 bd-gray b-solid br-1 mt-1 p-2 h-center" :style="docDisplayFont">
            The quick brown fox jumps over the lazy dog. 0123456789
          </div>
          <div class="text-gray mb-1 mt-1">Presentation</div>
          <div class="h-box">
            <label class="form-select-wrapper grow mr-1">
              <select class="form-select grow" v-model="presDisplayFont['font-family']">
                <option v-for="fn in fontFamilies" :value="fn">{{ fn }}</option>
              </select>
              <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>
            </label>
            <label class="form-select-wrapper mr-1">
              <select class="form-select" v-model="presDisplayFont['font-weight']">
                <option v-for="w in fontWeights(presDisplayFont)" :value="w">{{ w }}</option>
              </select>
              <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
            </label>
            <label class="form-select-wrapper">
              <select class="form-select" v-model="presDisplayFont['font-size']">
                <option v-for="n in fontSizes" :value="n+'px'">{{ n + 'px' }}</option>
              </select>
              <div class="form-select-icon mdi mdi-unfold-more-horizontal"></div>            
            </label>
          </div>
          <div class="b-1 bd-gray b-solid br-1 mt-1 p-2 h-center" :style="presDisplayFont">
            The quick brown fox jumps over the lazy dog. 0123456789
          </div>
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
        <textarea class="form-textarea no-resize br-1 p-1" v-model="customCSS" style="font-family: monospace;"></textarea>
      </div>
      <div class="modal-footer">
        <div class="grow"></div>
        <div class="button-group">
        <button class="btn form-btn" @click="save">Save</button>
        <button class="btn form-btn" @click="toggle">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  `
}