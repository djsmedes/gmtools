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

export async function retrieveObject({ uuid, modelName }) {
  let reply = await axios.get(generateUrl(modelName, uuid));
  return reply.data;
}

export async function updateObject({ object, modelName }) {
  let reply = await axios.put(generateUrl(modelName, object.uuid), object);
  return reply.data;
}

export async function destroyObject({ uuid, modelName }) {
  await axios.delete(generateUrl(modelName, uuid));
}

export async function optionsObject({ modelName }) {
  let reply = await axios.options(generateUrl(modelName));
  return reply.data;
}

export default {
  listObjects,
  createObject,
  retrieveObject,
  updateObject,
  destroyObject,
  optionsObject
};
