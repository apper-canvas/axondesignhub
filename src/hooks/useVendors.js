import { useState, useEffect } from "react";
import { vendorService } from "@/services/api/vendorService";

export const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await vendorService.getAll();
      setVendors(data);
    } catch (err) {
      setError(err.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const createVendor = async (vendorData) => {
    try {
      const newVendor = await vendorService.create(vendorData);
      setVendors(prev => [...prev, newVendor]);
      return newVendor;
    } catch (err) {
      throw new Error(err.message || "Failed to create vendor");
    }
  };

  const searchVendors = async (query) => {
    try {
      setLoading(true);
      setError("");
      const results = await vendorService.search(query);
      setVendors(results);
    } catch (err) {
      setError(err.message || "Failed to search vendors");
    } finally {
      setLoading(false);
    }
  };

  return {
    vendors,
    loading,
    error,
    loadVendors,
    createVendor,
    searchVendors
  };
};