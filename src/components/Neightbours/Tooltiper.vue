<template>
  <div class="button" :style="cssProps" v-show="button.Visible" @click="some">

    <!-- TRENDS -->
    <div class="button_icon" v-if="this.params.properties.leftIcon != 'None'" :style="cssPropsIcon"> 
      <div class="icon" :style="cssPropsIcon" v-if="this.params.properties.leftIcon=='Trends'">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="47.5" fill="white" stroke="white" stroke-width="5"/>
          <path d="M30 68.5C30 72.6421 26.6421 76 22.5 76C18.3579 76 15 72.6421 15 68.5C15 64.3579 18.3579 61 22.5 61C26.6421 61 30 64.3579 30 68.5Z" fill="black"/>
          <path d="M81 33.5C81 37.6421 77.6421 41 73.5 41C69.3579 41 66 37.6421 66 33.5C66 29.3579 69.3579 26 73.5 26C77.6421 26 81 29.3579 81 33.5Z" fill="black"/>
          <path d="M64 60.5C64 64.6421 60.6421 68 56.5 68C52.3579 68 49 64.6421 49 60.5C49 56.3579 52.3579 53 56.5 53C60.6421 53 64 56.3579 64 60.5Z" fill="black"/>
          <path d="M43 43.5C43 47.6421 39.6421 51 35.5 51C31.3579 51 28 47.6421 28 43.5C28 39.3579 31.3579 36 35.5 36C39.6421 36 43 39.3579 43 43.5Z" fill="black"/>
          <line x1="23.083" y1="69.0307" x2="36.4594" y2="42.7044" stroke="black" stroke-width="5"/>
          <line x1="58.8632" y1="57.9417" x2="74.192" y2="32.7022" stroke="black" stroke-width="5"/>
          <line x1="33.5999" y1="42.079" x2="56.2903" y2="60.9774" stroke="black" stroke-width="5"/>
        </svg>
      </div>

      <!-- INFO -->
      <div class="icon" :style="cssPropsIcon" v-else-if="this.params.properties.leftIcon=='Info'">
        <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" fill="white" fill-opacity="0.01"/>
          <path d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z" fill="#252525" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M24 11C25.3807 11 26.5 12.1193 26.5 13.5C26.5 14.8807 25.3807 16 24 16C22.6193 16 21.5 14.8807 21.5 13.5C21.5 12.1193 22.6193 11 24 11Z" fill="white"/>
          <path d="M24.5 34V20H23.5H22.5" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 34H28" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <!-- HELP -->
      <div class="icon" :style="cssPropsIcon" v-else-if="this.params.properties.leftIcon=='Help'">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="47.5" fill="black" stroke="white" stroke-width="5"/>
          <path d="M47.7656 63.3965V60.6621C47.7656 57.5632 48.1302 54.9655 48.8594 52.8691C49.6341 50.7728 50.5456 49.0182 51.5938 47.6055C52.6875 46.1471 53.7812 44.8483 54.875 43.709C55.9688 42.5697 56.8802 41.4303 57.6094 40.291C58.3841 39.1517 58.7715 37.8073 58.7715 36.2578C58.7715 33.7513 58.0423 31.9967 56.584 30.9941C55.1712 29.946 53.3027 29.4219 50.9785 29.4219C48.6087 29.4219 46.8086 29.8548 45.5781 30.7207C44.3477 31.5866 43.5046 32.7943 43.0488 34.3438C42.5931 35.8932 42.3424 37.7161 42.2969 39.8125H36.0078C36.099 36.5312 36.6458 33.6829 37.6484 31.2676C38.651 28.8066 40.2233 26.9154 42.3652 25.5938C44.5072 24.2721 47.3099 23.6113 50.7734 23.6113C53.4167 23.6113 55.8092 24.0898 57.9512 25.0469C60.0931 26.0039 61.8021 27.4395 63.0781 29.3535C64.3542 31.222 64.9922 33.5462 64.9922 36.3262C64.9922 38.1035 64.696 39.6074 64.1035 40.8379C63.5566 42.0684 62.8275 43.1621 61.916 44.1191C61.0501 45.0762 60.1159 46.0332 59.1133 46.9902C58.1107 47.9017 57.1536 48.9499 56.2422 50.1348C55.3763 51.2741 54.6471 52.6868 54.0547 54.373C53.5078 56.0137 53.2344 58.0645 53.2344 60.5254V63.3965H47.7656ZM46.7402 76.7266V69.3438H54.123V76.7266H46.7402Z" fill="white"/>
        </svg>
      </div>

      <!-- VALUES -->
      <div class="icon" :style="cssPropsIcon" v-else-if="this.params.properties.leftIcon=='Values'">
        <svg width="100%" height="100%" viewBox="0 0 101 101" fill="grey" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50.3964" cy="50.3965" r="47" fill="white"/>
          <circle cx="49.8745" cy="49.8745" r="47" transform="rotate(1.07629 49.8745 49.8745)" fill="black"/>
          <path d="M65.5362 34.214L74.8645 11.4617L87.9176 24.0279L65.5362 34.214Z" fill="white"/>
          <circle cx="50.3964" cy="50.3965" r="47.5" stroke="white" stroke-width="5"/>
          <circle cx="50.3964" cy="50.3965" r="40" fill="white"/>
          <circle cx="50.3964" cy="50.3965" r="11" fill="#282828"/>
          <circle cx="50.3964" cy="50.3965" r="7" fill="white"/>
          <line x1="55.9547" y1="44.0103" x2="80.9547" y2="18.0103" stroke="black" stroke-width="4"/>
          <circle cx="20.3964" cy="50.3965" r="4" fill="black"/>
          <circle cx="24.3964" cy="35.3965" r="4" fill="black"/>
          <circle cx="50.3964" cy="18.3965" r="4" fill="black"/>
          <circle cx="80.3964" cy="50.3965" r="4" fill="black"/>
          <circle cx="76.3964" cy="35.3965" r="4" fill="black"/>
          <circle cx="66.3964" cy="23.3965" r="4" fill="black"/>
          <circle cx="34.3964" cy="23.3965" r="4" fill="black"/>
        </svg>
      </div>

      <!-- SETTINGS -->
      <div class="icon" :style="cssPropsIcon" v-else-if="this.params.properties.leftIcon=='Settings'">
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="47.5" fill="white" stroke="white" stroke-width="5"/>
          <path d="M86.8467 27.406C86.459 25.9409 86.0838 25.0888 85.2647 23.7835C84.3976 22.3783 83.3043 21.1496 82.7241 20.9203C82.2476 20.7243 81.4212 20.8513 81.0699 21.1617C80.929 21.283 79.6059 23.3379 78.1368 25.7186C75.9594 29.2311 75.3834 30.0497 75.1352 30.061C74.0415 30.0981 71.8465 29.3668 70.6855 28.5757C69.9012 28.0359 68.6151 26.7265 68.6029 26.4587C68.5988 26.3694 69.6976 24.517 71.0451 22.3461C72.5561 19.9121 73.4885 18.2594 73.4792 18.0549C73.4566 17.5572 73.0375 17.0142 72.5171 16.8075C72.1154 16.6469 71.7496 16.6381 70.2803 16.7684C66.251 17.1306 62.9856 18.5576 60.2423 21.2005C58.2828 23.0795 57.0866 25.0385 56.4381 27.484C56.0134 29.0629 55.992 31.8123 56.3892 33.1495L56.6627 34.0316L45.5788 44.6491C35.4026 54.3929 34.4076 55.3081 33.4929 55.7582C32.0792 56.4748 31.6174 56.5852 29.0869 56.8279C27.2825 56.9867 26.5876 57.1205 25.6087 57.4334C21.3481 58.8161 16.9874 62.4913 15.338 66.0565C15.1265 66.5388 14.7875 67.4368 14.5961 68.059C14.2931 69.0955 14.2623 69.3907 14.358 71.1761C14.4363 72.8983 14.4989 73.3174 14.8851 74.412C15.4039 75.8585 16.8096 78.1852 17.5705 78.8662C18.026 79.2548 18.1751 79.3114 18.7582 79.2849C19.2537 79.2623 19.5128 79.1738 19.7654 78.958C19.9619 78.7828 21.4085 76.544 23.0004 73.9788C24.5924 71.4136 25.9127 69.2827 25.9405 69.2554C25.9682 69.2287 26.3938 69.2601 26.8934 69.3268C28.055 69.4916 29.5556 70.0496 30.5635 70.694C31.331 71.1832 32.7238 72.5899 32.7371 72.8837C32.7412 72.973 31.4517 75.1285 29.8731 77.6671C27.2199 81.9556 27.0183 82.3352 27.0964 82.779C27.2855 83.7164 27.8958 83.9697 29.9261 83.9801C35.0967 83.9752 40.28 81.3615 43.0612 77.3229C44.5834 75.12 45.2337 73.0323 45.3187 70.0883C45.3789 67.8738 45.5718 66.9832 46.2145 65.7008C46.6434 64.8502 47.3411 64.1408 56.79 55.1078C66.0429 46.2625 66.9963 45.388 67.911 44.9371C69.3246 44.2213 69.7864 44.1101 72.3177 43.8675C74.1213 43.7087 74.817 43.5749 75.7959 43.262C80.1865 41.8352 84.6561 37.9882 86.1981 34.3257C86.4225 33.7915 86.7179 32.9088 86.8542 32.3652C87.1745 31.0729 87.1801 28.6306 86.8467 27.406Z" fill="black"/>
        </svg>
      </div>
    </div>
    <p class="p" :style="cssProps" v-if="this.params.properties.width!=this.params.properties.height || this.params.properties.leftIcon == 'None'">{{button.value}}</p>
    <!-- <p class="p" :style="cssProps" v-else-if="(this.params.properties.width > 60 && this.params.properties.width!=this.params.properties.height) || this.params.properties.angle != 0">{{button.value}}</p> -->
  </div>
</template>

<script>
export default {
  name: "app",
  props: ["params", "windowWidth", "subscreensize",],
  data() {
    return {
      button: {
        Name: null,
        value: this.params.properties.text,
        ForegroundColor: this.params.properties.foreground,
        BackgroundColor: this.params.properties.background,
        neightbourState: this.params.properties.neightbourState,
        AlarmInfo: "Good",
        Visible: true,
        Enabled: true,
      },
    };
  },
  created() {
    // if (this.params.properties.leftIcon == 'Info') {
    //   console.log(this.params.properties.leftIcon)
    // }
    this.button.Name = this.params.name
    if (this.$parent.subscreenname){ 
      this.button.Name += '/' + this.$parent.subscreenname
    }
    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    const res = {'namewidget': this.button.Name, 'namewindow': this.$parent.windowname}
    setTimeout(() => {
      setInterval(() => {
        let changedelem= this.$store.getters.elemByName(res)?.properties
        if (changedelem) {
          if (changedelem.neightbourState) this.button.neightbourState = changedelem.neightbourState
        }
      },1000)
    }, 1000 - currentDateMilliseconds);
    
  },
  methods: {
    some() {
      let data = [];
      data.name = this.params.properties.path;
      data.title = [];
      if (this.params.properties.title) {
        data.title.text = this.params.properties.title;
        data.title.bool = true
      } else {
        data.title.text = this.params.properties.text;
        data.title.bool = false
      }
      data.screenPercentage = this.params.properties.screenPercentage;
      // if (this.$parent.windowname == ">:Header" || this.params.type == "neightbours/Navigator"){
      //   this.$store.dispatch("changemain", this.params.properties.path.split('\\').join(''))
      // } else {
        if (this.params.properties.text != "Главный экран") this.$store.dispatch("addElems", data);
      // }
    },
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.properties.x / 1) * this.$parent.multiplier + "px",
        "--y": (this.params.properties.y / 1) * this.$parent.multiplier + "px",
        "--z": this.params.properties.z,
        "--width": (this.params.properties.width / 1) * this.$parent.multiplier + "px",
        "--height": (this.params.properties.height / 1) * this.$parent.multiplier + "px",
        "--backgroundColor": [this.button.neightbourState == "Red" ? "Red" : [ this.button.neightbourState == "Yellow" ? "Yellow" : "#" + this.button.BackgroundColor, ],],
        "--color": [this.button.neightbourState == "Yellow" ? "Black": this.button.ForegroundColor,],
        "--borderThickness": [this.params.properties.windowBorderBrush ? this.$parent.multiplier + 'px' : '0px'],
        "--borderBrush": this.params.properties.borderBrush,
        "--scale": this.params.properties.scale,
        "--flexdir":  [this.params.properties.angle != 0 ? 'column' : 'row'],
        "--borderRadius": this.params.properties.borderRadius,
        "--fontSize":(this.params.properties.fontSize / 1.1) * this.$parent.multiplier + "px",
        "--textalign":[this.params.properties.leftIcon == 'None' ? 'center' : 'left'],
        "--vertical-rl": [(this.params.properties.angle == 270 ||  this.params.properties.angle == -90) ? 'vertical-lr' : 'horizontal-tb'],
        "--lineheight": [this.params.properties.angle != 0 ? (this.params.properties.width / 1) * this.$parent.multiplier + 'px' : '']
      };
    },
    cssPropsimg() {
      return {
        "--widthimg": (this.params.properties.width * this.$parent.multiplier) / 2 + "px",
        "--heightimg": (this.params.properties.height * this.$parent.multiplier) / 2 + "px",
        "--topy": (this.params.properties.height * this.$parent.multiplier) / 4 + "px",
        "--topx": (this.params.properties.width * this.$parent.multiplier) / 4 + "px",
      };
    },
    cssPropsIcon() {
      return {
        "--marginsideicon": [this.params.properties.leftIcon != 'None' ? this.params.properties.width/40 * this.$parent.multiplier + "px" : ''],
        "--widthbutton": [this.params.properties.angle != 0 ? this.params.properties.width * this.$parent.multiplier  : this.params.properties.height * this.$parent.multiplier] + "px"
      };
    },
  },
};
</script>

<style scoped>
.button {
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  -ms-user: none;
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--width);
  height: var(--height);
  background-color: var(--backgroundColor);
  color: var(--color);
  display: flex;
  flex-direction: var(--flexdir);
  border-radius: var(--borderRadius);
  border-color: var(--borderBrush);
  border-width: var(--borderThickness);
  border-style: solid;
  font-size: var(--fontSize);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  
}
img {
  position: absolute;
  width: var(--widthimg);
  height: var(--heightimg);
  left: var(--topx);
  top: var(--topy);
}
.icon{
  width: 80%;
  height: 80%;
}
.button_icon{
  width: var(--widthbutton);
  height: var(--widthbutton);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: var(--marginsideicon);
  margin-left: var(--marginsideicon);
}

p {
  margin: auto;
  writing-mode: var(--vertical-rl);
  width: 100%;
  text-align: var(--textalign);
  line-height: var(--lineheight);
}

.button:hover {
  background-color: var(--backgroundColor);
  filter: brightness(80%);
  background-blend-mode: da;
}
.button:active {
  background-color: var(--backgroundColor);
  filter: brightness(150%);
}
</style>
