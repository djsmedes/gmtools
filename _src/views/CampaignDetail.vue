<template>
  <v-card>
    <v-card-title
      :class="{
        title: true,
        'grey--text': editMode,
        'pb-0': !isCurrentCampaign,
      }"
    >
      {{ campaign.name }}
    </v-card-title>
    <v-btn
      v-if="!isCurrentCampaign"
      text
      small
      color="save"
      @click="$emit('set-active', uuid)"
    >
      Play this campaign
      <v-icon small right>call_made</v-icon>
    </v-btn>
    <v-card-text v-if="editMode">
      <v-text-field v-model="campaign.name" label="Name"></v-text-field>
    </v-card-text>
    <v-list v-else>
      <v-subheader>
        GMs
      </v-subheader>
      <v-list-tile v-for="user in gmList" :key="user._uid">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ user.name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-subheader>
        Players
      </v-subheader>
      <v-list-tile v-for="user in playerList" :key="user._uid">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ user.name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
    </v-list>
    <v-card-actions v-show="editMode">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn text icon color="delete" v-on="on" @click="tryDelete">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn text icon color="cancel" v-on="on" @click="editMode = false">
            <v-icon>cancel</v-icon>
          </v-btn>
        </template>
        <span>Cancel</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn text icon color="save" v-on="on" @click="save">
            <v-icon>save</v-icon>
          </v-btn>
        </template>
        <span>Save</span>
      </v-tooltip>
    </v-card-actions>
    <v-card-actions v-show="!editMode">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            :disabled="disabled"
            text
            icon
            color="delete"
            v-on="on"
            @click="tryLeave"
          >
            <v-icon>person_outline</v-icon>
          </v-btn>
        </template>
        Leave this campaign
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            :disabled="disabled"
            text
            icon
            color="edit"
            v-on="on"
            @click="editMode = true"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </template>
        <span>Edit</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn
            :disabled="disabled"
            text
            icon
            v-on="on"
            @click="invitePlayers"
          >
            <v-icon>group_add</v-icon>
          </v-btn>
        </template>
        <span>Invite players</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Campaign, UserList } from "@/models";
import { ButtonOption } from "@/plugins/userChoiceDialog";
import InvitePlayers from "@/components/accountManage/InvitePlayers";
import axios from "axios/index";
import { generateUrl2 } from "@/utils/urls";
import { authUserMixin } from "@/mixins";

export default {
  name: "CampaignDetail",
  mixins: [authUserMixin],
  props: {
    campaign: {
      type: Campaign,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      users: new UserList(),
      editMode: false,
    };
  },
  computed: {
    gmList() {
      return this.users.models.filter(u =>
        this.campaign.gm_set.includes(u.uuid)
      );
    },
    playerList() {
      return this.users.models.filter(u =>
        this.campaign.player_set.includes(u.uuid)
      );
    },
    isCurrentCampaign() {
      return this.campaign.uuid === this.currentCampaign.uuid;
    },
  },
  watch: {
    editMode: {
      handler(isEditMode) {
        if (isEditMode) {
          this.$emit("focus");
        } else {
          this.$emit("blur");
        }
      },
    },
  },
  created() {
    this.users.fetch();
  },
  methods: {
    async tryDelete() {
      let choice = await this.$userChoice(
        "Confirm delete",
        `<p>Are you sure?</p>`,
        [
          new ButtonOption({
            returnVal: true,
            text: `Yes, delete ${this.campaign.name}`,
            attrs: { color: "delete" },
          }),
          new ButtonOption(),
        ]
      );
      if (choice) {
        await this.campaign.delete();
      }
    },
    async tryLeave() {
      let choice = await this.$userChoice(
        "Confirm leaving campaign",
        `<p>Are you sure you want to leave ${this.campaign.name}? You will need to be re-invited by a GM to rejoin it.</p>`,
        [
          new ButtonOption({
            returnVal: true,
            text: `Yes, leave ${this.campaign.name}`,
            attrs: { color: "delete" },
          }),
          new ButtonOption(),
        ]
      );
      if (choice) {
        await axios.post(
          generateUrl2(Campaign.modelName, this.campaign.uuid, "leave")
        );
      }
    },
    async save() {
      await this.campaign.save();
      this.editMode = false;
    },
    async invitePlayers() {
      if (
        await this.$dialog(InvitePlayers, { campaignUuid: this.campaign.uuid })
      ) {
        this.$showSnack("Invitations sent");
      }
    },
  },
};
</script>
