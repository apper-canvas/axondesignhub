import { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const updateTaskStatus = async (id, status) => {
    try {
      const updated = await taskService.updateStatus(id, status);
      setTasks(prev => prev.map(t => t.Id === parseInt(id) ? updated : t));
      return updated;
    } catch (err) {
      throw new Error(err.message || "Failed to update task");
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      throw new Error(err.message || "Failed to create task");
    }
  };

  return {
    tasks,
    loading,
    error,
    loadTasks,
    updateTaskStatus,
    createTask
  };
};