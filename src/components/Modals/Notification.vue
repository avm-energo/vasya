<template>
  <div class="container" @mouseover="hover = true" @mouseout="hover = false" @click="DeleteCard">
    <v-icon icon="circle-check" v-if="type === 'Success'" :style="{ color: 'rgb(0, 158, 0)', width: '30px' }" />
    <v-icon icon="circle-exclamation" v-else-if="type === 'Error'" :style="{ color: 'red', width: '30px' }" />
    <v-icon icon="triangle-exclamation" v-else :style="{ color: 'orange', width: '30px' }" />
    <p style="text-align: center">{{ text }}</p>
    <!-- <p v-if="textArray == []" style="text-align: center">{{ text }}</p>
    <div v-else>
      <p v-for="text in textArray" :key="text" style="text-align: center">{{ text }}</p>
    </div> -->
    <button @click.stop="DeleteCard">
      <v-icon icon="xmark" :style="{ color: 'white', width: '30px', opacity: '0.7' }" />
    </button>
  </div>
</template>
<script>

export default {
  props: {
    text: String,
    id: Number,
    type: String, // Error, Success, Warning
    time: Number
  },
  data() {
    return {
      textArray: [],
      hover: false,
      active: true,
      default_time: 3000
    }
  },
  mounted() {
    if (this.text.split('\n').length > 1) {
      this.textArray = this.text.split('\n')
    }
    if (this.time != 0) {
      setTimeout(() => {
        this.active = false
      }, this.time ? this.time : this.default_time);
    }
  },
  methods: {
    DeleteCard() {
      this.$store.dispatch('DeleteNotification_action', this.id)
    }
  },
  watch: {
    active(newValue) {
      if (!newValue && !this.hover) {
        this.DeleteCard()
      }
    },
    hover(newValue) {
      if (!newValue && !this.active) {
        this.DeleteCard()
      }
    }
  }
};
</script>


<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  background: rgb(70, 70, 70);
  color: white;
  padding: 20px 20px;
  margin-top: 5px;
  transition: all 1s;
  width: 100%;
}

button {
  border: none;
  outline: none;
  background: transparent;
}

p {
  width: 100%;
}
</style>