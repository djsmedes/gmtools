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
            </v-layout>
            <v-list subheader class="elevation-1">
              <v-list-tile
                class="text-uppercase"
                color="save"
                @click="editCreatureProp(null)"
              >
                <v-icon left color="save">add</v-icon>
                add a property or action
              </v-list-tile>
              <template
                v-for="propListItem in creaturePropListItems.filter(
                  l => l.items.length
                )"
              >
                <v-divider :key="propListItem.subheader"></v-divider>
                <v-subheader :key="propListItem.subheader">{{
                  propListItem.subheader
                }}</v-subheader>
                <v-list-tile
                  v-for="prop in propListItem.items"
                  :key="prop.uuid"
                  @click="editCreatureProp(prop.uuid)"
                >
                  <v-list-tile-action>
                    <v-btn icon flat color="grey" style="cursor: row-resize" @click.stop>
                      <v-icon>drag_handle</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                  <v-list-tile-title>
                    {{ prop.title }}
                  </v-list-tile-title>
                </v-list-tile>
              </template>
            </v-list>
          </v-container>
        </v-form>
        <v-layout>
          <v-btn
            @click="statblock.reset()"
            flat
            :disabled="!statblock.changed()"
          >
            <v-icon left>cancel</v-icon>
            clear changes
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="statblock.vuex_save($store)"
            color="save"
            flat
            :disabled="!statblock.changed()"
          >
            <v-icon left>save</v-icon>
            save
          </v-btn>
        </v-layout>
      </v-tab-item>
      <v-tab-item>
        <statblock-view :value="statblock"></statblock-view>
      </v-tab-item>
    </v-tabs-items>
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
import CreaturePropDetailDialog from "@/components/statblocks/CreaturePropDetailDialog";
import creatureprop, { propTypes } from "@/models/creatureprop";
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
    };
  },
  computed: {
    ...mapGetters(creatureprop.namespace, {
      getCreatureProp: creatureprop.getterTypes.BY_ID,
    }),
    creatureProps() {
      return this.statblock.creatureprop_set
        .map(uuid => this.getCreatureProp(uuid))
        .filter(item => !!item);
    },
    creaturePropListItems() {
      return [
        {
          subheader: "Properties",
          items: this.creatureProps.filter(
            p => p.prop_type === propTypes.PROPERTY
          ),
        },
        {
          subheader: "Actions",
          items: this.creatureProps.filter(
            p => p.prop_type === propTypes.ACTION
          ),
        },
        {
          subheader: "Reactions",
          items: this.creatureProps.filter(
            p => p.prop_type === propTypes.REACTION
          ),
        },
        {
          subheader: "Legendary Actions",
          items: this.creatureProps.filter(
            p => p.prop_type === propTypes.LEGENDARY_ACTION
          ),
        },
      ];
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
    async editCreatureProp(uuid) {
      let newPropUuid = await this.$dialog(CreaturePropDetailDialog, {
        uuid,
        parentStatblockUuid: this.uuid,
      });
      if (newPropUuid) {
        this.statblock.creatureprop_set.push(newPropUuid);
      }
    },
  },
  async created() {
    if (this.uuid) {
      this.statblock.vuex_fetch(this.$store);
      this.loadCreatureProps({ statblock: this.uuid });
    }
  },
};
</script>
