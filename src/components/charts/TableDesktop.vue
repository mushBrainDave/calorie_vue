<template>
  <v-main>
    <v-card>
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
            <!--<td align="left">{{ props.item }}</td>-->
            <td nowrap="true" align="left"><v-chip dark :color="getColor(props.item.calories)">{{ props.item.calories }}</v-chip></td>
            <td nowrap="true" align="left">{{ props.item.protein }}</td>
            <td nowrap="true" align="left">{{ props.item.fat }}</td>
            <td nowrap="true" align="left">{{ props.item.carbs }}</td>
            <td nowrap="true" align="left">{{ props.item.intake_date }}</td>
            <td align="center"><v-icon @click="$emit('update', props.item)">mdi-pencil</v-icon></td>
            <td align="center"><v-icon @click="$emit('delete', props.item)">mdi-delete</v-icon></td>
          </tr>  
        </template>
      </v-data-table>
    </v-card> 
  </v-main>
</template>
<script>

  export default {
    props: ['intakes', 'dates', 'settings'],
    data() {
      return {
        search: '',
        headers: [
          //{text: 'User', sortable: false, align: 'left',},
          {text: 'Calories', sortable: true, align: 'left', value: 'calories'},
          {text: 'Protein', sortable: false, align: 'left',},
          {text: 'Fat', sortable: false, align: 'left',},
          {text: 'Carbs', sortable: false, align: 'left',},
          {text: 'Intake Date', sortable: true, align: 'left', value: 'intake_date'},
          {text: 'Update', sortable: false, align: 'center',},
          {text: 'Delete', sortable: false, align: 'center',}

        ],
        sortBy: 'intake_date',
        sortDesc: false,
      }
    },
    methods: {
      getColor (calories) {
        if (calories > this.settings[0].calorie_goal) return 'red'
        else return 'green'
      }
    },
  };
</script>