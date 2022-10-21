<template>
    <histogram v-if="params.type.startsWith('charts/Histogram')" :params="params.properties" />
    <classic-hystogramm v-if="params.type.startsWith('view/ClassicHystogramm')" :params="params.properties" :name ="params.name"/>
    <trend-viewer v-if="params.type.startsWith('trends/TrendViewer')" :params="params.properties" :name ="params.name"/>
</template>

<script>

import Histogram from './Histogram.vue'
import ClassicHystogramm from './ClassicHystogramm.vue'
import TrendViewer from './TrendViewer.vue'

export default {
    name: 'Charts',
    props:['params'],
    components:{
        Histogram,
        ClassicHystogramm,
        TrendViewer,
    },
    created(){
        // console.log(this.params)
    }
}
</script>

<style>

</style>