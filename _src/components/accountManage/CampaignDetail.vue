<template>
  <object-detail :title="campaign.name"
                 :save-func="save"
                 :clear-func="reset"
                 :delete-func="deleteSelf">
    <template slot="view">
      <v-card-text>
        <v-text-field
            readonly
            label="Name"
            v-model="campaign.name"
        ></v-text-field>
        <h5>Name:</h5>
        <p>{{ campaign.name }}</p>
        <h5>GMs:</h5>
        <p v-for="userUuid in campaign.gm_set" :key="userUuid">
          {{ getUser(userUuid).name }}
        </p>
        <h5>Players:</h5>
        <p v-for="userUuid in campaign.player_set" :key="userUuid">
          {{ getUser(userUuid).name }}
        </p>
      </v-card-text>>
    </template>
    <template slot="edit">
      <div class="card-body">
        <form novalidate @submit.stop.prevent>
          <div class="form-group">
            <label for="editName">Name</label>
            <input id="editName" class="form-control" v-model="localCampaign.name">
          </div>
        </form>
      </div>
    </template>
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
      if (this.localCampaign.uuid) {
        await this.updateCampaign(this.localCampaign);
        this.reset();
      } else {
        let rObj = await this.createCampaign(this.localCampaign);
        this.$router.push({
          name: routeNames.CAMPAIGN,
          params: { uuid: rObj.uuid }
        });
      }
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
