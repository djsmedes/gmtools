<template>
  <v-card>
    <v-toolbar dense flat color="grey lighten-3">
      <v-toolbar-title>
        <v-text-field
          placeholder="Search"
          prepend-icon="search"
          v-model="search"
        ></v-text-field>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!!createViewName"
        flat
        :to="{ name: createViewName }"
        color="edit"
      >
        <v-icon left>add</v-icon>
        Create new
      </v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="objectList"
      :rows-per-page-items="[25, 50]"
      :search="search"
    >
      <router-link
        tag="tr"
        slot="items"
        slot-scope="props"
        :to="{ name: detailViewName, params: { uuid: props.item.uuid } }"
      >
        <td v-for="header in headers" :key="header.text">
          {{ props.item[header.value] }}
        </td>
      </router-link>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "ObjectList",
  props: {
    detailViewName: String,
    createViewName: String,
    objectList: {
      default: () => [],
    },
    headers: {
      default() {
        return [
          {
            text: "Name",
            align: "left",
            value: "name",
          },
        ];
      },
    },
  },
  data() {
    return {
      search: "",
    };
  },
};
</script>
