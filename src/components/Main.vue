<template>
  <div id="main" v-if="!isLoading">
    <sonica-head :myJson="head" typewindow="head" />
    <sonica-footer :myJson="footer" />
    <sonica-main :myJson="main" typewindow="main" />
    <sonica-window
      v-for="elem in elems"
      :key="elem.name"
      :myJson="elem"
      :namewindow="elem.typename"
      typewindow="modalwindow"
    />
  </div>
  
</template>

<script>
import SonicaWindow from "./Components/Window.vue";
import SonicaFooter from "./Components/Footer.vue";
import SonicaHead from './Components/Head.vue'
import SonicaMain from './Components/Main.vue'

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
    };
  },

  components: { SonicaWindow, SonicaFooter, SonicaHead, SonicaMain },

  methods: {
    resetTimer() {
      this.innactivetime = 0;
      this.innactive = false;
    },
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
  // mounted(){
  //   this.$store.dispatch("updateElems", '>:\\Logic')
  // },
  computed: {
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
</style>
