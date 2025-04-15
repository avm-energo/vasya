<template>
  <div :style="cssProps" class="image">
    <img style="width: 100%; height: 100%;" v-if="imageUrl" :src="imageUrl" alt="Загруженное изображение">
    <div v-if="loading">Загрузка изображения...</div>
    <div v-if="error" class="error">
      <imagelogo :params="this.params"/>
    </div>
  </div>
</template>

<script>

import { 
  GetImage
} from "../../actions/SonicaActions";
import Imagelogo from '../Primitives/Logo.vue';

export default {
  name: '',
  props:["params"],
  data () {
    return {
      path: 0,  
      imageUrl: null,
      loading: false,
      error: null,
    }
  },
  components:{
    Imagelogo
  },
  computed:{
    cssProps() {
      return {
        "--x": this.params.x * this.$parent.multiplier + 22.4 +  "px",
        "--y": this.params.y * this.$parent.multiplier + "px",
        "--width": this.params.width * this.$parent.multiplier - 44.8 + "px",
        "--height": this.params.height * this.$parent.multiplier + "px",
      }
    }
  },
  methods: {
    async loadImage() {
      this.loading = true;
      this.error = null;
      
      if (this.params?.resource) {
        GetImage(this.params.resource, (err, data) => {
          this.loading = false;
          
          if (err) {
            this.error = err.message;
            return;
          }
          
          this.imageUrl = data.url;
          
          // this.$once('hook:beforeDestroy', () => {
          //   if (this.imageUrl) {
          //     URL.revokeObjectURL(this.imageUrl);
          //   }
          // });
        });
      } else {
        this.loading = false;
        this.error = true;
      }
    }
  },
  mounted() {
    this.loadImage();
  }
}
</script>

<style scoped>
.image{
    position: absolute;
    /* background-color: white; */
    left: var(--x);
    top: var(--y);
    width: var(--width);
    height: var(--height);
  }
</style>