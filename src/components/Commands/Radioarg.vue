<template>
  <div class="radioarg" :style="cssProps">
    <div v-for="elem in radioarg.masvalue" :key="elem.id" @change="some()">
      <input type="radio" :value="elem.value" v-model="radioarg.value" :id="elem.id" class="custom-radio"/>
      <label :for="elem.id">{{ elem.title}}</label>
    </div>
  </div>
</template>

<script>

import { Axios } from "axios";

export default {
  name: "app",
  props: ['params','name'], 
  data() {
    return {
      radioarg: {
        masvalue: null,
        Name: null,
        value: null,
      },
    };
  },
  methods: {
    async some(){
      // if (this.params.trigger != `ButtonApply`) {
      //   const article =`
      //     ${this.ipadressarg.value}
      //   `;
      //   const headers = { 
      //       'Content-Type': 'application/json',
      //   };
      //   await Axios.post(`http://localhost:5201/api/nodes/main/widget/${this.encript((new TextEncoder()).encode(this.ipadressarg.Name))}/query/write-arg`, article, { headers })
      // } else {
        const res = {'namewidget': this.radioarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this.radioarg.value}
        this.$store.dispatch('addcommandwidgetmass', res)
      // }
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
    this.radioarg.value = this.params.state.find((t) => t.isSelected = true).value
    console.log(this.params.state.find((t) => t.isSelected = true).value)
    this.radioarg.Name = this.name
    this.radioarg.masvalue = this.params.state
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
  },
};
</script>

<style scoped>
.radioarg {
  box-sizing: border-box;
  left: var(--x);
  top: var(--y);
  position: absolute;
  width: var(--width);
  height: var(--height);
  background-color: var(--background);
  border: solid 0px var(--borderBrush);
  align-items: center;
  font-size: 12px;
}

</style>
