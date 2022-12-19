<template>
  <!-- <div class="txtarg">
    <span class="txtarg_star" v-show="txtarg.value != txtarg.Notification && txtarg.ShowNotification">*</span>
    <input :style="[ txtarg.ShowNotification ? txtarg.value == txtarg.Notification ? { 'margin-left': '9.5px' } : '' : { 'margin-left': '9.5px' },]"
      class="txtarg_value" v-model="txtarg.value" @blur="submitForm(txtarg)" @keyup.enter="$event.target.blur()" id="txtarg" :disabled="txtarg.disabled"/>
  </div> -->
  <div class="txtarg" :style="cssProps">
    <input class="txtarg_value" v-model="txtarg.value" @blur="some()" @keyup.enter="$event.target.blur()" :style="cssProps"/>
  </div>
</template>

<script>

import { Axios } from "axios";

export default {
  name: "app",
  props:['params','name', 'ip'],
  data() {
    return {
      txtarg: {
        Name: null,
        value: null,
        disabled: false,
      },
    };
  },
  methods:{
    async some(){
      if (this.params.trigger != `ButtonApply`) {
        const article =`
          ${this.txtarg.value}
        `;
        const headers = { 
            'Content-Type': 'application/json',
        };
        await Axios.post(`http://${this.ip}/api/nodes/main/widget/${this.encript((new TextEncoder()).encode(this.txtarg.Name))}/query/write-arg`, article, { headers })
      } else {
        const res = {'namewidget': this. txtarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this. txtarg.value}
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
    this.txtarg.value = this.params.value
    this.txtarg.Name = this.name
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.x / 1) * this.$parent.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.$parent.multiplier + "px",
        "--width": (this.params.width / 1) * this.$parent.$parent.multiplier + "px",
        "--height": (this.params.height / 1) * this.$parent.$parent.multiplier + "px",
        "--margin": this.params.margin.split(" : ")[0] + "px",
        "--background": "#" + this.params.background,
        "--borderBrush": "#" + this.params.borderBrush,
        "--foreground": "#" + this.params.foreground,
        "--fontsize": this.params.fontSize * this.$parent.$parent.multiplier + "px",
        "--fontcolor": "#" + this.params.foreground,
      };
    }
  },
};
</script>

<style scoped>
.txtarg {
  box-sizing: border-box;
  left: var(--x);
  top: var(--y);
  position: absolute;
  width: var(--width);
  height: var(--height);
  display: flex;
  background-color: var(--background);
  border: solid 1px var(--borderBrush);
  align-items: center;
}
.txtarg_value {
  box-sizing: border-box;
  background-color: var(--background);
  border: none;
  border-radius: none;
  width: 100%;
  height: 100%;
  margin-left: var(--margin);
  font-size: var(--fontsize);
  color: var(--fontcolor);
}
.txtarg_value:focus {
  outline: none;
}

</style>
