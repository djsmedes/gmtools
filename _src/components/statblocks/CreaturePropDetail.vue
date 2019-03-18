<template>
  <v-container grid-list-xl>
    <v-form @submit.prevent v-model="formValid">
      <v-layout wrap>
        <v-flex xs12>
          <v-select
            label="Type"
            :items="propTypeChoices"
            v-model="creatureprop.prop_type"
          ></v-select>
        </v-flex>

        <v-flex xs12>
          <v-text-field
            label="Title"
            v-model="creatureprop.title"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-textarea
            label="Description"
            v-model="creatureprop.description"
            rows="1"
            auto-grow
          ></v-textarea>
        </v-flex>

        <v-flex xs12 sm4>
          <v-switch
            label="Use creature's ability score to determine save DC"
            v-model="dynamicSaveDC"
            hide-details
          ></v-switch>
        </v-flex>
        <v-flex xs12 sm4>
          <v-fade-transition mode="out-in">
            <v-select
              v-if="dynamicSaveDC"
              label="Source Ability"
              :items="abilityScoreChoices"
              clearable
              v-model="creatureprop.save_source_ability"
            ></v-select>
            <v-text-field
              v-else
              label="Save DC"
              v-model="creatureprop.save_dc_override"
            ></v-text-field>
          </v-fade-transition>
        </v-flex>
        <v-flex xs12 sm4>
          <v-select
            label="Targeted Ability"
            :items="abilityScoreChoices"
            clearable
            v-model="creatureprop.save_ability"
          ></v-select>
        </v-flex>

        <v-flex xs12 sm6>
          <v-select
            label="Attack type"
            :items="attackTypeChoices"
            v-model="creatureprop.attack_type"
            clearable
          ></v-select>
        </v-flex>
        <v-expand-transition>
          <v-flex xs12 sm6 v-if="creatureprop.attack_type">
            <v-select
              label="Ability score used"
              v-model="creatureprop.uses_ability_mod"
              :items="abilityScoreChoices"
            ></v-select>
          </v-flex>
        </v-expand-transition>
      </v-layout>
      <v-expand-transition>
        <v-layout wrap v-if="creatureprop.attack_type">
          <v-flex xs12 sm6 v-if="creatureprop.attack_type % 2 === 1">
            <v-text-field
              label="Reach"
              v-model="creatureprop.reach_range"
            ></v-text-field>
          </v-flex>
          <template v-else>
            <v-flex xs6 sm3>
              <v-text-field
                label="Range (1st increment)"
                v-model="creatureprop.reach_range"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm3>
              <v-text-field
                label="Range (2nd increment)"
                v-model="creatureprop.range_second"
              ></v-text-field>
            </v-flex>
          </template>
          <v-flex xs12 sm6>
            <v-text-field
              label="Number of targets"
              v-model="creatureprop.num_targets"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 sm3>
            <v-text-field
              label="Number of damage dice"
              v-model="creatureprop.hit_num_damage_dice"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 sm3>
            <v-select
              label="Size of damage dice"
              v-model="creatureprop.hit_die_size"
              :items="dieSizeChoices"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
              label="Damage type"
              v-model="creatureprop.hit_damage_type"
              :items="damageTypes"
            ></v-select>
          </v-flex>
          <v-flex xs12 class="mt-0 pt-0">
            <v-switch
              label="Attack does extra damage of another type"
              v-model="hitExtra"
              :hide-details="hitExtra"
            ></v-switch>
          </v-flex>
        </v-layout>
      </v-expand-transition>
      <v-expand-transition>
        <v-layout v-if="creatureprop.attack_type && hitExtra" wrap key="extra">
          <v-flex xs6 sm3>
            <v-text-field
              label="Number of extra damage dice"
              v-model="creatureprop.hit_extra_damage_dice"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 sm3>
            <v-select
              label="Size of extra damage dice"
              v-model="creatureprop.hit_extra_damage_die_size"
              :items="dieSizeChoices"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
              label="Extra damage type"
              v-model="creatureprop.hit_extra_damage_type"
              :items="damageTypes"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-expand-transition>
    </v-form>
    <v-layout>
      <slot
        name="actions"
        :resetFunc="creatureprop.reset"
        :saveFunc="async () => creatureprop.vuex_save($store)"
        :changedFunc="creatureprop.changed"
      >
        <v-btn
          flat
          @click="creatureprop.reset()"
          :disabled="!creatureprop.changed()"
        >
          <v-icon left>cancel</v-icon>
          clear changes
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          flat
          @click="creatureprop.vuex_save($store)"
          color="save"
          :disabled="!creatureprop.changed()"
        >
          <v-icon left>save</v-icon>
          save
        </v-btn>
      </slot>
    </v-layout>
  </v-container>
</template>

<script>
import {
  propTypeChoices,
  attackTypeChoices,
  CreatureProp,
} from "@/models/creatureprop";
import { abilityScoreChoices, damageTypes } from "@/models/statblock";

const dieSizeChoices = [1, 4, 6, 8, 10, 12, 20].map(v => ({
  text: "d" + v,
  value: v,
}));

export default {
  name: "CreaturePropDetail",
  props: {
    uuid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      damageTypes,
      dieSizeChoices,
      propTypeChoices,
      attackTypeChoices,
      abilityScoreChoices,
      formValid: false,
      creatureprop: new CreatureProp({ uuid: this.uuid }),
      dynamicSaveDC: false,
      hitExtra: false,
    };
  },
  watch: {
    dynamicSaveDC(val) {
      if (val) {
        this.creatureprop.save_dc_override = null;
      } else {
        this.creatureprop.save_source_ability = null;
      }
    },
    hitExtra(val) {
      if (!val) {
        this.creatureprop.hit_extra_damage_dice = null;
        this.creatureprop.hit_extra_damage_die_size = null;
        this.creatureprop.hit_extra_damage_type = null;
      }
    },
  },
  async created() {
    if (this.uuid) {
      this.creatureprop.vuex_fetch(this.$store);
      this.dynamicSaveDC = !!this.creatureprop.save_source_ability;
      this.hitExtra =
        !!this.creatureprop.hit_extra_damage_type ||
        !!this.creatureprop.hit_extra_damage_die_size ||
        !!this.creatureprop.hit_extra_damage_dice;
    }
  },
};
</script>
