import { Model } from "./_baseModel";
import { generateUrl } from "@/utils/urls";
import axios from "axios";

const modelName = "invitation";
const getListUrl = (extra_url_pieces = []) =>
  generateUrl([modelName, ...extra_url_pieces]);

export class Invitation extends Model {
  static get modelName() {
    return modelName;
  }

  constructor({
    uuid = null,
    campaign_name = "",
    campaign = null,
    joiner = null,
    approver = null,
  } = {}) {
    super();
    this.uuid = uuid;
    this.campaign_name = campaign_name;
    this.campaign = campaign;
    this.joiner = joiner;
    this.approver = approver;
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
