import { XCircle } from "@phosphor-icons/react";
import { COLOR_SCHEMA } from "../../utils/constants";
import { PropsWithChildren, useState } from "react";
import { RoomType } from "../../typings/@types";
import useChatStore from "../../stores/ChatStore";
import Loader from "../CrossApp/Loader";
import { useUpdateRoom } from "../../hooks/useRooms";
import { enqueueSnackbar } from "notistack";
import { useHasRoomAdminCreds } from "../../hooks/useValidate";
import useAppStore from "../../stores/AppStore";
import { convert } from "html-to-text";

interface Props {
  hideForm(): void;
}

const EditRoomForm = ({ hideForm }: PropsWithChildren<Props>) => {
  const currentRoom = useChatStore((state) => state.currentRoom);
  const auth = useAppStore((state) => state.auth);

  const [room, setRoom] = useState<RoomType>({
    ...currentRoom!,
    description: convert(currentRoom?.description || ""),
  });
  const { mutate, isPending } = useUpdateRoom({
    onSuccess() {
      hideForm();
    },

    onError() {},
  });

  let hasRoomAdminCreds = useHasRoomAdminCreds(auth!, currentRoom!);

  return (
    <div className="edit__room__form">
      <div className="users__topbar">
        <h2>Editer la Room</h2>
        <div className="actions">
          <button
            type="button"
            className="icon__btn__on__dark"
            onClick={hideForm}
          >
            <XCircle size={20} fill={COLOR_SCHEMA.whity} />
          </button>
        </div>
      </div>

      <form
        action="#"
        className="actual__form"
        onSubmit={(e) => {
          e.preventDefault();

          if (room.name.trim().length === 0)
            return enqueueSnackbar("Données incomplètes ou invalides !");

          mutate({ data: room, rid: currentRoom?._id, query: "gen" });
        }}
      >
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
              value={room.name}
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
              value={room.description}
              onChange={(e) =>
                setRoom((prev) => ({ ...prev, description: e.target.value }))
              }
            ></textarea>
          </div>

          {hasRoomAdminCreds && (
            <>
              <div className="wrap__inputs__check">
                <input
                  type="checkbox"
                  name="restricted"
                  id="restricted"
                  checked={room.restricted}
                  onChange={(e) =>
                    setRoom((prev) => ({
                      ...prev,
                      restricted: e.target.checked,
                    }))
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
                  checked={room.private}
                  onChange={(e) =>
                    setRoom((prev) => ({ ...prev, private: e.target.checked }))
                  }
                />
                <label htmlFor="private">
                  <span>Rendre cette room privée ?</span>{" "}
                  <span className={`cell ${room.private && "chosen"}`}>
                    private
                  </span>
                </label>
              </div>
            </>
          )}

          <button type="submit" className="submit__button">
            {isPending ? (
              <Loader height={20} width={20}></Loader>
            ) : (
              "Mettre à jour"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoomForm;
