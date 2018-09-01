<template>
  <div class="card">
    <div class="card-header">
      {{ model.modelName }}
    </div>
    <div class="list-group list-group-flush">
      <router-link v-for="object in objectList"
                   :to="{ name: objDetailViewName, params: { uuid: object.uuid }}"
                   class="list-group-item" :key="object.uuid">
        {{ object.name }}
      </router-link>
    </div>
  </div>
</template>

<script>
  // import { mapGetters } from 'vuex'

  export default {
    name: "ObjectList",
    props: {
      model: Object,
      objDetailViewName: String
    },
    data() {
      return {
        getList: 'combatant/combatantList'
      }
    },
    computed: {
      // todo - why doesn't this work?
      // ...mapGetters(this.model.namespace, {
      //   objectList: this.model.getterTypes.LIST
      // })
      objectList() {
        return this.$store.getters[this.model.namespace + '/' + this.model.getterTypes.LIST]
      }
    },
    methods: {
      loadObjects() {
        return this.$store.dispatch(this.model.namespace + '/' + this.model.actionTypes.LIST)
      }
    },
    created() {
      this.loadObjects()
    }
  }
</script>
