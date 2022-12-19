<template>
  <div class="ipadressarg" :style="cssProps">
    <!-- <span class="ipadressarg1_star" v-show=" ipadressarg.value != ipadressarg.Notification && ipadressarg.ShowNotification ">*</span> -->
    <input class="ipadressarg1_value" v-model="ipadressarg.value" type="text" placeholder="0.0.0.0" @input="ipchange()" @change="ipchange()"
      @blur="[ipadressarg.isValid ? some() : '']" @keyup.enter="[ipadressarg.isValid ? $event.target.blur() : '']" :disabled="ipadressarg.disabled"/>
    <div class="ipadressarg1_error" v-if="!ipadressarg.isValid">
      Ip is Invalid
    </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: "app",
  props:['params', 'name', 'ip'],
  data() {
    return {
      ipadressarg: {
        Name: null,
        value: null,
        isValid: true,
        regex:
          /^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)$/,
      },
    };
  },
  methods: {
    async some(){
      if (this.params.setOnEnter) {
        const article =`
          ${this.ipadressarg.value}
        `;
        const headers = { 
            'Content-Type': 'application/json',
        };
        await axios.post(`http://${this.ip}/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.namewindow))}/widget/${this.encript((new TextEncoder()).encode(this.ipadressarg.Name))}/query/write-arg`, article, { headers })
      } else {
        const res = {'namewidget': this. ipadressarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this. ipadressarg.value}
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
    ipchange() {
      this.ipadressarg.isValid = this.ipadressarg.regex.test(
        this.ipadressarg.value
      );
    },
  },
  created(){
    this.ipadressarg.value = this.params.ipByte1 + '.' + this.params.ipByte2 + '.' + this.params.ipByte3 + '.' + this.params.ipByte4 
    this.ipadressarg.Name = this.name
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.x / 1) * this.$parent.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.$parent.multiplier + "px",
        "--width": [ this.params.width > 125 ? this.params.width : 125 ] * this.$parent.$parent.multiplier + "px",
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
.ipadressarg {
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
  justify-content: center;
}
.ipadressarg1_star {
  width: 10px;
}
.ipadressarg1_value {
  height: 100%;
  width: 100%;
  border: none;
  border-radius: none;
}
.ipadressarg1_value:focus {
  outline: none;
}
.ipadressarg1_error {
  position: absolute;
  top: var(--height);
  width: var(--width);
  font-size: 12px;
}
</style>
