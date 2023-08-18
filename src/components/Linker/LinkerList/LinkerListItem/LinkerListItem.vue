<template>
  <tr>
    <td @mouseenter="tooltipShow" @mouseleave="tooltipHide" :class="[{resizable : columnsResize[prop[0]]}, prop[0]]" v-for="prop in Object.entries(elem)">
<!--    <td :class="[{resizable : columnsResize[prop[0]]}, prop[0]]" v-for="prop in Object.entries(elem)">-->
      {{ prop[1] }}
      <span v-if="prop[0] === 'quality'" class="quality-span">
        <span :class=qualityAttr[prop[1]]></span>
      </span>
    </td>
  </tr>
</template>
<script>

export default {
  name: "LinkerListItem",
  props: {
    elem: Object,
    atom: Object,
    columnsResize: Object,
  },
  data() {
    return {
      qualityAttr: {
        0: "Bad",
        8: "Bad",
        28: "Disabled",
        192: "Good",
      },
    }
  },
  methods: {
    tooltipShow(e) {
      const atom = this.atom;
      if (e.target.className.includes("path") || e.target.className.includes("name") || e.target.className.includes("description") ) {
        const tooltip = document.getElementById("tooltip");
        tooltip.innerHTML = `Path = ${atom.path},<br/>Name = ${atom.path.split(":\\").pop()},<br/>Description = ${atom.description}`;
        tooltip.style.left = e.clientX + 10 + "px";
        tooltip.style.top = e.clientY + 10 + "px";
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1";
      } else if (e.target.className.includes("quality") ) {
        const tooltip = document.getElementById("tooltip");
        tooltip.innerHTML = `${atom.qualityBlock}`;
        tooltip.style.left = e.clientX + 10 + "px";
        tooltip.style.top = e.clientY + 10 + "px";
        // setTimeout(() => {
        tooltip.style.visibility = "visible";
        tooltip.style.opacity = "1"
        // }, 1000);
      }
    },
    tooltipHide(e) {
      if (e.target.className.includes("path") || e.target.className.includes("name") || e.target.className.includes("description") || e.target.className.includes("quality") ) {
        const tooltip = document.getElementById("tooltip");
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
      }
    },
  }
}
</script>

<style scoped>

td {
  padding: 10px 5px;
  text-align: center;
  border-left: 1px solid #555558;
  position: relative;


  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}

.resizable {
  max-width: 0;
}

td.path, td.name, td.description {
  text-align: left;
  padding: 0 10px;
}

tr:hover {
  background: #2667c5;
}

.quality-span .Bad {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: red;
  width: 4px;
}

.quality-span .Good {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: #6dec58;
  width: 4px;
}

</style>