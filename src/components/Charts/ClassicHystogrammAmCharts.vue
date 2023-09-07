<template>
  <!-- <div id="chart" :style="cssProps">
    <apexchart type="bar" width="100%" height="100%" :options="chartOptions" :series="series" id="graph"></apexchart>
  </div> -->
  <div id="chart" :style="cssProps">
    <div style="position: relative; height: 100%; width: 100%;" :id="chartid"></div>
    
  </div>
</template>

<script>
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export default {
  name: "Histogram",
  props: ["params", "name"],
  components: {
    
  },
  data() {
    return {
      data: null,
      chartid: null,
      chartName: '',
    };
  },
  methods: {
    makeSeries(xAxis, yAxis, name, fieldName, index) {
      this.series = this.chart.series.push(am5xy.ColumnSeries.new(this.root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: "period",
        fill: am5.color('#' + this.params.graphs[index].back.slice(0,6).toLowerCase()),
      }));

      this.series.columns.template.setAll({
        width: am5.percent(90),
        tooltipY: 0
      });
      if (this.params.graphs.length > 1) {
        this.series.columns.template.setAll({
          tooltipText: "{name}, {categoryX} : {valueY}",
        });
        this.legend.data.push(this.series);
      } else {
        this.series.columns.template.setAll({
          tooltipText: "{valueY}",
        });
      }
      this.seriesArr.push(this.series)
    },

    createData(changedelem) {
      let data = this.data
      ;(changedelem.$id  == undefined ? changedelem : changedelem.$values).forEach(element => {
        let ColumnId = element.columnId
        data[ColumnId].period = element.settingSector.alias
        data[ColumnId][`${element.settingEntity.name}`] = element.currentValue
      })
      return data
    }
  },
  created() {
    this.chartid = this.name
  },
  mounted() {
    let root = am5.Root.new(this.chartid);
    root.setThemes([
      am5themes_Animated.new(root),
    ]);
    root.interfaceColors.set("text", am5.color(0xffffff));
    this.root = root
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout
    }));
    chart.startDuration = 0;
    this.chart = chart
    
    
    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "period",
      renderer: am5xy.AxisRendererX.new(root, {
        cellStartLocation: 0.03,
        cellEndLocation: 0.97,
        minGridDistance: 10,
        stroke: am5.color(0xFFFFFF),
        strokeOpacity: 1,
        strokeWidth: 1
      }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    let xRenderer = xAxis.get("renderer");
    xRenderer.labels.template.setAll({
      fill: am5.color(0xFFFFFF),
      fontSize: this.params.fontSize * this.$parent.$parent.multiplier * 1.5 + "px"
    });

    this.xAxis = xAxis

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: this.params.min,
      max: this.params.max,
      strictMinMax: true,
      renderer: am5xy.AxisRendererY.new(root, {
        minGridDistance: 20,
        stroke: am5.color(0xFFFFFF),
        strokeOpacity: 1,
        strokeWidth: 1
      })
    }));


    let yRenderer = yAxis.get("renderer");
    yRenderer.labels.template.setAll({
      fill: am5.color(0xFFFFFF),
      fontSize: this.params.fontSize * this.$parent.$parent.multiplier * 1.5 + "px"
    });
    yRenderer.grid.template.setAll({
      stroke: am5.color(0xFFFFFF),
      strokeWidth: 1,
      strokeOpacity: 0.7,
      colors: ["#f3f3f3", "transparent"],
    });


    this.yAxis = yAxis

    let legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
      
      })
    );
    this.legend = legend
    
    this.data = [{}];
    ;(this.params.sectors.$id  == undefined ? this.params.sectors : this.params.sectors.$values).forEach((element, index) => {
      this.data.push({"period": ''})
      this.data[index].period = element.alias
    })
    this.data.pop()

    let mas = []
    if (this.params.table.$id == undefined) {
      var array = this.params.table
    } else {
      var array = this.params.table.$values
    }
    let j = array.length/this.params.sectors.length
    for (let i=0; i<j;i++){
      console.log(1)
      mas.push({name: '',data: []})
      mas[i].name = this.params.graphs[i].name
    }
    ;(array.$id  == undefined ? array : array.$values).forEach(element => {
      mas[element.rowId].data.push(element.currentValue);
    })

    xAxis.data.setAll(this.data);

    this.chartName = this.name
    if (this.$parent.$parent.subscreenname){ 
      this.chartName += '/' + this.$parent.$parent.subscreenname
    }

    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();

    const res = {'namewidget': this.chartName, 'namewindow': this.$parent.$parent.windowname}
    
    this.seriesArr = []

    this.params.graphs.forEach((graph, index) => {
      this.makeSeries(xAxis, yAxis, graph.name, graph.name, index);
    })
    ;(this.seriesArr.$id  == undefined ? this.seriesArr : this.seriesArr.$values).forEach(series => {
      series.data.setAll(this.data)
    })
    
    setTimeout(() => {
      setInterval(() => {
        let changedelem= this.$store.getters.elemByName(res)?.properties.table
        if (changedelem) {
          this.data = this.createData(changedelem)
          ;(this.seriesArr.$id  == undefined ? this.seriesArr : this.seriesArr.$values).forEach(series => {
            series.data.setAll(this.data)
          })
        }
      },1000)
    // }, 1000 - Math.abs(500 - currentDateMilliseconds));
    }, 1000 - currentDateMilliseconds);

  },

  beforeDestroy() {
    if (this.root) {
      this.root.dispose();
    }
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
