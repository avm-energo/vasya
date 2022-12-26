
<template>
  <div id="chartdiv"></div>
</template>

<script>

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5radar from '@amcharts/amcharts5/radar'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export default {
  name: "app",
  data() {
    return {
      passwordarg: {
        Name: "passwordarg",
        value: "",
        ForegroundColor: "white",
        BackgroundColor: "blue",
        Flashing: false,
        AlarmInfo: "Good",
        tooltip: "подсказка!",
        disabled: false,
      },
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
      min: 0,
      max: 100,
      strictMinMax: true,
      renderer: axisRenderer
    }));


    // Add clock hand
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
    var axisDataItem = xAxis.makeDataItem({});

    var clockHand = am5radar.ClockHand.new(root, {
      pinRadius: am5.percent(20),
      radius: am5.percent(80),
      bottomWidth: 40
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
      fontSize: "3em"
    }));

    axisDataItem.set("value", 50);
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

    setInterval(function () {
      axisDataItem.animate({
        key: "value",
        to: Math.round(Math.random() * 100),
        duration: 500,
        easing: am5.ease.out(am5.ease.cubic)
      });
    }, 2000)

    chart.bulletsContainer.set("mask", undefined);


    // Create axis ranges bands
    // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
    var bandsData = [{
      color: "#ee1f25",
      lowScore: 0,
      highScore: 10
    }, {
      color: "#fdae19",
      lowScore: 10,
      highScore: 25
    }, {
      color: "#b0d136",
      lowScore: 25,
      highScore: 75
    }, {
      color: "#fdae19",
      lowScore: 75,
      highScore: 90
    }, {
      color: "#ee1f25",
      lowScore: 90,
      highScore: 100
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
      console.log('asd')
    }
  }
};
</script>

<style scoped>
#chartdiv {
  width: 100%;
  height: 500px;
}
</style>
