<template>
  <v-main>
    <!-- Welcome title -->
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" align="center" justify="center">
          <blockquote>
            Welcome {{validUserName}}!
            <footer>
              <small>
                <em>&mdash;Calorie Counter Services.</em>
              </small>
            </footer>
          </blockquote>
        </v-col>
        <v-col  cols="12" md="10" lg="10" align="center" justify="center">
          <v-alert v-if="showMsg === 'new'"
                   dismissible
                   :value="true"
                   type="success"
          >
            New intake has been added.
          </v-alert>
          <v-alert v-if="showMsg === 'update'" dismissible
                   :value="true"
                   type="success"
          >
           Intake has been updated.
          </v-alert>
          <v-alert v-if="showMsg === 'deleted'" dismissible
                   :value="true"
                   type="success"
          >
            Selected intake has been deleted.
          </v-alert>
        </v-col>
      </v-row>

      <!-- Data table -->
      <v-row align="center" justify="center">
        <v-col cols="12" md="10" v-resize="onResize">
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
            <v-date-picker
              v-model="dates"
              range
            ></v-date-picker>
          </v-menu>
          <table-desktop v-if="!isMobile" :intakes="intakesByDate" :settings="settings" :dates="dates" :method="updateIntake" @update="updateIntake" @delete="deleteIntake"/>
          <table-mobile v-else :intakes="intakesByDate" @update="updateIntake" @delete="deleteIntake" />
        <v-btn class="blue mt-4 white--text" @click="addNewIntake">Add Intake</v-btn>  
        </v-col>  
      </v-row>
    </v-container>  
  </v-main>
</template>

<script>
  import router from '../../router';
  import {APIService} from '../../http/APIService';
  const apiService = new APIService();

  import TableDesktop from './charts/TableDesktop';
  import TableMobile from './charts/TableMobile';

  export default {
    name: "IntakeList",
    components: {
      TableDesktop,
      TableMobile
    },
    data: () => ({
      dates: ['2020-10-21', '2020-10-28'],
      intakes: [],
      settings: [],
      validUserName: "Guest",
      intakeSize: 0,
      showMsg: '',
      isMobile: false,
    }),

    mounted() {
      this.getIntakes();
      this.getSettings();
      this.showMessages();
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
      onResize() {
          if (window.innerWidth < 600)
            this.isMobile = true;
          else  
            this.isMobile = false;
        },
      showMessages(){
        console.log(this.$route.params.msg)
        if (this.$route.params.msg) {
          this.showMsg = this.$route.params.msg;
        }
      },
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
      addNewIntake() {
        if (localStorage.getItem("isAuthenticates")
          && JSON.parse(localStorage.getItem("isAuthenticates")) === true) {
          router.push('/intake-create');
        } else {
          router.push("/auth");
        }
      },
      updateIntake(intake) {        router.push('/intake-create/' + intake.id);
      },
      deleteIntake(intake) {
        apiService.deleteIntake(intake.id).then(response => {
          if (response.status === 204) {
            router.push('/intake-list/deleted/')
            this.getintakes()
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
      getSettings() {
        apiService.getSetting().then(response => {
          this.settings = response.data;
          this.settingsSize = this.settings.length;
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
    }
  };
</script>
