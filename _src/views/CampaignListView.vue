<template>
  <v-expand-transition mode="out-in">
    <v-container fluid v-if="campaigns.length" grid-list-xl>
      <v-layout wrap>
        <v-flex xs12 md6 lg4>
          <v-toolbar dense color="transparent" flat class="pa-0">
            <v-toolbar-title class="display-1 mb-3">
              Current Campaign
            </v-toolbar-title>
          </v-toolbar>
          <v-fade-transition mode="out-in">
            <campaign-detail
              :key="currentCampaign._uid"
              :campaign="currentCampaign"
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

      <v-toolbar class="pa-0 mt-5" flat color="transparent" dense>
        <v-toolbar-title class="display-1">Other Campaigns</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="tryCreate">
          <v-icon left>add</v-icon>
          Create a new campaign
        </v-btn>
      </v-toolbar>
      <v-fade-transition>
        <v-layout v-if="showCampaigns" wrap>
          <v-flex
            v-for="campaign in campaigns"
            xs12
            md6
            lg4
            :key="campaign._uid"
            class="campaign-list-item"
          >
            <campaign-detail
              :campaign="campaign"
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
import { getCurrentCampaign, Campaign, CampaignList } from "@/models";
import CampaignDetail from "@/views/CampaignDetail";
import Invitations from "@/components/accountManage/Invitations";
import { sleep } from "@/utils/time";
import NewCampaign from "@/components/accountManage/NewCampaign";

export default {
  name: "CampaignListView",
  components: { Invitations, CampaignDetail },
  data() {
    return {
      p_campaignUnderEdit: null,
      showCampaigns: true,
      allCampaigns: new CampaignList(),
      currentCampaign: getCurrentCampaign(),
    };
  },
  computed: {
    campaignUnderEdit: {
      get() {
        return [...this.campaigns, this.currentCampaign]
          .map(c => c.uuid)
          .find(u => u === this.p_campaignUnderEdit);
      },
      set(val) {
        this.p_campaignUnderEdit = val;
      },
    },
    campaigns() {
      return this.allCampaigns.models.filter(
        c => c.uuid !== this.currentCampaign.uuid
      );
    },
    icos() {
      return require("@/assets/img/icosahedron.svg");
    },
  },
  methods: {
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
    async tryCreate() {
      let name = await this.$dialog(NewCampaign);
      if (name) {
        let newCampaign = new Campaign({ name }, this.allCampaigns);
        await newCampaign.save();
      }
    },
  },
  created() {
    this.allCampaigns.fetch();
  },
};
</script>
