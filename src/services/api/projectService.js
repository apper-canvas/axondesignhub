import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  async getAll() {
    await delay(300);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.Id === parseInt(id));
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  },

  async getByClientId(clientId) {
    await delay(250);
    return projects.filter(p => p.clientId === parseInt(clientId));
  },

  async create(projectData) {
    await delay(400);
    const maxId = Math.max(...projects.map(p => p.Id), 0);
    const newProject = {
      ...projectData,
      Id: maxId + 1,
      startDate: new Date().toISOString(),
      spent: 0,
      images: []
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, projectData) {
    await delay(350);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    projects[index] = { ...projects[index], ...projectData };
    return { ...projects[index] };
  },

  async delete(id) {
    await delay(250);
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    const deleted = projects.splice(index, 1)[0];
    return { ...deleted };
  }
};