// src/context/GymMemberContext.jsx
import { createContext, useContext, useState } from "react";
import * as gymService from "../services/gymMemberService";

const GymMemberContext = createContext(null);

export const GymMemberProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signContract = async (memberData) => {
    setLoading(true);
    setError(null);
    try {
      const newMember = await gymService.createGymMember(memberData);
      return newMember;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GymMemberContext.Provider value={{ signContract, loading, error }}>
      {children}
    </GymMemberContext.Provider>
  );
};

export const useGymMembersContext = () => {
  const ctx = useContext(GymMemberContext);
  if (!ctx) throw new Error("GymMemberContext was not provided");
  return ctx;
};
