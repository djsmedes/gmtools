export class ModuleSocket {
  constructor(vm, url, msgType2FunctionMap) {
    this.vm = vm;
    this.url = "ws://" + "localhost:8080" + url;
    this.counter = 0;
    // this.replyCallbackMap = {};
    this.msgType2FunctionMap = msgType2FunctionMap;
  }

  connect() {
    this.vm.$connect(this.url, { json: true });
    this.vm.$options.sockets.onmessage = this.receive().bind(this);
  }

  disconnect() {
    this.vm.$disconnect();
  }

  send(obj) {
    this.vm.$socket.sendObj(obj);
  }

  receive() {
    return event => {
      let obj = JSON.parse(event.data);
      if (!obj.type || !obj.data) return;
      let callback = this.msgType2FunctionMap[obj.type];
      if (!callback) return;
      callback(obj.data);
    };
  }

  // async sendAwaitReply(type, obj) {
  //   this.counter += 1;
  //   this.send({
  //     type,
  //     id: this.counter,
  //     data: obj
  //   });
  // }
}
