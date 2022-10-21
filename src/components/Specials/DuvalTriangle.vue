<template>
<div id="duval" :style="cssProps">
  <div id="C2H2" class="gas">{{duval.c2h2 ?  duval.c2h2 : ''}}% C&#8322;H&#8322; </div>
  <div id="C2H4" class="gas">{{duval.c2h4 ? duval.c2h4 : '' }}% C&#8322;H&#8324; </div>
  <div id="CH4" class="gas">{{duval.ch4 ? duval.ch4 : ''}}% CH&#8324; </div>
  <canvas ref="canvas" width=410 height=400></canvas>
</div>

</template>

<script>
export default {
  data(){
    return{
      multiplierx: 1.028,
      multipliery: 1.02,
      minx: 109.13,
      miny: 19.22,
      ctx:null,
      imageData: null,
      duval: {
        Name: null,
        c2h2: null,
        c2h4: null,
        ch4: null,
      }
    }
  },
  props: ["params", "name"],
  created(){
  this.duval.Name = this.name
  if (this.$parent.subscreenname){ 
    this.duval.Name += '/' + this.$parent.subscreenname
  }
  const today = new Date();
  var currentDateMilliseconds = today.getMilliseconds();
  setTimeout(()=>{
    const res = {'namewidget': this.duval.Name, 'namewindow': this.$parent.windowname}
    const { ctx } = this;
    var imageData = ctx.getImageData(0,0,410,400);
    setInterval(()=>{
      let changedelem= this.$store.getters.elemByName(res)?.properties
      if (changedelem) {
        console.log(changedelem)
        ctx.putImageData(imageData, 0, 0);
        this.drawDot(changedelem.CH4, changedelem.CH4X, changedelem.CH4Y, changedelem.C2H2, changedelem.C2H2X, changedelem.C2H2Y, changedelem.C2H4, changedelem.C2H4X, changedelem.C2H4Y)
      }
    }, 1000)
  }, 1000 - currentDateMilliseconds);
  },
  methods:{
    drawDuval(){
    const { ctx } = this;
    var { imageData } = this;
    var v0={x:(114-this.minx)*this.multiplierx,y:(366-this.miny)*this.multipliery};
    var v1={x:(306-this.minx)*this.multiplierx,y:(30-this.miny)*this.multipliery};
    var v2={x:(498-this.minx)*this.multiplierx,y:(366-this.miny)*this.multipliery};
    var triangle=[v0,v1,v2];
      // Define all your segments here
      var segments=[
        { 
          points:[{x:(114-this.minx)*this.multiplierx,y:(366-this.miny)*this.multipliery},{x:(281-this.minx)*this.multiplierx,y:(76-this.miny)*this.multipliery},{x:(324-this.minx)*this.multiplierx,y:(150-this.miny)*this.multipliery},{x:(201-this.minx)*this.multiplierx,y:(366-this.miny)*this.multipliery}],
          fill:'#8FCFFF',
          label:{text:'D1',cx:(200-this.minx)*this.multiplierx,cy:(290-this.miny)*this.multipliery,withLine:false,endX:null,endY:null},
        },
        { 
        points:[{x:(385-this.minx)*this.multiplierx,y:(366-this.miny)*this.multipliery},{x:(201-this.minx)*this.multiplierx,y:(366-this.miny)*this.multipliery},{x:(324-this.minx)*this.multiplierx,y:(150-this.miny)*this.multipliery},{x:(356-this.minx)*this.multiplierx,y:(204-this.miny)*this.multipliery},{x:(321-this.minx)*this.multiplierx,y:(256-this.miny)*this.multipliery}],
        fill:'#2F29FF',
        label:{text:'D2',cx:(290-this.minx)*this.multiplierx,cy:(290-this.miny)*this.multipliery,withLine:false,endX:null,endY:null},
      },
      { 
        points:[{x:(297-this.minx)*this.multiplierx,y:(46-this.miny)*this.multipliery},{x:(392-this.minx)*this.multiplierx,y:(214-this.miny)*this.multipliery},{x:(372-this.minx)*this.multiplierx,y:(248-this.miny)*this.multipliery},{x:(441-this.minx)*this.multiplierx,y:(366-this.miny)*this.multipliery},{x:(385-this.minx)*this.multiplierx,y:(366-this.miny)*this.multipliery},{x:(321-this.minx)*this.multiplierx,y:(256-this.miny)*this.multipliery},{x:(356-this.minx)*this.multiplierx,y:(204-this.miny)*this.multipliery},{x:(281-this.minx)*this.multiplierx,y:(76-this.miny)*this.multipliery}],
        fill:'#AF9AFF',
        label:{text:'DT',cx:(370-this.minx)*this.multiplierx,cy:(290-this.miny)*this.multipliery,withLine:false,endX:(366-this.minx)*this.multiplierx,endY:(120-this.miny)*this.multipliery},
      },
      { 
        points:[{x:(306-this.minx)*this.multiplierx,y:(30-this.miny)*this.multipliery},{x:(312-this.minx)*this.multiplierx,y:(40-this.miny)*this.multipliery},{x:(300-this.minx)*this.multiplierx,y:(40-this.miny)*this.multipliery}],
        fill:'#772200',
        label:{text:'PD',cx:(356-this.minx)*this.multiplierx,cy:(40-this.miny)*this.multipliery,withLine:true,endX:(321-this.minx)*this.multiplierx,endY:(40-this.miny)*this.multipliery},
      },
      { 
        points:[{x:(312-this.minx)*this.multiplierx,y:(40-this.miny)*this.multipliery},{x:(348-this.minx)*this.multiplierx,y:(103-this.miny)*this.multipliery},{x:(337-this.minx)*this.multiplierx,y:(115-this.miny)*this.multipliery},{x:(297-this.minx)*this.multiplierx,y:(46-this.miny)*this.multipliery},{x:(300-this.minx)*this.multiplierx,y:(40-this.miny)*this.multipliery}],
        fill:'#e0bccc',
        label:{text:'T1',cx:(375-this.minx)*this.multiplierx,cy:(70-this.miny)*this.multipliery,withLine:true,endX:(340-this.minx)*this.multiplierx,endY:(75-this.miny)*this.multipliery},
      },
      { 
        points:[{x:(348-this.minx)*this.multiplierx,y:(103-this.miny)*this.multipliery},{x:(402-this.minx)*this.multiplierx,y:(199-this.miny)*this.multipliery},{x:(392-this.minx)*this.multiplierx,y:(214-this.miny)*this.multipliery},{x:(337-this.minx)*this.multiplierx,y:(115-this.miny)*this.multipliery}],
        fill:'#e08d9f',
        label:{text:'T2',cx:(400-this.minx)*this.multiplierx,cy:(125-this.miny)*this.multipliery,withLine:true,endX:(366-this.minx)*this.multiplierx,endY:(120-this.miny)*this.multipliery},
      },
      { 
        points:[{x:(402-this.minx)*this.multiplierx,y:(199-this.miny)*this.multipliery},{x:(498-this.minx)*this.multiplierx,y:(366-this.miny)*this.multipliery},{x:(441-this.minx)*this.multiplierx,y:(366-this.miny)*this.multipliery},{x:(372-this.minx)*this.multiplierx,y:(248-this.miny)*this.multipliery}],
        fill:'#973300',
        label:{text:'T3',cx:(425-this.minx)*this.multiplierx,cy:(290-this.miny)*this.multipliery,withLine:false,endX:null,endY:null},
      },
      ];

      // label styles
      var labelfontsize=12;
      var labelfontface='verdana';
      var labelpadding=3;

    // draw colored segments inside triangle
    for(var i=0;i<segments.length;i++){
      drawSegment(segments[i]);
    }
    // draw ticklines
    ticklines(v0,v1,10,0,20);
    ticklines(v1,v2,10,Math.PI*2/3,20);
    ticklines(v2,v0,10,Math.PI*4/3,20);
    // molecules
    // moleculeLabel(v0,v1,100,Math.PI,'% CH4');
    // moleculeLabel(v1,v2,100,0,'% C2H4');
    // moleculeLabel(v2,v0,75,Math.PI/2,'% C2H2');
    // draw outer triangle
    drawTriangle(triangle);
    // draw legend
    // drawLegend(legendTexts,10,10,12.86);
    // const today = new Date();
    // var currentDateMilliseconds = today.getMilliseconds();
    // imageData = ctx.getImageData(0,0,410,400);
    // this.drawDot(this.params.CH4, this.params.CH4X, this.params.CH4Y, this.params.C2H2, this.params.C2H2X, this.params.C2H2Y, this.params.C2H4, this.params.C2H4X, this.params.C2H4Y)
    // setTimeout(() => {
    //   ctx.putImageData(imageData, 0, 0);
    // }, 990 - currentDateMilliseconds);
    function drawSegment(s){
      // draw and fill the segment path
      ctx.beginPath();
      ctx.moveTo(s.points[0].x,s.points[0].y);
      for(var i=1;i<s.points.length;i++){
        ctx.lineTo(s.points[i].x,s.points[i].y);
      }
      ctx.closePath();
      ctx.fillStyle=s.fill;
      ctx.fill();
      ctx.lineWidth=2;
      ctx.strokeStyle='white';
      ctx.stroke();
      // draw segment's box label
      if(s.label.withLine){
        lineBoxedLabel(s,labelfontsize,labelfontface,labelpadding);
      }else{
        boxedLabel(s,labelfontsize,labelfontface,labelpadding);
      }
    }

    function boxedLabel(s,fontsize,fontface,padding){
      var centerX=s.label.cx;
      var centerY=s.label.cy;
      var text=s.label.text;
      ctx.textAlign='center';
      ctx.textBaseline='middle'
      ctx.font=fontsize+'px '+fontface
      var textwidth=ctx.measureText(text).width;
      var textheight=fontsize*1.386;
      var leftX=centerX-textwidth/2-padding;
      var topY=centerY-textheight/2-padding;
      ctx.fillStyle='white';
      // ctx.fillRect(leftX,topY,textwidth+padding*2,textheight+padding*2);
      ctx.lineWidth=1;
      // ctx.strokeRect(leftX,topY,textwidth+padding*2,textheight+padding*2);
      ctx.fillStyle='white';
      ctx.fillText(text,centerX,centerY);
    }

    function lineBoxedLabel(s,fontsize,fontface,padding){
      var centerX=s.label.cx - 30;
      var centerY=s.label.cy - 10;
      var text=s.label.text;
      var lineToX=s.label.endX - 4;
      var lineToY=s.label.endY;
      ctx.textAlign='center';
      ctx.textBaseline='middle'
      ctx.font=fontsize+'px '+fontface
      var textwidth=ctx.measureText(text).width;
      var textheight=fontsize*1.286;
      var leftX=centerX-textwidth/2-padding - 10 ;
      var topY=centerY-textheight/2-padding;
      // the line
      ctx.beginPath();
      ctx.moveTo(leftX,topY+textheight/2 + 6);
      ctx.lineTo(lineToX,topY+textheight/2 );
      ctx.strokeStyle='white';
      ctx.lineWidth=1;
      ctx.stroke();
      // the boxed text
      ctx.fillStyle='white';
      // ctx.fillRect(leftX,topY,textwidth+padding*2,textheight+padding*2);
      // ctx.strokeRect(leftX,topY,textwidth+padding*2,textheight+padding*2);
      ctx.fillStyle='white';
      ctx.fillText(text,centerX,centerY);
    }

    function ticklines(start,end,count,angle,length){
      var dx=end.x-start.x;
      var dy=end.y-start.y;
      ctx.lineWidth=1;
      for(var i=1;i<count;i++){
        var x0=parseInt(start.x+dx*i/count);
        var y0=parseInt(start.y+dy*i/count);
        var x1=parseInt(x0+length*Math.cos(angle));
        var y1=parseInt(y0+length*Math.sin(angle));
        ctx.beginPath();
        ctx.moveTo(x0,y0);
        ctx.lineTo(x1,y1);
        ctx.stroke();
        if(i==2 || i==4 || i==6 || i==8){
          var labelOffset=length*3/4;
          var x1=parseInt(x0-labelOffset*Math.cos(angle));
          var y1=parseInt(y0-labelOffset*Math.sin(angle));
          ctx.fillStyle='white';
          ctx.fillText(parseInt(i*10),x1,y1);
        }
      }
    }

    function drawTriangle(t){
      ctx.beginPath();
      ctx.moveTo(t[0].x,t[0].y);
      ctx.lineTo(t[1].x,t[1].y);
      ctx.lineTo(t[2].x,t[2].y);
      ctx.closePath();
      ctx.strokeStyle='white';
      ctx.lineWidth=2;
      ctx.stroke();
    }
    },
    drawDot(CH4, CH4X, CH4Y, C2H2, C2H2X, C2H2Y, C2H4, C2H4X, C2H4Y){
      var MinLeft = 5;
      var MaxLeft = 400;
      var MinTop = 11;
      var MaxTop = 354;
      var summa = CH4 + C2H2 + C2H4;
      var ch4per = CH4 / summa * 100;
      var c2h2per = C2H2 / summa * 100;
      var c2h4per = C2H4 / summa * 100;
      this.duval.ch4 = parseInt(ch4per);
      this.duval.c2h4 = parseInt(c2h4per);
      this.duval.c2h2 = parseInt(c2h2per);
      var left = ch4per * Math.cos(Math.PI / 6);
      var down = c2h2per;
      var x = down + left / Math.tan(Math.PI / 3);
      var y = left;
      var topstep = (MaxTop - MinTop) / (100 * Math.cos(Math.PI / 6));
      const leftstep = (MaxLeft - MinLeft) / 100;
      var PointLeft = (100 - x) * leftstep + 5;
      var PointTop = (100 * Math.cos(Math.PI / 6) - y) * topstep + 11;
      const {ctx} = this
        ctx.beginPath();
        ctx.moveTo(CH4X,CH4Y,4,4)
        ctx.lineWidth = 2
        ctx.strokeStyle="yellow"
        ctx.lineTo(PointLeft,PointTop)
        ctx.stroke()
        ctx.moveTo(C2H2X,C2H2Y,4,4)
        ctx.lineTo(PointLeft,PointTop)
        ctx.stroke()
        ctx.moveTo(C2H4X,C2H4Y,4,4)
        ctx.lineTo(PointLeft,PointTop)
        ctx.stroke()
        ctx.beginPath();
        ctx.arc(PointLeft, PointTop, 4, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'yellow';
        ctx.stroke();
    }
  },
  mounted(){
    this.ctx = this.$refs.canvas.getContext('2d');
    this.drawDuval()
    var { imageData } = this;
  },
  computed: {
    cssProps() {
      return {
        "--x": (this.params.width/2 + this.params.x ) * this.$parent.multiplier - 205 + "px",
        "--y": (this.params.height/2 + this.params.y ) * this.$parent.multiplier - 200   + "px", 
        "scale": this.$parent.multiplier, 
        "--CH4X": 20 + 'px',
        "--CH4Y": 140 + 'px',
        "--C2H4X": 280 + 'px',
        "--C2H4Y": 140 + 'px',
        "--C2H2X": 170 + 'px',
        "--C2H2Y": 370 + 'px',
      };
    },
  },
}
</script>

<style scoped>
body{ background-color: ivory; padding:10px; }
#canvas{ 
  /* border:1px solid red; */
   margin:0 auto; }
#duval{
  position: absolute;
  top: var(--y);
  left: var(--x);
  scale: var(--scale);
  border: solid 0px red;
}
.gas{
  width: 100px;
}
#CH4{
  position: absolute;
  font-size: 20px;
  transform:rotate(-60deg);
  left: var(--CH4X);
  top: var(--CH4Y)
}
#C2H4{
  font-size: 20px;
  transform:rotate(60deg);
  position: absolute;
  left: var(--C2H4X);
  top: var(--C2H4Y);
}
#C2H2{
  font-size: 20px;
  position: absolute;
  left: var(--C2H2X);
  top: var(--C2H2Y);
}
</style>