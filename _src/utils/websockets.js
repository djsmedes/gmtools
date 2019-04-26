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
    this.vm.$socket.onmessage = message => {
      let { action, data, namespace, replyTo, status } = JSON.parse(
        message.data
      );

      if (this.replyCallbackMap[replyTo] !== undefined) {
        this.replyCallbackMap[replyTo](data);
        delete this.replyCallbackMap[replyTo];
      } else {
        Object.values(this.messageListeners).forEach(listener =>
          listener({
            action,
            data,
            namespace,
          })
        );
      }
    };
  }

  request(verb, data) {
    return new Promise(resolve => {
      this.counter += 1;
      let id = this.uuid + "-" + this.counter;
      this.replyCallbackMap[id] = obj => resolve(obj);
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
