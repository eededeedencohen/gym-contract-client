import { useGymMembers as useGymMemberContext } from "../context/GymMemberContext";

const useGymMembers = () => {
  const { loading, error, members, addMember, editMember, removeMember } =
    useGymMemberContext();
  return { loading, error, members, addMember, editMember, removeMember };
};
export default useGymMembers;
