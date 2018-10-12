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
    status = null
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
    this.url = "ws://" + "localhost:8080" + "/ws/" + url + "/";
    this.counter = 0;
    this.replyCallbackMap = {};
    this.msgType2FunctionMap = msgType2FunctionMap;
  }

  connect() {
    return new Promise(resolve => {
      this.vm.$connect(this.url, { format: "json" });
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

      if (typeof this.msgType2FunctionMap[obj.type] !== "undefined") {
        this.msgType2FunctionMap[obj.type](obj.data);
      }
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
      this.replyCallbackMap[this.counter] = obj => resolve(obj);
      this.send(new WebSocketRequest({ id: this.counter, type, data }));
    });
  }

  async update(data) {
    return await this.request("update", data);
  }
}
