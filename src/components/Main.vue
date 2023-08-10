<template>
  <div id="main" v-if="!isLoading">
    <sonica-head v-if="head!=null" :myJson="head" typewindow="head" />
    <sonica-footer v-if="footer!=null" :myJson="footer" />
    <sonica-main :myJson="main" typewindow="main" />
    <sonica-window
      v-for="elem in elems"
      :key="elem.name"
      :myJson="elem"
      :namewindow="elem.typename"
      typewindow="modalwindow"
    />
    <div v-if="linkerShow" class="sonica-linker">
      <sonica-linker @close="linkerClose" />
    </div>
    <!-- develop -->
  </div>
  
</template>

<script>
import SonicaWindow from "./Components/Window.vue";
import SonicaFooter from "./Components/Footer.vue";
import SonicaHead from './Components/Head.vue'
import SonicaMain from './Components/Main.vue'
import SonicaLinker from './Linker/Linker.vue'

export default {
  name: "Main",
  data() {
    return {
      info: null,
      mas: [],
      tick: null,
      innactivetime: 0,
      innactive: false,
      height: null,
      multiplier: null,
      linkerShow: false
    };
  },

  components: { SonicaWindow, SonicaFooter, SonicaHead, SonicaMain, SonicaLinker },

  methods: {
    resetTimer() {
      this.innactivetime = 0;
      this.innactive = false;
    },

    linkerClose() {
      this.linkerShow = false;
    }
  },
  created() {
    this.height = window.innerHeight
    setInterval(() => {
      if (!this.innactive) {
        this.innactivetime++;
        console.log(this.innactivetime);
        if (this.innactivetime >= 30) {
          this.innactive = true;
          this.$store.dispatch("innactivereset");
        }
      }
    }, 60000);
    addEventListener ('mousemove', this.resetTimer)

  },
  mounted(){
    this.linkerRedirect = function (e) {
      if (e.code === 'KeyL' && e.ctrlKey) {
        e.preventDefault();
        this.linkerShow = true;
      }
    };
    // this.$store.dispatch("updateElems", '>:\\Logic')
    document.addEventListener('keydown', this.linkerRedirect.bind(this))
  },
  computed: {
    // atoms() {
    //   return this.$store.getters.atoms;
    // },
    // tree() {
    //   return this.$store.getters.tree;
    // },
    elems() {
      return this.$store.getters.elems;
    },
    head() {
      return this.$store.getters.head;
    },
    footer() {
      return this.$store.getters.footer;
    },
    main() {
      return this.$store.getters.main;
    },
    isLoading() {
      return this.$store.getters.isLoading;
    },
    //   cssProps(){
    //     return {
    //       '--width': [this.myJson.properties.canvas.width>this.myJson.properties.canvas.height ? Math.round(this.myJson.properties.canvas.width/(1920/this.width)) + 'px' : Math.round(this.width/(this.myJson.properties.canvas.height/this.myJson.properties.canvas.width)) + 'px'],
    //       '--height': [this.myJson.properties.canvas.height>this.myJson.properties.canvas.width ? Math.round(this.myJson.properties.canvas.height/(1080/this.height)) + 'px' : Math.round(this.height/(this.myJson.properties.canvas.width/this.myJson.properties.canvas.height)) + 'px'],
    //       '--left': (this.width - Math.round(this.myJson.properties.canvas.width/(1920/this.width)))/2 + 'px',
    //       '--backgroundArea': '#' + this.myJson.properties.canvas.backgroundArea
    //     }
    //   },
  },

  beforeCreate() {
    this.$store.dispatch("fetchElems");
    // this.$store.dispatch("fetchTree");
    // setInterval(() => this.$store.dispatch("fetchAtoms"), 1000);
  },
};
</script>

<style>
body {
  -webkit-user: none;
}
#main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: v-bind('height');
}

.sonica-linker {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
  top: 0;

  overflow-y: hidden;
}

</style>
