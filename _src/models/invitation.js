import { Model, Collection } from "./_baseVueMcClasses";
import { generateUrl } from "@/utils/urls";
import axios from "axios";

const modelName = "invitation";
const getListUrl = (extra_url_pieces = []) =>
  generateUrl([modelName, ...extra_url_pieces]);

export class Invitation extends Model {
  static get modelName() {
    return modelName;
  }

  defaults() {
    return {
      uuid: null,
      campaign_name: "",
      campaign: null,
      joiner: null,
      approver: null,
      joiner_external_identifier: "",
      approver_external_identifier: "",
    };
  }
}

export class InvitationList extends Collection {
  static get modelName() {
    return modelName;
  }

  options() {
    return {
      ...super.options(),
      model: Invitation,
    };
  }
}

export async function load() {
  let { data } = await axios.get(getListUrl());
  return data.map(json => new Invitation(json));
}

export async function loadSent() {
  let { data } = await axios.get(getListUrl(["sent"]));
  return data.map(json => new Invitation(json));
}

export async function create(invitation) {
  let { data } = await axios.post(getListUrl(), invitation.serialize());
  return new Invitation(data);
}

export async function accept(invitation) {
  let { data } = await axios.post(getListUrl([invitation.uuid, "accept"]));
  return data;
}

export async function reject(invitation) {
  let { data } = await axios.post(getListUrl([invitation.uuid, "reject"]));
  return data;
}
