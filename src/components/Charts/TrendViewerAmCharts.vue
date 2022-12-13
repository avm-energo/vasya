<template>
  <div id="box" :style="cssProps">
    <div id="box_title">
      <div><datepicker v-model="starttime" class="box_title_datepicker"/></div>
      <div><datepicker v-model="endtime" class="box_title_datepicker"/></div>
      <a class="box_title_update_icon" @click="updateChartSeries">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 22 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 18.5549C0 18.1752 0.307804 17.8674 0.6875 17.8674H21.3125C21.6922 17.8674 22 18.1752 22 18.5549C22 18.9346 21.6922 19.2424 21.3125 19.2424H0.6875C0.307804 19.2424 0 18.9346 0 18.5549ZM9.97148 1.37158C9.97148 0.993401 10.2781 0.686829 10.6562 0.686829C11.0344 0.686829 11.341 0.993402 11.341 1.37158V12.3954C11.341 13.1166 12.2105 13.4803 12.724 12.9739L14.4471 11.2746C14.7111 11.0143 15.1351 11.0138 15.3997 11.2735C15.6704 11.5392 15.6709 11.9752 15.4008 12.2416L11.2267 16.3582C10.9098 16.6707 10.4005 16.6701 10.0843 16.3569L5.91017 12.2217C5.64079 11.9548 5.64203 11.5191 5.91292 11.2538C6.17811 10.994 6.60267 10.9952 6.86638 11.2565L8.58718 12.9611C9.10012 13.4692 9.97148 13.1058 9.97148 12.3838V1.37158Z"
          />
        </svg>
      </a>
    </div>
    <div id="box_chart">
      <div id="chartdiv" ref="chartdiv"></div>
    </div>
  </div>
</template>

<script>
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import Datepicker from "@vuepic/vue-datepicker";
import moment from "moment";
import ip from '../../assets/ip.json'

import axios from 'axios'


export default {
  name: "Histogram",
  props: ["params", "name"],
  data() {
    return {
      starttime: null,
      endtime: null,
      chartDataArr: [],
      ChartInfo: null,
      root: null,
      ip: null
    }
  },
  components: {
    moment,
    Datepicker,
  },
  created(){
    this.ip = ip.ip
  },
  methods: {
    encript(values) {
      const  Alphabet = "12345678" + "9ABDEFGH" + "JKLMNPQR" + "STUVWXYZ";
      var bitsCount = 8 * values.length;
      var ans = new Array(Math.trunc(bitsCount / 5) + (bitsCount%5==0?0:1));
      for (let i = 0; i < ans.length; i++) {
        var bitNum = i * 5;
        var byteNum = Math.trunc(bitNum / 8);
        var byteOffset = bitNum % 8;  
        var symbol = values[byteNum] >> byteOffset;
        if (byteOffset > 3 && byteNum<(values.length-1))
        {
          var symbolOffset = 8 - byteOffset;
          symbol |= values[byteNum+1]<<symbolOffset;
        }
        symbol &= 0b11111; 
        ans[i] = Alphabet[symbol];
      }
      return ans.join("")
    },

    async getChartData() {
      const article = this.updatedBody()
      const headers = { 
          'Content-Type': 'application/json',
      };
      // this.chartDataArr = await axios.post(`http://localhost:5201/api/nodes/main/widget/${this.encript((new TextEncoder()).encode(this.name))}/query/trend-history`, article, { headers })
      this.chartDataArr = await axios.post(`http://localhost:5201/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.windowname.split(':').join(':\\')))}/widget/${this.encript((new TextEncoder()).encode(this.name))}/query/trend-history`, article, { headers })
      .then(response => {
        return response.data
      });
    },
    
    getChartsInfo() {
      this.chartInfo = this.params.strends
    },
    updatedBody() {
      var body = `{
          "lowerTime": "${moment(this.starttime).format("YYYY-MM-DDTHH:mm:ss")}",
          "upperTime": "${moment(this.endtime).format("YYYY-MM-DDTHH:mm:ss")}"
      }`;
      console.log('new body created');
      return body
    },
    
   
    generateDataObj(point) {
      return {
        argument: new Date(point.argument).getTime(),
        value: point.value
      };
    },
    generateDatas(i) {
      let dataArr = [];
      this.chartDataArr.resultData[i].points.forEach((elem) => {
          dataArr.push(this.generateDataObj(elem));
        })
      return dataArr
    },
    async updateChartSeries() {
      await this.getChartData()
      for (let i = 0; i < this.chart.series.values.length; i++) {
        var data = this.generateDatas(i);
        this.seriesArr[i].data.setAll(data)
      }
    },
  },

  async mounted() {
    let root = am5.Root.new(this.$refs.chartdiv);
    this.root = root;
    this.starttime = new Date(new Date().setDate(new Date().getDay() - 18));
    this.endtime = new Date()

    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    root.interfaceColors.set("text", am5.color(0xffffff));
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelY: "zoomXY",
      pinchZoomX:true,
      "valueAxes": [
        {
          "title": "Axis title"
        }
      ],
    }));

    this.chart = chart

    

    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.2,
      baseInterval: {
        timeUnit: "second",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
    }));
    this.xAxis = xAxis

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        opposite: true
      })
    }));
    this.yAxis = yAxis

    await this.getChartData()
    this.getChartsInfo()

    this.seriesArr = []
    for (let i = 0; i < this.chartDataArr.resultData.length; i++) {
      var series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: this.chartInfo[i].name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "argument",
      }));
      var tooltip = series.set("tooltip", am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
      }));
      this.seriesArr.push(series)
      tooltip.label.setAll({
        showTooltipOn: "always",
        text: "{name}\n{valueX.formatDate('yyyy-MM-dd HH:mm:ss')}\nЗначение: {valueY}"
      });

      var data = this.generateDatas(i);
      series.data.setAll(data);
      series.appear();
    }
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none",
      snapToSeries: [series],
    }));
    cursor.lineY.set("visible", false);
    cursor.lineX.setAll({
      stroke: am5.color(0xf75394),
      strokeWidth: 2,
      strokeDasharray: []
    });

    // Scrollbar X
    var scrollbarX = am5.Scrollbar.new(root, {
      orientation: "horizontal"
    });
    
    chart.set("scrollbarX", scrollbarX);
    chart.bottomAxesContainer.children.push(scrollbarX);

    scrollbarX.thumb.setAll({
      fill: am5.color(0xffffff),
      fillOpacity: 0.2,
    });


    scrollbarX.get("background").setAll({
      fill: am5.color(0x000000),
      fillOpacity: 0.2,
      cornerRadiusTR: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusBL: 0
    });

    // Scrollbar Y
    var scrollbarY = am5.Scrollbar.new(root, {
      orientation: "vertical"
    });
    
    chart.set("scrollbarY", scrollbarY);
    chart.leftAxesContainer.children.push(scrollbarY);

    scrollbarY.thumb.setAll({
      fill: am5.color(0xffffff),
      fillOpacity: 0.2,
    });

    scrollbarY.get("background").setAll({
      fill: am5.color(0x000000),
      fillOpacity: 0.2,
      cornerRadiusTR: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusBL: 0
    });

    var legend = chart.topAxesContainer.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
    }));
    legend.data.setAll(chart.series.values);

    series.appear(1000);
    chart.appear(1000, 100);
    
    cursor.snapToSeries = series;
    
    
  },
  watch: {
    chartDataArr() {
      if (this.root) {
        console.log('new data loaded');
      }
    }
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
}
</script>

<style scoped>
#chartdiv {
  width: 100%;
  height: 100%;
  /* border: solid 1px gray; */
}
#box{
  position: absolute;
  /* border: solid 1px green; */
  width: var(--width);
  height: var(--height);
  left: var(--x);
  top: var(--y);
}
  #box_title{
    /* border: solid 1px blue; */
    width: 100%;
    height: 10%;
    display: flex;
    justify-content:center;
    align-items:center;
  }
    .box_title_datepicker{
      /* border: solid 1px peru; */
      width: 100%;
      height: 100%;
    }
    .box_title_update_icon{
      /* border: solid 1px peru; */
      fill: white;
      margin-left: 10px;
      width: 38px;
      height: 38px;
    }
    .box_title_update_icon:hover {
      background-color: #267dff;
    }
    .box_title_update_icon:active {
      background-color: #68a5ff;
    }
  #box_chart{
    width: 100%;
    height: 90%;
    /* border: solid 1px yellow; */
  }

</style>