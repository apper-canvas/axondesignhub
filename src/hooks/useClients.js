import { useState, useEffect } from "react";
import { clientService } from "@/services/api/clientService";

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      setError(err.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const createClient = async (clientData) => {
    try {
      const newClient = await clientService.create(clientData);
      setClients(prev => [...prev, newClient]);
      return newClient;
    } catch (err) {
      throw new Error(err.message || "Failed to create client");
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      const updated = await clientService.update(id, clientData);
      setClients(prev => prev.map(c => c.Id === parseInt(id) ? updated : c));
      return updated;
    } catch (err) {
      throw new Error(err.message || "Failed to update client");
    }
  };

  const deleteClient = async (id) => {
    try {
      await clientService.delete(id);
      setClients(prev => prev.filter(c => c.Id !== parseInt(id)));
    } catch (err) {
      throw new Error(err.message || "Failed to delete client");
    }
  };

  const searchClients = async (query) => {
    try {
      setLoading(true);
      setError("");
      const results = await clientService.search(query);
      setClients(results);
    } catch (err) {
      setError(err.message || "Failed to search clients");
    } finally {
      setLoading(false);
    }
  };

  return {
    clients,
    loading,
    error,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
    searchClients
  };
};