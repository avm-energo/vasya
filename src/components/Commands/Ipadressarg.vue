<template>
  <div class="ipadressarg" :style="cssProps">
    <span class="ipadressarg_star" v-show="ipadressarg.value != ipadressarg.prevvalue">*</span>
    <input class="ipadressarg_value" v-model="ipadressarg.value" type="text" placeholder="0.0.0.0" pattern="/^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)$/"
      @blur="[ipadressarg.isValid ? some() : '']" @keyup.enter="[ipadressarg.isValid ? $event.target.blur() : '']" :disabled="ipadressarg.disabled"/>
    <div class="ipadressarg_error" v-if="!ipadressarg.isValid">
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
        Namesub: null,
        value: null,
        isValid: true,
        regex:
          /^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)$/,
      },
    };
  },
  methods: {
    async some(){
      const res = {'namewidget': this. ipadressarg.Name, 'namewindow': this.$parent.$parent.windowname , 'value': this. ipadressarg.value}
      this.$store.dispatch('addcommandwidgetmass', res)
      if (this.params.setOnEnter) {
        const article =`
          ${this.ipadressarg.value}
        `;
        const headers = { 
            'Content-Type': 'application/json',
        };
        await axios.post(`http://${this.ip}/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.windowpath))}/widget/${this.encript((new TextEncoder()).encode(this.ipadressarg.Name))}/query/write-arg`, article, { headers }).then(()=>{
          this.ipadressarg.prevvalue = this.ipadressarg.value
        })
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
    this.ipadressarg.value = this.params.ipByte1 + '.' + this.params.ipByte2 + '.' + this.params.ipByte3 + '.' + this.params.ipByte4 
    this.ipadressarg.Name = this.name
    this.ipadressarg.prevvalue = this.ipadressarg.value
    if (this.$parent.$parent.subscreenname){ 
      this.ipadressarg.Namesub = this.ipadressarg.Name + '/' + this.$parent.$parent.subscreenname
    } else {
      this.ipadressarg.Namesub = this.ipadressarg.Name
    }
    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    const ress = {'namewidget': this.ipadressarg.Namesub, 'namewindow': this.$parent.$parent.windowname}
    setTimeout(() => {
      setInterval(() => {
        let changedelem = this.$store.getters.elemByName(ress)?.properties
        if (changedelem) {
          this.ipadressarg.value = changedelem.ipByte1 + '.' + changedelem.ipByte2 + '.' + changedelem.ipByte3 + '.' + changedelem.ipByte4 
          this.ipadressarg.prevvalue = this.ipadressarg.value
        }
      },1000)
    // }, 1000 - Math.abs(500 - currentDateMilliseconds));
    }, 1000 - currentDateMilliseconds);
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
        "--fontsize": this.params.textSize * this.$parent.$parent.multiplier * 1.2 + "px",
      };
    }
  },
  watch:{
    'ipadressarg.value'(){
      this.ipadressarg.isValid = this.ipadressarg.regex.test(
        this.ipadressarg.value
      );
    }
  }
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
.ipadressarg_star {
  width: var(--widthstar);
  font-size: var(--fontsize);
  height: 100%;
  background-color: white;
  color: black;
}
.ipadressarg_value {
  height: 92%;
  width: 100%;
  border: none;
  border-radius: none;
  font-size: var(--fontsize);
}
.ipadressarg_value:focus {
  outline: none;
}
.ipadressarg_error {
  position: absolute;
  top: var(--height);
  width: var(--width);
  font-size: 12px;
}
</style>
