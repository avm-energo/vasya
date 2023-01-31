<template>
    <txtarg v-if="params.type.startsWith('commands/TxtArg')" :params="this.params.properties" :name="this.params.name" :ip="this.ip"/>
    <radioarg v-if="params.type.startsWith('commands/RadioArg')" :params="this.params.properties" :name="this.params.name" :ip="this.ip"/>
    <!-- <passwordarg></passwordarg> -->
    <ipadressarg v-if="params.type.startsWith('commands/IpAddress')" :params="this.params.properties" :name="this.params.name" :ip="this.ip"/>
    <comboarg v-if="params.type.startsWith('commands/ComboArg')" :params="this.params.properties" :name="this.params.name" :ip="this.ip"/>
    <boolarg v-if="params.type.startsWith('commands/BoolArg')" :params="this.params.properties" :name="this.params.name" :ip="this.ip"/>
    <sliderarg v-if="params.type.startsWith('commands/SliderArg')" :params="this.params.properties" :name="this.params.name" :ip="this.ip"/>
    <apply v-if="params.type.startsWith('commands/Apply')" :params="this.params.properties" :name="this.params.name" :ip="this.ip"/>
    <bitmaskarg v-if="params.type.startsWith('commands/BitMaskArg')" :params="this.params.properties" :name="this.params.name" :ip="this.ip"/>
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
        // console.log(this.params)
    },
    computed: {
        ip() {
            return this.$store.getters.ip;
        },
    }
}
</script>

<style>

</style>