<template>
  <v-card>
    <v-toolbar dense flat color="grey lighten-3">
      <v-toolbar-title>
        <v-text-field
          v-model="search"
          placeholder="Search"
          prepend-icon="search"
        ></v-text-field>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!!createViewName"
        :to="{ name: createViewName }"
        text
        color="edit"
      >
        <v-icon left>add</v-icon>
        Create new
      </v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="objectList"
      :footer-props="{ 'items-per-page-options': [25, 50] }"
      :search="search"
    >
      <template #item="{ item }">
        <router-link
          :to="{ name: detailViewName, params: { uuid: item.uuid } }"
          tag="tr"
        >
          <td v-for="header in headers" :key="header.text">
            {{ item[header.value] }}
          </td>
        </router-link>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "ObjectList",
  props: {
    detailViewName: {
      type: String,
      required: true,
    },
    createViewName: {
      type: String,
      default: "",
    },
    objectList: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
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
