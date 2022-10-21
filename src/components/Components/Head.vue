<template>
  <div class="backgroundmain" :style="cssProps">
      <div id="mainbody" :style="cssProps">
        <svg v-show="this.lines.length" :height="this.myJson.canvas.height * this.multiplier" :width="this.myJson.canvas.width * this.multiplier" xmlns="http://www.w3.org/2000/svg" style="position: absolute; left: 0px; top: 0px;">
          <sline v-for="line in lines" :key="line.name" :params="line.properties" />
        </svg>
        <tiles v-for="elem  in tiless" :key="elem.name" :params="elem.properties" :name="elem.name" :screenPercentage="this.myJson.screenPercentage" :windowWidth="this.myJson.canvas.width" :windowHeight="this.myJson.canvas.height" :type="elem.type"/>
        <tooltiper v-for="elem in tooltipers" :key="elem.name" :params="elem"/>
        <helper v-for="elem in helper" :key="elem.name" :params="elem.properties"/>
      </div>
  </div>
</template>

<script>

import Tiles from "../Tiles/Tiles.vue";
import Sline from "../Primitives/Sline.vue";
import Tooltiper from "../Neightbours/Tooltiper.vue";
import Helper from '../Primitives/Helper.vue'

export default {
  name: "window",
  props: {
    myJson:{},
  },
  data() {
    return {
      multiplier: 1,
      multiplierwindow: 1,
      info: null,
      data: 0,
      lines: [],
      tiless: [],
      tooltipers: [],
      helper:[],
      width: 0,
      height: 0,
      windowname: null,
    };
  },

  components: {
    Tiles,
    Sline,
    Tooltiper,
    Helper,
  },

  computed: {
    cssProps() {
      return {
        "--margin": 'auto',
        "--width": this.myJson.canvas.width * this.multiplier  + "px",
        "--height": this.myJson.canvas.height * this.multiplier + "px",
        "--background": "#" + this.myJson.canvas.background,
        "--borderRadius": this.myJson.canvas.borderRadius + "px",
        "--borderThickness": '1px',
        '--backgroundArea1': parseInt(this.myJson.canvas.backgroundArea.slice(0,2), 16),
        '--backgroundArea2': parseInt(this.myJson.canvas.backgroundArea.slice(2,4), 16),
        '--backgroundArea3': parseInt(this.myJson.canvas.backgroundArea.slice(4,6), 16),
        '--backgroundArea4': parseInt(this.myJson.canvas.backgroundArea.slice(6,8), 16)/(255-0.06) ,
        '--fontsize' :  15 + 'px',
        "--zindex": 1
      };
    },
    mainheight(){
      return this.$store.getters.mainheight
    },
  },  
  methods: {
    reportWindowSize(){
      this.$store.dispatch("updatemainheight", this.myJson.canvas.height * this.multiplier )
      const multiplierwindow = ((window.innerWidth -2 )/ this.width)
      this.multiplier = this.multiplierwindow * multiplierwindow
    }
  },

  created() {
    this.width = window.innerWidth-2;
    this.height = window.innerHeight ;
    this.windowname = '>:Header'
    this.multiplierwindow = (this.width) / this.myJson.canvas.width
    window.addEventListener('resize', this.reportWindowSize)
    this.$store.dispatch("changemainheight", this.myJson.canvas.height * this.multiplierwindow)
    this.multiplier = this.multiplierwindow
    if (this.myJson.canvas.width * this.multiplierwindow > window.innerWidth) {
      this.multiplierwindow = window.innerWidth / (this.myJson.canvas.width + 50)
    }
    this.myJson.widgets.forEach(element => {
      let res = element;
      if (res.type.startsWith("primitives/Line")) {
        this.lines.push(res);
      }
      if (
        res.type.startsWith("tile") ||
        res.type.startsWith("primitives/Text") ||
        res.type.startsWith("Tiles")
      ) {
        this.tiless.push(res);
      }
      if (
        res.type.startsWith("tooltip") ||
        res.type.startsWith("neightbours/Tooltiper") ||
        res.type.startsWith("neightbours/Navigator")) 
      {
        this.tooltipers.push(res);  
      }
      if (res.type.startsWith("primitives/Helper")) {
        this.helper.push(res);
      }
    });
  },
};
</script>

<style scoped>
#mainbody {
  margin: var(--margin);
  position: relative;
  width: var(--width);
  height: var(--height);
  color: white;
  background-color: var(--background);
  /* background-color: #252525FF; */
  border: solid var(--borderThickness) white;
  /* border: solid var(--borderThickness) #252525ff; */
  border-radius: var(--borderRadius);
}
.backgroundmain{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0;
  background: rgba(var(--backgroundArea1),var(--backgroundArea2),var(--backgroundArea3), var(--backgroundArea4));
  height: var(--backgroundheight);
  z-index: 0;
}
</style>
