var mdconverter = new showdown.Converter({
  smoothPreview: true
})

new Vue({
  el: "#navbar",
  data: {
    windowHeight: 0,
    windowWidth: 0
  },
  methods: {
    clickUser: function () {
      document.querySelector("#modal-user").classList.toggle("active")
    },
    getWindowDimension: function () {
      this.windowHeight = document.documentElement.clientHeight
      this.windowWidth = document.documentElement.clientWidth
      let bar = this.$el.querySelector("#md-guide")
      let barHeight = bar.scrollHeight
      let itemHeight = bar.children[0].scrollHeight
      console.log(barHeight, itemHeight)
    }
  },
  mounted: function () {
      window.addEventListener("resize", this.getWindowDimension)
      this.getWindowDimension()
  }
})


new Vue({
  el: "#modal-user",
  methods: {
    closeModal: function () {
      this.$el.classList.toggle("active")
    }
  }
})

var contentContainer = {
  props: ["contenteditable", "wrapperId", "hideSm", "content"],
  data: function () {
    return {
      height: 80,
      heightd: 3,
      heightmin: 30,
      wrapperClass: {
        "column": true,
        "col-6": true,
        "col-sm-12": true,
        "hide-sm": this.hideSm
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
    decreaseHeight: function () {
      this.height = Math.max(this.height - this.heightd, this.heightmin)
    },
    increaseHeight: function () {
      this.height += this.heightd
    },
    sendEditedContent: function (ev) {
      this.$emit("input", ev.target.value)
    }
  },
  template: `
  <span :id="wrapperId" :class="wrapperClass">
    <div class="actual col-12 relative" :style="style">
      <textarea v-if="contenteditable" class="p-1" :value="content" @input="sendEditedContent">
      </textarea>
      <div v-else v-html="content" class="p-1">
      </div>
      <span class="controls absolute pr-2">
        <div class="height-minus mdi mdi-24px mdi-arrow-up-thick c-hand tooltip tooltip-left" data-tooltip="Decrease height" @click="decreaseHeight"></div>
        <div class="height-plus mdi mdi-24px mdi-arrow-down-thick c-hand tooltip tooltip-left" data-tooltip="Increase height" @click="increaseHeight"></div>
      </span>
    </div>
  </span>
  `
}

var content = new Vue({
  el: "#content",
  data: {
    rawDoc: "",
  },
  computed: {
    compiledDoc: function () {
      return mdconverter.makeHtml(this.rawDoc)
    }
  },
  components: {
    "content-container": contentContainer
  },
  methods: {
    switchTo: function (ev) {
      document.querySelectorAll("#content-tabs a").forEach((el) => {
        if (el == ev.target) el.classList.add("active")
        else el.classList.remove("active")
      })
      let allChildren = document.querySelector("#content #actual-content").children
      for (let i = 0; i < allChildren.length; i++) {
        if (allChildren[i].id == ev.target.dataset.target) allChildren[i].classList.remove("hide-sm")
        else allChildren[i].classList.add("hide-sm")
      }
    },
    updateRaw: function (raw) {
      this.rawDoc = raw
    }
  }
})

Vue.nextTick(function () {
  content.rawDoc = "# h1"
})