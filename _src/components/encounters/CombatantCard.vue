<template>
  <v-card @click.native="$emit('click', combatant.uuid)"
          :raised="active"
          :class="[
            { bloodied: !effectMode && localCombatant.hp < (localCombatant.max_hp / 2) && 0 < localCombatant.hp },
            { unconscious: !effectMode && 0 >= localCombatant.hp },
            { 'selected-buff': active && effectMode === effectTypes.BUFF },
            { 'selected-debuff': active && effectMode === effectTypes.DEBUFF },
            { 'selected-other': active && effectMode === effectTypes.OTHER }
          ]"
          class="combatant-card">
    <v-card-title class="pb-0 pt-2">
      <v-container fluid class="pa-0 ma-0">
        <v-layout row align-center>
          <v-flex xs9>
            <h3 class="headline mb-0 text-truncate">
              {{ localCombatant.name }}
            </h3>
          </v-flex>
          <v-flex xs3>
            <v-btn icon @click.stop="openInitDialog" :disabled="!!effectMode">
              <v-badge
                  overlap left color="transparent">
                <v-avatar slot="badge" size="12">
                  <span class="black--text">{{ localCombatant.initiative }}</span>
                </v-avatar>
                <v-icon large>directions_run</v-icon>
              </v-badge>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-title>
    <v-card-title class="py-1">

    </v-card-title>
    <v-divider></v-divider>


    <v-card-text class="combatant-card-body">
      <v-container fluid class="pa-0">
        <v-layout row wrap>
          <v-chip
              v-if="localCombatant.temp_hp > 0"
              @click.stop="openHpDialog"
              close @input="localCombatant.temp_hp = 0">
            <v-avatar class="white">
              <v-progress-circular
                  :rotate="-90"
                  :value="hpPercentage(localCombatant.temp_hp)"
                  color="yellow darken-2">
                <span class="body-2">{{ localCombatant.temp_hp }}</span>
              </v-progress-circular>
            </v-avatar>
            <span class="text-truncate font-weight-medium effect-text">
              Temp HP
            </span>
          </v-chip>
        </v-layout>
        <v-layout row wrap>
          <v-chip
              v-for="(buff, index) in localCombatant.effects[effectTypes.BUFF]"
              :key="index" :close="!!updateFunc"
              @input="removeEffect(effectTypes.BUFF, index)">
            <v-avatar color="green">
              <v-icon small style="color: #fff;">trending_up</v-icon>
            </v-avatar>
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
            <v-avatar color="red">
              <v-icon small style="color: #fff;">trending_down</v-icon>
            </v-avatar>
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
            <v-avatar color="grey">
              <v-icon small style="color: #fff;">trending_flat</v-icon>
            </v-avatar>
            <span class="text-truncate font-weight-medium effect-text">
              {{ other }}
            </span>
          </v-chip>
        </v-layout>
      </v-container>
    </v-card-text>


    <v-divider></v-divider>


    <v-card-actions>
      <v-btn icon flat class="ma-0"
             @click="updateHp(-10)"
             :disabled="!!effectMode">-10
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon flat class="ma-0"
             @click="updateHp(-1)"
             :disabled="!!effectMode">-1
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon flat class="ma-0" color="red darken-2"
             @click="openHpDialog"
             :disabled="!!effectMode">
        <v-progress-circular
            :rotate="-90"
            :value="hpPercentage(localCombatant.hp)"
            color="red darken-2">
          <span class="body-2">{{ localCombatant.hp }}</span>
        </v-progress-circular>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon flat class="ma-0"
             @click="updateHp(1)"
             :disabled="!!effectMode">+1
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon flat class="ma-0"
             @click="updateHp(10)"
             :disabled="!!effectMode">+10
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="hpDialog" width="400">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ localCombatant.name }}
        </v-card-title>
        <v-form>
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs4>
                <v-text-field
                    type="number"
                    v-model="hpDialogHp"
                    label="Current HP"
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field
                    type="number"
                    v-model="hpDialogMaxHp"
                    label="Max HP"
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field
                    type="number"
                    v-model="hpDialogTempHp"
                    label="Temp HP"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn flat @click="saveHpDialog">
            Save
          </v-btn>
          <v-btn flat @click="hpDialogHp = hpDialogMaxHp">
            Full health
          </v-btn>
          <v-btn flat @click="closeHpDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="initDialog" width="400" :persistent="!!initDialogRoll">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ localCombatant.name }}
        </v-card-title>
        <v-form v-if="!initDialogRoll">
          <v-container fluid>
            <v-layout row wrap>
              <v-flex xs6>
                <v-text-field
                    @focus="initDialogBonus = ''"
                    type="number"
                    pattern="\d*"
                    v-model="initDialogBonus"
                    label="Initiative Bonus"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                    @focus="initDialogInit = ''"
                    type="number"
                    pattern="\d*"
                    v-model="initDialogInit"
                    label="Initiative"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-card-text v-else-if="initDialogRoll < 0" class="text-xs-center">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-card-text>
        <v-card-text v-else>
          <span class="title">You rolled: {{ initDialogRoll + Number(initDialogBonus) }} ({{ initDialogRoll }} + {{ Number(initDialogBonus) }})</span>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click="saveInitDialog">
            Save
          </v-btn>
          <v-btn flat :disabled="!!initDialogRoll" @click="rollInitiative">
            Roll
          </v-btn>
          <v-btn flat @click="closeInitDialog">
            {{ !!initDialogRoll ? 'Ignore' : 'Cancel' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      effectTypes: Combatant.effectTypes,
      hpDialog: false,
      hpDialogHp: 0,
      hpDialogMaxHp: 0,
      hpDialogTempHp: 0,
      initDialog: false,
      initDialogInit: 0,
      initDialogBonus: 0,
      initDialogRoll: 0
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
    hpPercentage(hp) {
      let boundedLower = hp < 0 ? 0 : hp;
      let boundedUpper =
        boundedLower < this.localCombatant.max_hp
          ? boundedLower
          : this.localCombatant.max_hp;
      return (100 * boundedUpper) / this.localCombatant.max_hp;
    },
    updateHp(increment) {
      this.localCombatant.hp += increment;
      this.updateFunc(this.localCombatant);
    },
    openHpDialog() {
      this.hpDialogHp = this.localCombatant.hp;
      this.hpDialogMaxHp = this.localCombatant.max_hp;
      this.hpDialogTempHp = this.localCombatant.temp_hp;
      this.hpDialog = true;
    },
    async saveHpDialog() {
      this.localCombatant.hp = this.hpDialogHp;
      this.localCombatant.max_hp = this.hpDialogMaxHp;
      this.localCombatant.temp_hp = this.hpDialogTempHp;
      await this.updateFunc(this.localCombatant);
      this.hpDialog = false;
    },
    closeHpDialog() {
      this.hpDialog = false;
    },
    openInitDialog() {
      this.initDialogInit = this.localCombatant.initiative;
      this.initDialogBonus = this.localCombatant.initiative_bonus;
      this.initDialogRoll = 0;
      this.initDialog = true;
    },
    rollInitiative() {
      this.initDialogRoll = -1;
      setTimeout(() => {
        this.initDialogRoll = ((Math.random() * 20) | 0) + 1;
        this.initDialogInit =
          this.initDialogRoll + Number(this.initDialogBonus);
      }, 1000);
    },
    async saveInitDialog() {
      this.localCombatant.initiative = Number(this.initDialogInit);
      this.localCombatant.initiative_bonus = Number(this.initDialogBonus);
      await this.updateFunc(this.localCombatant);
      this.closeInitDialog();
    },
    closeInitDialog() {
      this.initDialog = false;
    },
    removeEffect(effectType, index) {
      this.localCombatant.effects[effectType].splice(index, 1);
      this.updateFunc(this.localCombatant);
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

.unconscious {
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.33) 0%,
    transparent 36px
  );
}

.selected-buff {
  background-color: rgba(76, 175, 80, 0.33);
}

.selected-debuff {
  background-color: rgba(244, 67, 54, 0.33);
}

.selected-other {
  background-color: rgba(158, 158, 158, 0.33);
}
</style>
