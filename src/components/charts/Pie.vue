<template>
  <div>
    <zingchart :data="chartData"></zingchart>
  </div>
</template>

<script>
import "zingchart/es6";
import zingchartVue from "zingchart-vue";
export default {
  components: {
    zingchart: zingchartVue
  },
  data() {
    return {
      chartData: {
        type: "pie",
        series: [
            { values: [59]},
            { values: [55]},
            { values: [30]},
            { values: [28]},
            { values: [15]}
        ]
      }
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>