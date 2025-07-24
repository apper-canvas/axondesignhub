import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, onSearch, showSearch = true, actions }) => {
  return (
    <div className="bg-surface/80 backdrop-blur-sm border-b border-gray-100 p-6 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            {title}
          </h1>
          {showSearch && onSearch && (
            <div className="max-w-md">
              <SearchBar onSearch={onSearch} />
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {actions}
          <div className="flex items-center space-x-2 text-gray-600">
            <ApperIcon name="Bell" size={20} className="hover:text-accent cursor-pointer transition-colors" />
            <ApperIcon name="Settings" size={20} className="hover:text-accent cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;