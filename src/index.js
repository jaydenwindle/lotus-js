import { Client } from "rpc-websockets";

export default class LotusClient {
  constructor(client, host, port, token) {
    this.client = client;
    this.host = host;
    this.port = port;
    this.token = token;
  }

  static async init({ host, port = 1234, token }) {
    return new Promise((resolve, reject) => {
      var ws = new Client(`ws://${host}:${port}/rpc/v0?token=${token}`, {
        protocol: "JSONRPC"
      });
      ws.on("open", () => resolve(new LotusClient(ws, host, port, token)));
      ws.on("error", err => reject(err));
    });
  }

  async version() {
    return this.client.call("Filecoin.Version", []);
  }

  async listImports() {
    return this.client.call("Filecoin.ClientListImports");
  }

  async listDeals() {
    return this.client.call("Filecoin.ClientListDeals");
  }

  async walletList() {
    return this.client.call("Filecoin.WalletList");
  }

  async walletBalance(wallet) {
    return this.client.call("Filecoin.WalletBalance", [wallet]);
  }

  async chainHead() {
    return this.client.call("Filecoin.ChainHead");
  }

  async importFile(file) {
    return fetch(`http://${this.host}:${this.port}/rest/v0/import`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      body: file
    });
  }

  close() {
    return this.client.close();
  }
}
