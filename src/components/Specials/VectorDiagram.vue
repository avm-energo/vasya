<template>
  <canvas ref="canvas" :style="cssProps"></canvas>
</template>

<script>
export default {
  name: "VectorDiagram",
  data() {
    return {
      ctx:null,
      Uab: 140,
      Ubc: 120,
      Uca: 100,
      UIA: 15,
      UIB: 15,
      UIC: 13,
      centerX: 200,
      centerY: 350,
      R: 150,
      r: 50,
    }
  },
  props: ["params", "name"],

  methods: {
    drawVectorDiagram() {
      const { ctx } = this;
      const yellow = '#E8EB2D';
      const green = '#65A65F';
      const red = '#D71F28';
      const startAngle = 0;
      const fi1 = startAngle;
      const fi2 = fi1 + this.Uab;
      const fi3 = fi2 + this.Ubc;

      // Отрисовка верхних блоков со значениями
      this.drawAngles(this.centerX-this.R, this.centerY-300,
          yellow, green, red,
          "UA(1)", 220.0,
          "UB(1)", 220.0,
          "UC(1)", 220.0,
          "В"
      );
      this.drawAngles(this.centerX, this.centerY-300,
          yellow, green, red,
          "IA(1)", 1.000,
          "IB(1)", 1.000,
          "IC(1)", 1.000,
          "А"
      );
      this.drawAngles(this.centerX-this.R, this.centerY-240,
          yellow, green, red,
          "ΦUAB(1)", this.Uab,
          "ΦUBC(1)", this.Ubc,
          "ΦUCA(1)", this.Uca,
          "°"
      );
      this.drawAngles(this.centerX, this.centerY-240,
          yellow, green, red,
          "ΦUIA(1)", this.UIA,
          "ΦUIB(1)", this.UIB,
          "ΦUIC(1)", this.UIC,
          "°"
      );

      // Отрисовка области
      this.drawArea(this.centerX, this.centerY, this.R, '#0F140E', true);
      this.drawArea(this.centerX, this.centerY, this.R / 2, '#030706');
      this.drawArea(this.centerX, this.centerY, this.r, '#0F140E', true);
      this.drawArea(this.centerX, this.centerY, this.r / 2, '#030706');

      // Отрисовка координат
      ctx.beginPath();
      ctx.setLineDash([0, 0]);
      ctx.closePath();
      this.drawArrow(
          this.centerX+this.R,
          this.centerY,
          this.centerX-this.R,
          this.centerY,
          90,
          'white'
      );
      this.drawArrow(
          this.centerX,
          this.centerY-this.R,
          this.centerX,
          this.centerY+this.R,
          0,
          'white');

      //  Отрисовка подписей областей
      this.drawAreaLabel(1, "I", this.R);
      this.drawAreaLabel(2, "II", this.R);
      this.drawAreaLabel(3, "III", this.R);
      this.drawAreaLabel(4, "IV", this.R);

      //  Отрисовка векторов напряжений и токов
      //Yellow
      this.drawVector(fi1, this.R, yellow, "Ua");
      this.drawVector(fi1 + this.UIA, this.r, yellow, "Ia");
      // //Green
      this.drawVector(fi2, this.R, green, "Ub");
      this.drawVector(fi2 + this.UIB, this.r, green, "Ib");
      // //Red
      this.drawVector(fi3, this.R, red, "Uc");
      this.drawVector(fi3 + this.UIC, this.r, red, "Ic");

    },
    drawAngles(x, y, yellow, green, red, label1, value1, label2, value2, label3, value3, unit) {
      const { ctx } = this;
      ctx.strokeStyle = 'white';
      ctx.strokeRect(x-3, y-15, 150, 60);
      this.drawLabel(x, y, yellow, label1);
      this.drawLabel(x+ 105, y, yellow, value1 + " " + unit );

      this.drawLabel(x, y + 20, green, label2);
      this.drawLabel(x+ 105, y + 20, green, value2 + " " + unit);

      this.drawLabel(x, y + 40, red, label3);
      this.drawLabel(x+ 105, y + 40, red, value3 + " " + unit);
    },
    calcX(angle, radius) {
      return Math.sin(angle * Math.PI / 180) * radius;
    },
    calcY(angle, radius) {
      return -Math.cos(angle * Math.PI / 180) * radius;
    },
    drawArea(x, y, radius, color, stroke = false, [dash1, dash2] = [6, 6]) {
      const { ctx } = this;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2*Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      if (stroke) {
        ctx.setLineDash([dash1, dash2]);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'white';
        ctx.stroke();
      }
      ctx.closePath();
    },
    drawLabel(x, y, color, label) {
      const { ctx } = this;
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.strokeStyle = "#F00";
      ctx.font = "12pt Times New Roman";
      ctx.fillText(label, x, y);
      ctx.closePath();
    },
    drawAreaLabel(number, label, radius) {
      const x = this.calcX(-(number * 90 - 135), radius-radius/5) + this.centerX;
      const y = this.calcY(-(number * 90 - 135), radius-radius/5) + this.centerY;
      this.drawLabel(x, y, 'white', label);
    },
    drawLine(x_to, y_to, x_start, y_start, color, thickness) {
      const { ctx } = this;
      ctx.beginPath();
      ctx.moveTo(x_start, y_start);
      ctx.lineTo(x_to, y_to);
      ctx.lineWidth = thickness;
      ctx.strokeStyle = color;
      ctx.stroke()
      ctx.closePath();
    },
    drawArrow(x_to, y_to, x_start, y_start, angle, color) {
      // Сама линия
      this.drawLine(x_to, y_to, x_start, y_start, color, 1);
      const x_arrow1 = x_to + this.calcX(angle + 160, 6);
      const x_arrow2 = x_to + this.calcX(angle - 160, 6);
      const y_arrow1 = y_to + this.calcY(angle + 160, 6);
      const y_arrow2 = y_to + this.calcY(angle - 160, 6);
      // Стрелочки на конце
      this.drawLine(x_arrow1, y_arrow1, x_to, y_to, color, 1);
      this.drawLine(x_arrow2, y_arrow2, x_to, y_to, color, 1);
    },
    drawVector(angle, radius, color, label) {
      // Сам вектор
      const x = this.calcX(angle, radius) + this.centerX;
      const y = this.calcY(angle, radius) + this.centerY;
      this.drawArrow(x, y, this.centerX, this.centerY, angle, color);
      //  Подпись
      const x_label = x + this.calcX(angle, 15);
      const y_label = y + this.calcY(angle, 15);
      this.drawLabel(x_label-8, y_label+6, color, label);
    },
  },
  mounted () {
    this.ctx = this.$refs.canvas.getContext('2d');
    this.drawVectorDiagram()
  },
  cssProps() {
    return {
      "--x":  500 + "px",
      "--y":  300 + "px",
    };
  },
}

</script>

<style scoped>

</style>