import { createContext, useContext } from "react";

const StorageContext = createContext();

const StorageProvider = ({ children }) => {
  return (
    <StorageContext.Provider value={{}}>{children}</StorageContext.Provider>
  );
};

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorageContext must be used within a StorageProvider");
  }
  return context;
};

export default StorageProvider;
