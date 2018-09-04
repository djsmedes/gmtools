<template>
  <div class="card">
    <h5 class="card-header">
      <input v-if="editing" type="text" v-model="localCombatant.name"/>
      <template v-else>
        {{ localCombatant.name }}
      </template>
      <button v-if="editing" class="btn btn-outline-primary" @click="saveCombatant">Save</button>
      <button v-else class="btn btn-outline-success" @click="enterEditMode">Edit</button>
    </h5>
    <div class="card-body">
      <p class="card-text">
        buffs, debuffs, and effects go here
      </p>
    </div>
    <div class="card-footer">
      <small>
        <span class="oi oi-timer" title="initiative" aria-hidden="true"></span>
        <input v-if="editing" type="number" v-model="localCombatant.initiative"/>
        <template v-else>
          {{ localCombatant.initiative }}
        </template>
      </small>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import combatant from '../models/combatant'
  import { Combatant } from '../models/combatant'

  export default {
    name: "Combatant",
    props: {
      combatant: {
        type: Combatant,
        default: () => new Combatant()
      },
      startEditing: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        localCombatant: new Combatant(this.combatant),
        editing: this.startEditing
      }
    },
    computed: {
      ...mapGetters(combatant.namespace, {
        getCombatant: combatant.getterTypes.BY_ID
      })
    },
    methods: {
      ...mapActions(combatant.namespace, {
        loadCombatants: combatant.actionTypes.LIST,
        updateCombatant: combatant.actionTypes.UPDATE
      }),
      saveCombatant() {
        if (this.localCombatant.uuid) {
          this.updateCombatant(this.localCombatant).then(() => this.editing = false)
        } else {
          // todo - create??
        }
      },
      enterEditMode() {
        this.editing = true;
      }
    },
    created () {}
  }
</script>
