<template>
  <div id="chart" :style="cssProps">
    <apexchart type="bar" width="100%" height="100%" :options="chartOptions" :series="series" id="graph"></apexchart>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "Histogram",
  props: ["params", "name"],
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      chart:{
          Name: this.name,
      },
      series: [{
        data: []
      }],
      chartOptions: { 
        colors: [],
        chart: {
          type: "bar",
          height: 350,
          animations:{
            speed: 50,
          },
          zoom:{
            enabled: true,
            type: 'y',
            autoScaleYaxis: true, 
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "100 %",
            endingShape: "rounded",
          },
        },
        
        dataLabels: {
          enabled: false,
          textAnchor: 'middle',
          offsetY: -100,
          style: {
            colors: ["#FFFFFF"],
            fontSize: this.params.fontSize * this.$parent.$parent.multiplier * 1.5 + "px"
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
              fontSize: this.params.fontSize * this.$parent.$parent.multiplier * 1.5 + "px"
            },
          },
        },
        yaxis: {
          max: this.params.max,
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
          onItemClick: {
            toggleDataSeries: false
          },
          onItemHover: {
            highlightDataSeries: true
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
        "--width": this.params.width * this.$parent.$parent.multiplier * this.params.scale + "px",
        "--height": this.params.height * this.$parent.$parent.multiplier * this.params.scale + "px",
        "--borderRadius": this.params.borderRadius * this.$parent.$parent.multiplier + "px",
        "--borderThick": this.params.borderThick * this.$parent.$parent.multiplier + "px",
        "--back": "#" + this.params.back,
        "--fontSize": this.params.fontSize * this.$parent.$parent.multiplier + "px",
      };
    },
  },

  methods:{
    some(){
      console.log(this.chartOptions.yaxis.max)
      var chart = new ApexCharts(el, options);
      chart.updateOptions({
        yaxis: {
          min: 20,
          max: 200,
        }
      })
    }
  },

  created() {
    if (this.$parent.$parent.subscreenname){ 
      this.chart.Name += '/' + this.$parent.$parent.subscreenname
    }
    this.params.sectors.forEach((element) => {
      this.chartOptions.xaxis.categories.push(element.alias)
    })
    let mas = []
    let j = this.params.table.length/this.params.sectors.length
    for (let i=0; i<j;i++){
      mas.push({name: '',data: []})
      mas[i].name = this.params.graphs[i].name
      console.log(this.params.graphs[i].back.slice(0,6))
      this.chartOptions.colors.push('#' + this.params.graphs[i].back.slice(0,6))
    } 
    this.params.table.forEach((element) => {
      mas[element.rowId].data.push(element.currentValue);
    })
    this.series = mas
    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    const res = {'namewidget': this.chart.Name, 'namewindow': this.$parent.$parent.windowname}
    setTimeout(() => {
      setInterval(() => {
        let changedelem= this.$store.getters.elemByName(res)?.properties.table
        if (changedelem) {  
          changedelem.forEach((element) =>{
            this.series[element.rowId].data[element.columnId] = element.currentValue
          })
        }
      },1000)
    // }, 1000 - Math.abs(500 - currentDateMilliseconds));
    }, 1000 - currentDateMilliseconds);
  },
};
</script>

<style>
#chart {
  border: solid var(--borderThick) gray;
  border-radius: var(--borderRadius);
  position: absolute;
  left: var(--x);
  top: var(--y);
  color: black;
  width: var(--width);
  height: var(--height);
  background-color: var(--back);
  font-size: var(--fontsize);
}
</style>
