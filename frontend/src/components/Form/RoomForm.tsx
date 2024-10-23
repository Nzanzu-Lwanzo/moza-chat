import { XCircle } from "@phosphor-icons/react";
import useAppStore from "../../stores/AppStore";
import { useState } from "react";
import { RoomType } from "../../typings/@types";
import { useCreateRoom } from "../../hooks/useRooms";
import Loader from "../CrossApp/Loader";
import { enqueueSnackbar } from "notistack";

const RoomForm = () => {
  const setModal = useAppStore((state) => state.setModal);
  const { mutate, isPending } = useCreateRoom();

  const [room, setRoom] = useState<
    Pick<RoomType, "name" | "description" | "private" | "restricted">
  >({ name: "", description: "", private: false, restricted: false });

  return (
    <form
      action="#"
      className="in__modal__form actual__form"
      onSubmit={(e) => {
        e.preventDefault();

        if (room.name.trim().length === 0)
          return enqueueSnackbar("Données incomplètes ou invalides !");

        mutate(room);
      }}
    >
      <div className="top__bar">
        <h2 className="title">Créer une room</h2>
        <button
          type="button"
          className="close"
          onClick={() => setModal(undefined)}
        >
          <XCircle size={25}></XCircle>
        </button>
      </div>

      <div className="inputs__container">
        <div className="wrap__inputs">
          <label htmlFor="name">Nom de la chat room*</label>
          <input
            type="text"
            id="name"
            placeholder="Nom de votre chat room"
            name="name"
            minLength={10}
            maxLength={64}
            required
            onChange={(e) =>
              setRoom((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div className="wrap__inputs">
          <label htmlFor="description">Description de la chat room</label>
          <textarea
            name="description"
            id="description"
            placeholder="Décrivez cette chat room"
            maxLength={256}
            onChange={(e) =>
              setRoom((prev) => ({ ...prev, description: e.target.value }))
            }
          ></textarea>
        </div>

        <div className="wrap__inputs__check">
          <input
            type="checkbox"
            name="restricted"
            id="restricted"
            onChange={(e) =>
              setRoom((prev) => ({ ...prev, restricted: e.target.checked }))
            }
          />
          <label htmlFor="restricted">
            <span>Restreindre cette room ?</span>
            <span className={`cell ${room.restricted && "chosen"}`}>
              restricted
            </span>
          </label>
        </div>
        <div className="wrap__inputs__check">
          <input
            type="checkbox"
            name="private"
            id="private"
            onChange={(e) =>
              setRoom((prev) => ({ ...prev, private: e.target.checked }))
            }
          />
          <label htmlFor="private">
            <span>Rendre cette room privée ?</span>{" "}
            <span className={`cell ${room.private && "chosen"}`}>private</span>
          </label>
        </div>

        <button type="submit" className="submit__button">
          {isPending ? (
            <Loader height={23} width={23}></Loader>
          ) : (
            "Valider et créer"
          )}
        </button>
      </div>
    </form>
  );
};

export default RoomForm;
