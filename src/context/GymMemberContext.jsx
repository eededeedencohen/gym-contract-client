// src/context/GymMemberContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  getAllMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../services/gymMemberService";

const GymMemberContext = createContext(null);

export const GymMemberProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllMembers();
        setMembers(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const addMember = async (memberData) => {
    setLoading(true);
    setError(null);
    try {
      const newMember = await createMember(memberData);
      setMembers((prev) => [...prev, newMember]);
      return newMember;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editMember = async (memberID, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMember = await updateMember(memberID, updateData);
      setMembers((prev) =>
        prev.map((m) => (m.memberID === memberID ? updatedMember : m))
      );
      return updatedMember;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (memberID) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMember(memberID);
      setMembers((prev) => prev.filter((m) => m.memberID !== memberID));
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GymMemberContext.Provider
      value={{ loading, error, members, addMember, editMember, removeMember }}
    >
      {children}
    </GymMemberContext.Provider>
  );
};

export const useGymMembers = () => {
  const ctx = useContext(GymMemberContext);
  if (!ctx) throw new Error("GymMemberContext was not provided");
  return ctx;
};
