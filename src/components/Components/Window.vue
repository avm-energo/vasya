<template>
  <div :class="typewindow == 'modalwindow' ? 'background' : [ typewindow != 'subscreen' ? 'backgroundmain' : 'background']" :style="cssProps" @click.self="[typewindow == 'modalwindow' ? closejson() : '']">
    <!-- <div v-clickoutside:[typewindow]="onClickOutside"> -->
    <div>
      <div id="head" v-show="infoFromTooltiper?.title">
        <div id="headtext"><p>{{ infoFromTooltiper?.title }}</p></div>
        <div id="closewindow" @click.stop="closejson"><p>X</p></div>
      </div>
      <div id="mainBodyBackground" :style="cssProps">
        <div id="mainbody" :style="cssProps">
          <imagetrans v-for="elem in imagestrans" :key="elem.name" :params="elem.properties"/>
          <imagelogo v-for="elem in imageslogo" :key="elem.name" :params="elem.properties"/>

          <svg v-show="this.lines.length" :height="this.myJson.canvas.height * this.multiplier" :width="this.myJson.canvas.width * this.multiplier" xmlns="http://www.w3.org/2000/svg" style="position: absolute; left: 0px; top: 0px;">
            <sline v-for="line in lines" :key="line.name" :params="line.properties" />
          </svg>
          <tiles v-for="elem  in tiless" :key="elem.name" :params="elem.properties" :name="elem.name" :screenPercentage="this.myJson.screenPercentage" :windowWidth="this.myJson.canvas.width" :windowHeight="this.myJson.canvas.height" :type="elem.type"/>
          <commands v-for="elem in commandss" :key="elem.name" :params="elem"/>
          <!-- было windowname -->
          <subscreen v-for="elem in subscreens" :key="elem.name" :params="elem" :name="elem.type" :namewindow="this.namewindow"/>
          <tooltiper v-for="elem in tooltipers" :key="elem.name" :params="elem" :name="elem.name" :ip="this.ip"/>
          <chart v-for="elem in charts" :key="elem.name" :params="elem"/>
          <helper v-for="elem in helper" :key="elem.name" :params="elem.properties"/>
          <duval v-for="elem in duval" :key="elem.name" :params="elem.properties" :name="elem.name" :ip="this.ip"/>
          <vector v-for="elem in vector" :key="elem.name" :params="elem.properties" :name="elem.name"/>
          <horizontals v-for="elem in horizontal" :key="elem.name" :params="elem.properties" :name="elem.name"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Tiles from "../Tiles/Tiles.vue";
import Apply from "../Commands/Apply.vue";
import Sline from "../Primitives/Sline.vue";
import Tooltiper from "../Neightbours/Tooltiper.vue";
import Subscreen from "../Neightbours/Subscreen.vue";
import Imagetrans from '../Primitives/Image.vue';
import Imagelogo from '../Primitives/Logo.vue';
import Chart from '../Charts/Charts.vue';
import Helper from '../Primitives/Helper.vue'
import Duval from '../Specials/DuvalTriangle.vue'
import Vector from '../Specials/VectorDiagram.vue'
import Commands from "../Commands/Commands.vue";
import Meters from "../Scales/Meter.vue"
import Horizontals from "../Scales/Horizontal.vue";


export default {
  name: "window",
  props: {
    myJson:{},
    subscreensize:{default:1},
    //фон для вложенный subscreen
    boolback:{default:true},
    title:{default:''},
    typewindow:{default: 'modalwindow'},
    namewindow:{default:''},
    subscreenname:{default: ''},
    path:{default: '',},
  },
  data() {
    return {
      multiplierwindow: 1,
      multiplierwindoww : 1,
      multiplierwindowww : 1,
      multiplier: 1,
      resize: [],
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
      vector: [],
      commandss:[],
      horizontal:[],
      width: 0,
      height: 0,
      windowname: null,
      titlebool: null,
      titletext: null,
      windowpath: null,
      infoFromTooltiper: null,
    };
  },

  components: {
    Tiles,
    Commands,
    Apply,
    Sline,
    Tooltiper,
    Subscreen,
    Imagetrans,
    Imagelogo,
    Chart,
    Helper,
    Duval,
    Vector,
    Horizontals,
    Meters

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
    ip() {
      return this.$store.getters.ip;
    },
    cssProps() {
      return {
        "--margin": [this.typewindow == 'modalwindow' ? 0 : 'auto'],
        // "--windowWidth": [this.boolback ? this.width + "px": this.myJson.canvas.width*this.subscreensize + "px"],
        "--windowWidth": [this.boolback ? this.width + "px": this.myJson.canvas.width*this.multiplier + "px"],
        // "--windowHeight": [this.boolback ? this.height -1 + "px": this.myJson.canvas.height*this.subscreensize + "px"],
        // -------------------------------костыль тут---\/------появляются слайдеры
        "--windowHeight": [this.boolback ? this.height - 1 + "px": this.myJson.canvas.height* this.multiplier + "px"],
        "--width": this.myJson.canvas.width * this.multiplier + "px",
        "--height": [this.myJson.canvas.height * this.multiplier > window.innerHeight ? this.height - 50 : this.myJson.canvas.height * this.multiplier] + "px",
        "--background": "#" + this.myJson.canvas.background,
        "--borderRadius": [this.myJson.canvas.borderRadius || 0]  + 'px',
        "--borderThickness": [this.typewindow != 'modalwindow' ? this.myJson.canvas.borderThickness + "px" : '1px'],
        "--borderColor": '#' + this.infoFromTooltiper?.windowBorderBrush,
        '--headerFontsize' :  this.infoFromTooltiper?.titleFontSize + 'px',
        '--headerBackground' : '#' + this.infoFromTooltiper?.windowBackground,
        '--headerForeColor' : '#' + this.infoFromTooltiper?.windowForeground,
        "--zindex": [this.typewindow != 'modalwindow' ? '' : 1],
        "--subscreenScale": [this.subscreensize || 1],

      };
    },
    mainheight(){
      return this.$store.getters.mainheightwindowname
    },
    updatedmainheight(){
      return this.$store.getters.updatedmainheight
    },
    mainmultiplier(){
      return this.$store.getters.mainmultiplier
    }
  },

  watch: {
    myJson(){
      this.updateJson()
    },
    mainmultiplier(newVal, oldVal) {
      this.multiplier = this.multiplierwindow * (this.mainmultiplier[1]/this.multiplierwindowww)
    },
  },

  methods: {
    reportWindowSize(){
      this.multiplier = window.innerWidth * window.innerHeight * this.multiplier / (this.width * this.height);
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.multiplier = this.multiplierwindow * (this.mainmultiplier[1]/this.multiplierwindowww)
      if (this.typewindow == "modalwindow") {
        if (this.myJson.canvas.width * this.multiplier + 30 > window.innerWidth) {
          this.multiplier = this.multiplier / ((this.myJson.canvas.width * this.multiplier)/window.innerWidth)
        }
      }

    },
    closejson(){
      this.$store.dispatch('closewindow', this.windowname)
      window.removeEventListener('resize', this.reportWindowSize)
    },
    updateJson(){
      ["lines", "tiless", "tooltipers", "subscreens", "imagestrans",
      "imageslogo", "charts", "helper", "duval", "commandss",
      "meter", "horizontal"].forEach(key => this[key] = []);
      this.infoFromTooltiper = this.myJson.infoFromTooltiper?.properties
      // console.log(this.myJson)
      ;(this.myJson.widgets.$id == undefined ? this.myJson.widgets : this.myJson.widgets.$values).forEach(element => {
        let res = element;

        if (res.type.startsWith("primitives/Line")) {
          this.lines.push(res);
        } else
        if (
            res.type.startsWith("tile") ||
            res.type.startsWith("primitives/Text") ||
            res.type.startsWith("Tiles")
        ) {
          this.tiless.push(res);
        } else
        if (
            res.type.startsWith("tooltip") ||
            res.type.startsWith("neightbours/Tooltiper") ||
            res.type.startsWith("neightbours/Navigator"))
        {
          this.tooltipers.push(res);
        } else
        if (res.type.startsWith("neightbours/Subscreen") || (res.type.startsWith("neightbours/Renter"))) {
          this.subscreens.push(res);
        } else
        if (res.type.startsWith("primitives/Image")) {
          this.imagestrans.push(res);
        } else
        if (res.type.startsWith("primitives/Logo")) {
          this.imageslogo.push(res);
        } else
        if (res.type.startsWith("charts") || (res.type.startsWith("view/ClassicHystogramm")) || (res.type.startsWith("trends/TrendViewer"))){

          this.charts.push(res);
        } else
        if (res.type.startsWith("primitives/Helper")) {
          this.helper.push(res);
        } else
        if (res.type.startsWith("specials/DuvalTriangle")) {
          this.duval.push(res);
        }
        if (res.type.startsWith("specials/VectorDiagram")) {
          this.vector.push(res);
        } else
        if (res.type.startsWith("commands")) {
          this.commandss.push(res)
        } else 
        if (res.type.startsWith("scales/Meter")) {
          this.meter.push(res)
        } else
        if (res.type.startsWith("scales/Horizontal")) {
          this.horizontal.push(res)
        }
      });
      this.multiplierwindow = 1
      this.multiplierwindoww = 1
      this.multiplierwindowww = 1
      this.multiplier = 1
      this.multiplierwindow = this.multiplierwindow * this.subscreensize
      if (this.infoFromTooltiper) {
        this.windowname = this.infoFromTooltiper?.path.split('\\').join('')
      } else {
        this.windowname = this.namewindow.split('\\').join('')
      }
      if (this.myJson.path){
        this.windowpath = this.myJson.path
      } else {
        this.windowpath = this.namewindow
      }
      if (this.myJson.screenPercentage){
        let ss = ((window.innerHeight - 100) * (this.myJson.screenPercentage/100))/this.myJson.canvas.height
        this.multiplierwindow = this.multiplierwindow * ss
      }

      this.width = window.innerWidth;
      this.height = window.innerHeight;

      if (this.myJson.canvas.width * this.multiplierwindow > window.innerWidth) {
        this.multiplierwindow = window.innerWidth / (this.myJson.canvas.width + 100)
      }

      this.multiplier = this.multiplierwindow
      this.multiplierwindoww = this.multiplier
      this.multiplierwindowww = this.mainmultiplier[1]
    }
  },
  created() {
    this.updateJson()
    if (this.myJson.title) {
      if (this.myJson.title.bool) {
        this.titletext = this.myJson.title.text
        this.titlebool = true
      } else {
        this.titletext = ''
        this.titlebool = false
      }
    }
    window.addEventListener('resize', this.reportWindowSize)
    

  },
  updated() {
    // Этот метод вызывается после перерендера компонента
    // console.log('Компонент Window был перерендерен');
  },
  mounted(){
    
  }
};
</script>

<style scoped>
#mainbody {
  /* transform: scale(var(--subscreenScale)); */
  margin: var(--margin);
  position: relative;
  width: var(--width);
  height: var(--height);
  color: white;
  background-color: var(--background);
  border-style: solid;
  border-width: var(--borderThickness);
  border-color: var(--borderColor);
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
  background: rgba(0, 0, 0, 0.45);
  width: var(--windowWidth);
  height: var(--windowHeight);
  margin-bottom: 24px;
  z-index: 2;
}
#head {
  border: solid 1px var(--background);
  color: var(--headerForeColor);;
  padding: 0px;
  display: flex;
  justify-content: space-between;
  width: var(--width);
  height: 25px;
  background-color: var(--headerBackground);
  margin-bottom: 5px;
  padding-left: 10px;
  /* cursor: grab; */
}
#headtext{
  height: 100%;
  font-size: rgb(var(--headerFontsize));
  /* vertical-align: text-bottom; */
  user-select: none;
}
#headtext p, #closewindow p{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#closewindow{
  user-select: none;
  color:rgb(65, 65, 255);
  font-size:18px;
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
#mainBodyBackground{
  background-color: var(--headerBackground);

}
</style>
