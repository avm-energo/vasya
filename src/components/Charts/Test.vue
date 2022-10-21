<template>
  <div id="chart">
    <apexchart
      type="line"
      width="500"
      height="350"
      ref="chart"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>

import VueApexCharts from 'vue3-apexcharts'

var lastDate = 0;
var data = [];
var TICKINTERVAL = 86400000;
let XAXISRANGE = 777600000;

export default {
    name: "RealtimeLineChart",
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [
        {
          data: data.slice(),
        },
      ],
      chartOptions: {
        chart: {
          id: "realtime",
          height: 350,
          type: "line",
          animations: {
            enabled: true,
            easing: "linear",
            dynamicAnimation: {
              speed: 1000,
            },
          },
          toolbar: {
            show: false,
          },
          zoom:{
            enabled: true,
            type: 'x',
            autoScaleYaxis: true, 
          },

        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        title: {
          text: "Dynamic Updating Chart",
          align: "left",
        },
        markers: {
          size: 0,
        },
        xaxis: {
          type: "datetime",
          range: XAXISRANGE,
        },
        yaxis: {
          max: 100,
        },
        legend: {
          show: false,
        },
      },
    };
  },
  mounted: function () {
    this.getDayWiseTimeSeries(new Date("11 Feb 2017 GMT").getTime(), 10, {
      min: 10,
      max: 90,
    });

    window.setInterval(() => {
      this.getNewSeries(lastDate, {
        min: 10,
        max: 90,
      });

      this.$refs.chart.updateSeries([
        {
          data: data,
        },
      ]);
    }, 1000);

    // every 60 seconds, we reset the data to prevent memory leaks
    window.setInterval(() => {
      this.resetData();
      this.$refs.chart.updateSeries(
        [
          {
            data,
          },
        ],
        false,
        true
      );
    }, 60000);
  },
  methods: {
    getNewSeries(baseval, yrange) {
      var newDate = baseval + TICKINTERVAL;
      lastDate = newDate;

      for (var i = 0; i < data.length - 10; i++) {
        // IMPORTANT
        // we reset the x and y of the data which is out of drawing area
        // to prevent memory leaks
        data[i].x = newDate - XAXISRANGE - TICKINTERVAL;
        data[i].y = 0;
      }

      data.push({
        x: newDate,
        y:
          Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
          yrange.min,
      });
    },

    resetData() {
      // Alternatively, you can also reset the data at certain intervals to prevent creating a huge series
      data = data.slice(data.length - 10, data.length);
    },

    getDayWiseTimeSeries(baseval, count, yrange) {
      var i = 0;
      while (i < count) {
        var x = baseval;
        var y =
          Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
          yrange.min;

        data.push({
          x,
          y,
        });
        lastDate = baseval;
        baseval += TICKINTERVAL;
        i++;
      }
    },
  },
        
    created(){
        console.log(this.params)
    }
}
</script>

<style>

</style>