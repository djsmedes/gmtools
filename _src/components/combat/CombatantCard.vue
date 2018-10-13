<template>
  <v-card @click.native="$emit('click', combatant.uuid)"
          :raised="active"
          :width="300">
    <v-card-title>
      <h3 class="headline mb-0">
        {{ localCombatant.name }}
      </h3>
      <v-spacer></v-spacer>
      <v-icon
          v-if="active"
          :color="effectMode === effectTypes.BUFF ? 'green' : effectMode === effectTypes.DEBUFF ? 'red' : false">
        check_circle
      </v-icon>
    </v-card-title>


    <v-divider class="mb-0 mt-0"></v-divider>


    <v-card-text>
      <v-container fluid class="pa-0">
        <v-layout row wrap>
          <v-chip
            v-for="(buff, index) in localCombatant.effects[effectTypes.BUFF]"
            :key="index" :close="!!updateFunc" @input="updateEffects"
            v-model="buffs[index]">
            <v-avatar class="green"></v-avatar>
            <span class="text-truncate font-weight-medium" style="max-width: 200px">
              {{ buff }}
            </span>
          </v-chip>
        </v-layout>
        <v-layout row wrap>
          <v-chip
            v-for="(debuff, index) in localCombatant.effects[effectTypes.DEBUFF]"
            :key="index" :close="!!updateFunc" @input="updateEffects"
            v-model="debuffs[index]">
            <v-avatar class="red"></v-avatar>
            <span class="text-truncate font-weight-medium" style="max-width: 200px">
              {{ debuff }}
            </span>
          </v-chip>
        </v-layout>
        <v-layout row wrap>
          <v-chip
            v-for="(other, index) in localCombatant.effects[effectTypes.OTHER]"
            :key="index" :close="!!updateFunc" @input="updateEffects"
            v-model="others[index]">
            <span class="text-truncate font-weight-medium" style="max-width: 200px">
              {{ other }}
            </span>
          </v-chip>
        </v-layout>
      </v-container>
    </v-card-text>


    <v-divider class="mb-0 mt-0"></v-divider>


    <v-card-actions>
      <v-btn flat icon
             v-if="updateFunc"
             :disabled="!!effectMode"
             @click.stop="updateInitiative(1)">
        <v-icon>add</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-icon>directions_run</v-icon>
      <span class="font-weight-medium">{{ localCombatant.initiative }}</span>
      <v-spacer></v-spacer>
      <v-btn flat icon
             v-if="updateFunc"
             :disabled="!!effectMode"
             @click.stop="updateInitiative(-1)">
        <v-icon>remove</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Combatant } from "@/models/combatant";

export default {
  name: "Combatant",
  props: {
    combatant: {
      type: Combatant,
      default: () => new Combatant()
    },
    effectMode: {
      default: Combatant.effectTypes.NONE
    },
    active: {
      type: Boolean,
      default: false
    },
    updateFunc: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      localCombatant: new Combatant(this.combatant),
      effectTypes: Combatant.effectTypes
    };
  },
  computed: {
    buffs() {
      return this.localCombatant.effects[Combatant.effectTypes.BUFF].map(
        () => true
      );
    },
    debuffs() {
      return this.localCombatant.effects[Combatant.effectTypes.DEBUFF].map(
        () => true
      );
    },
    others() {
      return this.localCombatant.effects[Combatant.effectTypes.OTHER].map(
        () => true
      );
    }
  },
  watch: {
    combatant: {
      handler(newCombatant) {
        this.localCombatant = new Combatant(newCombatant);
      }
    }
  },
  methods: {
    updateInitiative(increment) {
      this.localCombatant.initiative += increment;
      this.updateFunc(this.localCombatant);
    },
    updateEffects() {
      this.buffs.reduce((acc, cur) => {
        if (!cur) {
          this.localCombatant.effects[Combatant.effectTypes.BUFF].splice(
            acc,
            1
          );
        }
        return acc + 1;
      }, 0);
      this.debuffs.reduce((acc, cur) => {
        if (!cur) {
          this.localCombatant.effects[Combatant.effectTypes.DEBUFF].splice(
            acc,
            1
          );
        }
        return acc + 1;
      }, 0);
      this.others.reduce((acc, cur) => {
        if (!cur) {
          this.localCombatant.effects[Combatant.effectTypes.OTHER].splice(
            acc,
            1
          );
        }
        return acc + 1;
      }, 0);

      this.updateFunc(this.localCombatant);
    }
  },
  created() {}
};
</script>
