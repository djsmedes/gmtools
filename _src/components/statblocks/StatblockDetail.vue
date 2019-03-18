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

            <v-expand-transition mode="out-in">
              <v-list subheader class="elevation-1" v-if="statblock.uuid">
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
                  <v-divider :key="propListItem.subheader + '_'"></v-divider>
                  <v-subheader :key="propListItem.subheader">
                    {{ propListItem.subheader }}
                  </v-subheader>
                  <v-list
                    :key="'_' + propListItem.subheader"
                    v-sortable-list
                    @sorted="objectSortOccurred($event, propListItem.propType)"
                  >
                    <v-list-tile
                      v-for="prop in propListItem.items"
                      :key="prop.uuid"
                      @click.stop
                    >
                      <v-list-tile-action class="sortHandle">
                        <v-icon style="cursor: row-resize" color="grey">
                          drag_handle
                        </v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title @click="editCreatureProp(prop.uuid)">
                        {{ prop.title }}
                      </v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </template>
              </v-list>
              <div v-else class="grey--text">
                You can begin adding properties and actions once you have
                created this statblock by saving it for the first time.
              </div>
            </v-expand-transition>
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
            @click="save"
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
        <statblock-view
          :creature="statblock"
          :properties="statblockProperties"
          :actions="statblockActions"
          :reactions="statblockReactions"
          :legendary_actions="statblockLegendaryActions"
        ></statblock-view>
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
import Sortable from "sortablejs";

const propType2Key = {
  [propTypes.PROPERTY]: "properties",
  [propTypes.ACTION]: "actions",
  [propTypes.REACTION]: "reactions",
  [propTypes.LEGENDARY_ACTION]: "legendary_actions",
};

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
    statblockProperties() {
      return this.uuidsToCreatureProps(this.statblock.properties);
    },
    statblockActions() {
      return this.uuidsToCreatureProps(this.statblock.actions);
    },
    statblockReactions() {
      return this.uuidsToCreatureProps(this.statblock.reactions);
    },
    statblockLegendaryActions() {
      return this.uuidsToCreatureProps(this.statblock.legendary_actions);
    },
    creaturePropListItems() {
      return [
        {
          subheader: "Properties",
          propType: propTypes.PROPERTY,
          items: this.statblockProperties,
        },
        {
          subheader: "Actions",
          propType: propTypes.ACTION,
          items: this.statblockActions,
        },
        {
          subheader: "Reactions",
          propType: propTypes.REACTION,
          items: this.statblockReactions,
        },
        {
          subheader: "Legendary Actions",
          propType: propTypes.LEGENDARY_ACTION,
          items: this.statblockLegendaryActions,
        },
      ];
    },
  },
  methods: {
    ...mapActions(creatureprop.namespace, {
      loadCreatureProps: creatureprop.actionTypes.QUERY_LIST,
    }),
    async save() {
      let creatingNew = !this.statblock.uuid;
      await this.statblock.vuex_save(this.$store);
      if (creatingNew) {
        this.$router.replace({
          name: this.$routeNames.STATBLOCK,
          params: { uuid: this.statblock.uuid },
        });
      }
    },
    uuidsToCreatureProps(uuid_list) {
      return uuid_list.map(uuid => this.getCreatureProp(uuid)).filter(p => !!p);
    },
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
      let newProp = await this.$dialog(CreaturePropDetailDialog, {
        uuid,
        parentStatblockUuid: this.uuid,
      });
      if (newProp) {
        let key = propType2Key[newProp.prop_type];
        this.statblock[key].push(newProp.uuid);
      }
    },
    objectSortOccurred({ oldIndex, newIndex }, propType) {
      let key = propType2Key[propType];
      const moved = this.statblock[key].splice(oldIndex, 1)[0];
      this.statblock[key].splice(newIndex, 0, moved);
    },
  },
  directives: {
    sortableList: {
      bind(el, binding, vnode) {
        const options = {
          handle: ".sortHandle",
          animation: 150,
          onUpdate: function(event) {
            vnode.child.$emit("sorted", event);
          },
        };

        Sortable.create(el, options);
      },
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
