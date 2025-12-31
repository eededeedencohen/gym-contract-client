// src/hooks/useGymMembers.jsx
import { useGymMembersContext } from "../context/GymMemberContext";

const useGymMembers = () => {
  const { signContract, loading, error } = useGymMembersContext();
  return { signContract, loading, error };
};

export default useGymMembers;
