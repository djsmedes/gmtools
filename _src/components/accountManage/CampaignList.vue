<template>
  <v-expand-transition mode="out-in">
    <v-container v-if="campaigns.length" grid-list-xl>
      <v-layout wrap>
        <v-flex xs12 md6 lg4>
          <v-toolbar dense color="transparent" flat class="p-0">
            <v-toolbar-title class="display-1 mb-3">
              Current Campaign
            </v-toolbar-title>
          </v-toolbar>
          <v-fade-transition mode="out-in">
            <campaign-detail
              :key="currentCampaign.uuid"
              :uuid="currentCampaign.uuid"
              @focus="campaignUnderEdit = currentCampaign.uuid"
              @blur="
                campaignUnderEdit =
                  campaignUnderEdit === currentCampaign.uuid
                    ? null
                    : campaignUnderEdit
              "
              :disabled="
                campaignUnderEdit && campaignUnderEdit !== currentCampaign.uuid
              "
              :is-current-campaign="true"
            ></campaign-detail>
          </v-fade-transition>
        </v-flex>
        <v-flex lg4 class="hidden-md-and-down">
          <v-layout fill-height justify-center align-center>
            <img :src="icos" alt="icosahedron" style="max-width: 100px" />
          </v-layout>
        </v-flex>
        <invitations class="flex xs12 md6 lg4"></invitations>
      </v-layout>

      <h1 class="display-1 mb-3 mt-5">Other Campaigns</h1>
      <v-fade-transition>
        <v-layout v-if="showCampaigns" wrap>
          <v-flex
            v-for="campaign in campaigns"
            xs12
            md6
            lg4
            :key="campaign.uuid"
            class="campaign-list-item"
          >
            <campaign-detail
              :uuid="campaign.uuid"
              @set-active="setCurrentCampaign"
              @focus="campaignUnderEdit = campaign.uuid"
              @blur="
                campaignUnderEdit =
                  campaignUnderEdit === campaign.uuid ? null : campaignUnderEdit
              "
              :disabled="
                campaignUnderEdit && campaignUnderEdit !== campaign.uuid
              "
            ></campaign-detail>
          </v-flex>
        </v-layout>
      </v-fade-transition>
    </v-container>
  </v-expand-transition>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { routeNames } from "@/router";
import campaign from "@/models/campaign";
import CampaignDetail from "@/components/accountManage/CampaignDetail";
import auth from "@/auth";
import Invitations from "@/components/accountManage/Invitations";
import { sleep } from "@/utils/time";

export default {
  name: "CampaignList",
  components: { Invitations, CampaignDetail },
  data() {
    return {
      routeNames,
      campaignUnderEdit: null,
      showCampaigns: true,
    };
  },
  computed: {
    ...mapGetters(campaign.namespace, {
      allCampaigns: campaign.getterTypes.LIST,
    }),
    ...mapGetters(auth.namespace, {
      currentCampaign: auth.getterTypes.CURRENT_CAMPAIGN,
    }),
    campaigns() {
      return this.allCampaigns.filter(
        c => c.uuid !== this.currentCampaign.uuid
      );
    },
    icos() {
      return require("@/assets/img/icosahedron.svg");
    },
  },
  methods: {
    ...mapActions(campaign.namespace, {
      loadCampaigns: campaign.actionTypes.LIST,
    }),
    async setCurrentCampaign(uuid) {
      this.showCampaigns = false;
      let error = await Promise.race([
        this.$ws.request("change_campaign", { campaign_uuid: uuid }),
        sleep(4000).then(
          () => "This is taking a while. You may want to refresh the page."
        ),
      ]);
      if (error) {
        this.$showSnack(error);
      } else {
        await sleep(500);
      }
      this.showCampaigns = true;
    },
  },
  created() {
    this.loadCampaigns();
  },
};
</script>
