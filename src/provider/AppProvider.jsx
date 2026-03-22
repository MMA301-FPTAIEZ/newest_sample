import { createContext, useContext, useEffect, useState } from "react";
import { instance } from "../lib/axios";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [models, setModels] = useState([])

  const fetchModels = async () => {
    await instance.get("/").then((res) => {
      setModels(res.data);
    });
  }

  useEffect(() => {
    fetchModels();
  }, [])

  return <AppContext.Provider value={{
    models,
    setModels
  }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default AppProvider;
