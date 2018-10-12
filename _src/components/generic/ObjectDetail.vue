<template>
  <div class="card">
    <div class="card-header d-flex">
      <h4>{{ title }}</h4>
      <button class="btn btn-outline-danger ml-auto" @click.stop.prevent="deleteObj">
        Delete
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ObjectDetail",
  props: {
    title: {
      type: String
    }
  },
  methods: {
    deleteObj() {
      console.log("delete clicked");
    }
  }
};
</script>
