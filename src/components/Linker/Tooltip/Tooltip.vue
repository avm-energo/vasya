<template>
  <div id="tooltip">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Tooltip",
  props: {
  }
}
</script>

<style scoped>

#tooltip {
  position: absolute;
  opacity: 0;
  visibility: hidden;
  display: inline-block;
  /*min-width: 200px;*/
  max-width: 300px;
  /*margin-top: 20px;*/
  /*margin-left: 10px;*/
  transition: opacity 0.5s 0.3s;
  background-color: #efefef;
  color: #fff;
  font-size: 14px;
  text-align: left;
  padding: 5px;
  border-radius: 1px;
  z-index: 999;
  white-space: normal;
  pointer-events: none;
}

</style>