
<template>
  <div id="Gauge" :style="cssProps">
    <div id="chartdiv"></div>
  </div>
</template>

<script>

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5radar from '@amcharts/amcharts5/radar'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export default {
  name: "Gauge",
  props: ["params" , "name"],
  data() {
    return {
      Name: this.name,
      data: 2,
    };
  },
  mounted() {
    var root = am5.Root.new("chartdiv");
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/radar-chart/
    var chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      startAngle: 120,
      endAngle: 420
    }));
    // Create axis and its renderer
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
    var axisRenderer = am5radar.AxisRendererCircular.new(root, {
      innerRadius: -20
    });

    // axisRenderer.grid.template.setAll({
    //   stroke: root.interfaceColors.get("background"),
    //   visible: true,
    //   strokeOpacity: 0.8
    // });

    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: this.params.minValue,
      max: this.params.maxValue,
      strictMinMax: true,
      renderer: axisRenderer
    }));
    

    xAxis.get("renderer").labels.template.setAll({
      fontSize: 15,
      fill: am5.color(0xffffff),
    });


    // Add clock hand
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
    var axisDataItem = xAxis.makeDataItem({});

    var clockHand = am5radar.ClockHand.new(root, {
      pinRadius: am5.percent(20),
      radius: am5.percent(80),
      bottomWidth: 20
    })

    var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
      sprite: clockHand
    }));

    xAxis.createAxisRange(axisDataItem);

    var label = chart.radarContainer.children.push(am5.Label.new(root, {
      fill: am5.color(0xffffff),
      centerX: am5.percent(50),
      textAlign: "center",
      centerY: am5.percent(50),
      fontSize: "1em"
    }));

    axisDataItem.set("value", this.params.data);
    bullet.get("sprite").on("rotation", function () {
      var value = axisDataItem.get("value");
      var text = Math.round(axisDataItem.get("value")).toString();
      var fill = am5.color(0x000000);
      xAxis.axisRanges.each(function (axisRange) {
        if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
          fill = axisRange.get("axisFill").get("fill");
        }
      })

      label.set("text", Math.round(value).toString());

      clockHand.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
      clockHand.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
    });

    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    setTimeout(() => {
      setInterval(() => {
        axisDataItem.animate({
          key: "value",
          to: this.data,
          duration: 500,
          easing: am5.ease.out(am5.ease.cubic)
        });
      }, 1000)
    // }, 1000 - Math.abs(500 - currentDateMilliseconds));
    }, 1000 - currentDateMilliseconds);

    chart.bulletsContainer.set("mask", undefined);


    // Create axis ranges bands
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
    var bandsData = [{
      color: "#ee1f25",
      lowScore: this.params.minValue,
      highScore: this.params.lowAlarm
    }, {
      color: "#fdae19",
      lowScore: this.params.lowAlarm,
      highScore: this.params.lowWarning
    }, {
      color: "#b0d136",
      lowScore: this.params.lowWarning,
      highScore: this.params.highWarning
    }, {
      color: "#fdae19",
      lowScore: this.params.highWarning,
      highScore: this.params.highAlarm
    }, {
      color: "#ee1f25",
      lowScore: this.params.highAlarm,
      highScore: this.params.maxValue
    }];

    am5.array.each(bandsData, function (data) {
      var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));

      axisRange.setAll({
        value: data.lowScore,
        endValue: data.highScore
      });

      axisRange.get("axisFill").setAll({
        visible: true,
        fill: am5.color(data.color),
        fillOpacity: 0.8
      });

      axisRange.get("label").setAll({
        text: data.title,
        inside: true,
        radius: 15,
        fontSize: "0.9em",
        fill: root.interfaceColors.get("background")
      });
    });
    chart.appear(1000, 100);

  },
  methods: {
    some() {
    }
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.x / 1) * this.$parent.multiplier + "px",
        "--y": (this.params.y / 1) * this.$parent.multiplier + "px",
        "--width": this.params.width * this.$parent.multiplier + "px",
        "--height": (this.params.height / 1) * this.$parent.multiplier + "px",
        // "--background": "#" + this.params.background,
        // "--borderBrush": "#" + this.params.borderBrush,
        // "--foreground": "#" + this.params.foreground,
        // "--fontsize": this.params.fontSize * this.$parent.$parent.multiplier + "px",
      };
    }
  },
  created(){
    const res = {'namewidget': this.Name, 'namewindow': this.$parent.windowname}
    const today = new Date();
    var currentDateMilliseconds = today.getMilliseconds();
    setTimeout(() => {
      setInterval(() => {
        let changedelem= this.$store.getters.elemByName(res)?.properties
        if (changedelem) {
          if (changedelem.data){
            this.data = changedelem.data
          }
        }
      },1000)
    // }, 1000 - Math.abs(500 - currentDateMilliseconds));
    }, 1000 - currentDateMilliseconds);
  }
};
</script>

<style scoped>
#chartdiv {
  width: 100%;
  height: 100%;
}
#Gauge{
  left: var(--x);
  top: var(--y);
  position: absolute;
  width: var(--width);
  height: var(--height)
}
</style>
