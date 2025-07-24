import vendorsData from "@/services/mockData/vendors.json";

let vendors = [...vendorsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const vendorService = {
  async getAll() {
    await delay(300);
    return [...vendors];
  },

  async getById(id) {
    await delay(200);
    const vendor = vendors.find(v => v.Id === parseInt(id));
    if (!vendor) {
      throw new Error("Vendor not found");
    }
    return { ...vendor };
  },

  async getByCategory(category) {
    await delay(250);
    return vendors.filter(v => v.category === category);
  },

  async create(vendorData) {
    await delay(400);
    const maxId = Math.max(...vendors.map(v => v.Id), 0);
    const newVendor = {
      ...vendorData,
      Id: maxId + 1
    };
    vendors.push(newVendor);
    return { ...newVendor };
  },

  async update(id, vendorData) {
    await delay(350);
    const index = vendors.findIndex(v => v.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Vendor not found");
    }
    vendors[index] = { ...vendors[index], ...vendorData };
    return { ...vendors[index] };
  },

  async delete(id) {
    await delay(250);
    const index = vendors.findIndex(v => v.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Vendor not found");
    }
    const deleted = vendors.splice(index, 1)[0];
    return { ...deleted };
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(searchTerm) ||
      vendor.category.toLowerCase().includes(searchTerm) ||
      vendor.contact.toLowerCase().includes(searchTerm)
    );
  }
};