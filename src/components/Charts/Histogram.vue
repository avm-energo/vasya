<template>
  <div id="chart" :style="cssProps">
    <apexchart type="bar" width="100%" height="100%" :options="chartOptions" :series="series" id="graph"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "Histogram",
  props: ["params"],
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ["#000000"],
          },
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: "white",
            },
          },
        },
        yaxis: {
          // title: {
          //   text: "$ (thousands)",
          // },
          labels: {
            style: {
              colors: "white",
            },
          },
        },
        fill: {
          opacity: 1,
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.2,
          },
        },
        legend: {
          labels: {
            colors: ['white'],
          },
        },
        tooltip: {
          y: {
            formatter: (val) => {
              return val;
            },
          },
        },
      },
    };
  },

  computed: {
    cssProps() {
      return {
        "--x": this.params.x * this.$parent.$parent.multiplier + "px",
        "--y": this.params.y * this.$parent.$parent.multiplier + "px",
        "--width": this.params.width * this.$parent.$parent.multiplier + "px",
        "--height": this.params.height * this.$parent.$parent.multiplier + "px",
      };
    },
  },

  created() {
    this.params.groupDef.forEach((element) => {
      this.chartOptions.xaxis.categories.push(element.groupName);
    });
    this.params.series.forEach((element) => {
      let mas = [];
      element.points.forEach((elements) => {
        mas.push(elements.currentValue);
      });
      this.series.push({
        name: element.seriesName,
        data: mas,
      });
    });
  },
};
</script>

<style>
#chart {
  border: solid 5px gray;
  position: absolute;
  left: var(--x);
  top: var(--y);
  color: black;
  width: var(--width);
  height: var(--height);
}
</style>
