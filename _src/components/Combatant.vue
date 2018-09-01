<template>
  <div class="card">
    <h5 class="card-header">{{ combatant.name }}</h5>
    <div class="card-body">
      <p class="card-text">
        buffs, debuffs, and effects go here
      </p>
    </div>
    <div class="card-footer">
      <small>
        <span class="oi oi-timer" title="initiative" aria-hidden="true"></span>
        {{ combatant.initiative }}
      </small>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import _ from 'lodash'
  import combatantModel from '../models/combatant'

  export default {
    name: "Combatant",
    props: {
      uuid: String
    },
    data() {
      return {
        combatant: new combatantModel.Combatant()
      }
    },
    computed: {
        ...mapGetters(combatantModel.namespace, {
          getCombatant: combatantModel.getterTypes.BY_ID
        })
    },
    methods: {
        ...mapActions(combatantModel.namespace, {
          loadCombatants: combatantModel.actionTypes.LIST
        })
    },
    created() {
      this.loadCombatants();
      this.combatant = _.cloneDeep(this.getCombatant(this.uuid));
    }
  }
</script>
