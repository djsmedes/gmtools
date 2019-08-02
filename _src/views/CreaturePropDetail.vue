<template>
  <v-container grid-list-xl>
    <v-form v-model="formValid" @submit.prevent>
      <v-layout wrap>
        <v-flex xs12>
          <v-select
            :items="propTypeChoices"
            v-model="creatureprop.prop_type"
            label="Type"
          ></v-select>
        </v-flex>

        <v-flex xs12>
          <v-text-field
            v-model="creatureprop.title"
            label="Title"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-textarea
            v-model="creatureprop.description"
            label="Description"
            rows="1"
            auto-grow
          ></v-textarea>
        </v-flex>

        <v-flex xs12 sm4>
          <v-switch
            v-model="dynamicSaveDC"
            label="Use creature's ability score to determine save DC"
            hide-details
          ></v-switch>
        </v-flex>
        <v-flex xs12 sm4>
          <v-fade-transition mode="out-in">
            <v-select
              v-if="dynamicSaveDC"
              :items="abilityScoreChoices"
              v-model="creatureprop.save_source_ability"
              label="Source Ability"
              clearable
            ></v-select>
            <v-text-field
              v-else
              v-model="creatureprop.save_dc_override"
              label="Save DC"
            ></v-text-field>
          </v-fade-transition>
        </v-flex>
        <v-flex xs12 sm4>
          <v-select
            :items="abilityScoreChoices"
            v-model="creatureprop.save_ability"
            label="Targeted Ability"
            clearable
          ></v-select>
        </v-flex>

        <v-flex xs12 sm6>
          <v-select
            :items="attackTypeChoices"
            v-model="creatureprop.attack_type"
            label="Attack type"
            clearable
          ></v-select>
        </v-flex>
        <v-expand-transition>
          <v-flex v-if="creatureprop.attack_type" xs12 sm6>
            <v-select
              v-model="creatureprop.uses_ability_mod"
              :items="abilityScoreChoices"
              label="Ability score used"
            ></v-select>
          </v-flex>
        </v-expand-transition>
      </v-layout>
      <v-expand-transition>
        <v-layout v-if="creatureprop.attack_type" wrap>
          <v-flex v-if="creatureprop.attack_type % 2 === 1" xs12 sm6>
            <v-text-field
              v-model="creatureprop.reach_range"
              label="Reach"
            ></v-text-field>
          </v-flex>
          <template v-else>
            <v-flex xs6 sm3>
              <v-text-field
                v-model="creatureprop.reach_range"
                label="Range (1st increment)"
              ></v-text-field>
            </v-flex>
            <v-flex xs6 sm3>
              <v-text-field
                v-model="creatureprop.range_second"
                label="Range (2nd increment)"
              ></v-text-field>
            </v-flex>
          </template>
          <v-flex xs12 sm6>
            <v-text-field
              v-model="creatureprop.num_targets"
              label="Number of targets"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 sm3>
            <v-text-field
              v-model="creatureprop.hit_num_damage_dice"
              label="Number of damage dice"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 sm3>
            <v-select
              v-model="creatureprop.hit_die_size"
              :items="dieSizeChoices"
              label="Size of damage dice"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
              v-model="creatureprop.hit_damage_type"
              :items="damageTypes"
              label="Damage type"
            ></v-select>
          </v-flex>
          <v-flex xs12 class="mt-0 pt-0">
            <v-switch
              v-model="hitExtra"
              :hide-details="hitExtra"
              label="Attack does extra damage of another type"
            ></v-switch>
          </v-flex>
        </v-layout>
      </v-expand-transition>
      <v-expand-transition>
        <v-layout v-if="creatureprop.attack_type && hitExtra" key="extra" wrap>
          <v-flex xs6 sm3>
            <v-text-field
              v-model="creatureprop.hit_extra_damage_dice"
              label="Number of extra damage dice"
            ></v-text-field>
          </v-flex>
          <v-flex xs6 sm3>
            <v-select
              v-model="creatureprop.hit_extra_damage_die_size"
              :items="dieSizeChoices"
              label="Size of extra damage dice"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
              v-model="creatureprop.hit_extra_damage_type"
              :items="damageTypes"
              label="Extra damage type"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-expand-transition>
    </v-form>
    <v-layout>
      <slot
        :resetFunc="creatureprop.reset"
        :saveFunc="creatureprop.save"
        :changedFunc="creatureprop.changed"
        name="actions"
      >
        <v-btn
          :disabled="!creatureprop.changed()"
          flat
          @click="creatureprop.reset()"
        >
          <v-icon left>cancel</v-icon>
          clear changes
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!creatureprop.changed()"
          flat
          color="save"
          @click="creatureprop.save()"
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
  abilityScoreChoices,
  damageTypes,
  propTypeChoices,
  attackTypeChoices,
  CreatureProp,
} from "@/models";

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
      await this.creatureprop.fetch();
      this.dynamicSaveDC = !!this.creatureprop.save_source_ability;
      this.hitExtra =
        !!this.creatureprop.hit_extra_damage_type ||
        !!this.creatureprop.hit_extra_damage_die_size ||
        !!this.creatureprop.hit_extra_damage_dice;
    }
  },
};
</script>
