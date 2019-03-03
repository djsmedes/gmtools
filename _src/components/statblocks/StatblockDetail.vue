<template>
  <div>
    <v-tabs fixed-tabs color="transparent" v-model="whichTab">
      <v-tab>
        Edit
      </v-tab>
      <v-tab>
        Preview
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="whichTab" class="mt-3">
      <v-tab-item>
        <v-form @submit.prevent v-model="formValid">
          <v-container grid-list-xl>
            <v-layout wrap>
              <v-flex xs12>
                <h1 class="headline">
                  Visible Stats
                </h1>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Name"
                  v-model="statblock.name"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-select
                  label="Size"
                  :items="sizeChoices"
                  v-model="statblock.size"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                  label="Type"
                  v-model="statblock.type"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-select
                  label="Alignment"
                  :items="alignmentChoices"
                  v-model="statblock.alignment"
                ></v-select>
              </v-flex>

              <v-flex xs12 sm6>
                <v-text-field
                  label="Armor class"
                  v-model="statblock.armor_class"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  label="Armor kind"
                  v-model="statblock.armor_kind"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 sm6>
                <v-text-field
                  label="Number of hit dice"
                  v-model="statblock.num_hit_die"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-btn flat color="save" @click="helpCalcHitDie">
                  Help me calculate hit dice
                </v-btn>
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  label="Speed"
                  v-model="statblock.speed"
                ></v-text-field>
              </v-flex>

              <v-flex
                xs4
                md2
                v-for="abl in ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha']"
                :key="abl"
              >
                <v-text-field
                  :label="abl"
                  v-model="statblock[abl.toLowerCase()]"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  label="Saving throws"
                  v-model="statblock.saving_throws"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Skills"
                  v-model="statblock.skills"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  label="Damage vulnerabilities"
                  chips
                  multiple
                  :items="damageTypes"
                  v-model="statblock.damage_vulnerabilities"
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  label="Damage resistances"
                  chips
                  multiple
                  :items="damageTypes"
                  v-model="statblock.damage_resistances"
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  label="Damage immunities"
                  chips
                  multiple
                  :items="damageTypes"
                  v-model="statblock.damage_immunities"
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  label="Condition immunities"
                  chips
                  multiple
                  :items="conditions"
                  v-model="statblock.condition_immunities"
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Senses"
                  v-model="statblock.senses"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  label="Languages"
                  chips
                  multiple
                  :items="languages"
                  v-model="statblock.languages"
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  label="Challenge rating"
                  v-model="statblock.challenge"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <h1 class="headline">
                  Hidden Stats
                </h1>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  label="Generic name"
                  hint="This will be used in action descriptions"
                  v-model="statblock.generic_name"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  label="Proficiency"
                  v-model="statblock.proficiency"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <h1 class="headline">
                  Properties and Actions
                </h1>
              </v-flex>
              <v-flex xs12 v-for="prop in creatureProps" :key="prop.uuid">
                <v-btn
                  :to="{
                    name: $routeNames.CREATUREPROP,
                    params: { uuid: prop.creature_prop },
                  }"
                >
                  {{ prop.fullData.title }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-tab-item>
      <v-tab-item>
        <statblock-view :value="statblock"></statblock-view>
      </v-tab-item>
    </v-tabs-items>

    <v-btn @click="statblock.vuex_save($store)">save</v-btn>
    <v-btn @click="statblock.reset()">reset</v-btn>
  </div>
</template>

<script>
import {
  Statblock,
  sizeChoices,
  alignmentChoices,
  damageTypes,
  conditions,
  languages,
} from "@/models/statblock";
import StatblockView from "@/components/statblocks/StatblockView";
import CalcHitDieDialog from "@/components/statblocks/CalcHitDieDialog";
import axios from "axios";
import { generateUrl } from "@/utils/urls";
import creatureprop from "@/models/creatureprop";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "StatblockDetail",
  components: { StatblockView },
  props: {
    uuid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      sizeChoices,
      alignmentChoices,
      damageTypes,
      conditions,
      languages,
      whichTab: 0,
      formValid: false,
      statblock: new Statblock({ uuid: this.uuid }),
      p_creatureProps: [],
    };
  },
  computed: {
    ...mapGetters(creatureprop.namespace, {
      getCreatureProp: creatureprop.getterTypes.BY_ID,
    }),
    creatureProps() {
      return [...this.p_creatureProps]
        .sort((a, b) => (a.manual_ordering || 0) - (b.manual_ordering || 0))
        .map(item => ({
          ...item,
          fullData: this.getCreatureProp(item.creature_prop) || {},
        }));
    },
  },
  methods: {
    ...mapActions(creatureprop.namespace, {
      loadCreatureProps: creatureprop.actionTypes.QUERY_LIST,
    }),
    async helpCalcHitDie() {
      let response = await this.$dialog(CalcHitDieDialog, {
        creatureSize: this.statblock.size,
        creatureCon: this.statblock.con,
      });
      if (response) {
        this.statblock.num_hit_die = response.num_hit_die;
        this.statblock.con = response.con || this.statblock.con;
        this.statblock.size = response.size || this.statblock.size;
      }
    },
  },
  async created() {
    if (this.uuid) {
      this.statblock.vuex_fetch(this.$store);
      axios
        .get(generateUrl(["statblockprop"]), {
          params: {
            statblock: this.uuid,
          },
        })
        .then(response => (this.p_creatureProps = response.data));
      this.loadCreatureProps({ statblock: this.uuid });
    }
  },
};
</script>
