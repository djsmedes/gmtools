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
  constructor(vm) {
    this.vm = vm;

    this.counter = 0;
    this.uuid = uuid();
    this.replyCallbackMap = {};
    this.vm.$socket.onmessage = this.receive().bind(this);
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

      const evt = new CustomEvent(obj.type, {
        detail: obj.data,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(evt);

      this.vm.$store.commit("setLastReply", obj.replyTo);
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
