import React from "react";
import useAppStore from "../../stores/AppStore";
import type { ModalType } from "../../stores/AppStore";
import RoomForm from "../Form/RoomForm";
import Settings from "../Chat/Settings";

const MAP_MODAL_ELT: Record<NonNullable<ModalType>, React.ReactElement> = {
  ROOM_FORM: <RoomForm />,
  PROFILE: <RoomForm />,
  SETTINGS: <Settings />,
};

const Modal = () => {
  const modal = useAppStore((state) => state.modal);

  return (
    <div className={`modal__panel ${modal ? "show" : null}`}>
      <div className="card">{modal && MAP_MODAL_ELT[modal]}</div>
    </div>
  );
};

export default Modal;
