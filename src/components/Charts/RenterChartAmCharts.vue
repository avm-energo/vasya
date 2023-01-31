<template>
    <div id="chart" :style="cssProps">
      <div style="position: relative; height: 100%; width: 100%;" :id="chartid"></div>
    </div>
  </template>
  
  <script>
  import * as am5 from '@amcharts/amcharts5';
  import * as am5xy from '@amcharts/amcharts5/xy';
  import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { range } from '@amcharts/amcharts5/.internal/core/util/Animation';
  
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
      //Метод создания объекта графика для включения на полотно
      makeSeries(xAxis, yAxis, name, root) {
        this.series = this.chart.series.push(am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          categoryXField: "argument",
        }));
        this.series.bullets.push(function() {
          return am5.Bullet.new(root, {
            locationX: 0.5,
            locationY: 1.1,
            sprite: am5.Label.new(root, {
              text: "{valueY}",
              fontSize: 9,
              centerX: am5.percent(50),
              centerY: am5.percent(50),
              textAlign: "center",
              populateText: true,
            })
          });
        });
        this.seriesArr.push(this.series)
      },
      //Создание конкретной длинны оси абсцис на основе данных графков
      createXaxisArgument() {
        let maxArrLen = 0
        this.dataArr.forEach((elem, index) => {
          if (elem.length > maxArrLen) {
            maxArrLen = index
          }
        })
        let xaxisData = []
        for(let g = 0; g <= 20; g++) { //КОСТЫЛЬ ДЛИННЫ ОСИ АБСЦЫС
          xaxisData.push({"argument": g})
        }

        
        return xaxisData
      },
      //Создание массива занчений осей для графика
      createData(changedelem) {
        let dataArr = [];
        changedelem.dataSeries.forEach((PointsArr) => {
          let dataArrEx = []
          PointsArr.points.forEach((element, index) => {
            dataArrEx.push({"argument": '', "value": ''})
            dataArrEx[index].argument = element.argument
            dataArrEx[index].value = element.value
          })
          dataArr.push(dataArrEx)
        })
        return dataArr
      },
      //Создание синусоиды
      createSinusDataSeries() {
        let maxArrLen = 0
        this.dataArr.forEach((elem, index) => {
          if (elem.length > maxArrLen) {
            maxArrLen = index
          }
        })
        let maxValue = 0
        this.dataArr[maxArrLen].forEach((elem) => {
          if (elem.value > maxValue) {
            maxValue = elem.value
          }
        })
        let sinusDataArr = []
        let sinus = function(maxValue, x) {
          let res = 0.95105 * maxValue * Math.sin(0.1 * Math.PI * x) //Примерная формула синусоиды
          return res
        }
        for (let i = 0; i <= 20; i++) {
          sinusDataArr.push({"argument" : '', "value" : ''})
          sinusDataArr[i].argument = i
          sinusDataArr[i].value = sinus(maxValue, i)
        }
        return sinusDataArr
        
      },
      getRandomInt() {
        return Math.floor(Math.random() * 100000000000000000);
      }

    },
    created() {
      console.log('this.params',this.params);
      // this.chartid = this.$parent.$parent.subscreenname
      this.chartid = this.getRandomInt() //КОСТЫЛЬ НА СЛУЧАЙНОЕ ЗНАЧЕНИЕ ID ДЛЯ БЛОКА ГРАФИКА
    },
    mounted() {
      //Создание экземпляра графка
      let root = am5.Root.new(this.chartid);
      root.setThemes([
        am5themes_Animated.new(root),
      ]);
      //Уставнока базовых параметров отображения
      root.interfaceColors.set("text", am5.color(0xffffff));
      this.root = root
      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        layout: root.verticalLayout
      }));
      chart.startDuration = 0;
      this.chart = chart
      //Создание экземпляра оси Абсцис
      let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "argument",
        renderer: am5xy.AxisRendererX.new(root, {
          cellStartLocation: 0,
          cellEndLocation: 1,
          minGridDistance: 10,
          stroke: am5.color(0xFFFFFF),
          strokeOpacity: 1,
          strokeWidth: 1
        }),
        tooltip: am5.Tooltip.new(root, {})
      }));
      //Уставнока рендера оси абсцис
      let xRenderer = xAxis.get("renderer");
      xRenderer.labels.template.setAll({
        fill: am5.color(0xFFFFFF),
        fontSize: this.params.fontSize * this.$parent.$parent.multiplier * 1.5 + "px"
      });
  
      this.xAxis = xAxis
      //Создание экземпляра оси Ординат
      let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        //Парамтеры для ограничения экстремумов отображения графика
        // min: this.params.min,
        // max: this.params.max,
        // strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 20,
          stroke: am5.color(0xFFFFFF),
          strokeOpacity: 1,
          strokeWidth: 1
        })
      }));
      //Уставнока рендера оси ординат
      let yRenderer = yAxis.get("renderer");
      yRenderer.labels.template.setAll({
        fill: am5.color(0xFFFFFF),
        // fontSize: this.params.fontSize * this.$parent.$parent.multiplier * 1.5 + "px"
      });
      yRenderer.grid.template.setAll({
        stroke: am5.color(0xFFFFFF),
        strokeWidth: 1,
        strokeOpacity: 0.7,
        colors: ["#f3f3f3", "transparent"],
      });
  
      this.yAxis = yAxis
      //Базовая легенда
      let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
        })
      );
      this.legend = legend
      //Первоначальная устанвока значений при первой отрисовки
      this.dataArr = [];
      this.params.dataSeries.forEach((PointsArr) => {
        let dataArrEx = []
        PointsArr.points.forEach((element, index) => {
          dataArrEx.push({"argument": '', "value": ''})
          dataArrEx[index].argument = element.argument
          dataArrEx[index].value = element.value
        })
        this.dataArr.push(dataArrEx)
      })
      console.log("data", this.dataArr);

      let mas = []

      xAxis.data.setAll(this.createXaxisArgument());

      this.chartName = this.name
      if (this.$parent.$parent.subscreenname){ 
        this.chartName += '/' + this.$parent.$parent.subscreenname
      }
  
      const today = new Date();
      var currentDateMilliseconds = today.getMilliseconds();
  
      const res = {'namewidget': this.chartName, 'namewindow': this.$parent.$parent.windowname}
      //Массив обхектов графиков для дальнейшего перебора
      this.seriesArr = []

      this.params.dataSeries.forEach((dataArr, index) => {
        this.makeSeries(xAxis, yAxis, dataArr.id, root);
      })
      this.seriesArr.forEach((series, index) => {
        series.data.setAll(this.dataArr[index])
      })

      //Создания экзмепляра графика синусоиды и его добавление
      let sinSeries = this.chart.series.push(
          am5xy.LineSeries.new(this.root, {
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueYField: "value",
            categoryXField: "argument",
            tooltip:am5.Tooltip.new(this.root, {
              pointerOrientation:"horizontal",
              labelText:"{valueY}"
            })
          })
        );
      sinSeries.data.setAll(this.createSinusDataSeries())

      setTimeout(() => {
        setInterval(() => {
          let changedelem= this.$store.getters.elemByName(res)?.properties
          if (changedelem) {
            //Обновление массива данных
            this.dataArr = this.createData(changedelem)
            //Создание графков на основе новых данных
            this.seriesArr.forEach((series, index) => {
              if (series.className === "ColumnSeries") {
                series.data.setAll(this.dataArr[index])
              }
            })
            //Обновление оси абсцис на основе новой длинны графков
            xAxis.data.setAll(this.createXaxisArgument());
            
          }
        },1000)
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
  