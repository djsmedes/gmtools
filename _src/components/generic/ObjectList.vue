<template>
  <div class="card">
    <div class="card-header d-flex">
      <h4>{{ model.namespace.charAt(0).toUpperCase() + model.namespace.slice(1)}} List</h4>
      <router-link v-if="createViewName"
                   :to="{ name: createViewName }"
                   class="btn btn-outline-primary ml-auto" key="new">
        <span class="oi oi-plus" aria-hidden="true"></span>
      </router-link>
    </div>
    <div class="list-group list-group-flush">
      <router-link v-for="object in objectList"
                   :to="{ name: detailViewName, params: { uuid: object.uuid }}"
                   class="list-group-item" :key="object.uuid">
        {{ object.name }}
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
    createViewName: String,
    objectList: {
      default: () => []
    }
  }
};
</script>
