const BASE_URL = "api";

export function generateUrl(endpointList = []) {
  return ["", BASE_URL, ...endpointList, ""].join("/");
}
