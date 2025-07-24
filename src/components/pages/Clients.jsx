import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import ClientCard from "@/components/molecules/ClientCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useClients } from "@/hooks/useClients";

const Clients = () => {
  const { clients, loading, error, loadClients, searchClients } = useClients();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        await searchClients(query);
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      loadClients();
    }
  };

  const handleClientClick = (client) => {
    toast.info(`Viewing details for ${client.name}`);
  };

  const handleAddClient = () => {
    toast.info("Add new client functionality would open here");
  };

  if (loading) {
    return (
      <div>
        <Header 
          title="Clients" 
          onSearch={handleSearch}
          actions={
            <Button onClick={handleAddClient}>
              <ApperIcon name="Plus" size={20} className="mr-2" />
              Add Client
            </Button>
          }
        />
        <div className="p-6">
          <Loading type="list" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Clients" showSearch={false} />
        <div className="p-6">
          <Error message={error} onRetry={loadClients} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Clients" 
        onSearch={handleSearch}
        actions={
          <Button onClick={handleAddClient}>
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Add Client
          </Button>
        }
      />
      
      <div className="p-6">
        {clients.length === 0 ? (
          <Empty
            title={searchQuery ? "No clients found" : "No clients yet"}
            description={
              searchQuery 
                ? `No clients match your search for "${searchQuery}"`
                : "Start building your client base by adding your first client"
            }
            actionLabel={searchQuery ? "Clear Search" : "Add Client"}
            onAction={searchQuery ? () => handleSearch("") : handleAddClient}
            icon="Users"
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {clients.map((client, index) => (
              <motion.div
                key={client.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ClientCard client={client} onClick={handleClientClick} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Clients;