<template>
    <txtarg v-if="params.type.startsWith('commands/TxtArg')" :params="this.params.properties" :name="this.params.name"/>
    <radioarg v-if="params.type.startsWith('commands/RadioArg')" :params="this.params.properties" :name="this.params.name"></radioarg>
    <!-- <passwordarg></passwordarg> -->
    <ipadressarg v-if="params.type.startsWith('commands/IpAddress')" :params="this.params.properties" :name="this.params.name"></ipadressarg>
    <comboarg v-if="params.type.startsWith('commands/ComboArg')" :params="this.params.properties" :name="this.params.name"></comboarg>
    <boolarg v-if="params.type.startsWith('commands/BoolArg')" :params="this.params.properties" :name="this.params.name"></boolarg>
    <bitmaskarg v-if="params.type.startsWith('commands/BitMaskArg')" :params="this.params.properties" :name="this.params.name"></bitmaskarg>
    <sliderarg v-if="params.type.startsWith('commands/SliderArg')" :params="this.params.properties" :name="this.params.name"></sliderarg>
    <apply v-if="params.type.startsWith('commands/Apply')" :params="this.params.properties" :name="this.params.name"></apply>
</template>

<script>

import Txtarg from "../Commands/Txtarg.vue";
import Radioarg from "../Commands/Radioarg.vue";
import Passwordarg from "../Commands/Passwordarg.vue";
import Ipadressarg from "../Commands/Ipadressarg.vue";
import Comboarg from "../Commands/Comboarg.vue";
import Boolarg from "../Commands/Boolarg.vue";
import Bitmaskarg from "../Commands/Bitmaskarg.vue";
import Sliderarg from "../Commands/Sliderarg.vue";
import Apply from "../Commands/Apply.vue";

export default {
    name: 'Commands',
    props: ['params'],
    components: {
        Txtarg,
        Radioarg,
        Passwordarg,
        Ipadressarg,
        Comboarg,
        Boolarg,
        Bitmaskarg,
        Sliderarg,
        Apply,
    },
    created(){
        console.log(this.params)
    }
}
</script>

<style>

</style>