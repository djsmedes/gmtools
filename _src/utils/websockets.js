import uuid from "uuid/v4";

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
    this.vm.$store.watch(
      state => state.lastReplyId,
      value => {
        if (this.replyCallbackMap[value] !== undefined) {
          this.replyCallbackMap[value]();
          delete this.replyCallbackMap[value];
        }
      }
    );
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
}
