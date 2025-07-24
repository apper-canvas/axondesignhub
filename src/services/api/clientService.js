import clientsData from "@/services/mockData/clients.json";

let clients = [...clientsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const clientService = {
  async getAll() {
    await delay(300);
    return [...clients];
  },

  async getById(id) {
    await delay(200);
    const client = clients.find(c => c.Id === parseInt(id));
    if (!client) {
      throw new Error("Client not found");
    }
    return { ...client };
  },

  async create(clientData) {
    await delay(400);
    const maxId = Math.max(...clients.map(c => c.Id), 0);
    const newClient = {
      ...clientData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString()
    };
    clients.push(newClient);
    return { ...newClient };
  },

  async update(id, clientData) {
    await delay(350);
    const index = clients.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Client not found");
    }
    clients[index] = { ...clients[index], ...clientData };
    return { ...clients[index] };
  },

  async delete(id) {
    await delay(250);
    const index = clients.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Client not found");
    }
    const deleted = clients.splice(index, 1)[0];
    return { ...deleted };
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm) ||
      client.email.toLowerCase().includes(searchTerm) ||
      client.phone.includes(searchTerm)
    );
  }
};