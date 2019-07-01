import uuid from "uuid/v4";
import uniqueId from "lodash/uniqueId";

class WebSocketRequest {
  constructor({ verb = null, id = null, data = null } = {}) {
    this.verb = verb;
    this.id = id;
    this.data = data;
  }
}

export class ModuleSocket {
  constructor(vm) {
    this.vm = vm;

    this.counter = 0;
    this.uuid = uuid();
    this.replyCallbackMap = {};
    this.messageListeners = {};
  }

  initialize() {
    this.vm.$connect();
    this.vm.$socket.onmessage = message => {
      let { action, data, namespace, replyTo, status } = JSON.parse(
        message.data
      );

      let { resolve, reject } = this.replyCallbackMap[replyTo] || {
        resolve: () => {},
        reject: () => {},
      };

      if (status >= 400) {
        reject(data);
        return;
      }

      Object.values(this.messageListeners).forEach(listener =>
        listener({
          action,
          data,
          namespace,
        })
      );
      resolve();
    };
  }

  terminate() {
    if (typeof this.vm.$disconnect === "function") this.vm.$disconnect();
  }

  request(verb, data) {
    return new Promise((resolve, reject) => {
      this.counter += 1;
      let id = this.uuid + "-" + this.counter;
      this.replyCallbackMap[id] = {
        resolve: obj => {
          delete this.replyCallbackMap[id];
          resolve(obj);
        },
        reject: obj => {
          delete this.replyCallbackMap[id];
          reject(obj);
        },
      };
      this.vm.$socket.sendObj(new WebSocketRequest({ id, verb, data }));
    });
  }

  async get(data) {
    return await this.request("GET", data);
  }

  async put(data) {
    return await this.request("PUT", data);
  }

  async post(data) {
    return await this.request("POST", data);
  }

  async delete(data) {
    return await this.request("DELETE", data);
  }

  addMessageListener(cb) {
    let id = uniqueId();
    this.messageListeners[id] = cb;
    return () => delete this.messageListeners[id];
  }
}
