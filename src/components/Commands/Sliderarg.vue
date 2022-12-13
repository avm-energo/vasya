<template>
  <!-- <div class="sliderarg1" :style="[ sliderarg1.Orientation == 'Vertical' ? { transform: 'rotate(-90deg)' } : '', ]"> -->
  <div class="sliderarg" :style="cssProps">
      <vue3-slider v-model="sliderarg.value" color="blue" track-color="#F2F2F2" :min="this.params.lowRange" :max="this.params.hiRange" :orientation="this.params.orientation.toLowerCase()" :step="this.params.changingTick" :tooltip=true
      @drag-end="[this.sliderarg.trigger == 'ChangeOnEnd' ? some() : this.sliderarg.trigger == 'ButtonApply' ? somepush() : '']" @change="[this.sliderarg.trigger == 'ChangeRealtime' ? some() : '']"/>
  </div>
</template>

<script>
// import CustomSlider from "vue-custom-range-slider";
import slider from "vue3-slider"
import axios from "axios";

export default {
  name: "app",
  props:['params','name'],
  components: {
    "vue3-slider": slider
  },
  data() {
    return {
      sliderarg: {
        Name: null,
        value: null,
        lastvalue: null,
        trigger: null,
      },
    };
  },
  created(){
    this.sliderarg.trigger = this.params.trigger
    this.sliderarg.value = this.params.value
    this.sliderarg.Name = this.name
  },

  methods: {
    async some() {
      if (this.sliderarg.value != this.sliderarg.lastvalue){
        console.log('asd')
        const article =`
          ${this.sliderarg.value}
        `;
        const headers = { 
            'Content-Type': 'application/json',
        };
        await axios.post(`http://localhost:5201/api/nodes/main/widget/${this.encript((new TextEncoder()).encode(this.sliderarg.Name))}/query/write-arg`, article, { headers })
       
        // this.chartDataArr = await axios.post(`http://localhost:5201/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.windowname.split(':').join(':\\')))}/widget/${this.encript((new TextEncoder()).encode(this.name))}/query/trend-history`, article, { headers })
      }
      this.sliderarg.lastvalue = this.sliderarg.value
    },
    somepush(){
      const res = {'namewidget': this.sliderarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this.sliderarg.value}
      this.$store.dispatch('addcommandwidgetmass', res)
    },
    encript(values) {
      const  Alphabet = "12345678" + "9ABDEFGH" + "JKLMNPQR" + "STUVWXYZ";
      var bitsCount = 8 * values.length;
      var ans = new Array(Math.trunc(bitsCount / 5) + (bitsCount%5==0?0:1));
      for (let i = 0; i < ans.length; i++) {
        var bitNum = i * 5;
        var byteNum = Math.trunc(bitNum / 8);
        var byteOffset = bitNum % 8;  
        var symbol = values[byteNum] >> byteOffset;
        if (byteOffset > 3 && byteNum<(values.length-1))
        {
          var symbolOffset = 8 - byteOffset;
          symbol |= values[byteNum+1]<<symbolOffset;
        }
        symbol &= 0b11111; 
        ans[i] = Alphabet[symbol];
      }
      return ans.join("")
    },
  },
  
  computed: {
    cssProps() {
      return {
        "--x": (this.params.x / 1) * this.$parent.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.$parent.multiplier + "px",
        "--width": (this.params.width / 1) * this.$parent.$parent.multiplier + "px",
        "--height": (this.params.height / 1) * this.$parent.$parent.multiplier + "px",
      };
    }
  },
};
</script>

<style scoped>
/* @import "vue-custom-range-slider/dist/vue-custom-range-slider.scss"; */
.sliderarg {
  left: var(--x);
  top: var(--y);
  position: absolute;
  width: var(--width);
  height: var(--height);
  display: var(--x);
  align-items: var(--x);
}
</style>
