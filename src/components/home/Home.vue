<template>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col align="center" justify="center" cols="12">
          <blockquote>
            &#8220;Welcome {{validUserName}}!&#8221;
            <footer>
              <small>
                <em>&mdash;Calorie Counter Services.</em>
              </small>
            </footer>
          </blockquote>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="10" md="10">
          <v-menu
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
              v-model="dateRangeText"
              label="Intake Date Range"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dates" range />
          </v-menu>
          <calorie-chart :intakes="intakesByDate" :dates="dates" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
  import router from '../../router';
  import {APIService} from '../../http/APIService';
  import CalorieChart from './charts/CalorieChart.vue';
  const apiService = new APIService();

  export default {
    name: 'Home',
    components: {
      CalorieChart,
    },
    data: () => ({
      validUserName: "Guest",
      intakes: [],
      dates: ['2020-10-21', '2020-10-28'],
    }),
    mounted() {
      this.getUser();
      this.getIntakes();
    },
    computed: {
      dateRangeText() {
        return this.dates.join(' ~ ')
      },
      intakesByDate() {
        return this.intakes.filter(entry => {
          return (
            entry.intake_date >= this.dates[0] &&
            entry.intake_date <= this.dates[1]
          )
        })
      }
    },
    methods: {
      getIntakes() {
        apiService.getIntakeList().then(response => {
          this.intakes = response.data.data;
          this.intakeSize = this.intakes.length;
          if (localStorage.getItem("isAuthenticates")
            && JSON.parse(localStorage.getItem("isAuthenticates")) === true) {
            this.validUserName = JSON.parse(localStorage.getItem("log_user"));
          }
        }).catch(error => {
          if (error.response.status === 401) {
            localStorage.removeItem('isAuthenticates');
            localStorage.removeItem('log_user');
            localStorage.removeItem('token');
            router.push("/auth");
          }
        });
      },
      viewIntake() {
        router.push('/intake-list');
      },
      viewSettings() {
        router.push('/settings-list');
      },
      getUser() {
        if (localStorage.getItem("isAuthenticates")
          && JSON.parse(localStorage.getItem("isAuthenticates")) === true) {
          this.validUserName = JSON.parse(localStorage.getItem("log_user"));
        }
      }
    }
  }
</script>
