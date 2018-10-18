<template>
  <v-card @click.native="$emit('click', combatant.uuid)"
          :raised="active"
          class="combatant-card">
    <v-card-title>
      <h3 class="headline mb-0 text-truncate">
        {{ localCombatant.name }}
      </h3>
      <v-spacer></v-spacer>
      <v-icon
          v-if="active"
          :color="effectColorString()">
        check_circle
      </v-icon>
    </v-card-title>


    <v-divider></v-divider>


    <v-card-text class="combatant-card-body">
      <v-container fluid class="pa-0">
        <v-layout row wrap>
          <v-chip
            v-for="(buff, index) in localCombatant.effects[effectTypes.BUFF]"
            :key="index" :close="!!updateFunc"
            @input="removeEffect(effectTypes.BUFF, index)">
            <v-avatar class="green"></v-avatar>
            <span class="text-truncate font-weight-medium effect-text">
              {{ buff }}
            </span>
          </v-chip>
        </v-layout>
        <v-layout row wrap>
          <v-chip
            v-for="(debuff, index) in localCombatant.effects[effectTypes.DEBUFF]"
            :key="index" :close="!!updateFunc"
            @input="removeEffect(effectTypes.DEBUFF, index)">
            <v-avatar class="red"></v-avatar>
            <span class="text-truncate font-weight-medium effect-text">
              {{ debuff }}
            </span>
          </v-chip>
        </v-layout>
        <v-layout row wrap>
          <v-chip
            v-for="(other, index) in localCombatant.effects[effectTypes.OTHER]"
            :key="index" :close="!!updateFunc"
            @input="removeEffect(effectTypes.OTHER, index)">
            <span class="text-truncate font-weight-medium effect-text">
              {{ other }}
            </span>
          </v-chip>
        </v-layout>
      </v-container>
    </v-card-text>


    <v-divider></v-divider>


    <v-card-actions>
      <v-btn flat icon
             v-if="updateFunc"
             :disabled="!!effectMode"
             @click.stop="updateInitiative(1)">
        <v-icon>add</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-icon>directions_run</v-icon>
      <span class="font-weight-medium title">{{ localCombatant.initiative }}</span>
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
    removeEffect(effectType, index) {
      this.localCombatant.effects[effectType].splice(index, 1);
      this.updateFunc(this.localCombatant);
    },
    effectColorString() {
      if (this.effectMode === Combatant.effectTypes.BUFF) {
        return "green";
      } else if (this.effectMode === Combatant.effectTypes.DEBUFF) {
        return "red";
      } else {
        return "";
      }
    }
  },
  created() {}
};
</script>

<style scoped lang="scss">
$card-width: 275px;

.combatant-card {
  width: $card-width;
  display: flex;
  flex-direction: column;
}

.combatant-card-body {
  flex-grow: 1;
}

.effect-text {
  max-width: $card-width - 120px;
}
</style>
