<template>
  <div>
    <zingchart :data="chartConfig" ></zingchart>
  </div>
</template>

<script>
import "zingchart/es6";
import zingchartVue from "zingchart-vue";


export default {
  props: ['intakes', 'dates'],
  components: {
    zingchart: zingchartVue
  },
  data() {
    return {
      chartData: {
        type: "line",
        series: [
            { values: this.inta },
        ]
      }
    };
  },

  computed: {
    inta() {
      let sorted = this.intakes.sort((a,b) => a.intake_date - b.intake_date);
      return sorted.map(o => {
        return [o.intake_date, parseInt(o.calories)]
      });
    },
    chartConfig() {
      return {
        type: 'line',
        title: {
          text: 'Intakes',
          adjustLayout: true,
          align: 'left',
          margin: 0,
        },
        series: [
          {
            values: this.inta,
            text: 'Calories'
          }
        ],
        plot: {
          aspect: 'spline',
          marker: {
            visible: false,
          },
          animation: {
              effect: "ANIMATION_SLIDE_LEFT",
          },
        },
        crosshairX:{
          plotLabel: "Calories",
          marker: {
            visible: false,
          }
        },
        tooltip: { 
          visible: false,

        },
        plotarea: {
          margin: 'dynamic',
        },
        scaleX: {
          transform: {
            type: 'date',
          },
          item: {
            width: 35,
            wrapText: true,
          }
        },
        scaleY: {
          label: {
            text: 'Calories',
          },
        }
      };
    
    }
  }
};
</script>

