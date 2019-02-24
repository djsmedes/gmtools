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
          <campaign-detail
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
          ></campaign-detail>
        </v-flex>
        <v-flex lg4 class="hidden-md-and-down">
          <v-layout fill-height justify-center align-center>
            <img :src="icos" alt="icosahedron" style="max-width: 100px" />
          </v-layout>
        </v-flex>
        <invitations class="flex xs12 md6 lg4"></invitations>
      </v-layout>

      <h1 class="display-1 mb-3 mt-5">Other Campaigns</h1>
      <v-data-iterator
        :items="campaigns"
        content-tag="v-layout"
        wrap
        hide-actions
      >
        <v-flex slot="item" slot-scope="props" xs12 md6 lg4>
          <campaign-detail
            :uuid="props.item.uuid"
            @focus="campaignUnderEdit = props.item.uuid"
            @blur="
              campaignUnderEdit =
                campaignUnderEdit === props.item.uuid ? null : campaignUnderEdit
            "
            :disabled="
              campaignUnderEdit && campaignUnderEdit !== props.item.uuid
            "
          ></campaign-detail>
        </v-flex>
      </v-data-iterator>
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

export default {
  name: "CampaignList",
  components: { Invitations, CampaignDetail },
  data() {
    return {
      routeNames,
      campaignUnderEdit: null,
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
  },
  created() {
    this.loadCampaigns();
  },
};
</script>
