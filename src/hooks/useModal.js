import { useDispatch } from "react-redux";
import { setModalsField } from "../redux/redux";

export const useModal = () => {

  const dispatch = useDispatch();

  const showModal = async (content) => {
    dispatch(setModalsField({ key: "isMasterModalOpen", value: true }));
    dispatch(setModalsField({ key: "modalContent", value: content }));
  };

  const hideModal = async () => {
    dispatch(setModalsField({ key: "isMasterModalOpen", value: false }));
    dispatch(setModalsField({ key: "modalContent", value: "login" }));
  };

  return {
    showModal,
    hideModal
  };
};
