<template>
  <div id="box" :style="cssProps">
    <div id="box_title">
      <div id="buttons" style="flex-grow: 6">
        <div id ="button_play" @click="[liveview() + !this.viewlive ? startlive(this.$parent.$parent.windowpath, this.name, this.seriesArr, this.controller, this.interval) : '']" :class="[!this.viewlive ? 'button_hover': '']" :title="[!this.viewlive ? 'Realtime mod': '']">
          <svg width="80%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" fill="none"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3 5.49686C3 3.17662 5.52116 1.73465 7.52106 2.91106L18.5764 9.41423C20.5484 10.5742 20.5484 13.4259 18.5764 14.5858L7.52106 21.089C5.52116 22.2654 3 20.8234 3 18.5032V5.49686Z" :fill="[!this.viewlive ? '#FFFFFF' : '#696969']"/>
          </svg>
        </div>
        <div id ="button_pause" @click="[this.viewlive ? [stoplive()] : ''], liveview()" :class="[this.viewlive ? 'button_hover': '']" :title="[this.viewlive ? 'Stop realtime mod': '']">
          <svg width="80%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z" :fill="[this.viewlive ? '#FFFFFF' : '#696969']"/>
          <path d="M21.0016 19.11V4.89C21.0016 3.54 20.4316 3 18.9916 3H15.3616C13.9316 3 13.3516 3.54 13.3516 4.89V19.11C13.3516 20.46 13.9216 21 15.3616 21H18.9916C20.4316 21 21.0016 20.46 21.0016 19.11Z" :fill="[this.viewlive ? '#FFFFFF' : '#696969']"/>
          </svg>
        </div>
      </div>
      <div style="display: flex; align-items: center;" class="ms">&nbsp;From:&nbsp;<datepicker :close-on-auto-apply="false" v-model="starttime" class="box_title_datepicker" :dark="true" :disabled="this.viewlive" :clearable="false" :max-date="this.endtime"/></div>
      <div style="display: flex; align-items: center;" class="ms">&nbsp;To:&nbsp;<datepicker v-model="endtime" class="box_title_datepicker" :dark="true" :disabled="this.viewlive" :clearable="false" show-now-button/></div>
      <div id="buttons">
        <div class ="button button_hover" @click="showlegend(this.legendbool = !this.legendbool)" title="Show legend">
          <svg width="80%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5V19C4 19.5523 4.44772 20 5 20H19" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18 9L13 13.9999L10.5 11.4998L7 14.9998" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="box_title_update_icon" @click="[!this.viewlive ? updateChartSeries() : '']" :class="[!this.viewlive ? 'button_hover': '']" :title="[!this.viewlive ? 'Refresh data': '']">
          <svg width="80%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.83334 13.6C8.25804 14.4031 8.97945 15.0676 9.88888 15.4934C10.7983 15.9191 11.8465 16.083 12.8755 15.9604C13.9045 15.8378 14.8586 15.4353 15.594 14.8136L17 13.7451M17 16V13.6H14.5M16.1667 10.4C15.742 9.59687 15.0206 8.93238 14.1111 8.50664C13.2017 8.08091 12.1535 7.91699 11.1245 8.03959C10.0955 8.16219 9.1414 8.56467 8.40599 9.18637L7 10.2549M7 8V10.4H9.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" :stroke="[!this.viewlive ? '#FFFFFF' : '#696969']" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class ="button" @click="[!this.viewlive ? print() : '']" :class="[!this.viewlive ? 'button_hover': '']" :title="[!this.viewlive ? 'Print': '']">
          <svg width="80%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 16.75H16C15.8011 16.75 15.6103 16.671 15.4697 16.5303C15.329 16.3897 15.25 16.1989 15.25 16C15.25 15.8011 15.329 15.6103 15.4697 15.4697C15.6103 15.329 15.8011 15.25 16 15.25H18C18.3315 15.25 18.6495 15.1183 18.8839 14.8839C19.1183 14.6495 19.25 14.3315 19.25 14V10C19.25 9.66848 19.1183 9.35054 18.8839 9.11612C18.6495 8.8817 18.3315 8.75 18 8.75H6C5.66848 8.75 5.35054 8.8817 5.11612 9.11612C4.8817 9.35054 4.75 9.66848 4.75 10V14C4.75 14.3315 4.8817 14.6495 5.11612 14.8839C5.35054 15.1183 5.66848 15.25 6 15.25H8C8.19891 15.25 8.38968 15.329 8.53033 15.4697C8.67098 15.6103 8.75 15.8011 8.75 16C8.75 16.1989 8.67098 16.3897 8.53033 16.5303C8.38968 16.671 8.19891 16.75 8 16.75H6C5.27065 16.75 4.57118 16.4603 4.05546 15.9445C3.53973 15.4288 3.25 14.7293 3.25 14V10C3.25 9.27065 3.53973 8.57118 4.05546 8.05546C4.57118 7.53973 5.27065 7.25 6 7.25H18C18.7293 7.25 19.4288 7.53973 19.9445 8.05546C20.4603 8.57118 20.75 9.27065 20.75 10V14C20.75 14.7293 20.4603 15.4288 19.9445 15.9445C19.4288 16.4603 18.7293 16.75 18 16.75Z" :fill="[!this.viewlive ? '#FFFFFF' : '#696969']"/>
            <path d="M16 8.75C15.8019 8.74741 15.6126 8.66756 15.4725 8.52747C15.3324 8.38737 15.2526 8.19811 15.25 8V4.75H8.75V8C8.75 8.19891 8.67098 8.38968 8.53033 8.53033C8.38968 8.67098 8.19891 8.75 8 8.75C7.80109 8.75 7.61032 8.67098 7.46967 8.53033C7.32902 8.38968 7.25 8.19891 7.25 8V4.5C7.25 4.16848 7.3817 3.85054 7.61612 3.61612C7.85054 3.3817 8.16848 3.25 8.5 3.25H15.5C15.8315 3.25 16.1495 3.3817 16.3839 3.61612C16.6183 3.85054 16.75 4.16848 16.75 4.5V8C16.7474 8.19811 16.6676 8.38737 16.5275 8.52747C16.3874 8.66756 16.1981 8.74741 16 8.75Z" :fill="[!this.viewlive ? '#FFFFFF' : '#696969']"/>
            <path d="M15.5 20.75H8.5C8.16848 20.75 7.85054 20.6183 7.61612 20.3839C7.3817 20.1495 7.25 19.8315 7.25 19.5V12.5C7.25 12.1685 7.3817 11.8505 7.61612 11.6161C7.85054 11.3817 8.16848 11.25 8.5 11.25H15.5C15.8315 11.25 16.1495 11.3817 16.3839 11.6161C16.6183 11.8505 16.75 12.1685 16.75 12.5V19.5C16.75 19.8315 16.6183 20.1495 16.3839 20.3839C16.1495 20.6183 15.8315 20.75 15.5 20.75ZM8.75 19.25H15.25V12.75H8.75V19.25Z" :fill="[!this.viewlive ? '#FFFFFF' : '#696969']"/>
          </svg>
        </div>
        <div class ="button" @click="[!this.viewlive ? downloadpng() : '']" :class="[!this.viewlive ? 'button_hover': '']" :title="[!this.viewlive ? 'Save as .png': '']">
          <svg :fill="[!this.viewlive ? '#FFFFFF' : '#696969']" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            width="70%" height="100%" viewBox="0 0 550.801 550.801"
            xml:space="preserve">
          <g>
            <g>
              <path d="M151.951,414.103c-5.677,0-9.526,0.554-11.541,1.107v36.492c2.381,0.554,5.313,0.732,9.352,0.732
                c14.851,0,24.026-7.524,24.026-20.171C173.794,420.884,165.905,414.103,151.951,414.103z"/>
              <polygon points="353.668,141.89 353.711,141.906 353.711,141.89 		"/>
              <path d="M475.095,131.992c-0.032-2.526-0.844-5.021-2.568-6.993L366.324,3.694c-0.021-0.034-0.053-0.045-0.084-0.076
                c-0.633-0.707-1.36-1.29-2.141-1.804c-0.232-0.15-0.465-0.285-0.707-0.422c-0.686-0.366-1.393-0.67-2.131-0.892
                c-0.2-0.058-0.379-0.14-0.59-0.192C359.87,0.114,359.037,0,358.203,0H97.2C85.292,0,75.6,9.693,75.6,21.601v507.6
                c0,11.913,9.692,21.601,21.6,21.601H453.6c11.908,0,21.601-9.688,21.601-21.601V133.202
                C475.2,132.796,475.137,132.398,475.095,131.992z M190.107,460.867c-9.537,8.986-23.657,13.025-40.165,13.025
                c-3.673,0-6.982-0.189-9.537-0.554v44.196h-27.696V395.582c8.617-1.466,20.725-2.568,37.779-2.568
                c17.23,0,29.531,3.296,37.776,9.903c7.881,6.229,13.204,16.501,13.204,28.608C201.479,443.623,197.445,453.906,190.107,460.867z
                M321.616,517.535h-29.341l-26.412-47.682c-7.349-13.205-15.412-29.152-21.477-43.644l-0.538,0.18
                c0.738,16.326,1.094,33.744,1.094,53.915v37.23h-25.671V393.932h32.643l25.684,45.293c7.325,13.025,14.671,28.424,20.161,42.367
                h0.554c-1.841-16.321-2.384-33.012-2.384-51.532v-36.123h25.687V517.535L321.616,517.535z M449.086,511.851
                c-8.617,2.933-24.943,6.972-41.27,6.972c-22.55,0-38.887-5.685-50.251-16.695c-11.364-10.632-17.613-26.769-17.429-44.925
                c0.18-41.075,30.08-64.552,70.601-64.552c15.958,0,28.255,3.111,34.304,6.048l-5.864,22.376
                c-6.797-2.933-15.229-5.316-28.803-5.316c-23.282,0-40.891,13.205-40.891,39.973c0,25.497,15.957,40.532,38.887,40.532
                c6.417,0,11.554-0.728,13.753-1.835v-25.861h-19.074v-21.821h46.032v65.105H449.086z M97.2,366.752V21.601h250.203v77.69h6.75
                v42.599h42.156v1.026h57.29l0.011,223.836H97.2z"/>
              <polygon points="184.328,269.687 226.178,269.687 226.178,227.093 184.022,227.093 184.022,184.491 226.178,184.491 
                226.178,141.89 184.022,141.89 184.022,99.291 141.42,99.291 141.42,141.89 183.579,141.89 183.579,184.491 141.42,184.491 
                141.42,227.093 183.579,227.093 183.579,269.687 141.739,269.687 141.739,312.293 183.898,312.293 183.898,354.887 
                226.481,354.887 226.481,312.293 184.328,312.293 		"/>
              <polygon points="269.401,269.687 311.249,269.687 311.249,227.093 269.093,227.093 269.093,184.491 311.249,184.491 
                311.249,141.89 269.093,141.89 269.093,99.291 226.481,99.291 226.481,141.89 268.64,141.89 268.64,184.491 226.481,184.491 
                226.481,227.093 268.64,227.093 268.64,269.687 226.8,269.687 226.8,312.293 268.958,312.293 268.958,354.887 311.555,354.887 
                311.555,312.293 269.401,312.293 		"/>
              <path d="M311.555,141.89h42.113c-3.691-1.716-6.265-5.432-6.265-9.774V99.291h-35.849V141.89z"/>
              <path d="M353.711,141.906v42.585h-42.156v42.602h42.156v42.594H311.86v42.602h42.167v42.599h42.593v-42.599h-42.15v-42.602h41.84
                v-42.594h-42.156v-42.602h42.156v-41.575h-38.106C356.59,142.916,355.082,142.539,353.711,141.906z"/>
            </g>
          </g>
          </svg>
        </div>
          <div class ="button" @click="exporttoexcel()" :class="[!this.viewlive ? 'button_hover': '']" :title="[!this.viewlive ? 'Export as table': '']">
            <exportexcel :data="this.datajson" :header ="this.starttimeexcel + ' - ' + this.endtimeexcel" style="width: 100%; height: 100%">
            <svg height="100%" width="65%" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 26 26" xml:space="preserve">
            <g>
              <path :fill="[!this.viewlive ? '#FFFFFF' : '#696969']" d="M25.162,3H16v2.984h3.031v2.031H16V10h3v2h-3v2h3v2h-3v2h3v2h-3v3h9.162
                C25.623,23,26,22.609,26,22.13V3.87C26,3.391,25.623,3,25.162,3z M24,20h-4v-2h4V20z M24,16h-4v-2h4V16z M24,12h-4v-2h4V12z M24,8
                h-4V6h4V8z"/>
              <path :fill="[!this.viewlive ? '#FFFFFF' : '#696969']" d="M0,2.889v20.223L15,26V0L0,2.889z M9.488,18.08l-1.745-3.299c-0.066-0.123-0.134-0.349-0.205-0.678
                H7.511C7.478,14.258,7.4,14.494,7.277,14.81l-1.751,3.27H2.807l3.228-5.064L3.082,7.951h2.776l1.448,3.037
                c0.113,0.24,0.214,0.525,0.304,0.854h0.028c0.057-0.198,0.163-0.492,0.318-0.883l1.61-3.009h2.542l-3.037,5.022l3.122,5.107
                L9.488,18.08L9.488,18.08z"/>
            </g>
            </svg>
          </exportexcel>
          </div>
          <!-- <button @click="some()">dsa</button> -->
      </div>
      <div style="flex-grow: 6" ></div>
    </div>
      
    <div id="box_chart">
      <div id="chartdiv" ref="chartdiv"></div>
    </div>
  </div>
  <div id="box_loading" v-if="!this.getdata" :style="cssProps">
    <div id="box_loading_center">
      <div id="box_loading_top">
        <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="64px" height="64px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="#232323" /><g><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#000000"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(45 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(90 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(135 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#bebebe" transform="rotate(180 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#979797" transform="rotate(225 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#6e6e6e" transform="rotate(270 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#3c3c3c" transform="rotate(315 64 64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;45 64 64;90 64 64;135 64 64;180 64 64;225 64 64;270 64 64;315 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform></g><g><circle fill="#000000" cx="63.66" cy="63.16" r="12"/><animate attributeName="opacity" dur="720ms" begin="0s" repeatCount="indefinite" keyTimes="0;0.5;1" values="1;0;1"/></g></svg>
        <div style="margin-left: 10px;">Loading...</div>
      </div>
      <button @click="stopfetch(), stoplive()" v-show="this.seriesArr != null">Отмена</button>
    </div>  
  </div>
</template>

<script>
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

import Datepicker from "@vuepic/vue-datepicker";
import moment from "moment";
import exportexcel from "vue-json-excel3"

import axios from 'axios'
import { Settings } from '@amcharts/amcharts5/.internal/core/util/Entity';

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
      getdata: false,
      viewlive: false,
      legendbool: true,
      legend: null,
      path: this.$parent.$parent.windowpath,
      seriesArr: null,
      starttimeexcel: null,
      endtimeexcel: null,
      controller: null,
      interval: null,
    }
  },
  components: {
    moment,
    Datepicker,
    exportexcel,
  },
  created(){
    const controller = new AbortController();
    this.controller = controller
    this.interval = this.params["trends-interval"]
    console.log(this.params)
    // document.tooltip({show:null})
  },
  methods: {
    async some(){
      this.endtime = moment(this.seriesArr[0].data.values[this.seriesArr[0].data.values.length-1].argument).toISOString()
    },
    showlegend(){},
    startlive(){},
    stoplive(){},
    print(){},
    downloadpng(){},
    async liveview(){
      this.viewlive = !this.viewlive

    },
    stopfetch(){
      this.viewlive = false
      this.getdata = !this.getdata
      this.controller.abort()
      this.controller = new AbortController();
    },
    exporttoexcel(){},
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
      console.log('запросил')
      const headers = { 
          'Content-Type': 'application/json',
      };
      this.chartDataArr = await axios.post(`http://${this.ip}/api/nodes/${this.encript((new TextEncoder()).encode(this.$parent.$parent.windowpath))}/widget/${this.encript((new TextEncoder()).encode(this.name))}/query/trend-history`, article, 
      { 
        headers,
        signal: this.controller.signal
       },)
      .then(response => {
        // console.log(this.controller)
        console.log(response.data)
        this.gettingdata()
        console.log('получил')
        return response.data
      })
      .catch(function (error) {
      });
    },
    
    getChartsInfo() {
      this.chartInfo = this.params.strends
    },
    updatedBody() {
      var body = `{
          "lowerTime": "${moment(new Date(this.starttime).getTime()).format("YYYY-MM-DDTHH:mm:ss")}",
          "upperTime": "${moment(new Date(this.endtime).getTime()).format("YYYY-MM-DDTHH:mm:ss")}"
      }`;
      console.log((moment(new Date(this.endtime)) - moment(new Date(this.starttime)))/60000*60)
      console.log('new body created');
      return body
    },
    
   
    generateDataObj(point) {
      return {
        argument: new Date(point.argument).getTime(),
        value: point.value
      };
    },
    generateDatas(num) {
      let dataArr = [];
      // console.log(this.chartDataArr.resultData[num].points.length)
      //   const del = 400
      //   var k = this.chartDataArr.resultData[num].points.length / del
      //   console.log(Math.trunc(k)*del)
      //   console.log(Math.round((k - Math.trunc(k))*del))
      //   if (num == 0){
      //     for (let i = 0; i<k-1; i++){
      //       setTimeout(()=>{
      //         for (let j = i * del ; j<i*del+del; j++)
      //           dataArr.push(this.generateDataObj( this.chartDataArr.resultData[num].points[j]));
      //         }, i * 3000)
      //     }
      //     setTimeout(()=>{
      //       for (let i = Math.trunc(k)*del; i<Math.trunc(k)*del + Math.round((k - Math.trunc(k))*del); i++){
      //         dataArr.push(this.generateDataObj( this.chartDataArr.resultData[num].points[i]));
      //       }
      //       return dataArr
      //     }, (k-1) * 3000)
      //   }
      this.chartDataArr.resultData[num].points.forEach((elem) => {
          dataArr.push(this.generateDataObj(elem));
        })
      return dataArr
    },
    async updateChartSeries() {
      this.gettingdata()
      await this.getChartData()
      if (this.chartDataArr !== undefined){
        for (let i = 0; i < this.chart.series.values.length; i++) {
          var data = this.generateDatas(i);
          console.log('asd')
          this.seriesArr[i].data.setAll(data)
        }
      }
    },
    gettingdata(){
      this.getdata = !this.getdata
    }
  },

  async mounted() {
    let root = am5.Root.new(this.$refs.chartdiv);
    this.root = root;
    this.starttime = new Date(Date.now() - 86400000 * 1 * 21);
    this.endtime = new Date(Date.now() + 86400000 * 1)

    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    root.interfaceColors.set("text", am5.color(0xffffff));
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelY: "zoomXY",
        pinchZoomX:true,
        "valueAxes": [
          {
            "title": "Axis title"
          }
        ],
      })
    );

    this.chart = chart

    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      // maxDeviation: 0.2,
      minZoomCount: 3,
      // groupData: true,
      baseInterval: { timeUnit: "second", count: this.params["trends-interval"]/1000 },
      // groupIntervals: [
      //   { timeUnit: "second", count: 60 },
      //   { timeUnit: "minute", count: 10 },
      //   { timeUnit: "hour", count: 1 },
      //   { timeUnit: "day", count: 1 },
      //   { timeUnit: "week", count: 1 },
      //   { timeUnit: "month", count: 1 },
      //   { timeUnit: "year", count: 1 }
      // ],
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {}),
      tooltipDateFormat: "yy-MMM-dd HH:mm:ss",
      tooltipIntervalOffset: 0,
    }));
    this.xAxis = xAxis

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      numberFormat: "#.0a",
      // numberFormat: "#.##e",
      renderer: am5xy.AxisRendererY.new(root, {
        opposite: true
      })
    }));
    
    this.yAxis = yAxis

    await this.getChartData()
    this.getChartsInfo()

    this.seriesArr = []

    for (let i = 0; i < this.chartDataArr.resultData.length; i++) {
      var yRenderer = am5xy.AxisRendererY.new(root, {
        opposite: true
      });
      var yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          numberFormat: "#.0a",
          // numberFormat: "#.##e",
          maxDeviation: 1,
          renderer: yRenderer
        })
      );

      if (chart.yAxes.indexOf(yAxis) > 0) {
        yAxis.set("syncWithAxis", chart.yAxes.getIndex(0));
      }
      // Set up data processor to parse string dates
      // https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
      var linecolor = am5.color("#" + this.chartInfo[i].sColor.slice(0,6))
      var series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name: this.chartInfo[i].name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "argument",
          connect: false,
          fill: linecolor,
          stroke: linecolor,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            showTooltipOn: "always",
            labelText: "{name}: {valueY}"
          }),
      }));
      series.uid = this.chartInfo[i].uid

      series.data.processor = am5.DataProcessor.new(root, {
        dateFormat: "yyyy-MM-dd",
        dateFields: ["date"]
      });
      
      series.strokes.template.setAll({ strokeWidth: 1 });
      yRenderer.grid.template.set("strokeOpacity", 0.05);
      yRenderer.labels.template.set("fill", series.get("fill"));
      yRenderer.setAll({
        stroke: series.get("fill"),
        strokeOpacity: 1,
        opacity: 1
      });

      this.seriesArr.push(series)

      var data = this.generateDatas(i);

      series.data.setAll(data);
      series.appear();
    }
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none",
    }));
    cursor.lineY.set("visible", false);
    cursor.lineX.setAll({
      stroke: am5.color(0xf75394),
      strokeWidth: 1,
      strokeDasharray: []
    });

    // Scrollbar X
    // var scrollbarX = am5.Scrollbar.new(root, {
    //   orientation: "horizontal"
    // });
    
    // chart.set("scrollbarX", scrollbarX);
    // chart.bottomAxesContainer.children.push(scrollbarX);

    // scrollbarX.thumb.setAll({
    //   fill: am5.color(0xffffff),
    //   fillOpacity: 0.2,
    // });


    // scrollbarX.get("background").setAll({
    //   fill: am5.color(0x000000),
    //   fillOpacity: 0.2,
    //   cornerRadiusTR: 0,
    //   cornerRadiusBR: 0,
    //   cornerRadiusTL: 0,
    //   cornerRadiusBL: 0
    // });

    // Scrollbar Y
    // var scrollbarY = am5.Scrollbar.new(root, {
    //   orientation: "vertical"
    // });
    
    // chart.set("scrollbarY", scrollbarY);
    // chart.leftAxesContainer.children.push(scrollbarY);

    // scrollbarY.thumb.setAll({
    //   fill: am5.color(0xffffff),
    //   fillOpacity: 0.2,
    // });

    // scrollbarY.get("background").setAll({
    //   fill: am5.color(0x000000),
    //   fillOpacity: 0.2,
    //   cornerRadiusTR: 0,
    //   cornerRadiusBR: 0,
    //   cornerRadiusTL: 0,
    //   cornerRadiusBL: 0
    // });

    var legend = chart.topAxesContainer.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
       x: am5.percent(50),
    }));
    legend.data.setAll(chart.series.values);
    this.showlegend = function showl(state){
      console.log(state)
      legend.setAll({
        visible: state
      });
    }

    var refreshId
    var timeoutId
    this.startlive = async function startlive(winn,namee,seriesArr, controllerr, interval){
      console.log("я тут")
      this.gettingdata()
      var series = seriesArr
      var ip = this.ip
      var win = winn
      let name = namee
      var controller = controllerr
      const headers = { 
          'Content-Type': 'application/json',
      };
      var article = `"${moment(series[0].data.values[series[0].data.values.length-1].argument + 1000).format("YYYY-MM-DDTHH:mm:ss")}"`;
      await axios.post(`http://${ip}/api/nodes/${this.encript((new TextEncoder()).encode(win))}/widget/${this.encript((new TextEncoder()).encode(name))}/query/trend-increment`, article, { headers, signal: controller.signal })
      .then(response => {
        console.log(response)
        if(response.data.resultData) {
          if (response.data.resultData[0].points[0]){
            response.data.resultData.forEach(res =>{
              var seriesfind = series.find(s => s.uid === res.uid)
              console.log(res)
              for (let i = 0; i < res.points.length; i++) {
                seriesfind.data.push({
                  argument: new Date(res.points[i].argument).getTime(),
                  value: res.points[i].value,
                })
              }
            })
          }
        }
        this.gettingdata()
      })
      .catch(function (error) {
      })
      console.log(series)
      console.log((interval - moment().second()*1000 + 1000)/1000)
      if (!controller.signal.aborted) {
        timeoutId = setTimeout(()=>{
          addData(series, ip, win, name);
          refreshId = setInterval(function () {
            var seriesArr = series
            var ipp = ip
            var winn = win
            var namee = name
            addData(seriesArr, ipp, winn, namee);
          }, interval)
        },interval - moment().second()*1000 + 1000)
      }
    }

    this.stoplive = function stoplive(){
      console.log(refreshId)
      console.log(timeoutId)
      clearInterval(refreshId)
      clearTimeout(timeoutId)
    }

    async function addData(seriesArr, ip, win, name) {
      // console.log(moment(seriesArr[0].data.values[seriesArr[0].data.values.length-1].argument).format('LLLL'))
      // console.log(endtime)
      // endtime = moment(seriesArr[0].data.values[seriesArr[0].data.values.length-1].argument).format('LLLL')
      // console.log(endtime)
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
          symbol &= 0b11111; 
          ans[i] = Alphabet[symbol];
        }
        return ans.join("")
      }
      const headers = { 
          'Content-Type': 'application/json',
      };
      var article = `"${moment(seriesArr[0].data.values[seriesArr[0].data.values.length-1].argument + 1000).format("YYYY-MM-DDTHH:mm:ss")}"`;
      await axios.post(`http://${ip}/api/nodes/${encript((new TextEncoder()).encode(win))}/widget/${encript((new TextEncoder()).encode(name))}/query/trend-increment`, article, { headers })
      .then(response => {
        if(response.data.resultData) {
          if (response.data.resultData[0].points[0]){
            console.log(response)
            seriesArr.forEach(series =>{
              series.data.removeIndex(0)
            })
            response.data.resultData.forEach(res =>{
              var seriesfind = seriesArr.find(s => s.uid === res.uid)
              console.log(res)
              for (let i = 0; i < res.points.length; i++) {
                seriesfind.data.push({
                  argument: new Date(res.points[i].argument).getTime(),
                  value: res.points[i].value,
                })
              }
            })
          }
        }
      })
      
    }
    var exporting = am5plugins_exporting.Exporting.new(root, {});
    this.print =  function downloadChartImage() {
      exporting.print();
    }
    this.downloadpng = function downloadChartImage() {
      exporting.download("png");
    }


    series.appear(1000);
    chart.appear(1000, 100);
    
    cursor.snapToSeries = series;

    // chart.preloader.disabled = true;

    // var indicator;
    // function showIndicator() {
    //   indicator = chart.tooltipContainer.createChild(am4core.Container);
    //   indicator.background.fill = am4core.color("#fff");
    //   indicator.background.fillOpacity = 0.8;
    //   indicator.width = am4core.percent(100);
    //   indicator.height = am4core.percent(100);
      
    //   var indicatorLabel = indicator.createChild(am4core.Label);
    //   indicatorLabel.text = "Loading stuff...";
    //   indicatorLabel.align = "center";
    //   indicatorLabel.valign = "middle";
    //   indicatorLabel.fontSize = 20;
    // }

    // showIndicator();
    
    
  },
  watch: {
    chartDataArr() {
      if (this.root) {
        console.log('new data loaded ');
      }
    },
    seriesArr:{
      handler() {
        if (this.viewlive) {
          this.endtime = new Date(this.seriesArr[0].data.values[this.seriesArr[0].data.values.length-1].argument)
          this.starttime = new Date(this.seriesArr[0].data.values[0].argument)
          this.starttimeexcel = moment(this.starttime).format("HH:mm:ss DD.MM.YY")
          this.endtimeexcel = moment(this.endtime).format("HH:mm:ss DD.MM.YY")
        }
      },
      deep: true
    },
    endtime() {
      if (this.endtime < this.starttime) this.starttime = new Date(this.endtime.getTime() - 86400000)
    }
  },
  beforeDestroy() {
    stoplive()
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
    // sterttimeexcle(){
    //   console.log(this.starttime)
    //   return moment(this.starttime).format("HH:mm:ss DD.MM.YY")
    // },
    // endtimeexcel(){
    //   console.log(this.endtime)
    //   return moment(this.endtime).format("HH:mm:ss DD.MM.YY")
    // },
    // starttimefixed(){
    //   if (moment(this.starttime) > moment()){
    //     return moment.
    //   }
    // },
    datajson(){
      if (this.seriesArr) {
        var items = [];
        var sum
        for (let i = 0; i < this.seriesArr[0].data.values.length; i++) {
          let element = new Object()
          element["Time"] = moment(this.seriesArr[0].data.values[i].argument).format(`YYYY.MM.DD`) + " " + moment(this.seriesArr[0].data.values[i].argument).format(`HH:mm:ss`)
          sum = 0
          for (let j = 0; j < this.seriesArr.length; j++) {
            if (this.seriesArr[j].data._values[i].value) {
              element[this.seriesArr[j]._settings.name] = this.seriesArr[j].data._values[i].value.toFixed(3).toString()
            } else{
              element[this.seriesArr[j]._settings.name] = '***'
              sum = sum + 1
            }
          }
          if (this.seriesArr.length!= sum) items.push(JSON.parse(JSON.stringify(element)))
        }
        return items
      } else {
        return null
      }
    },
    ip() {
      return this.$store.getters.ip;
    },
    
  },
}
</script>

<style scoped>
.ms{
  user-select: none;
}
#chartdiv {
  width: 100%;
  height: 100%;
  /* border: solid 1px gray; */
}
#box_loading{
  background: rgba(35, 35, 35,0.8);
  position: absolute;
  /* border: solid 1px green; */
  width: var(--width);
  height: var(--height);
  left: var(--x);
  top: var(--y);
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
#box_loading_top{
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
}
#box_loading_center{
  border: solid 1px white;
  width: 30%;
  height: 30%;
  background-color: #232323;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
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
    flex-direction: row;
    justify-content:center;
    align-items:center;
  }
    .box_title_datepicker{
      /* border: solid 1px peru; */
      width: 100%;
      height: 100%;
    }

    .button_hover:hover{
      background-color: #267dff;
    }
    .button_hover:active{
      background-color: #68a5ff;
    }

  #box_chart{
    width: 100%;
    height: 90%;
    /* border: solid 1px yellow; */
  }
  .dp__theme_dark {
   --dp-background-color: #212121;
   --dp-text-color: #ffffff;
   --dp-hover-color: #484848;
   --dp-hover-text-color: #ffffff;
   --dp-hover-icon-color: #959595;
   --dp-primary-color: #005cb2;
   --dp-primary-text-color: #ffffff;
   --dp-secondary-color: #a9a9a9;
   --dp-border-color: #2d2d2d;
   --dp-menu-border-color: #2d2d2d;
   --dp-border-color-hover: #aaaeb7;
   --dp-disabled-color: #737373;
   --dp-scroll-bar-background: #212121;
   --dp-scroll-bar-color: #484848;
   --dp-success-color: #00701a;
   --dp-success-color-disabled: #428f59;
   --dp-icon-color: #959595;
   --dp-danger-color: #e53935;
   --dp-highlight-color: rgba(0, 92, 178, 0.2);
}
#buttons{
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>