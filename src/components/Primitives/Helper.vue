<template>
  <a id="helper" :style="cssProps" :title="helper.tooltip">
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 -10 510 540"
      width = "90%"
      height = "90%"
    >
        <circle cx="245.333" cy="362.667" r="21.333" stroke-width="7%" stroke="white"/>
        <path stroke-width="5%" stroke="white"
          d="M245.333,0C110.059,0,0,110.059,0,245.333s110.059,245.333,245.333,245.333s245.333-110.059,245.333-245.333
    S380.608,0,245.333,0z M245.333,469.333c-123.52,0-224-100.48-224-224s100.48-224,224-224s224,100.48,224,224
    S368.853,469.333,245.333,469.333z"
        />
        <path stroke-width="5%" stroke="white"
          d="M245.333,96C207.104,96,176,127.904,176,167.115c0,5.891,4.776,10.667,10.667,10.667c5.891,0,10.667-4.776,10.667-10.667
    c0-27.445,21.536-49.781,48-49.781s48,21.792,48,48.597c0,25.888-22.4,48.587-48,48.587c-5.891,0-10.667,4.776-10.667,10.667V288
    c0,5.891,4.776,10.667,10.667,10.667c5.891,0,10.667-4.776,10.667-10.667v-53.013c32.736-5.333,58.667-34.805,58.667-69.056
    C314.667,127.371,283.563,96,245.333,96z"
        />
    </svg>
  </a>
</template>

<script>
export default {
  name: "helper",
  props: ["params"],
  data() {
    return {
      helper:{
        Name: null,
        tooltip: this.params.axisTitle
      }
    };
  },
  computed: {
    cssProps() {
      return {
        "--x": this.params.x  * this.$parent.multiplier + "px",
        "--y": this.params.y  * this.$parent.multiplier + "px", 
        "--width": this.params.width  * this.$parent.multiplier * this.params.scale+ "px",
        "--height": this.params.height  * this.$parent.multiplier* this.params.scale + "px",
        
      };
    },
  },
};
</script>

<style scoped>
#helper{
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--width);
  height: var(--height);
}
#layer_1{
  stroke: white
}
.title{
  background-color: 'black';
}
</style>
