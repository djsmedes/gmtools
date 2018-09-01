<template>
  <div class="card">
    <div class="card-header">
      {{ model }}
    </div>
    <div class="list-group list-group-flush">
      <router-link v-for="object in object_list" :to="object.uuid" class="list-group-item" :key="object.uuid">
        {{ object.name }}
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ObjectList",
    props: {
      model: String
    },
    computed: {
      object_list () {
        return [
          {
            url: '#',
            name: 'thing1',
            uuid: '1'
          },
          {
            url: '#',
            name: 'thing2',
            uuid: '2'
          }
        ]
      }
    }
  }
</script>
