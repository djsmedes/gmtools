import axios from "axios";

export function generateUrl(modelName, uuid = null) {
  const baseStr = "/api/" + modelName + "/";
  return uuid ? baseStr + uuid + "/" : baseStr;
}

export async function listObjects({ modelName }) {
  let reply = await axios.get(generateUrl(modelName));
  return reply.data;
}

export async function createObject({ object, modelName }) {
  let reply = await axios.post(generateUrl(modelName), object);
  return reply.data;
}

export function retrieveObject({ uuid, modelName, axiosConfig = {} }, resolve) {
  return axios.get(generateUrl(modelName, uuid), axiosConfig).then(r => {
    resolve(r.data);
  });
}

export async function updateObject({ object, modelName }) {
  let reply = await axios.put(generateUrl(modelName, object.uuid), object);
  return reply.data;
}

export function destroyObject({ uuid, modelName, axiosConfig = {} }, resolve) {
  return axios.delete(generateUrl(modelName, uuid), axiosConfig).then(() => {
    resolve();
  });
}

export function optionsObject({ modelName, axiosConfig = {} }, resolve) {
  return axios.options(generateUrl(modelName), axiosConfig).then(r => {
    resolve(r.data);
  });
}

export default {
  listObjects,
  createObject,
  retrieveObject,
  updateObject,
  destroyObject,
  optionsObject
};
