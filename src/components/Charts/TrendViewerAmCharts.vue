<template>
  <div id="chartdiv" class="chart" ref="chartdiv">
  </div>
</template>

<script>
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export default {
  name: "Histogram",
  props: ["params", "name"],
  data() {
    return {
      chartDataArr: [],
      // name: this.name,
    }
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
        symbol &= 0b11111; // cut a tail
        ans[i] = Alphabet[symbol];
      }
      return ans.join("")
    },
    getChartData(series) {
      var url = `http://localhost:5201/api/nodes/main/widget/${this.encript((new TextEncoder()).encode(this.name))}/query/trend-history`;

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            this.chartDataArr = JSON.parse(xhr.responseText)
            this.generateDatas(series)
        }
      };

      var body = `{
          "lowerTime": "2022-09-20T09:07:21",
          "upperTime": "2023-11-20T09:07:21"
      }`;

      xhr.send(body);
    },
    generateDataObj(point) {
      let dateStr = point.argument.split(' ')
      let date = dateStr[0]
      let time = dateStr[1]
      let dmy = date.split('/')
      let hms = time.split(':')
      let day = dmy[0]
      let month = dmy[1]
      let year = dmy[2]
      let hour = hms[0]
      let minute = hms[1]
      let seconds = hms [2]
      const pointDate = new Date(year, month, day, hour, minute, seconds, 0);
      
      
      return {
        argument: pointDate.getTime(),
        value: point.value
      };
    },
    generateDatas(series) {
      let data = [];
      console.log(this.chartDataArr);
      this.chartDataArr.resultData[0].points.map((elem) => {
        data.push(this.generateDataObj(elem));
      })
      
      series.data.setAll(data);
      console.log(series.data);
    },

  },
  async mounted() {
    let root = am5.Root.new("chartdiv");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    root.interfaceColors.set("text", am5.color(0xffffff));
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelY: "zoomXY",
      pinchZoomX:true,
      // pinchZoomY:true,
      "valueAxes": [
        {
          "title": "Axis title"
        }
      ],
    }));

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none",
    }));
    cursor.lineY.set("visible", false);
    cursor.lineX.setAll({
      stroke: am5.color(0xf75394),
      strokeWidth: 2,
      strokeDasharray: []
    });

    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.2,
      baseInterval: {
        timeUnit: "second",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {}),
      // tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        opposite: true
      })
    }));

    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "argument",
      })
    );

    var tooltip = series.set("tooltip", am5.Tooltip.new(root, {
      pointerOrientation: "horizontal"
    }));

    tooltip.label.setAll({
      text: `[bold]{valueX}:[/]\n[width: 130px]Value: [/] {valueY}`,
    });
    await this.getChartData(series)



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
    //lEGEND
    // var legend = chart.children.push(am5.Legend.new(root, {}));
    // legend.data.setAll(chart.series.values);

    series.appear(1000);
    chart.appear(1000, 100);
    // console.log(this.params.strends[0].sColor);
    
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
.chart {
  /* padding-top:5px; */
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