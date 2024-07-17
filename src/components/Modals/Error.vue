<template>
  <div class="container" @mouseover="hover = true" @mouseout="hover = false">
    <button @click="active = false">
      <v-icon icon="xmark" :style="{ color: 'white', width: '30px', opacity: '0.7' }" />
    </button>
    <v-icon icon="circle-exclamation" :style="{ color: 'white', width: '20px' }" /><span>{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: {
    error: String,
    id: Number
  },
  data() {
    return {
      hover: false,
      active: true,
    }
  },
  mounted() {
    setTimeout(() => {
      this.active = false
    }, 3000);
  },
  methods: {
    DeleteCard() {
      this.$store.dispatch('DeleteError_action', this.id)
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
  position: relative;
  display: flex;
  align-items: center;

  border-radius: 10px;
  background: rgb(194, 11, 11);
  color: white;
  padding: 20px 20px;
  margin-top: 5px;
}

button {
  border: none;
  outline: none;
  background: transparent;
  position: absolute;
  right: 0;
  top: 3px;
}
</style>