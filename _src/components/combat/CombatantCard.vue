<template>
  <v-card @click.native="$emit('click', combatant.uuid)"
          :raised="active"
          :class="{ bloodied: localCombatant.hp < (localCombatant.max_hp / 2) }"
          class="combatant-card">
    <v-card-title class="pb-0">
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
    <v-card-title class="py-0">
      <v-btn icon flat class="ma-0"
             @click="updateHp(-10)"
             :disabled="!!effectMode">-10</v-btn>
      <v-spacer></v-spacer>
      <v-btn icon flat class="ma-0"
             @click="updateHp(-1)"
             :disabled="!!effectMode">-1</v-btn>
      <v-spacer></v-spacer>
      <v-avatar :size="36">
        <span class="red--text text--darken-2 body-2">{{ localCombatant.hp }}</span>
      </v-avatar>
      <v-spacer></v-spacer>
      <v-btn icon flat class="ma-0"
             @click="updateHp(1)"
             :disabled="!!effectMode">+1</v-btn>
      <v-spacer></v-spacer>
      <v-btn icon flat class="ma-0"
             @click="updateHp(10)"
             :disabled="!!effectMode">+10</v-btn>
    </v-card-title>
    <v-card-title class="py-0">
      <v-progress-linear
          v-if="localCombatant.hp <= localCombatant.max_hp"
          :value="100 * localCombatant.hp / localCombatant.max_hp"
          color="red darken-2"></v-progress-linear>
      <v-progress-linear
          v-else
          :value="100 * (localCombatant.hp - localCombatant.max_hp) / localCombatant.max_hp"
          color="yellow darken-2"
          background-color="red darken-2"></v-progress-linear>
    </v-card-title>
    <v-divider></v-divider>


    <v-card-text class="combatant-card-body">
      <v-container fluid class="pa-0">
        <v-layout row wrap>
          <v-chip
            v-for="(buff, index) in localCombatant.effects[effectTypes.BUFF]"
            :key="index" :close="!!updateFunc"
            @input="removeEffect(effectTypes.BUFF, index)">
            <v-avatar color="green"><v-icon small style="color: #fff;">trending_up</v-icon></v-avatar>
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
            <v-avatar color="red"><v-icon small style="color: #fff;">trending_down</v-icon></v-avatar>
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
            <v-avatar color="grey"><v-icon small style="color: #fff;">trending_flat</v-icon></v-avatar>
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
    updateHp(increment) {
      this.localCombatant.hp += increment;
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

.bloodied {
  background-image: linear-gradient(
    to bottom,
    rgba(211, 47, 47, 0.33) 0%,
    transparent 36px
  );
}
</style>
