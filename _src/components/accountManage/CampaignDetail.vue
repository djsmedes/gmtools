<template>
  <object-detail :name="localCampaign.name"
                 :start-editing="!campaign.uuid"
                 :save-func="campaign.uuid ? save : create"
                 :clear-func="campaign.uuid ? reset : () => $router.go(-1)"
                 :delete-func="campaign.uuid ? deleteSelf : null">
    <v-list slot="view">
      <v-subheader>
        Name
      </v-subheader>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            {{ campaign.name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-subheader>
        GMs
      </v-subheader>
      <v-list-tile v-for="userUuid in campaign.gm_set" :key="userUuid">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ getUser(userUuid).name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-subheader>
        Players
      </v-subheader>
      <v-list-tile v-for="userUuid in campaign.player_set" :key="userUuid">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ getUser(userUuid).name }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
    </v-list>
    <v-card-text slot="edit">
      <v-text-field
          label="Name"
          v-model="localCampaign.name"
      ></v-text-field>
      <v-select
          readonly
          label="GMs"
          multiple chips
          :items="localCampaign.gm_set.map(userUuid => getUser(userUuid))"
          item-text="name"
          item-value="uuid"
          v-model="localCampaign.gm_set"
      ></v-select>
      <v-select
          readonly
          label="Players"
          multiple chips
          :items="localCampaign.player_set.map(userUuid => getUser(userUuid))"
          item-text="name"
          item-value="uuid"
          v-model="localCampaign.player_set"
      ></v-select>
    </v-card-text>
  </object-detail>
</template>

<script>
import ObjectDetail from "@/components/generic/ObjectDetail";
import { mapGetters, mapActions } from "vuex";
import campaign, { Campaign } from "@/models/campaign";
import userModule from "@/models/user";
import { routeNames } from "@/router";

export default {
  name: "CampaignDetail",
  components: { ObjectDetail },
  data() {
    return {
      localCampaign: new Campaign()
    };
  },
  computed: {
    campaign() {
      let uuid = this.$route.params.uuid;
      return uuid ? this.getCampaign(uuid) : new Campaign();
    },
    ...mapGetters(campaign.namespace, {
      getCampaign: campaign.getterTypes.BY_ID
    }),
    ...mapGetters(userModule.namespace, {
      getUser: userModule.getterTypes.BY_ID
    })
  },
  methods: {
    ...mapActions(campaign.namespace, {
      loadCampaigns: campaign.actionTypes.LIST,
      deleteCampaign: campaign.actionTypes.DESTROY,
      updateCampaign: campaign.actionTypes.UPDATE,
      createCampaign: campaign.actionTypes.CREATE
    }),
    ...mapActions(userModule.namespace, {
      loadUsers: userModule.actionTypes.LIST
    }),
    async deleteSelf() {
      await this.deleteCampaign(this.campaign.uuid);
      this.$router.push({ name: routeNames.CAMPAIGNS });
    },
    async save() {
      await this.updateCampaign(this.localCampaign);
      this.reset();
    },
    async create() {
      let rObj = await this.createCampaign(this.localCampaign);
      this.$router.replace({
        name: routeNames.CAMPAIGN,
        params: { uuid: rObj.uuid }
      });
    },
    reset() {
      this.localCampaign = new Campaign(this.campaign);
    }
  },
  created() {
    this.loadCampaigns().then(() => {
      this.reset();
      if (this.$route.params.uuid && !this.campaign.uuid) {
        this.$router.replace({ name: routeNames.NOT_FOUND });
      }
    });
    this.loadUsers();
  }
};
</script>
