import es6BindAll = require("es6bindall");

type CallbackSub = (data?: number | string | void) => void;
interface IPubSub {
  subscribe(eventName: string, fn: CallbackSub): void;
  unsubscribe(eventName: string, fn: CallbackSub): void;
  publish(eventName: string, data?: string | number | void): void;
}
interface IPubsubInner {
  [index: string]: [(data?: string | number | void) => void];
}
class Pubsub {
  public pubsub: IPubsubInner;
  private bindMethods: string[] = ["subscribe", "unsubscribe", "publish"];
  constructor() {
    this.pubsub = {};
    es6BindAll(this, this.bindMethods);
  }
  public subscribe(eventName: string, fn: CallbackSub): void {
    this.pubsub[eventName] = this.pubsub[eventName] || [];
    this.pubsub[eventName].push(fn);
  }
  public unsubscribe(eventName: string, fn: CallbackSub): void {
    if (this.pubsub[eventName]) {
      for (let i: number = 0; i < this.pubsub[eventName].length; i++) {
        if (this.pubsub[eventName][i] === fn) {
          this.pubsub[eventName].splice(i, 1);
          break;
        }
      }
    }
  }
  public publish(eventName: string, data?: string | number | void): void {
    if (this.pubsub[eventName]) {
      this.pubsub[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
}

export default Pubsub;
