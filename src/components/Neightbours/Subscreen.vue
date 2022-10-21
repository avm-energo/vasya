<template>
<div class="Subscreen" :style="cssProps">
    <window  :myJson = params.properties.screen :subscreensize = subscreensize :boolback="false" typewindow="subscreen" :namewindow="namewindow" :subscreenname="this.params.name"/>
    <!-- <window  :myJson = params.properties.screen :subscreensize = this.params.properties.scale :boolback="false" /> -->
</div>
</template>

<script>

import { defineAsyncComponent } from 'vue'
const Window = defineAsyncComponent (() => import('../Components/Window.vue'))

export default {
  name: 'Subscreen',
  data(){
    return{
      subscreensize: 1
    }
  },
  props:['params', 'namewindow'],
  components: {
    Window
  },
 
  computed: {
    cssProps() {
      return {
        "--x": this.params.properties.x * this.$parent.multiplier + "px",
        "--y": this.params.properties.y * this.$parent.multiplier + "px",
        "--z": this.params.properties.z,
        "--width": this.params.properties.width * this.$parent.multiplier + "px",
        "--height": this.params.properties.height * this.$parent.multiplier + "px",
      }
    }
  },
  created(){
    if (this.params.properties.width > this.params.properties.screen.canvas.width) {
      this.subscreensize = this.params.properties.height/(this.params.properties.screen.canvas.height) * this.$parent.multiplier
    } else {
      this.subscreensize = this.params.properties.width/(this.params.properties.screen.canvas.width) * this.$parent.multiplier
    }
  },
  methods: {
  },
}
</script>

<style scoped>
  .Subscreen{
    box-sizing: border-box;
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--width);
    height: var(--height);
    border: solid 5px #25252500;
  }
</style>