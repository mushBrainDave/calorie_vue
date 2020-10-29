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
          <v-card v-if="!isMobile">
            <v-card-title>
              Daily Intake
              <v-spacer></v-spacer>
              <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              >
              </v-text-field>
              </v-card-title>
            <v-data-table
            :headers="headers"
            :items="intakes"
            :search="search"
            :sort-by="['intake_date']"
            :sort-desc="[false]"
            class="elevation-1"
            style="max-height: 300px; overflow-y: auto"
            >
              <template v-slot:item="props">
                <tr>
                  <td align="left">{{ props.item }}</td>
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
          </v-card>
          <!-- Mobile -->
          <v-card v-else :elevation="0">
            <v-data-iterator 
            :items="intakes"
            :items-per-page.sync="itemsPerPage"
            :page="page"
            :search="search"
            :sort-by="sortBy.toLowerCase()"
            :sort-desc="sortDesc"
            hide-default-footer              
            item-key="name"
            >
            <!-- toolbars -->
              <template v-slot:header>
                <v-container fluid>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-toolbar
                        :elevation="1"
                        :rounded="true"
                        class="mb-1"
                      >
                        <v-text-field
                          v-model="search"
                          clearable
                          flat
                          solo-inverted
                          hide-details
                          prepend-inner-icon="mdi-magnify"
                          label="Search"
                        >
                        </v-text-field>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                    </v-col>
                    <v-col cols="12" justify>
                      <v-toolbar
                        :elevation="1"
                        :rounded="true"
                      >
                      <v-col>
                          <v-select
                            v-model="sortBy"
                            flat
                            solo-inverted
                            hide-details
                            :items="keys"
                            label="Sort by"
                          >
                          </v-select>
                      </v-col>
                      <v-col>
                          <v-btn-toggle
                            v-model="sortDesc"
                            mandatory
                          >
                            <v-btn
                              depressed
                              color="blue"
                              :value="false"
                            >
                              <v-icon>mdi-arrow-up</v-icon>
                            </v-btn>
                            <v-btn
                              depressed
                              color="blue"
                              :value="true"
                            >
                              <v-icon>mdi-arrow-down</v-icon>
                            </v-btn>
                          </v-btn-toggle>
                      </v-col>
                      </v-toolbar>
                    </v-col>
                  </v-row>
                </v-container>
              </template>
              <!-- data cards -->
              <template v-slot:default="{ items, isExpanded, expand }">
                <v-row>
                  <v-col
                  v-for="item in items"
                  :key="item.calories"
                  cols="12"
                  >
                    <v-card>
                      <v-card-title class="pb-0 pt-0 pl-0">
                        <v-col cols="9" class="text-left body-2 text-truncate">{{item.intake_date}}</v-col>
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
                          <v-list-item-content>Calories:</v-list-item-content>
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
                          <v-list-item-content>Carbs:</v-list-item-content>
                          <v-list-item-content class="align-end">{{ item.carbs }}</v-list-item-content>
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
              <!-- footer -->
              <template v-slot:footer>
                <v-row
                class="mt-2"
                align="center"
                justify="center"
                >
                  <span class="grey--text" style="font-size: 10px">Items per page</span>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                      dark
                      text
                      color="primary"
                      class="ml-2"
                      v-bind="attrs"
                      v-on="on"
                      >
                        {{ itemsPerPage }}
                      <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                      v-for="(number, index) in itemsPerPageArray"
                      :key="index"
                      @click="updateItemsPerPage(number)"
                      >
                        <v-list-item-title>{{ number }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <span
                  class="mr-4
                  grey--text"
                  style="font-size: 10px"
                  >
                    Page {{ page }} of {{ numberOfPages }}
                  </span>
                  <v-btn
                  fab
                  dark
                  color="blue darken-3"
                  class="mr-1"
                  @click="formerPage"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn
                  fab
                  dark
                  color="blue darken-3"
                  class="ml-1"
                  @click="nextPage"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                </v-row>
              </template>
            </v-data-iterator>  
          </v-card>
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
      search: '',
      intakes: [],
      validUserName: "Guest",
      intakeSize: 0,
      showMsg: '',
      isMobile: false,
      headers: [
        {text: 'User', sortable: false, align: 'left',},
        {text: 'Calories', sortable: true, align: 'left', value: 'calories'},
        {text: 'Protein', sortable: false, align: 'left',},
        {text: 'Fat', sortable: false, align: 'left',},
        {text: 'Carbs', sortable: false, align: 'left',},
        {text: 'Intake Date', sortable: true, align: 'left', value: 'intake_date'},
        {text: 'Update', sortable: false, align: 'left',},
        {text: 'Delete', sortable: false, align: 'left',}

      ],
      sortBy: 'intake_date',
      sortDesc: false,
      keys: [
        'Calories',
        'Intake_Date'
      ],
      page: 1,
      itemsPerPageArray: [4, 8, 12],
      itemsPerPage: 4,
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
      nextPage () {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage () {
        if (this.page - 1 >= 1) this.page -= 1
      },
      updateItemsPerPage (number) {
        this.itemsPerPage = number
      },
    }
  };
</script>
