const BASE_URL = "api";

export function generateUrl(endpointList = []) {
  return ["", BASE_URL, ...endpointList, ""].join("/");
}

export function generateUrl2(...endpoints) {
  return ["", BASE_URL, ...endpoints, ""].join("/");
}
