<template>
  <div id="chart" :style="cssProps">
    <apexchart type="line" height="100%" width="100%" :options="chartOptions" :series="series"></apexchart>
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
      series: [
        // {
        //   name: "Income",
        //   type: "line",
        //   data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6],
        // },
        // {
        //   name: "Cashflow",
        //   type: "line",
        //   data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5],
        // },
        // {
        //   name: "Revenue",
        //   type: "line",
        //   data: [20, 29, 37, 36, 44, 45, 50, 58],
        // },
        // {
        //   name: "asd",
        //   type: "line",
        //   data: [25, 20, 31, 23, 43, 25, 10, 38],
        // },
        // {
        //   name: "Revenues",
        //   type: "line",
        //   data: [23, 123, 100, 97, 88, 43, 30, 78],
        // },
        // {
        //   name: "asda",
        //   type: "line",
        //   data: [30, 19, 27, 16, 24, 15, 20, 18],
        // },
      ],
      chartOptions: {
        colors:['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
        chart: {
          height: 350,
          type: "line",
          stacked: false,
          zoom:{
            enabled: true,
            type: 'y',  
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [1, 1, 4, 2, 2, 2],
        },
        title: {
          text: this.params.header,
          align: "center",
          // offsetX: 110,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily:  undefined,
            color:  'white'
          },
        },
        xaxis: {
          categories: [],
        },
        yaxis: [
          // {
          //   axisTicks: {
          //     show: true,
          //   },
          //   axisBorder: {
          //     show: true,
          //     color: "#008FFB",
          //   },
          //   labels: {
          //     style: {
          //       colors: "#008FFB",
          //     },
          //   },
          //   title: {
          //     text: "Income (thousand crores)",
          //     style: {
          //       color: "#008FFB",
          //     },
          //   },
          //   tooltip: {
          //     enabled: true,
          //   },
          // },
          {
            seriesName: "name0",
            // opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: "#00E396",
            },
            labels: {
              style: {
                colors: "white",
              },
            },
            // title: {
            //   text: "Operating Cashflow (thousand crores)",
            //   style: {
            //     color: "#00E396",
            //   },
            // },
          },
          {
            seriesName: "name1",
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: "#00E396",
            },
            labels: {
              style: {
                colors: "white",
              },
            },
            // title: {
            //   text: "Operating Cashflow (thousand crores)",
            //   style: {
            //     // color: "#00E396",
            //   },
            // },
          },
          {
            // min: -50,
            // max: 150,
            seriesName: "name2",
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: "#FEB019",
            },
            labels: {
              style: {
                colors: "white",
              },
            },
            // title: {
            //   text: "Revenue (thousand crores)",
            //   style: {
            //     // color: "#FEB019",
            //   },
            // },
          },
          {
            seriesName: "name3",
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: "#00E396",
            },
            labels: {
              style: {
                colors: "white",
              },
            },
            // title: {
            //   text: "Operating Cashflow (thousand crores)",
            //   style: {
            //     // color: "#00E396",
            //   },
            // },
          },
          {
            show: false,
            seriesName: "name4",
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: "#00E396",
            },
            labels: {
              style: {
                colors: "white",
              },
            },
            // title: {
            //   text: "Operating Cashflow (thousand crores)",
            //   style: {
            //     // color: "#00E396",
            //   },
            // },
          },
          {
            show: false,
            seriesName: "name5",
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              // color: "#00E396",
            },
            labels: {
              style: {
                colors: "white",
              },
            },
            // title: {
            //   text: "Operating Cashflow (thousand crores)",
            //   style: {
            //     // color: "#00E396",
            //   },
            // },
          },
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: "topRight", // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 150,
          },
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40,
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
  async created() {
    if (this.$parent.$parent.subscreenname){ 
      this.chart.Name += '/' + this.$parent.$parent.subscreenname
    }
    console.log(this.params)
    for (let i = 0; i<6; i++){
      let mas = []
      for (let j = 0; j< 101; j++){
        mas.push(Math.trunc(Math.random() * (100 - 0) + 0)*i)
      }
      this.series.push({'name': 'name' + i, 'data':mas})
      mas = []
    }
    for (let j = 0; j< 101; j++){
       this.chartOptions.xaxis.categories.push(2000 + j)
    }
    function encript(values) {
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
      }
    console.log(encript((new TextEncoder()).encode(this.chart.Name)))
    console.log(this.chart.Name)
    // let response = await fetch('http://localhost:5201/api/nodes/main/widget/NLWB7RKEQBUBQVPEL4/query/trend-history', {
    //   headers: {
    //       'Accept': 'application/json',
    //       'contentType': 'application/json',
    //   },
    //   // mode: 'no-cors',
    //   method: 'POST',
    //   // cache: 'no-cache',
    //   body: {
    //     "lowerTime": "123",
    //     "upperTime": "123"
    //   },
    // });
    // console.log(response)

    var url = `http://localhost:5201/api/nodes/main/widget/${encript((new TextEncoder()).encode(this.chart.Name))}/query/trend-history`;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          console.log(xhr.responseText);
      }};

    var data = `{
        "lowerTime": "2022-09-20T09:07:21",
        "upperTime": "2023-11-20T09:07:21"
    }`;

    xhr.send(data);

    // this.params.sectors.forEach((element) => {
    //   this.chartOptions.xaxis.categories.push(element.alias)
    // })
    // let mas = []
    // let j = this.params.table.length/this.params.sectors.length
    // for (let i=0; i<j;i++){
    //   mas.push({name: '',data: []})
    //   mas[i].name = this.params.graphs[i].name
    //   console.log(this.params.graphs[i].back.slice(0,6))
    //   this.chartOptions.colors.push('#' + this.params.graphs[i].back.slice(0,6))
    // } 
    // this.params.table.forEach((element) => {
    //   mas[element.rowId].data.push(element.currentValue);
    // })
    // this.series = mas
    // const today = new Date();
    // var currentDateMilliseconds = today.getMilliseconds();
    // const res = {'namewidget': this.chart.Name, 'namewindow': this.$parent.$parent.windowname}
    // setTimeout(() => {
    //   setInterval(() => {
    //     let changedelem= this.$store.getters.elemByName(res)?.properties.table
    //     if (changedelem) {  
    //       changedelem.forEach((element) =>{
    //         this.series[element.rowId].data[element.columnId] = element.currentValue
    //       })
    //     }
    //   },1000)
    // // }, 1000 - Math.abs(500 - currentDateMilliseconds));
    // }, 1000 - currentDateMilliseconds);
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
