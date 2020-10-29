<template>
  <v-container grid-list-md>
    <v-row align="center" justify="center">
      <v-col class="align-center">
        <v-row class="align-center" justify="center">
          <v-col cols="12" sm="10" md="10" lg="6" class="align-center">
            <v-alert v-if="showMsg === 'error'"
                     dismissible
                     :value="true"
                     type="error"
            >
              Please verify Settings information.
            </v-alert>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="10" lg="6" class="align-center">
            <v-card class="login-card">
              <v-card-title>
                <span class="headline">{{pageTitle}}</span>
              </v-card-title>
              <v-spacer/>
 
              <v-card-text>
                <v-form ref="form" lazy-validation>
                  <v-container>
 
                    <!--v-text-field
                    v-model="investment.cust_number"
                    label="Customer"
                    required
                    type="number"
                    /-->
                    <v-select
                    v-model="settings"
                    label="User"
                    :items="list"
                    item-value='pk'
                    item-text='customer'
                    ></v-select>
 
                    <v-text-field
                    v-model="settings.calorie_goal"
                    label="Calorie Goal"
                    required
                    type="number"
                    />
                    <v-text-field
                    v-model="settings.protein_goal"
                    label="Protein Goal"
                    required
                    type="number"
                    />
                    <v-text-field
                    v-model="settings.fat_goal"
                    label="Fat Goal"
                    required
                    type="number"
                    />
                    <v-text-field
                    v-model="settings.carb_goal"
                    label="Carb Goal"
                    required
                    type="number"
                    />
                    <v-text-field
                    v-model="settings.calorie_min_max"
                    label="Calorie Min Max"
                    required
                    type="boolean"
                    />
                    <v-text-field
                    v-model="settings.set_date"
                    label="Set Date"
                    required
                    type="date"
                    />
 
                </v-container>
                <v-btn v-if="!isUpdate" class="blue white--text" @click="createSettings">Save</v-btn>
                <v-btn v-if="isUpdate" class="blue white--text" @click="updateSettings">Update</v-btn>
                <v-btn class="white black--text" @click="cancelOperation">Cancel</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>  
      </v-col>
    </v-row>
  </v-container>
</template>
 
 
<script>
  import router from '../router';
  import {APIService} from '../http/APIService';
  const apiService = new APIService();
 
  export default {
    name: 'SettingsCreate',
    components: {},
    data() {
      return {
        customers: [],
        showError: false,
        settings: {},
        pageTitle: "Add New Setting",
        isUpdate: false,
        showMsg: '',
      };
    },
    computed:{
      list:{
      get () {
            return this.customers
        },
          set (newValue) {
            this.customers = newValue
          }
      }
    },
    methods: {
      getCustomers() {
        apiService.getCustomerList().then(response => {
          this.customers = response.data.data;
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
      createSettings() {
        apiService.addNewSettings(this.settings).then(response => {
          if (response.status === 201) {
            this.settings = response.data;
             this.showMsg = "";
            router.push('/settings-list/new');
          }else{
              this.showMsg = "error";
          }
        }).catch(error => {
          if (error.response.status === 401) {
            router.push("/auth");
          }else if (error.response.status === 400) {
            this.showMsg = "error";
          }
        });
      },
      cancelOperation(){
         router.push("/settings-list");
      },
      updateSettings() {
        apiService.updateSettings(this.settings).then(response => {
          if (response.status === 200) {
            this.settings = response.data;
            router.push('/settings-list/update');
          }else{
              this.showMsg = "error";
          }
        }).catch(error => {
          if (error.response.status === 401) {
            router.push("/auth");
          }else if (error.response.status === 400) {
            this.showMsg = "error";
          }
        });
      }
    },
    mounted() {
      this.getCustomers();
      if (this.$route.params.pk) {
        this.pageTitle = "Edit Investment";
        this.isUpdate = true;
        apiService.getSettings(this.$route.params.pk).then(response => {
          this.settings = response.data;
        }).catch(error => {
          if (error.response.status === 401) {
            router.push("/auth");
          }
        });
      }
    },
  }
</script>
<style scoped>
  .aform {
    margin-left: auto;
    width: 60%;
  }
</style>
