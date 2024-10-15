import React from "react";
import useAppStore from "../../stores/useAppStore";
import type { ModalType } from "../../stores/useAppStore";
import RoomForm from "../Form/RoomForm";

const MAP_MODAL_ELT: Record<NonNullable<ModalType>, React.ReactElement> = {
  ROOM_FORM: <RoomForm />,
  PROFILE: <RoomForm />,
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
