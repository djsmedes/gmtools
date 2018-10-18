<template>
  <v-card>
    <v-data-table
        :headers="headers"
        :items="objectList">
      <template slot="items" slot-scope="props">
        <router-link tag="tr" :to="{ name: detailViewName, params: { uuid: props.item.uuid }}">
          <!-- todo - change the header.value thing to a function, so we can do arbitrary actions on props.item -->
          <td v-for="header in headers" :key="header.text">{{ props.item[header.value] }}</td>
        </router-link>
      </template>
    </v-data-table>
    <v-card-actions>
      <v-btn v-if="!!createViewName" flat :to="{ name: createViewName }">
        Create new
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ObjectList",
  props: {
    model: Object,
    detailViewName: String,
    createViewName: String,
    objectList: {
      default: () => []
    },
    headers: {
      default() {
        return [
          {
            text: "Name",
            align: "left",
            value: "name"
          }
        ];
      }
    }
  }
};
</script>
