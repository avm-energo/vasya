<template>
    <div class="progress-wrapper" :style="wrapperStyle">
      <!-- Текст заголовка -->
      <div class="header-text" :style="{ fontSize: textSize + 'px' }">
        {{ headerText }}
      </div>
      
      <!-- Значение температуры вверху справа -->
      <div class="top-value" :style="{ fontSize: textSize * 1.4 + 'px' }">
        {{ currentValue }} {{ mark }}
      </div>
      
      <!-- Основной контейнер прогресс-бара -->
      <div class="progress-container" :style="containerStyle">
        <!-- Фон прогресс-бара -->
        <div class="progress-background"></div>
        
        <!-- Активная часть прогресс-бара -->
        <div 
          class="progress-fill" 
          :style="{
            width: progress + '%',
            backgroundColor: progressColor
          }"
        ></div>
        
        <!-- Слой с пределами (только для валидных пределов) -->
        <div class="limits-layer" v-if="validLimits.length > 0">
          <!-- Левые пределы -->
          <div
            v-for="limit in sortedLeftLimits"
            :key="'left-' + limit.type"
            class="limit-mark left-mark"
            :class="limit.type"
            :style="{ width: calculatePosition(limit.value) + '%' }"
          ></div>
          
          
          <!-- Правые пределы -->
          <div
            v-for="limit in sortedRightLimits"
            :key="'right-' + limit.type"
            class="limit-mark right-mark"
            :class="limit.type"
            :style="{ width: calculatePosition(limit.value, 'right') + '%' }"
          ></div>
        </div>
      </div>
      
      <!-- Подписи минимального и максимального значений -->
      <div class="limits-labels" :style="{ fontSize: labelSize + 'px' }">
        <span class="min-label">{{ minValue }}</span>
        <span class="max-label">{{ maxValue }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TemperatureProgressBar',
    props: {
      mark:{
        type: String,
        default: ''
      },
      headerText: {
        type: String,
        default: 'Температура элегаза, °C'
      },
      currentValue: {
        type: Number,
        required: true,
        validator: value => value !== null && !isNaN(value)
      },
      minValue: {
        type: Number,
        default: -50,
        validator: value => value !== null && !isNaN(value)
      },
      maxValue: {
        type: Number,
        default: 115,
        validator: value => value !== null && !isNaN(value)
      },
      limits: {
        type: Array,
        default: () => [],
        validator: limits => Array.isArray(limits)
      },
      position: {
        type: Object,
        default: () => ({ x: 0, y: 0 }),
        validator: pos => pos.x !== null && pos.y !== null && !isNaN(pos.x) && !isNaN(pos.y)
      },
      dimensions: {
        type: Object,
        default: () => ({ width: '100%', height: 'auto' }),
        validator: dims => dims.width !== null && dims.height !== null
      },
      barHeight: {
        type: Number,
        default: 30,
        validator: value => value !== null && value > 0
      },
      textSize: {
        type: Number,
        default: 14,
        validator: value => value !== null && value > 0
      },
      labelSize: {
        type: Number,
        default: 16,
        validator: value => value !== null && value > 0
      },
      colors: {
        type: Object,
        default: () => ({
          normal: '#42b983',
          warning: '#ffa500',
          alarm: '#ff0000',
          background: '#f0f0f0',
          text: '#333',
          label: '#666'
        }),
        validator: colors => (
          colors.normal !== null && 
          colors.warning !== null && 
          colors.alarm !== null && 
          colors.background !== null && 
          colors.text !== null && 
          colors.label !== null
        )
      },
      
    },
    computed: {
      validLimits() {
        const validTypes = ['low-alarm', 'low-warning', 'high-warning', 'high-alarm']
        return this.limits.filter(limit => 
          limit && 
          limit.value !== null &&
          validTypes.includes(limit.type) && 
          ['left', 'right'].includes(limit.side) &&
          !isNaN(limit.value)
        )
      },
      sortedLeftLimits() {
        return this.validLimits
          .filter(limit => limit.side === 'left')
          .sort((a, b) => b.value - a.value)
      },
      sortedRightLimits() {
        return this.validLimits
          .filter(limit => limit.side === 'right')
          .sort((a, b) => a.value - b.value)
      },
      progress() {
        const range = this.maxValue - this.minValue
        if (range <= 0) return 0
        const progress = ((this.currentValue - this.minValue) / range) * 100
        return Math.min(Math.max(progress, 0), 100)
      },
      progressColor() {
        // if (this.validLimits.length === 0) return this.colors.normal
        
        // const lowAlarm = this.validLimits.find(l => l.type === 'low-alarm')
        // const highAlarm = this.validLimits.find(l => l.type === 'high-alarm')
        // const lowWarning = this.validLimits.find(l => l.type === 'low-warning')
        // const highWarning = this.validLimits.find(l => l.type === 'high-warning')
        
        // if (lowAlarm && this.currentValue <= lowAlarm.value) return this.colors.alarm
        // if (highAlarm && this.currentValue >= highAlarm.value) return this.colors.alarm
        // if (lowWarning && this.currentValue <= lowWarning.value) return this.colors.warning
        // if (highWarning && this.currentValue >= highWarning.value) return this.colors.warning
        
        return this.colors.normal
      },
      wrapperStyle() {
        return {
          position: 'absolute',
          left: this.parseSize(this.position.x),
          top: this.parseSize(this.position.y),
          width: this.parseSize(this.dimensions.width),
          height: this.parseSize(this.dimensions.height),
        //   fontFamily: 'Arial, sans-serif'
        }
      },
      containerStyle() {
        return {
          height: this.barHeight + 'px',
          marginTop: (this.textSize + 8) + 'px'
        }
      }
    },
    methods: {
      calculatePosition(value, side = 'left') {
        const range = this.maxValue - this.minValue
        if (range <= 0) return 0
        if (side === 'left') {
          return ((value - this.minValue) / range) * 100
        } else {
          return ((this.maxValue - value) / range) * 100
        }
      },
      parseSize(value) {
        if (value === null) return 'auto'
        return typeof value === 'number' ? value + 'px' : value
      }
    }
  }
  </script>
  
  <style scoped>
  .progress-wrapper {
    box-sizing: border-box;
  }
  
  .header-text {
    position: absolute;
    top: 0;
    left: 0;
    color: v-bind('colors.label');
    font-weight: bold;
  }
  
  .top-value {
    position: absolute;
    top: 0;
    right: 0;
    color: v-bind('colors.text');
    /* font-weight: bold; */
  }
  
  .progress-container {
    width: 100%;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    border: solid 1px white;
  }
  
  .progress-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: v-bind('colors.background');
  }
  
  .progress-fill {
    position: absolute;
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease, background-color 0.3s ease;
  }
  
  .limits-layer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
  }
  
  .limit-mark {
    position: absolute;
    width: 2px;
    height: 100%;
    bottom: 0;
  }
  
  .left-mark {
    left: 0;
    /* transform: translateX(-50%); */
  }
  
  .right-mark {
    right: 0;
    /* transform: translateX(50%); */
  }
  
  .low-alarm, .high-alarm {
    background-color: v-bind('colors.alarm');
  }
  
  .low-warning, .high-warning {
    background-color: v-bind('colors.warning');
  }
  
  .limits-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 4px;
  }
  
  .min-label, .max-label {
    color: v-bind('colors.label');
  }
  </style>