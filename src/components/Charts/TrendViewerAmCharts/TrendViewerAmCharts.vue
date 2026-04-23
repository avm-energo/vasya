<template>
  <div id="box" :style="cssProps">
    <div id="box_title">
      <div id="buttons" style="flex-grow: 6">
        <div id ="button_play" @click="[liveview() + !this.viewlive ? startlive(this.$parent.$parent.windowpath, this.name, this.seriesArr, this.controller, this.interval) : '']" :class="[!this.viewlive ? 'button_hover': '']" :title="[!this.viewlive ? 'Режим реального времени': '']">
          <svg width="80%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" fill="none"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 5.49686C3 3.17662 5.52116 1.73465 7.52106 2.91106L18.5764 9.41423C20.5484 10.5742 20.5484 13.4259 18.5764 14.5858L7.52106 21.089C5.52116 22.2654 3 20.8234 3 18.5032V5.49686Z" :fill="[!this.viewlive ? '#FFFFFF' : '#696969']"/>
          </svg>
        </div>
        <div id ="button_pause" @click="[this.viewlive ? [stoplive()] : ''], liveview()" :class="[this.viewlive ? 'button_hover': '']" :title="[this.viewlive ? 'Откл. режим реального времени': '']">
          <svg width="80%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z" :fill="[this.viewlive ? '#FFFFFF' : '#696969']"/>
            <path d="M21.0016 19.11V4.89C21.0016 3.54 20.4316 3 18.9916 3H15.3616C13.9316 3 13.3516 3.54 13.3516 4.89V19.11C13.3516 20.46 13.9216 21 15.3616 21H18.9916C20.4316 21 21.0016 20.46 21.0016 19.11Z" :fill="[this.viewlive ? '#FFFFFF' : '#696969']"/>
          </svg>
        </div>
      </div>
      <div style="display: flex; align-items: center;" class="ms">&nbsp;От:&nbsp;<datepicker :close-on-auto-apply="false" format="dd MMM yyyy, HH:mm" :format-locale="locale" locale="ru" cancelText="Назад" selectText="Далее"  v-model="starttime" class="box_title_datepicker" :dark="true" :disabled="this.viewlive" :clearable="false" :max-date="this.endtime"/></div>
      <div style="display: flex; align-items: center;" class="ms">&nbsp;До:&nbsp;<datepicker format="dd MMM yyyy, HH:mm" :format-locale="locale" locale="ru" cancelText="Назад" selectText="Далее" now-button-label="Сегодня" v-model="endtime" class="box_title_datepicker" :dark="true" :disabled="this.viewlive" :clearable="false" show-now-button/></div>
      <div id="buttons">
        <div class ="button button_hover" @click="showlegend(this.legendbool = !this.legendbool)" title="Показать легенду">
          <svg width="80%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5V19C4 19.5523 4.44772 20 5 20H19" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18 9L13 13.9999L10.5 11.4998L7 14.9998" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="box_title_update_icon" @click="[!this.viewlive ? updateChartSeriesByTimeInterval() : '']" :class="[!this.viewlive ? 'button_hover': '']" :title="[!this.viewlive ? 'Обновить данные': '']">
          <svg width="80%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.83334 13.6C8.25804 14.4031 8.97945 15.0676 9.88888 15.4934C10.7983 15.9191 11.8465 16.083 12.8755 15.9604C13.9045 15.8378 14.8586 15.4353 15.594 14.8136L17 13.7451M17 16V13.6H14.5M16.1667 10.4C15.742 9.59687 15.0206 8.93238 14.1111 8.50664C13.2017 8.08091 12.1535 7.91699 11.1245 8.03959C10.0955 8.16219 9.1414 8.56467 8.40599 9.18637L7 10.2549M7 8V10.4H9.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" :stroke="[!this.viewlive ? '#FFFFFF' : '#696969']" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class ="button" @click="[!this.viewlive ? print() : '']" :class="[!this.viewlive ? 'button_hover': '']" :title="[!this.viewlive ? 'Печать': '']">
          <svg width="80%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 16.75H16C15.8011 16.75 15.6103 16.671 15.4697 16.5303C15.329 16.3897 15.25 16.1989 15.25 16C15.25 15.8011 15.329 15.6103 15.4697 15.4697C15.6103 15.329 15.8011 15.25 16 15.25H18C18.3315 15.25 18.6495 15.1183 18.8839 14.8839C19.1183 14.6495 19.25 14.3315 19.25 14V10C19.25 9.66848 19.1183 9.35054 18.8839 9.11612C18.6495 8.8817 18.3315 8.75 18 8.75H6C5.66848 8.75 5.35054 8.8817 5.11612 9.11612C4.8817 9.35054 4.75 9.66848 4.75 10V14C4.75 14.3315 4.8817 14.6495 5.11612 14.8839C5.35054 15.1183 5.66848 15.25 6 15.25H8C8.19891 15.25 8.38968 15.329 8.53033 15.4697C8.67098 15.6103 8.75 15.8011 8.75 16C8.75 16.1989 8.67098 16.3897 8.53033 16.5303C8.38968 16.671 8.19891 16.75 8 16.75H6C5.27065 16.75 4.57118 16.4603 4.05546 15.9445C3.53973 15.4288 3.25 14.7293 3.25 14V10C3.25 9.27065 3.53973 8.57118 4.05546 8.05546C4.57118 7.53973 5.27065 7.25 6 7.25H18C18.7293 7.25 19.4288 7.53973 19.9445 8.05546C20.4603 8.57118 20.75 9.27065 20.75 10V14C20.75 14.7293 20.4603 15.4288 19.9445 15.9445C19.4288 16.4603 18.7293 16.75 18 16.75Z" :fill="[!this.viewlive ? '#FFFFFF' : '#696969']"/>
            <path d="M16 8.75C15.8019 8.74741 15.6126 8.66756 15.4725 8.52747C15.3324 8.38737 15.2526 8.19811 15.25 8V4.75H8.75V8C8.75 8.19891 8.67098 8.38968 8.53033 8.53033C8.38968 8.67098 8.19891 8.75 8 8.75C7.80109 8.75 7.61032 8.67098 7.46967 8.53033C7.32902 8.38968 7.25 8.19891 7.25 8V4.5C7.25 4.16848 7.3817 3.85054 7.61612 3.61612C7.85054 3.3817 8.16848 3.25 8.5 3.25H15.5C15.8315 3.25 16.1495 3.3817 16.3839 3.61612C16.6183 3.85054 16.75 4.16848 16.75 4.5V8C16.7474 8.19811 16.6676 8.38737 16.5275 8.52747C16.3874 8.66756 16.1981 8.74741 16 8.75Z" :fill="[!this.viewlive ? '#FFFFFF' : '#696969']"/>
            <path d="M15.5 20.75H8.5C8.16848 20.75 7.85054 20.6183 7.61612 20.3839C7.3817 20.1495 7.25 19.8315 7.25 19.5V12.5C7.25 12.1685 7.3817 11.8505 7.61612 11.6161C7.85054 11.3817 8.16848 11.25 8.5 11.25H15.5C15.8315 11.25 16.1495 11.3817 16.3839 11.6161C16.6183 11.8505 16.75 12.1685 16.75 12.5V19.5C16.75 19.8315 16.6183 20.1495 16.3839 20.3839C16.1495 20.6183 15.8315 20.75 15.5 20.75ZM8.75 19.25H15.25V12.75H8.75V19.25Z" :fill="[!this.viewlive ? '#FFFFFF' : '#696969']"/>
          </svg>
        </div>
        <div class ="button" @click="[!this.viewlive ? downloadpng() : '']" :class="[!this.viewlive ? 'button_hover': '']" :title="[!this.viewlive ? 'Сохранить как .png': '']">
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
        <div class ="button" @click="exporttoexcel()" :class="[!this.viewlive ? 'button_hover': '']" :title="[!this.viewlive ? 'Экспортировать в формате таблицы': '']">
          <!-- <exportexcel :data="this.datajson" :header ="[this.params.header, this.starttimeexcel + ' - ' + this.endtimeexcel]" :name="this.params.header + ' ' + this.starttimeexcel + '-' + this.endtimeexcel + '.xls'" style="width: 100%; height: 100%"> -->
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
          <!-- </exportexcel> -->
        </div>
        <div class ="button" @click="toggleFullscreen()" :class="[!this.viewlive ? 'button_hover': '']" :title="[!this.viewlive ? 'На весь экран': '']">
          <svg width="90%" height="100%" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
            <path :fill="[!this.viewlive ? '#FFFFFF' : '#696969']" d="M6.5 45.5V34.6667H10.8333V41.1667H17.3333V45.5H6.5ZM34.6667 45.5V41.1667H41.1667V34.6667H45.5V45.5H34.6667ZM6.5 17.3333V6.5H17.3333V10.8333H10.8333V17.3333H6.5ZM41.1667 17.3333V10.8333H34.6667V6.5H45.5V17.3333H41.1667Z" />
          </svg>
        </div>
      </div>
      <div style="flex-grow: 6" ></div>
    </div>
    <div id="box_chart">
      <div v-if="baseIntervalMeasurement === 'minute'" id="box_timeframe">
        <span>Краткосрочные тренды:</span>
<!--        <span-->
<!--            @click="updateChartSeriesByTimeFrame(1)"-->
<!--            :title="this.density === 1 ? 'Интервал установлен в 1 минуту' : 'Установить интервал между точками в 1 минуту'"-->
<!--            :class="this.density === 1 ? 'timeframe_active' : 'timeframe'">-->
<!--          1m-->
<!--        </span>-->
        <span
            @click="updateChartSeriesByTimeFrame(5)"
            :title="this.density === 5 ? 'Интервал установлен в 5 минут' : 'Установить интервал между точками в 5 минут'"
            :class="this.density === 5 ? 'timeframe_active' : 'timeframe'">
          5m
        </span>
        <span
            @click="updateChartSeriesByTimeFrame(15)"
            :title="this.density === 15 ? 'Интервал установлен в 15 минут' : 'Установить интервал между точками в 15 минут'"
            :class="this.density === 15 ? 'timeframe_active' : 'timeframe'">
          15m
        </span>
        <span
            @click="updateChartSeriesByTimeFrame(30)"
            :title="this.density === 30 ? 'Интервал установлен в 30 минут' : 'Установить интервал между точками в 30 минут'"
            :class="this.density === 30 ? 'timeframe_active' : 'timeframe'">
          30m
        </span>
        <span
            @click="updateChartSeriesByTimeFrame(60)"
            :title="this.density === 60 ? 'Интервал установлен в 60 минут' : 'Установить интервал между точками в 60 минут'"
            :class="this.density === 60 ? 'timeframe_active' : 'timeframe'">
          1H
        </span>
      </div>
      <div v-else-if="baseIntervalMeasurement === 'hour'" id="box_timeframe">
        <span>Долгосрочные тренды:</span>
        <span
            @click="updateChartSeriesByTimeFrame(1)"
            :title="this.density === 1 ? 'Интервал установлен в 1 час' : 'Установить интервал между точками в 1 час'"
            :class="this.density === 1 ? 'timeframe_active' : 'timeframe'">
          1H
        </span>
        <span
            @click="updateChartSeriesByTimeFrame(4)"
            :title="this.density === 4 ? 'Интервал установлен в 4 часа' : 'Установить интервал между точками в 4 часа'"
            :class="this.density === 4 ? 'timeframe_active' : 'timeframe'">
          4H
        </span>
        <span
            @click="updateChartSeriesByTimeFrame(12)"
            :title="this.density === 12 ? 'Интервал установлен в 12 часов' : 'Установить интервал между точками в 12 часов'"
            :class="this.density === 12 ? 'timeframe_active' : 'timeframe'">
          12H
        </span>
        <span
            @click="updateChartSeriesByTimeFrame(24)"
            :title="this.density === 24 ? 'Интервал установлен в 1 день' : 'Установить интервал между точками в 1 день'"
            :class="this.density === 24 ? 'timeframe_active' : 'timeframe'">
          1D
        </span>
<!--        <span-->
<!--            @click="updateChartSeriesByTimeFrame(168)"-->
<!--            :title="this.density === 168 ? 'Интервал установлен в 1 неделю' : 'Установить интервал между точками в 1 неделю'"-->
<!--            :class="this.density === 168 ? 'timeframe_active' : 'timeframe'">-->
<!--          1W-->
<!--        </span>-->
      </div>
      <div id="chartdiv" ref="chartdiv"></div>
    </div>
  </div>
  <!--  <div id="box_loading" >-->
  <!--    <div id="box_loading_center">-->
  <div id="box_loading_top" v-if="!this.getdata" :style="cssPropsLoading" >
    <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="24px" height="24px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="#232323" /><g><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#000000"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(45 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(90 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#e1e1e1" transform="rotate(135 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#bebebe" transform="rotate(180 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#979797" transform="rotate(225 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#6e6e6e" transform="rotate(270 64 64)"/><path d="M71 39.2V.4a63.6 63.6 0 0 1 33.96 14.57L77.68 42.24a25.53 25.53 0 0 0-6.7-3.03z" fill="#3c3c3c" transform="rotate(315 64 64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;45 64 64;90 64 64;135 64 64;180 64 64;225 64 64;270 64 64;315 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform></g><g><circle fill="#000000" cx="63.66" cy="63.16" r="12"/><animate attributeName="opacity" dur="720ms" begin="0s" repeatCount="indefinite" keyTimes="0;0.5;1" values="1;0;1"/></g></svg>
    <div style="margin-left: 10px;">Загрузка: {{this.loading_per}}% </div>
    <button @click="stopfetch(), stoplive()" v-show="this.seriesArr != null">Прервать загрузку</button>
  </div>

  <!--    </div>-->
  <!--  </div>-->
</template>

<script>
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import am5lang_ru_RU from '../locales/am5lang_ru_RU'
import {ru} from 'date-fns/locale'
import { getTrendsData } from './api/getTrendsData'


import Datepicker from "@vuepic/vue-datepicker";
import moment from "moment";
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import axios from 'axios'
import store from "@/store";
import {encript} from "@/mixins/encript.js";

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
      seriesArr: null,
      starttimeexcel: null,
      endtimeexcel: null,
      controller: null,
      interval: null,
      locale: ru,
      // saxes: [],
      loading_per: 0,
      yAxisVisibleSeriesCount: new Map(),
      baseIntervalMeasurement: "hour",
      density: 1,
      isFullscreen: false,
    }
  },
  components: {
    moment,
    Datepicker,
  },
  created() {
    const controller = new AbortController();
    this.controller = controller
    this.interval = 1000;
  },
  methods: {

    setTimeFrame(value) {
      this.xAxis.set("baseInterval", {
        timeUnit: this.baseIntervalMeasurement,
        count: value
      });
    },

    async some() {
      this.endtime = moment(this.seriesArr[0].data.values[this.seriesArr[0].data.values.length - 1].argument).toISOString()
    },

    showlegend() {
    },

    startlive() {
    },

    stoplive() {
    },

    print() {
    },

    downloadpng() {
    },

    async liveview() {
      this.viewlive = !this.viewlive

    },

    stopfetch() {
      this.viewlive = false
      // this.getdata = !this.getdata
      this.controller.abort()
      this.controller = new AbortController();
    },
    calcColumnWidths(data) {
      if (!data.length) return []

      // Порядок колонок – берём из первого объекта
      const cols = Object.keys(data[0])
      const maxLengths = cols.map(col => col.length) // стартуем с длины заголовка

      data.forEach(row => {
        cols.forEach((col, i) => {
          const cell = row[col]
          // Если в ячейке число, превращаем в строку, чтобы измерить длину
          const len = cell == null ? 0 : cell.toString().length
          if (len > maxLengths[i]) maxLengths[i] = len
        })
      })

      // Добавляем «запас» (2–3 символа) и возвращаем массив { wch }
      return maxLengths.map(len => ({ wch: len + 2 }))
    },
    exporttoexcel() {
      if (this.datajson.length !== 0) {
        console.log('Export To Excel is in Progress!');
        // const header = [this.params.header, this.starttimeexcel + ' - ' + this.endtimeexcel]
        // const ws = XLSX.utils.json_to_sheet(this.datajson, { header })
        const ws = XLSX.utils.json_to_sheet(this.datajson)
        const colWidths = this.calcColumnWidths(this.datajson)


        ws['!cols'] = colWidths
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Лист1')

        // 4️⃣ Генерируем бинарный файл
        const wbout = XLSX.write(wb, {
          bookType: 'xlsx',    // формат .xlsx
          type: 'array'        // возвращаем Uint8Array
        })

        // 5️⃣ Сохраняем через FileSaver
        const blob = new Blob([wbout], { type: 'application/octet-stream' })
        saveAs(blob, `${this.params.header + ' ' + this.starttimeexcel + '-' + this.endtimeexcel}.xls`)
      } else
        store.dispatch('AddNotification_action', { text: `Ошибка: Остутствуют данные для формирования отчета Excel`, type: 'Error', time: 5000 });
    },

    divideTimeInterval(startDate, endDate) {

      const diff = endDate.getTime() - startDate.getTime(); // Разница между датами в миллисекундах

      let intervalCounts;
      if (diff <= 86400000) intervalCounts = 1;
      else if (diff <= 345600000) intervalCounts = 2;
      else if (diff <= 1209600000) intervalCounts = 4;
      else if (diff <= 2678403559) intervalCounts = 10;
      else intervalCounts = 20;

      const intervalLength = diff / intervalCounts; // Длина каждого промежутка

      const intervals = []; // Массив для хранения промежутков

      // Создание равных промежутков
      for (let i = 0; i < intervalCounts; i++) {
        const startOfInterval = new Date(startDate.getTime() + i * intervalLength); // Начало промежутка
        const endOfInterval = new Date(startDate.getTime() + (i + 1) * intervalLength); // Конец промежутка
        intervals.push({start: startOfInterval, end: endOfInterval}); // Добавление промежутка в массив
      }

      return intervals;
    },

    getChartsInfo() {
      this.chartInfo = this.params.strends
    },


    updateChart() {
      if (this.chartDataArr !== undefined) {
        for (let i = 0; i < this.chart.series.values.length; i++) {
          var data = this.generateDatas(i);
          this.seriesArr[i].data.setAll(data)
        }
      }
    },

    clearChart() {
      if (this.chartDataArr !== undefined) {
        for (let i = 0; i < this.chart.series.values.length; i++) {
          this.seriesArr[i].data.setAll([])
        }
      }
    },

    generateDataObj(point) {
      return {
        argument: new Date(point.argument).getTime(),
        category: 'category',
        value: point.value
      };
    },

    generateDatas(num) {
      let dataArr = [];
      const points = this.chartDataArr.resultData[num].points;

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        if (p.value !== null && p.value !== undefined) {
          dataArr.push(this.generateDataObj(p));
        }
      }
      return dataArr
    },
    async updateChartSeriesByTimeFrame (newDensity) {
      console.log("Происходит Update Chart Series By Time Frame");
      // Indicator
      this.gettingdata()
      this.loading_per = 0;

      // Задаем интервал для загрузки данных
      if (this.baseIntervalMeasurement === "hour") {
        this.starttime = new Date(Date.now() - (1000 * 60 * 60 * 500 * newDensity));
      } else if (this.baseIntervalMeasurement === "minute") {
        this.starttime = new Date(Date.now() - (1000 * 60 * 500 * newDensity));
      }

      this.endtime = new Date(Date.now());
      this.density = newDensity;
      const intervals = this.divideTimeInterval(this.starttime, this.endtime);
      this.clearChart();

      for (let j = 0; j < intervals.length; j++) {
        this.loading_per = j / intervals.length * 100;
        const result = await getTrendsData(intervals[j].start, intervals[j].end, this.density, this.$parent.$parent.windowpath, this.name, this.controller);
        if (result !== undefined) {
          if (j === 0) this.chartDataArr = result;
          else {
            for (let i = 0; i < result.resultData.length; i++) {
              this.chartDataArr.resultData[i].points = [...this.chartDataArr.resultData[i].points, ...result.resultData[i].points]
            }
          }
        } else break;

        if (j === 0 ) {
          this.setTimeFrame(this.density);
        }

        this.updateChart()
      }
      this.loading_per = 100;
      this.gettingdata()
    },
    async updateChartSeriesByTimeInterval() {
      console.log("Происходит Update Chart Series by Time Interval")
      // Indicator
      this.gettingdata()
      this.loading_per = 0;

      // let density = 1;
      if (this.baseIntervalMeasurement === "hour") {
        this.density = this.normalizeHourTimeFrame(Math.ceil((this.endtime - this.starttime) / (1000 * 60 * 60 * 500)));
      } else if (this.baseIntervalMeasurement === "minute") {
        this.density = this.normalizeMinuteTimeFrame(Math.ceil((this.endtime - this.starttime) / (1000 * 60 * 500)));
      }
      const intervals = this.divideTimeInterval(this.starttime, this.endtime);
      this.clearChart();

      for (let j = 0; j < intervals.length; j++) {
        this.loading_per = j / intervals.length * 100;
        const result = await getTrendsData(intervals[j].start, intervals[j].end, this.density, this.$parent.$parent.windowpath, this.name, this.controller);
        if (result !== undefined) {
          if (j === 0) this.chartDataArr = result;
          else {
            for (let i = 0; i < result.resultData.length; i++) {
              this.chartDataArr.resultData[i].points = [...this.chartDataArr.resultData[i].points, ...result.resultData[i].points]
            }
          }
        } else break;

        if (j === 0 ) {
          this.setTimeFrame(this.density);
        }

        this.updateChart()
      }
      this.loading_per = 100;
      this.gettingdata()

    },

    gettingdata() {
      this.getdata = !this.getdata
    },

    handleKeyDown(e) {
      if (e.ctrlKey) {
        this.chart.set("wheelY", "zoomY");
      } else if (e.shiftKey) {
        this.chart.set("wheelY", "panY");
      }
    },

    handleKeyUp(e) {
      this.chart.set("wheelY", "zoomX"); // сброс к дефолту
    },
    toggleFullscreen() {
      console.log("toggleFullscreen");
      const el = this.$refs.chartdiv; // весь виджет

      if (!this.isFullscreen) {
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    },
    normalizeMinuteTimeFrame(value) {
      if (value > 30) return 60;
      if (value > 15) return 30
      if (value > 5) return 15;
      if (value > 1) return 5;
      return 1;
    },
    normalizeHourTimeFrame(value) {
      if (value > 24) return 168;
      if (value > 12) return 24;
      if (value > 4) return 12;
      if (value > 1) return 4;
      return 1;
    }
  },

  async mounted() {
    let root = am5.Root.new(this.$refs.chartdiv);
    this.root = root;

    // Задаем интервал для загрузки данных
    this.starttime = new Date(Date.now() - 86400000 * 1); // Устанавливаем в один день ровно
    this.endtime = new Date(Date.now())
    console.log(this.starttime, " = Start time ");
    console.log(this.endtime, " = End time ");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    root.locale = am5lang_ru_RU;

    root.interfaceColors.set("text", am5.color(0xffffff));
    let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "panY",
          pinchZoomX: false,
          "valueAxes": [
            {
              "title": "Axis title"
            }
          ],
        })
    );

    const scrollbarX = am5.Scrollbar.new(root, {
      orientation: "horizontal",
      height: 12
    });

    const scrollbarY = am5.Scrollbar.new(root, {
      orientation: "vertical",
      width: 12
    });

    const sbTooltipX = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      autoTextColor: false
    });

    sbTooltipX.get("background").setAll({
      fill: am5.color(0x333333),
      fillOpacity: 0.95,
      stroke: am5.color(0xffffff),
      strokeOpacity: 0.2
    });

    sbTooltipX.label.setAll({
      fill: am5.color(0xffffff),
      fontSize: 12
    });

    const sbTooltipY = am5.Tooltip.new(root, {
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      autoTextColor: false
    });

    sbTooltipY.get("background").setAll({
      fill: am5.color(0x333333),
      fillOpacity: 0.95,
      stroke: am5.color(0xffffff),
      strokeOpacity: 0.2
    });

    sbTooltipY.label.setAll({
      fill: am5.color(0xffffff),
      fontSize: 12
    });

    scrollbarX.set("tooltip", sbTooltipX);
    scrollbarY.set("tooltip", sbTooltipY);

    scrollbarX.startGrip.set("tooltipText", "Изменение левой границы по оси X");
    scrollbarX.endGrip.set("tooltipText", "Изменение правой границы по оси X");

    scrollbarY.startGrip.set("tooltipText", "Изменение нижней границы по оси Y");
    scrollbarY.endGrip.set("tooltipText", "Изменение верхней границы по оси Y");

    scrollbarX.thumb.setAll({
      tooltipText: "Прокрутка трендов по оси X",
      interactive: true
    });

    scrollbarY.thumb.setAll({
      tooltipText: "Прокрутка трендов по оси Y",
      interactive: true
    });

    chart.set("scrollbarX", scrollbarX);
    chart.set("scrollbarY", scrollbarY);

    this.chart = chart

    console.log("Разница временного интервала в часах = ", (this.endtime - this.starttime) / (1000 * 60 * 60));
    const intervals = this.divideTimeInterval(this.starttime, this.endtime);
    console.log(intervals, ' = intervals');

    this.getChartsInfo()

    this.chartDataArr = await getTrendsData(intervals[0].start, intervals[0].end, 1, this.$parent.$parent.windowpath, this.name, this.controller);
    this.seriesArr = []

    // Первоначальный расчет, краткосрочные или долгосрочные тренды
    if ( this.chartDataArr.resultData[0]?.points[0] && this.chartDataArr.resultData[0]?.points[1] ) {
      let newBaseInterval = (new Date(this.chartDataArr.resultData[0]?.points[1]?.argument).getTime() - new Date(this.chartDataArr.resultData[0]?.points[0]?.argument).getTime()) / 1000 / 60;
      if (newBaseInterval === 60) {
        this.baseIntervalMeasurement = "hour"
      } else if (newBaseInterval === 1) {
        this.baseIntervalMeasurement = "minute"
      }
      console.log("Интервал данных при инцициализации в минутах", newBaseInterval)
    }

    if (this.baseIntervalMeasurement === "hour") {
      this.density = this.normalizeHourTimeFrame(Math.ceil((this.endtime - this.starttime) / (1000 * 60 * 60 * 500)));
    } else if (this.baseIntervalMeasurement === "minute") {
      this.density = this.normalizeMinuteTimeFrame(Math.ceil((this.endtime - this.starttime) / (1000 * 60 * 500)));
    }
    console.log(this.density, " density при инициализации")

    this.chartDataArr = await getTrendsData(intervals[0].start, intervals[0].end, this.density, this.$parent.$parent.windowpath, this.name, this.controller);


    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      minZoomCount: 3,
      baseInterval: {timeUnit: this.baseIntervalMeasurement, count: this.density},
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueX.formatDate('dd MMM yyyy, HH:mm')}"
      }),
      tooltipDateFormat: "dd MMM yyyy, HH:mm",
      tooltipIntervalOffset: 0,
      categoryField: "category",
    }));

    xAxis.set("groupData", false);

    this.xAxis = xAxis

    function boostColor(baseColor, factor = 1.2, index = 0) {
      let color = baseColor;
      if (index % 2 === 0) {
        color = am5.Color.lighten(color, 0.1 * index);
      } else {
        color = am5.Color.brighten(color, 1 / (1 + 0.1 * index)); // уменьшение яркости
      }
      return color;
    }
    // НАЧАЛО ЦИКЛА SERIES ------------------------------------------------------
    const axisByParentId = new Map();
    for (let i = 0; i < this.chartDataArr.resultData.length; i++) {

      const lineColor = am5.color("#" + this.chartInfo[i].sColor.slice(0, 6))
      const axisColor = boostColor(lineColor, 1.75, i * 1.2); // i — индекс серии
      const parentID = this.params.strends[i]["parentID"];
      const saxes = this.params.saxes.filter(item => item.id === parentID);
      const axisConfig = saxes[0];

      if (!axisConfig) {
        console.error("Не найдена ось для parentID =", parentID);
        continue;
      }

      let yAxis = axisByParentId.get(parentID);

      if (!yAxis) {
        const yRenderer = am5xy.AxisRendererY.new(root, {
          opposite: true,
        });

        yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
              min: axisConfig.yLowerLimit,
              max: axisConfig.yUpperLimit,
              renderer: yRenderer,
              // strictMinMax: true,
              autoZoom: false,
              extraMin: 0,
              extraMax: 0,
              maxDeviation: 1,
            })
        );

        const label = yAxis.children.push(
            am5.Label.new(root, {
              text: axisConfig.uom ?? "",
              textAlign: 'center',
              y: -40,
              x: 0,
              fontWeight: 'bold',
            })
        );

        yAxis.set("customLabel", label);

        yRenderer.grid.template.set("strokeOpacity", 0.05);
        yRenderer.setAll({
          stroke: "white",
          strokeOpacity: 1,
          opacity: 1,
        });

        axisByParentId.set(parentID, yAxis);
      }

      const uom = axisConfig.uom ?? "";

      const series = chart.series.push(
          am5xy.LineSeries.new(root, {
            name: `${this.chartInfo[i].name}${uom ? ", " + uom : ""}`,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "argument",
            categoryXField: "category",
            categoryField: "category",
            connect: true,
            minDistance: 0,
            autoGapCount: 1,
            fill: axisColor,
            stroke: axisColor,
            tooltip: am5.Tooltip.new(root, {
              labelText: "[bold]{name}[/]\n{valueX.formatDate('dd MMM yyyy, HH:mm')}\n{valueY}",
              getFillFromSprite: false,
              getStrokeFromSprite: false,
              autoTextColor: false,
              pointerOrientation: "horizontal",
              pointerLength: 10,
              background: am5.PointedRectangle.new(root, {
                fill: am5.color("#333"),
                stroke: am5.color("#ffffff"),
                strokeWidth: 1,
                fillOpacity: 0.9,
                pointerLength: 12,
                pointerBaseWidth: 15,
                cornerRadiusTL: 5,
                cornerRadiusTR: 5,
                cornerRadiusBL: 5,
                cornerRadiusBR: 5
              }),
              label: am5.Label.new(root, {
                fill: am5.color("#ffffff"),
                fontSize: 16,
                fontWeight: "bold"
              })
            })
          }));

      series.uid = this.chartInfo[i].uid

      series.data.processor = am5.DataProcessor.new(root, {
        dateFormat: "MM/dd/yyyy HH:mm:ss",
        dateFields: ["argument"]
      });

      series.set("simplifiedProcessing", false);

      series.strokes.template.setAll({strokeWidth: 1});

      series.bullets.push(function(root, series) {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 2,
            fill: series.get("stroke"),     // цвет как у линии
            stroke: root.interfaceColors.get("background"),
            strokeWidth: 1
          })
        });
      });

      if (!this.yAxisVisibleSeriesCount.get(yAxis.uid)) this.yAxisVisibleSeriesCount.set(yAxis.uid, 1);
      else this.yAxisVisibleSeriesCount.set(yAxis.uid, this.yAxisVisibleSeriesCount.get(yAxis.uid) + 1);
      this.seriesArr.push(series)

    }
    // КОНЕЦ ЦИКЛА SERIES ------------------------------------------------------
    this.updateChart()

    // КУРСОР
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none",
      snapToSeries: [],
      xAxis: xAxis,
      // yAxis: yAxis
    }));



    cursor.lineY.set("visible", false);
    cursor.lineX.setAll({
      stroke: am5.color(0xf75394),
      strokeWidth: 1,
      strokeDasharray: []
    });

    // Обработчики при нажатии на кнопки для масштабирования трендов
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);

    // ЛЕГЕНДА Сверху
    var legend = chart.topAxesContainer.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      // clickTarget: "none",
    }));
    legend.data.setAll(chart.series.values);
    this.showlegend = function showl(state) {
      legend.setAll({
        visible: state
      });
    }

    this.gettingdata()


    // Функции для скрытия и отображение оси Y
    const hideYAxis = (yAxis) => {
      yAxis.get("customLabel").set("visible", false);
      var renderer = yAxis.get("renderer");
      renderer.grid.template.set("forceHidden", true);
      renderer.labels.template.set("forceHidden", true);
      renderer.ticks.template.set("forceHidden", true);
      renderer.axisFills.template.set("forceHidden", true);
      renderer.set("visible", false);
    }
    const showYAxis = (yAxis) => {
      yAxis.get("customLabel").set("visible", true);
      var renderer = yAxis.get("renderer");
      renderer.grid.template.set("forceHidden", false);
      renderer.labels.template.set("forceHidden", false);
      renderer.ticks.template.set("forceHidden", false);
      renderer.axisFills.template.set("forceHidden", false);
      renderer.set("visible", true);
    }

    this.seriesArr.forEach(series => {
      series.on("visible", (visible, target) => {
        var yAxises = series.get("yAxis");
        if (visible) {
          this.yAxisVisibleSeriesCount.set(yAxises.uid, this.yAxisVisibleSeriesCount.get(yAxises.uid) + 1);
          console.log("Series shown", target)
        } else {
          this.yAxisVisibleSeriesCount.set(yAxises.uid, this.yAxisVisibleSeriesCount.get(yAxises.uid) - 1);
          console.log("Series hidden", target)
        }
        if (this.yAxisVisibleSeriesCount.get(yAxises.uid) > 0) {
          console.log("Открываем");
          showYAxis(yAxises);
        } else {
          console.log("Скрываем");
          hideYAxis(yAxises);
        }

      });
    });


    var refreshId
    var timeoutId
    this.startlive = async function startlive(winn, namee, seriesArr, controllerr, interval) {
      // this.gettingdata()
      var series = seriesArr
      var ip = this.ip
      var win = winn
      let name = namee
      var controller = controllerr
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`,
      };
      var article = `"${moment(series[0].data.values[series[0].data.values.length - 1].argument + 1000).format("YYYY-MM-DDTHH:mm:ss")}"`;
      await axios.post(`http://${ip}/api/nodes/${encript((new TextEncoder()).encode(win))}/widget/${encript((new TextEncoder()).encode(name))}/query/trend-increment`, article, {
        headers,
        signal: controller.signal
      })
          .then(response => {
            if (response.data.resultData) {
              if (response.data.resultData[0].points[0]) {
                response.data.resultData.forEach(res => {
                  var seriesfind = series.find(s => s.uid === res.uid)
                  for (let i = 0; i < res.points.length; i++) {
                    seriesfind.data.push({
                      argument: new Date(res.points[i].argument).getTime(),
                      value: res.points[i].value,
                    })
                  }
                })
              }
            }
            // this.gettingdata()
          })
          .catch(function (error) {
          })
      if (!controller.signal.aborted) {
        timeoutId = setTimeout(() => {
          addData(series, ip, win, name);
          refreshId = setInterval(function () {
            var seriesArr = series
            var ipp = ip
            var winn = win
            var namee = name
            addData(seriesArr, ipp, winn, namee);
          }, interval)
        }, interval - moment().second() * 1000 + 1000)
      }
    }

    this.stoplive = function stoplive() {
      clearInterval(refreshId)
      clearTimeout(timeoutId)
    }

    async function addData(seriesArr, ip, win, name) {


      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`,
      };
      var article = `"${moment(seriesArr[0].data.values[seriesArr[0].data.values.length - 1].argument + 1000).format("YYYY-MM-DDTHH:mm:ss")}"`;
      await axios.post(`http://${ip}/api/nodes/${encript((new TextEncoder()).encode(win))}/widget/${encript((new TextEncoder()).encode(name))}/query/trend-increment`, article, {headers})
          .then(response => {
            if (response.data.resultData) {
              if (response.data.resultData[0].points[0]) {
                seriesArr.forEach(series => {
                  series.data.removeIndex(0)
                })
                response.data.resultData.forEach(res => {
                  var seriesfind = seriesArr.find(s => s.uid === res.uid)
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
    this.print = function downloadChartImage() {
      exporting.print();
    }
    this.downloadpng = function downloadChartImage() {
      exporting.download("png");
    }

    // cursor.snapToSeries = series;


  },

  // Кронец Mounted
  watch: {
    timeFrame() {
      this.updateChart();
    },

    chartDataArr() {
      if (this.root) {
        console.log('new data loaded ');
      }
    },
    //
    seriesArr: {
      handler() {
        console.log(this.seriesArr[0].data.values[0]?.argument, " argument")
        if (this.seriesArr[0].data.values[0]?.argument !== undefined) {
          this.starttimeexcel = moment(new Date(this.seriesArr[0].data.values[0].argument)).format("HH:mm:ss DD.MM.YY")
          this.endtimeexcel = moment(new Date(this.seriesArr[0].data.values[this.seriesArr[0].data.values.length - 1].argument)).format("HH:mm:ss DD.MM.YY")
        }
        if (this.viewlive) {
          this.endtime = new Date(this.seriesArr[0].data.values[this.seriesArr[0].data.values.length - 1].argument)
          this.starttime = new Date(this.seriesArr[0].data.values[0].argument)
        }
      },
      deep: true
    },
    endtime() {
      if (this.endtime < this.starttime) this.starttime = new Date(this.endtime.getTime() - 86400000)
    }
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
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
        // "--back": "#" + this.params.back,
        "--fontSize": this.params.fontSize * this.$parent.$parent.multiplier + "px",
      };
    },

    cssPropsLoading() {
      return {
        "--x": this.params.x * this.$parent.$parent.multiplier + "px",
        "--y": this.params.y * this.$parent.$parent.multiplier + "px",
        "--width": this.params.width * this.$parent.$parent.multiplier * this.params.scale + "px",
        "--height": this.params.height * this.$parent.$parent.multiplier * this.params.scale + "px",
        "--borderRadius": this.params.borderRadius * this.$parent.$parent.multiplier + "px",
        "--borderThick": this.params.borderThick * this.$parent.$parent.multiplier + "px",
        // "--back": "#" + this.params.back,
        "--fontSize": this.params.fontSize * this.$parent.$parent.multiplier + "px",
      };
    },

    datajson() {
      if (this.seriesArr) {
        var items = [];
        var sum
        for (let i = 0; i < this.seriesArr[0].data.values.length; i++) {
          let element = new Object()
          element["Time"] = moment(this.seriesArr[0].data.values[i].argument).format(`YYYY.MM.DD`) + " " + moment(this.seriesArr[0].data.values[i].argument).format(`HH:mm:ss`)
          sum = 0
          for (let j = 0; j < this.seriesArr.length; j++) {
            if (this.seriesArr[j].data._values[i]?.value) {
              element[this.seriesArr[j]._settings.name] = (this.seriesArr[j].data._values[i].value).toFixed(3).toString()
            } else {
              element[this.seriesArr[j]._settings.name] = 0
              sum = sum + 1
            }
          }
          //
          if (this.seriesArr.length != sum) items.push(JSON.parse(JSON.stringify(element)))
          // items.push(JSON.parse(JSON.stringify(element)))
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
.ms {
  user-select: none;
}

#chartdiv {
  width: 100%;
  height: 92%;
  /* border: solid 1px gray; */
}

#box_loading {
  /* background: rgba(35, 35, 35, 0.8); */
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

#box_loading_top {
  position: absolute;
  align-items: center;
  top: calc(var(--y) + 60px);
  left: calc(var(--x) + 8px);
  /* bottom: 0; */
  /* right: 0; */
  padding: 10px;
  display: flex;
  justify-content: center;
  /* flex-direction: row; */
}

#box_loading_center {
  /* border: solid 1px white; */
  /* width: 30%; */
  /* height: 30%; */
  padding: 10px;
  /* background-color: #232323; */
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

#box {
  position: absolute;
  /*text-align: left;*/
  /* border: solid 1p x green; */
  width: var(--width);
  height: var(--height);
  left: var(--x);
  top: var(--y);
}

#box_title {
  /* border: solid 1px blue; */
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.box_title_datepicker {
  /* border: solid 1px peru; */
  width: 100%;
  height: 100%;
}

.button_hover:hover {
  background-color: #267dff;
}

.button_hover:active {
  background-color: #68a5ff;
}

#box_chart {
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

#buttons {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

#box_timeframe {
  padding: 10px 0;
}

.timeframe {
  padding: 10px;
  cursor: pointer;
}

.timeframe_active {
  color: red;
}

.timeframe:hover {
  color: #267dff;
}
</style>