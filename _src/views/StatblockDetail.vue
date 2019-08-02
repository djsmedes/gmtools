<template>
  <div>
    <v-tabs v-model="whichTab" fixed-tabs background-color="transparent">
      <v-tab>
        Edit
      </v-tab>
      <v-tab>
        Preview
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="whichTab" class="mt-4">
      <v-tab-item>
        <v-form v-model="formValid" @submit.prevent>
          <v-container grid-list-xl>
            <v-layout wrap>
              <v-flex xs12>
                <h1 class="headline">
                  Visible Stats
                </h1>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="statblock.name"
                  label="Name"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-select
                  :items="sizeChoices"
                  v-model="statblock.size"
                  label="Size"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                  v-model="statblock.type"
                  label="Type"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-select
                  :items="alignmentChoices"
                  v-model="statblock.alignment"
                  label="Alignment"
                ></v-select>
              </v-flex>

              <v-flex xs12 sm6>
                <v-text-field
                  v-model="statblock.armor_class"
                  label="Armor class"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  v-model="statblock.armor_kind"
                  label="Armor kind"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 sm6>
                <v-text-field
                  v-model="statblock.num_hit_die"
                  label="Number of hit dice"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-btn text color="save" @click="helpCalcHitDie">
                  Help me calculate hit dice
                </v-btn>
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  v-model="statblock.speed"
                  label="Speed"
                ></v-text-field>
              </v-flex>

              <v-flex
                v-for="abl in ['Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha']"
                :key="abl"
                xs4
                md2
              >
                <v-text-field
                  :label="abl"
                  v-model="statblock[abl.toLowerCase()]"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  v-model="statblock.saving_throws"
                  label="Saving throws"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="statblock.skills"
                  label="Skills"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  :items="damageTypes"
                  v-model="statblock.damage_vulnerabilities"
                  label="Damage vulnerabilities"
                  chips
                  multiple
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  :items="damageTypes"
                  v-model="statblock.damage_resistances"
                  label="Damage resistances"
                  chips
                  multiple
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  :items="damageTypes"
                  v-model="statblock.damage_immunities"
                  label="Damage immunities"
                  chips
                  multiple
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  :items="conditions"
                  v-model="statblock.condition_immunities"
                  label="Condition immunities"
                  chips
                  multiple
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="statblock.senses"
                  label="Senses"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-combobox
                  :items="languages"
                  v-model="statblock.languages"
                  label="Languages"
                  chips
                  multiple
                ></v-combobox>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="statblock.challenge"
                  label="Challenge rating"
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <h1 class="headline">
                  Hidden Stats
                </h1>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  v-model="statblock.generic_name"
                  label="Generic name"
                  hint="This will be used in action descriptions"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                  v-model="statblock.proficiency"
                  label="Proficiency"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <h1 class="headline">
                  Properties and Actions
                </h1>
              </v-flex>
            </v-layout>

            <v-expand-transition mode="out-in">
              <v-list v-if="statblock.uuid" subheader class="elevation-1">
                <v-list-item
                  class="text-uppercase"
                  color="save"
                  @click="editCreatureProp(null)"
                >
                  <v-icon left color="save">add</v-icon>
                  add a property or action
                </v-list-item>
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
                    v-sortable-list
                    :key="'_' + propListItem.subheader"
                    @sorted="objectSortOccurred($event, propListItem.propType)"
                  >
                    <v-list-item
                      v-for="prop in propListItem.items"
                      :key="prop.uuid"
                      @click.stop
                    >
                      <v-list-item-action class="sortHandle">
                        <v-icon style="cursor: row-resize" color="grey">
                          drag_handle
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-title @click="editCreatureProp(prop.uuid)">
                        {{ prop.title }}
                      </v-list-item-title>
                    </v-list-item>
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
            :disabled="!statblock.changed()"
            text
            @click="statblock.reset()"
          >
            <v-icon left>cancel</v-icon>
            clear changes
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!statblock.changed()"
            color="save"
            text
            @click="save"
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
  propTypes,
  CreaturePropList,
} from "@/models";
import StatblockView from "@/components/statblocks/StatblockView";
import CalcHitDieDialog from "@/components/statblocks/CalcHitDieDialog";
import CreaturePropDetailDialog from "@/components/statblocks/CreaturePropDetailDialog";
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
      creatureProps: new CreaturePropList([], {
        storeFilter: {
          statblock: this.uuid,
        },
      }),
    };
  },
  computed: {
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
  async created() {
    if (this.uuid) {
      this.statblock.fetch();
      this.creatureProps.fetch();
    }
  },
  methods: {
    async save() {
      let creatingNew = !this.statblock.uuid;
      await this.statblock.save();
      if (creatingNew) {
        this.$router.replace({
          name: this.$routeNames.STATBLOCK,
          params: { uuid: this.statblock.uuid },
        });
      }
    },
    uuidsToCreatureProps(uuid_list) {
      // start with uuid_list and map from it to preserve order
      return uuid_list
        .map(uuid => this.creatureProps.find({ uuid }))
        .filter(cp => cp);
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
      // todo - changing types will not be updated until refresh

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
};
</script>
