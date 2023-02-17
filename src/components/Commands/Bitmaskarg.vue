<template>
  <div>
    <div class="bitmaskarg" @click.stop="bitmaskarg.window = !bitmaskarg.window" :style="cssProps">
      <span class="bitmaskarg_star" v-show=" bitmaskarg.value != bitmaskarg.Notification && bitmaskarg.ShowNotification ">*</span>
      <span class="bitmaskarg_value">0x{{ bitmaskargvalue }}</span>
    </div>
    <div class="bitmaskarg_table"  v-show="bitmaskarg.window" v-click-outside="onClickOutside" :style="cssProps1">
      <table class="bitmaskarg_table_style"  ref="bit" :style="cssProps">
        <tr>
          <td colspan="3" style="text-align: left; padding:5px" >Bit field</td>
        </tr>
        <tr>
          <td style="padding:5px">Position</td>
          <td style="padding:5px">Description</td>
          <td style="padding:5px">Value</td>
        </tr>
        <tr v-for="elem in bitmaskarg.masvalue" :key="elem.id">
          <td>{{ elem.position }}</td>
          <td style="padding:0 5px 0 5px;">{{ elem.description }}</td>
          <td>
            <input type="checkbox" v-model="elem.value" @change="[elem.value ? BigInt(bitmaskarg.value += Math.pow(2, elem.position)) : BigInt(bitmaskarg.value -= Math.pow(2, elem.position)),], some(bitmaskarg)"/>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import vClickOutside from "v-click-outside";

export default {
  name: "app",
  props: ['params' , 'name', 'ip'],
  data() {
    return {
      leftside:null,
      widthtable:null,
      bitmaskarg: {
        Name: null,
        value: 0,
        masvalue: null,
        window: true,
      },
    };
  },
  methods: {
    onClickOutside(event) {
      if (!(event.target._prevClass == "bitmaskarg_value")) {
        this.bitmaskarg.window = false;
      }
    },
    async some(){
      if (this.params.personalSend) {
        const article =`
          ${this.bitmaskargvalue}
        `;
        const headers = { 
            'Content-Type': 'application/json',
        };
        await axios.post(`http://${this.ip}/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.namewindow))}/widget/${this.encript((new TextEncoder()).encode(this.bitmaskarg.Name))}/query/write-arg`, article, { headers })
      } else {
        const res = {'namewidget': this.bitmaskarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this.bitmaskarg.value}
        this.$store.dispatch('addcommandwidgetmass', res)
      }
    },
    encript(values) {
      const Alphabet = "12345678" + "9ABDEFGH" + "JKLMNPQR" + "STUVWXYZ";
      var bitsCount = 8 * values.length;
      var ans = new Array(Math.trunc(bitsCount / 5) + (bitsCount % 5 == 0 ? 0 : 1));
      for (let i = 0; i < ans.length; i++) {
          var bitNum = i * 5;
          var byteNum = Math.trunc(bitNum / 8);
          var byteOffset = bitNum % 8;
          var symbol = values[byteNum] >> byteOffset;
          if (byteOffset > 3 && byteNum < (values.length - 1)) {
              var symbolOffset = 8 - byteOffset;
              symbol |= values[byteNum + 1] << symbolOffset;
          }
          symbol &= 0b11111;
          ans[i] = Alphabet[symbol];
      }
      return ans.join("")
    },
  },
  directives: {
    clickOutside: {
      beforeMount(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event, el);
          }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      }
    }
  },
  created(){
    // this.bitmaskarg.value = this.params.value
    this.bitmaskarg.masvalue = this.params.settings
    this.bitmaskarg.Name = this.name
    setTimeout(()=>{this.bitmaskarg.window = false},1  )
    // console.log(this.params.x * this.$parent.$parent.multiplier)
    
  },
  mounted(){
    const bit = this.$refs.bit
    this.widthtable = bit.getBoundingClientRect().width
    this.leftside = this.params.x * this.$parent.$parent.multiplier  + this.widthtable + 84.67 > document.documentElement.clientWidth
  },
  computed: {
    bitmaskargvalue() {
      return this.bitmaskarg.value.toString(16).toUpperCase();
    },
    cssProps() {
      return {
        "--x": this.params.x * this.$parent.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.$parent.multiplier + "px",
        "--width": this.params.width * this.$parent.$parent.multiplier + "px",
        "--height": (this.params.height / 1) * this.$parent.$parent.multiplier + "px",
        "--background": "#" + this.params.backgroundColor,
        "--borderBrush": "#" + this.params.borderColor,
        "--foreground": "#" + this.params.foreground,
        "--fontsize": this.params.fontSize * this.$parent.$parent.multiplier + "px",
      };
    },
    cssProps1(){
      return{
        "--ytable": (this.params.y + this.params.height) * this.$parent.$parent.multiplier + "px",
        "--xtable": [this.leftside ? this.params.x * this.$parent.$parent.multiplier - this.widthtable :  this.params.x * this.$parent.$parent.multiplier] + "px",
        "--background": "#" + this.params.backgroundColor,
      }
    }
  },
};
</script>

<style scoped>
.bitmaskarg {
  box-sizing: border-box;
  left: var(--x);
  top: var(--y);
  position: absolute;
  width: var(--width);
  height: var(--height);
  background-color: var(--background);
  border: solid 1px var(--borderBrush);
  user-select: none;
  display: flex;
  align-items: center;
}
.bitmaskarg:hover {
  background-color: rgb(22,70,108);
}
.bitmaskarg:active {
  background-color: rgb(7, 103, 179);
}
.bitmaskarg_star {
  position: absolute;
  width: 10px;
}
.bitmaskarg_value {
  font-size: 12px;
  border: none;
  width: 100%;
  text-align: center;
}
.bitmaskarg_table {
  background-color: #252525;
  z-index: 1;
  font-size: 12px;
  position: absolute;
  left: var(--xtable);
  top: var(--ytable);
}
.bitmaskarg_table_style{
  border-collapse: collapse;
  border: 1px solid var(--borderBrush);
  background-color: var(--background);
}
.bitmaskarg_table_style td {
   border: 1px solid grey;
}
  
</style>
