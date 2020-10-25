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
            <v-data-table
              :headers="headers"
              :items="intakes"
              class="elevation-1"
              style="max-height: 300px; overflow-y: auto"
              v-if="!isMobile"
            >
                    <template v-slot:item="props">
                      <tr>
                        <td align="left">{{ props.item.cust_number }}</td>
                        <td nowrap="true" align="left">{{ props.item.calories }}</td>
                        <td nowrap="true" align="left">{{ props.item.protein }}</td>
                        <td nowrap="true" align="left">{{ props.item.fat }}</td>
                        <td nowrap="true" align="left">{{ props.item.carbs }}</td>
                        <td nowrap="true" align="left">{{ props.item.intake_date }}</td>
                        <td align="center"><v-icon @click="updateIntake(props.item)">mdi-pencil</v-icon></td>
                        <td align="center"><v-icon @click="deleteIntake(props.item)">mdi-delete</v-icon></td>
                      </tr>  
                    </template>
              </v-data-table>
              <v-data-iterator 
                :items="intakes"
                hide-default-footer
                v-else
              >
                <template v-slot:default="{ items, isExpanded, expand }">
                  <v-row>
                    <v-col
                      v-for="item in items"
                      :key="item.calories"
                      cols="12"
                    >
                      <v-card>
                        <v-card-title class="pb-0 pt-0 pl-0">
                          <v-col cols="9" class="text-left body-2 text-truncate">{{item.cust_number}}</v-col>
                          <v-col cols="3" class="text-center">
                            <v-card-actions>
                              <v-icon @click="updateIntake(item)" class="small">mdi-pencil</v-icon>
                              <v-icon @click="deleteIntake(item)" class="small">mdi-delete</v-icon>
                              <v-icon @click.native="expand(item, !isExpanded(item))" class="small">mdi-dots-horizontal</v-icon>
                            </v-card-actions>
                          </v-col>
                        </v-card-title>
                        <v-divider></v-divider>

                        <v-list v-show="isExpanded(item)" dense>
                          <v-list-item>
                            <v-list-item-content class="align-end">{{ item.calories }}</v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>Protein:</v-list-item-content>
                            <v-list-item-content class="align-end">{{ item.protein }}</v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>Fat:</v-list-item-content>
                            <v-list-item-content class="align-end">{{ item.fat }}</v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>Intake Date:</v-list-item-content>
                            <v-list-item-content class="align-end">{{ item.intake_date }}</v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-card>
                    </v-col>
                  </v-row>
                </template>     
              </v-data-iterator>  
              <v-btn class="blue mt-4 white--text" @click="addNewIntake">Add Intake</v-btn>  
        </v-col>  
      </v-row>
    </v-container>  
  </v-main>
</template>


<script>

  import router from '../router';
  import {APIService} from '../http/APIService';
  const apiService = new APIService();

  export default {
    name: "IntakeList",
    data: () => ({
      intakes: [],
      validUserName: "Guest",
      intakeSize: 0,
      showMsg: '',
      isMobile: false,
      headers: [
        {text: 'Customer Number', sortable: false, align: 'left',},
        {text: 'Calories', sortable: false, align: 'left',},
        {text: 'Protein', sortable: false, align: 'left',},
        {text: 'Fat', sortable: false, align: 'left',},
        {text: 'Carbs', sortable: false, align: 'left',},
        {text: 'Intake_Date', sortable: false, align: 'left',},
        {text: 'Update', sortable: false, align: 'left',},
        {text: 'Delete', sortable: false, align: 'left',}

      ],

    }),
    mounted() {
      this.getIntakes();
      this.showMessages();
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
      updateIntake(intake) {        router.push('/intake-create/' + intake.pk);
      },
      deleteIntake(intake) {
        apiService.deleteIntake(intake.pk).then(response => {
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
      }
    }
  };
</script>
