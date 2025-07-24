import appointmentsData from "@/services/mockData/appointments.json";

let appointments = [...appointmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentService = {
  async getAll() {
    await delay(300);
    return [...appointments];
  },

  async getById(id) {
    await delay(200);
    const appointment = appointments.find(a => a.Id === parseInt(id));
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  },

  async getByClientId(clientId) {
    await delay(250);
    return appointments.filter(a => a.clientId === parseInt(clientId));
  },

  async create(appointmentData) {
    await delay(400);
    const maxId = Math.max(...appointments.map(a => a.Id), 0);
    const newAppointment = {
      ...appointmentData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    appointments.push(newAppointment);
    return { ...newAppointment };
  },

  async update(id, appointmentData) {
    await delay(350);
    const index = appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    appointments[index] = { ...appointments[index], ...appointmentData };
    return { ...appointments[index] };
  },

  async delete(id) {
    await delay(250);
    const index = appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    const deleted = appointments.splice(index, 1)[0];
    return { ...deleted };
  },

  async getUpcoming(days = 7) {
    await delay(200);
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= now && appointmentDate <= futureDate;
    });
  }
};