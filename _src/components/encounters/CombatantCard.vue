<template>
  <v-card
    :raised="active"
    :class="cardClasses"
    @click.native="$emit('click', combatant.uuid)"
  >
    <v-card-title class="pb-0 pt-2">
      <v-container fluid class="pa-0 ma-0">
        <v-layout align-center>
          <v-flex xs9>
            <h3 class="headline mb-0 text-truncate">
              {{ combatant.name }}
            </h3>
          </v-flex>
          <v-flex xs3>
            <v-btn :disabled="!!effectMode" icon @click.stop="openInitDialog">
              <v-badge overlap left color="transparent">
                <v-avatar slot="badge" size="12">
                  <span class="black--text">{{ combatant.initiative }}</span>
                </v-avatar>
                <v-icon large>directions_run</v-icon>
              </v-badge>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-title>
    <v-card-title class="py-1"> </v-card-title>
    <v-divider></v-divider>

    <v-card-text class="combatant-card-body">
      <v-container fluid class="pa-0">
        <v-layout wrap>
          <v-chip
            v-if="combatant.temp_hp > 0"
            close
            pill
            @click.stop="openHpDialog"
            @click:close="combatant.temp_hp = 0"
          >
            <v-avatar left class="white">
              <v-progress-circular
                :rotate="-90"
                :value="hpPercentage(combatant.temp_hp)"
                color="yellow darken-2"
              >
                <span class="body-2">{{ combatant.temp_hp }}</span>
              </v-progress-circular>
            </v-avatar>
            <span class="text-truncate font-weight-medium effect-text">
              Temp HP
            </span>
          </v-chip>
        </v-layout>
        <v-layout wrap>
          <v-chip
            v-for="(buff, index) in combatant.buffs"
            :key="index"
            pill
            close
            @click:close="removeEffect(combatant.buffs, index)"
          >
            <v-avatar left color="green">
              <v-icon small style="color: #fff;">trending_up</v-icon>
            </v-avatar>
            <span class="text-truncate font-weight-medium effect-text">
              {{ buff }}
            </span>
          </v-chip>
        </v-layout>
        <v-layout wrap>
          <v-chip
            v-for="(debuff, index) in combatant.debuffs"
            :key="index"
            pill
            close
            @click:close="removeEffect(combatant.debuffs, index)"
          >
            <v-avatar left color="red">
              <v-icon small style="color: #fff;">trending_down</v-icon>
            </v-avatar>
            <span class="text-truncate font-weight-medium effect-text">
              {{ debuff }}
            </span>
          </v-chip>
        </v-layout>
        <v-layout wrap>
          <v-chip
            v-for="(other, index) in combatant.others"
            :key="index"
            pill
            close
            @click:close="removeEffect(combatant.others, index)"
          >
            <v-avatar left color="grey">
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
      <v-btn
        :disabled="!!effectMode"
        icon
        text
        class="ma-0"
        @click="combatantHp -= largeHPIncrement"
      >
        -{{ largeHPIncrement }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!!effectMode"
        icon
        text
        class="ma-0"
        @click="combatantHp -= 1"
      >
        -1
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!!effectMode"
        icon
        text
        class="ma-0"
        color="red darken-2"
        @click="openHpDialog"
      >
        <v-progress-circular
          :rotate="-90"
          :value="hpPercentage(combatant.hp)"
          color="red darken-2"
        >
          <span class="body-2">{{ combatant.hp }}</span>
        </v-progress-circular>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!!effectMode"
        icon
        text
        class="ma-0"
        @click="combatantHp += 1"
      >
        +1
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!!effectMode"
        icon
        text
        class="ma-0"
        @click="combatantHp += largeHPIncrement"
      >
        +{{ largeHPIncrement }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Combatant } from "@/models";
import CombatantHpDialog from "@/components/encounters/CombatantHPDialog";
import CombatantInitiativeDialog from "@/components/encounters/CombatantInitiativeDialog";
import debounce from "lodash/debounce";

export default {
  name: "CombatantCard",
  props: {
    combatant: {
      type: Combatant,
      required: true,
    },
    effectMode: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
    largeHPIncrement: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    cardClasses() {
      return [
        { "combatant-card": true },
        {
          bloodied:
            !this.effectMode &&
            this.combatant.hp < this.combatant.max_hp / 2 &&
            0 < this.combatant.hp,
        },
        { unconscious: !this.effectMode && 0 >= this.combatant.hp },
        {
          "selected-buff": this.active && this.effectMode === "buffs",
        },
        {
          "selected-debuff": this.active && this.effectMode === "debuffs",
        },
        {
          "selected-other": this.active && this.effectMode === "others",
        },
      ];
    },
    combatantHp: {
      get() {
        return this.combatant.hp;
      },
      set(val) {
        this.combatant.hp = val;
        this.updateSelfDebounced();
      },
    },
  },
  async created() {
    await this.combatant.fetch();
  },
  methods: {
    updateSelf() {
      this.$ws.put({ [Combatant.modelName]: [this.combatant] });
    },
    updateSelfDebounced: debounce(function() {
      this.updateSelf();
    }, 500),
    hpPercentage(hp) {
      let lBound = Math.max(hp, 0);
      let uBound = Math.min(lBound, this.combatant.max_hp);
      return (100 * uBound) / this.combatant.max_hp;
    },
    async openHpDialog() {
      let returnVal = await this.$dialog(CombatantHpDialog, {
        name: this.combatant.name,
        hp: this.combatant.hp,
        maxHp: this.combatant.max_hp,
        tempHp: this.combatant.temp_hp,
      });
      if (returnVal) {
        this.combatant.hp = returnVal.hp;
        this.combatant.max_hp = returnVal.maxHp;
        this.combatant.temp_hp = returnVal.tempHp;
        this.updateSelf();
      }
    },
    async openInitDialog() {
      let returnVal = await this.$dialog(CombatantInitiativeDialog, {
        name: this.combatant.name,
        initiative: this.combatant.initiative,
        initiativeBonus: this.combatant.initiative_bonus,
      });
      if (returnVal) {
        this.combatant.initiative = returnVal.initiative;
        this.combatant.initiative_bonus = returnVal.initiativeBonus;
        this.updateSelf();
      }
    },
    removeEffect(toRemoveFrom, index) {
      toRemoveFrom.splice(index, 1);
      this.updateSelf();
    },
  },
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
