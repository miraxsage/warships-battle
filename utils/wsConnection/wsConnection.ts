class wsConnectionClass {
  connection: WebSocket;
  opened = false;
  constructor() {
    this.connection = new WebSocket("/api/ws");
    this.connection.onopen = () => (this.opened = true);
  }
}

let wsConnectionInstance: wsConnectionClass;

export function wsConnection() {
  if (!wsConnectionInstance) {
    wsConnectionInstance = new wsConnectionClass();
  }
  return wsConnectionInstance;
}
