<template>
  <div class="comboarg" :style="cssProps">
    <select class="comboarg_value" v-model="comboarg.value" @change="some()">
      <option v-for="elem in comboarg.masvalue" :key="elem.id" :value="elem.val">
        {{ elem.title }}
      </option>
    </select>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: "app",
  props:['params', 'name' ,'ip'],
  data() {
    return {
      comboarg: {
        Name: null,
        masvalue: null,
        value: null,
      },
    };
  },
  methods:{
    async some(){
      if (this.params.trigger == "ChangeOnEnd") {
        const article =`
          ${this.comboarg.value}
        `;
        const headers = { 
            'Content-Type': 'application/json',
        };
        await axios.post(`http://${this.ip}/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.namewindow))}/widget/${this.encript((new TextEncoder()).encode(this.comboarg.Name))}/query/write-arg`, article, { headers })
      } else {
        const res = {'namewidget': this.comboarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this.comboarg.value}
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
  created(){
    console.log(this.params)
    this.comboarg.value = this.params.value
    this.comboarg.masvalue = this.params.cases
    this.comboarg.Name = this.name
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.x / 1) * this.$parent.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.$parent.multiplier + "px",
        "--width": this.params.width * this.$parent.$parent.multiplier + "px",
        "--height": (this.params.height / 1) * this.$parent.$parent.multiplier + "px",
        "--background": "#" + this.params.background,
        "--borderBrush": "#" + this.params.borderBrush,
        "--foreground": "#" + this.params.foreground,
        "--fontsize": this.params.fontSize * this.$parent.$parent.multiplier + "px",
      };
    }
  }
};
</script>

<style scoped>
.comboarg {
  box-sizing: content-box;
  left: var(--x);
  top: var(--y);
  position: absolute;
  width: var(--width);
  height: var(--height);
  background-color: var(--background);
  border: solid 1px var(--borderBrush);
}
.comboarg_value {
  background-color: #252525FF;
  color: white;
  border: none;
  width: 100%;
  height: 100%;
  text-align-last:center;
}
.comboarg_value:focus {
  outline: none;
}
</style>
