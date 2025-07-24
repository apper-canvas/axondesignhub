import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import VendorCard from "@/components/molecules/VendorCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useVendors } from "@/hooks/useVendors";

const Vendors = () => {
  const { vendors, loading, error, loadVendors, searchVendors } = useVendors();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "furniture", label: "Furniture" },
    { value: "lighting", label: "Lighting" },
    { value: "textiles", label: "Textiles" },
    { value: "accessories", label: "Accessories" }
  ];

  const filteredVendors = categoryFilter === "all" 
    ? vendors 
    : vendors.filter(vendor => vendor.category === categoryFilter);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        await searchVendors(query);
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      loadVendors();
    }
  };

  const handleVendorClick = (vendor) => {
    toast.info(`Viewing details for ${vendor.name}`);
  };

  const handleAddVendor = () => {
    toast.info("Add new vendor functionality would open here");
  };

  if (loading) {
    return (
      <div>
        <Header 
          title="Vendors" 
          onSearch={handleSearch}
          actions={
            <Button onClick={handleAddVendor}>
              <ApperIcon name="Plus" size={20} className="mr-2" />
              Add Vendor
            </Button>
          }
        />
        <div className="p-6">
          <Loading type="cards" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header title="Vendors" showSearch={false} />
        <div className="p-6">
          <Error message={error} onRetry={loadVendors} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Vendors" 
        onSearch={handleSearch}
        actions={
          <Button onClick={handleAddVendor}>
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Add Vendor
          </Button>
        }
      />
      
      <div className="p-6">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategoryFilter(category.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                categoryFilter === category.value
                  ? 'bg-gradient-to-r from-accent to-warning text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {/* Vendors Grid */}
        {filteredVendors.length === 0 ? (
          <Empty
            title={searchQuery ? "No vendors found" : categoryFilter === "all" ? "No vendors yet" : `No ${categoryFilter} vendors`}
            description={
              searchQuery 
                ? `No vendors match your search for "${searchQuery}"`
                : categoryFilter === "all"
                ? "Build your vendor network by adding trusted suppliers and partners"
                : `No vendors found in the ${categoryFilter} category`
            }
            actionLabel={searchQuery ? "Clear Search" : categoryFilter === "all" ? "Add Vendor" : "View All Vendors"}
            onAction={
              searchQuery 
                ? () => handleSearch("") 
                : categoryFilter === "all" 
                ? handleAddVendor 
                : () => setCategoryFilter("all")
            }
            icon="Building2"
          />
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredVendors.map((vendor, index) => (
              <motion.div
                key={vendor.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VendorCard vendor={vendor} onClick={handleVendorClick} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Vendors;