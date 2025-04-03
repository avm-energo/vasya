<template>
  <line
    class="line"
    :x1="params.x * this.$parent.multiplier"
    :y1="[params.y1 == 0 ? params.y  : params.y + params.height] * this.$parent.multiplier"
    :x2="(params.x + params.width * this.params.scale) * this.$parent.multiplier "
    :y2="[params.y1 == 0 ? params.y + params.height * this.params.scale : params.y] * this.$parent.multiplier "
    :stroke="['#' + params.foreground] "
    :stroke-width="params.thickness * this.$parent.multiplier * this.params.scale "
  />
</template>

<script>
export default {
  name: "app",
  props: ["params"],
  data() {
    return {};
  },
  created(){
  }
};
</script>

<style scoped></style>
