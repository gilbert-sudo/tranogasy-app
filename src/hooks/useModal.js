import { useDispatch } from "react-redux";
import { setModalsField } from "../redux/redux";

export const useModal = () => {

  const dispatch = useDispatch();

  const showModal = async (content) => {
    dispatch(setModalsField({ key: "isMasterModalOpen", value: true }));
    dispatch(setModalsField({ key: "masterModalContent", value: content }));
  };

  const setCodeConfirmer = async (value) => {
    dispatch(setModalsField({ key: "codeConfirmer", value: value }));
  };

  const hideModal = async () => {
    dispatch(setModalsField({ key: "isMasterModalOpen", value: false }));
    dispatch(setModalsField({ key: "masterModalContent", value: "login" }));
  };

  return {
    showModal,
    setCodeConfirmer,
    hideModal
  };
};
