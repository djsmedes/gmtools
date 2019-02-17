import uuid from "uuid/v4";

class WebSocketRequest {
  constructor({ type = null, id = null, data = null } = {}) {
    this.type = type;
    this.id = id;
    this.data = data;
  }
}

class WebSocketReply {
  constructor({
    type = null,
    replyTo = null,
    data = null,
    status = null,
  } = {}) {
    this.type = type;
    this.replyTo = replyTo;
    this.data = data;
    this.status = status;
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

  request(type, data) {
    return new Promise(resolve => {
      this.counter += 1;
      let id = this.uuid + "-" + this.counter;
      this.replyCallbackMap[id] = obj => resolve(obj);
      this.vm.$socket.sendObj(new WebSocketRequest({ id, type, data }));
    });
  }

  async update(data) {
    return await this.request("update", data);
  }
}
