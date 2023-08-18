<template>

</template>

<script>

import  {saveAs}  from 'file-saver';

export default {
  name: '',
  props:[],
  data () {
    return {
     
    }
  },
  async created(){
    let config = await fetch('defaults.json')
    const a = JSON.parse(await config.text())
    console.log(a)
    var FileSaver = require('file-saver');
    var blob = new Blob(["Версия: ",a.version], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "Version.txt");
    history.go(-1)
  }
}
</script>

<style scoped>

</style>