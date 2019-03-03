<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="objectList"
      :rows-per-page-items="[25, 50]"
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
};
</script>
