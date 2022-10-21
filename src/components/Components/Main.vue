<template>
  <div :class="typewindow != 'subscreen' ? 'backgroundmain' : 'background'" :style="cssProps">
    <!-- <div v-clickoutside:[typewindow]="onClickOutside"> -->
    <div>
      <div id="mainbody" :style="cssProps">
        <imagetrans v-for="elem in imagestrans" :key="elem.name" :params="elem.properties"/>
        <svg v-show="this.lines.length" :height="this.myJson.canvas.height * this.multiplier" :width="this.myJson.canvas.width * this.multiplier" xmlns="http://www.w3.org/2000/svg" style="position: absolute; left: 0px; top: 0px;">
          <sline v-for="line in lines" :key="line.name" :params="line.properties" />
        </svg>
        <tiles v-for="elem  in tiless" :key="elem.name" :params="elem.properties" :name="elem.name" :screenPercentage="this.myJson.screenPercentage" :windowWidth="this.myJson.canvas.width" :windowHeight="this.myJson.canvas.height" :type="elem.type"/>
        <subscreen v-for="elem in subscreens" :key="elem.name" :params="elem" :name="elem.type" :namewindow="this.windowname"/>
        <!-- <txtarg /> -->
        <!-- <radioarg></radioarg> -->
        <!-- <passwordarg></passwordarg> -->
        <!-- <ipadressarg></ipadressarg> -->
        <!-- <comboarg></comboarg> -->
        <!-- <boolarg></boolarg> -->
        <!-- <bitmaskarg></bitmaskarg> -->
        <!-- <sliderarg></sliderarg> -->
        <!-- <apply></apply> -->
        <tooltiper v-for="elem in tooltipers" :key="elem.name" :params="elem"/>
        <imagelogo v-for="elem in imageslogo" :key="elem.name" :params="elem.properties"/>
        <chart v-for="elem in charts" :key="elem.name" :params="elem"/>
        <helper v-for="elem in helper" :key="elem.name" :params="elem.properties"/>
        <duval v-for="elem in duval" :key="elem.name" :params="elem.properties" :name="elem.name"/>
        <!-- <charttest/> -->
      </div>
    </div>
  </div>
</template>

<script>

import Tiles from "../Tiles/Tiles.vue";
import Txtarg from "../Commands/Txtarg.vue";
import Radioarg from "../Commands/Radioarg.vue";
import Passwordarg from "../Commands/Passwordarg.vue";
import Ipadressarg from "../Commands/Ipadressarg.vue";
import Comboarg from "../Commands/Comboarg.vue";
import Boolarg from "../Commands/Boolarg.vue";
import Bitmaskarg from "../Commands/Bitmaskarg.vue";
// import Sliderarg from "../Commands/Sliderarg.vue";
import Apply from "../Commands/Apply.vue";
import Sline from "../Primitives/Sline.vue";
import Tooltiper from "../Neightbours/Tooltiper.vue";
import Subscreen from "../Neightbours/Subscreen.vue";
import Imagetrans from '../Primitives/Image.vue';
import Imagelogo from '../Primitives/Logo.vue';
import Chart from '../Charts/Charts.vue';
import Helper from '../Primitives/Helper.vue'
import Duval from '../Specials/DuvalTriangle.vue'
import Charttest from '../Charts/Test.vue'

export default {
  name: "window",
  props: {
    myJson:{},
    subscreensize:{default:1},
    //фон для вложенный subscreen
    boolback:{default:true},
    typewindow:{},
    namewindow:{default:''},
    subscreenname:{default: ''}
  },
  data() {
    return {
      multiplierwindow: 1,
      multiplier: 1,
      info: null,
      data: 0,
      lines: [],
      tiless: [],
      tooltipers: [],
      subscreens:[],
      imagestrans:[],
      imageslogo:[],
      charts:[],
      helper:[],
      duval:[],
      width: 0,
      height: 0,
      windowname: null,
    };
  },

  components: {
    Tiles,
    Txtarg,
    Radioarg,
    Passwordarg,
    Ipadressarg,
    Comboarg,
    Boolarg,
    Bitmaskarg,
    // Sliderarg,
    Apply,
    Sline,
    Tooltiper,
    Subscreen,
    Imagetrans,
    Imagelogo,
    Chart,
    Helper,
    Duval,
    Charttest
    
  },

  // directives: {
  //     clickoutside: {
  //       beforeMount(el, binding, vnode) {
  //         if (binding.arg == 'modalwindow'){
  //           el.clickOutsideEvent = function(event) {
  //               if (!(el === event.target || el.contains(event.target))) {
  //                 binding.value(event, el);
  //               }
  //           };
  //             document.body.addEventListener('click', el.clickOutsideEvent);
  //         }
  //       },
  //     unmounted(el) {
  //       // if (binding.value == 'modalwindow'){
  //         document.body.removeEventListener('click', el.clickOutsideEvent);
  //       // }
  //     }
  //   }
  // },

  computed: {
    cssProps() {
      return {
        "--margin": 'auto',
        "--windowWidth": [this.boolback ? this.width + "px": this.myJson.canvas.width*this.multiplier + "px"],
        "--windowHeight": [this.boolback ? this.height + "px": this.myJson.canvas.height* this.multiplier + "px"],
        "--width": this.myJson.canvas.width * this.multiplier + "px",
        "--height": this.myJson.canvas.height * this.multiplier + "px",
        "--background": "#" + this.myJson.canvas.background,
        "--borderRadius": this.myJson.canvas.borderRadius + "px",
        "--borderThickness": [this.typewindow != 'modalwindow' ? this.myJson.canvas.borderThickness + "px" : '1px'],
        '--backgroundArea1': parseInt(this.myJson.canvas.backgroundArea.slice(0,2), 16),
        '--backgroundArea2': parseInt(this.myJson.canvas.backgroundArea.slice(2,4), 16),
        '--backgroundArea3': parseInt(this.myJson.canvas.backgroundArea.slice(4,6), 16),
        '--backgroundArea4': [this.typewindow == 'modalwindow' ? ((parseInt(this.myJson.canvas.backgroundArea.slice(6,8), 16))/255-0.06) : ((parseInt(this.myJson.canvas.backgroundArea.slice(6,8), 16))/255)] ,
        '--fontsize' :  15 + 'px',
        '--backgroundheight': [this.updatedmainheight ? window.innerHeight - (this.updatedmainheight) - 24 : this.mainheight] + 'px',
        "--zindex": [this.typewindow != 'modalwindow' ? '' : 1]
      };
    },
    mainheight(){
      return this.$store.getters.mainheight
    }, 
    updatedmainheight(){
      return this.$store.getters.updatedmainheight
    }
  },  

  methods: {
    reportWindowSize(){
      let multiplierwindow = (window.innerHeight - (this.updatedmainheight) - 28)/this.myJson.canvas.height
      if (multiplierwindow * this.myJson.canvas.width > window.innerWidth){
        multiplierwindow = multiplierwindow * window.innerWidth / (multiplierwindow * this.myJson.canvas.width) - 0.005
        this.$store.dispatch('mainmultiplier', [true, this.multiplier])
      } else {
        this.$store.dispatch('mainmultiplier', [false, this.multiplier])
      }
      this.multiplier =  multiplierwindow
    },
    closejson(){
      this.$store.dispatch('closewindow', this.windowname)
    }
  },

  created() {
    window.addEventListener('resize', this.reportWindowSize)
    this.width = window.innerWidth - 2
    this.height = window.innerHeight ;
    this.windowname = this.namewindow.split('\\').join('')
    this.windowname = '>:MAIN'
    this.multiplierwindow = (this.mainheight - 4)/this.myJson.canvas.height
    
    if (this.multiplierwindow * this.myJson.canvas.width > window.innerWidth){
      this.multiplierwindow = this.multiplierwindow * window.innerWidth / (this.multiplierwindow * this.myJson.canvas.width) - 0.005
    }
    if (this.myJson.canvas.width * this.multiplierwindow > window.innerWidth) {
      this.multiplierwindow = window.innerWidth / (this.myJson.canvas.width + 50)
    }
    this.multiplier = this.multiplierwindow
    this.$store.dispatch('mainmultiplier', [true, this.multiplier])
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
      if (res.type.startsWith("neightbours/Subscreen")) {
        this.subscreens.push(res);
      }
      if (res.type.startsWith("primitives/Image")) {
        this.imagestrans.push(res);
      }
      if (res.type.startsWith("primitives/Logo")) {
        this.imageslogo.push(res);
      }
      if (res.type.startsWith("charts") || (res.type.startsWith("view/ClassicHystogramm")) || (res.type.startsWith("trends/TrendViewer"))){
        
        this.charts.push(res);
      }
      if (res.type.startsWith("primitives/Helper")) {
        this.helper.push(res);
      }
      if (res.type.startsWith("specials/DuvalTriangle")) {
        this.duval.push(res);
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
  border: solid var(--borderThickness) white;
  border-radius: var(--borderRadius);
  
}
.background {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; 
  position: absolute;
  left: 0px;
  top: 0px;
  background: rgba(var(--backgroundArea1),var(--backgroundArea2),var(--backgroundArea3), var(--backgroundArea4));
  width: var(--windowWidth);
  height: var(--windowHeight)
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
#head {
  border: solid 1px var(--background);
  color: white;
  padding: 0px;
  display: flex;
  justify-content: space-between;
  width: var(--width);
  height: 25px;
  background-color: var(--background);
  margin-bottom: 5px;
  /* cursor: grab; */
}
#headtext{
  padding: 3px;
  font-size: var(--fontsize);
  /* vertical-align: text-bottom; */
  user-select: none;
}
#closewindow{
  user-select: none;
  color:rgb(65, 65, 255); 
  font-size:20px; 
  width: 25px; 
  text-align:center; 
  height: 100%;
  margin: 0;
}
#closewindow:hover{
  background-color: rgb(4, 174, 253);
}
#closewindow:active{
  background-color: rgb(4, 21, 253);
}
</style>
