import { createContext, useContext, useEffect, useState } from "react";
import { instance } from "../lib/axios";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [foods, setFoods] = useState([])

  const fetchFoods = async () => {
    await instance.get("/").then((res) => {
      setFoods(res.data);
    });
  }

  useEffect(() => {
    fetchFoods();
  }, [])

  return <AppContext.Provider value={{
    foods,
    setFoods
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
