<template>
  <v-layout column>
    <h3 class="headline">{{ creature.name }}</h3>
    <h6 class="subheading">
      {{ creature.size_display | capitalize }} {{ creature.type }},
      {{ creature.alignment_display }}
    </h6>
    <v-divider class="my-3"></v-divider>
    <v-flex>
      <strong>Armor Class</strong> {{ creature.armor_class
      }}{{ creature.armor_kind ? " (" + creature.armor_kind + ")" : "" }}
      <br />
      <strong>Hit Points</strong> {{ hit_point_string }}
      <br />
      <strong>Speed</strong> {{ creature.speed }}
    </v-flex>
    <v-divider class="my-3"></v-divider>
    <v-flex>
      <v-layout>
        <v-flex
          v-for="abl in abilityScores"
          :key="abl"
          xs2
          class="text-xs-center"
        >
          <strong class="text-uppercase">{{ abl }}</strong>
          <br />
          {{ creature[abl] }} ({{
            creature[abl + "_mod"] >= 0
              ? "+" + creature[abl + "_mod"]
              : creature[abl + "_mod"]
          }})
        </v-flex>
      </v-layout>
    </v-flex>
    <v-divider class="my-3"></v-divider>
    <v-flex>
      <template v-if="creature.saving_throws">
        <strong>Saving Throws</strong> {{ creature.saving_throws }}
        <br />
      </template>
      <template v-if="creature.skills">
        <strong>Skills</strong> {{ creature.skills }}
        <br />
      </template>
      <template
        v-if="
          creature.damage_vulnerabilities &&
            creature.damage_vulnerabilities.length
        "
      >
        <strong>Damage Vulnerabilities</strong>
        {{ creature.damage_vulnerabilities.join(", ") }}
        <br />
      </template>
      <template
        v-if="creature.damage_resistances && creature.damage_resistances.length"
      >
        <strong>Damage Resistances</strong>
        {{ creature.damage_resistances.join(", ") }}
        <br />
      </template>
      <template
        v-if="creature.damage_immunities && creature.damage_immunities.length"
      >
        <strong>Damage Immunities</strong>
        {{ creature.damage_immunities.join(", ") }}
        <br />
      </template>
      <template
        v-if="
          creature.condition_immunities && creature.condition_immunities.length
        "
      >
        <strong>Condition Immunities</strong>
        {{ creature.condition_immunities.join(", ") }}
        <br />
      </template>
      <strong>Senses</strong> {{ creature.senses }}
      <br />
      <strong>Languages</strong>
      {{
        creature.languages && creature.languages.length
          ? creature.languages.join(", ")
          : "&mdash;"
      }}
      <br />
      <strong>Challenge</strong> {{ creature.challenge }}
    </v-flex>
    <v-divider class="my-3"></v-divider>

    <v-flex v-if="properties.length">
      <p v-for="prop in properties" :key="prop.uuid">
        <em>
          <strong>{{ prop.title }}.</strong>
        </em>
        {{ prop.description | renderSpecifics(creature, prop) }}
      </p>
    </v-flex>

    <template v-if="actions.length">
      <h6 class="title">Actions</h6>
      <v-divider class="mb-2"></v-divider>
      <v-flex>
        <p v-for="prop in actions" :key="prop.uuid">
          <em>
            <strong>{{ prop.title }}.</strong>
          </em>
          <attack-template
            v-if="prop.attack_type"
            :creature="creature"
            v-bind="prop"
          ></attack-template>
          {{ prop.description | renderSpecifics(creature, prop) }}
        </p>
      </v-flex>
    </template>

    <template v-if="reactions.length">
      <h6 class="title">Reactions</h6>
      <v-divider class="mb-2"></v-divider>
      <v-flex>
        <p v-for="prop in reactions" :key="prop.uuid">
          <em>
            <strong>{{ prop.title }}.</strong>
          </em>
          {{ prop.description | renderSpecifics(creature, prop) }}
        </p>
      </v-flex>
    </template>

    <template v-if="legendary_actions.length">
      <h6 class="title">Legendary Actions</h6>
      <v-divider class="mb-2"></v-divider>
      <v-flex>
        <p>
          The {{ creature.generic_name }} can take 3 legendary actions, choosing
          from the options below. Only one legendary action option can be used
          at a time and only at the end of another creature's turn. The
          {{ creature.generic_name }} regains spent legendary actions at the
          start of its turn.
        </p>
      </v-flex>
      <v-flex>
        <p v-for="prop in legendary_actions" :key="prop.uuid">
          <em>
            <strong>{{ prop.title }}.</strong>
          </em>
          {{ prop.description | renderSpecifics(creature, prop) }}
        </p>
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
import {
  Statblock,
  abilityScores,
  abilityScoreDisplay,
} from "@/models/statblock";
import AttackTemplate from "@/components/statblocks/AttackTemplate";

function generateSavingThrowText(creature, property) {
  let dc =
    property.save_dc_override ||
    8 + creature.proficiency + creature[property.save_source_ability + "_mod"];

  return (
    "DC " +
    dc +
    " " +
    abilityScoreDisplay(property.save_ability) +
    " saving throw"
  );
}

export default {
  name: "StatblockView",
  components: { AttackTemplate },
  props: {
    creature: {
      type: Statblock,
      required: true,
    },
    properties: {
      type: Array,
      default: () => [],
    },
    actions: {
      type: Array,
      default: () => [],
    },
    reactions: {
      type: Array,
      default: () => [],
    },
    legendary_actions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      abilityScores,
    };
  },
  computed: {
    hit_point_string() {
      let con_contribution = this.creature.con_mod * this.creature.num_hit_die;
      let con_piece = "";
      if (con_contribution > 0) {
        con_piece = " + " + String(con_contribution);
      } else if (con_contribution < 0) {
        con_piece = " - " + String(Math.abs(con_contribution));
      }

      return (
        this.creature.hit_points ||
        this.creature.avg_hp +
          " (" +
          this.creature.num_hit_die +
          "d" +
          this.creature.hit_die_size +
          con_piece +
          ")"
      );
    },
  },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    renderSpecifics(value, creature, property) {
      if (!value) return "";
      value = value.replace(/{creature}/g, creature.generic_name);
      value = value.replace(
        /{saving throw}/g,
        generateSavingThrowText(creature, property)
      );
      return value;
    },
  },
};
</script>
