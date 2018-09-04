<template>
  <div class="card">
    <div class="card-header">
      {{ model.modelName }}
    </div>
    <div class="list-group list-group-flush">
      <router-link v-for="object in objectList"
                   :to="{ name: detailViewName, params: { uuid: object.uuid }}"
                   class="list-group-item" :key="object.uuid">
        {{ object.name }}
      </router-link>
      <router-link v-if="createViewName"
                   :to="{ name: createViewName }"
                   class="list-group-item" key="new">
        Create new {{ model.modelName }}
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ObjectList",
    props: {
      model: Object,
      detailViewName: String,
      createViewName: String
    },
    data() {
      return {}
    },
    computed: {
      objectList() {
        return this.$store.getters[this.model.namespace + '/' + this.model.getterTypes.LIST]
      }
    },
    created() {}
  }
</script>
