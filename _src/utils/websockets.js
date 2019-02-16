import uuid from "uuid/v4";

const readyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

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
  constructor(vm, url, msgType2FunctionMap) {
    this.vm = vm;

    this.counter = 0;
    this.uuid = uuid();
    this.replyCallbackMap = {};
    this.msgType2FunctionMap = msgType2FunctionMap;
    this.vm.$connect();
    // this.vm.$options.sockets.onmessage = this.receive().bind(this);
  }

  connect() {
    if (this.vm.$socket && this.vm.$socket.readyState === readyState.OPEN) {
      return new Promise(resolve => {
        this.vm.$socket.onmessage = this.receive().bind(this);
        this.vm.$socket.onopen = () => resolve();
      });
    }
    return new Promise(resolve => {
      this.vm.$connect();
      this.vm.$socket.onmessage = this.receive().bind(this);
      this.vm.$socket.onopen = () => resolve();
    });
  }

  disconnect() {
    this.vm.$disconnect();
  }

  send(obj) {
    this.vm.$socket.sendObj(obj);
  }

  receive() {
    return event => {
      let obj = new WebSocketReply(JSON.parse(event.data));

      // if (typeof this.msgType2FunctionMap[obj.type] !== "undefined") {
      //   this.msgType2FunctionMap[obj.type](obj.data);
      // }

      const evt = new CustomEvent(obj.type, {
        detail: obj.data,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(evt);

      if (
        obj.replyTo !== null &&
        typeof this.replyCallbackMap[obj.replyTo] !== "undefined"
      ) {
        this.replyCallbackMap[obj.replyTo](obj);
        delete this.replyCallbackMap[obj.replyTo];
      }
    };
  }

  request(type, data) {
    return new Promise(resolve => {
      this.counter += 1;
      let id = this.uuid + "-" + this.counter;
      this.replyCallbackMap[id] = obj => resolve(obj);
      this.send(new WebSocketRequest({ id, type, data }));
    });
  }

  async update(data) {
    return await this.request("update", data);
  }
}
