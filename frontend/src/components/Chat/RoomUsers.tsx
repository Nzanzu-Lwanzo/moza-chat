import useChatStore from "../../stores/ChatStore";
import { UserType } from "../../utils/@types";
import { COLOR_SCHEMA } from "../../utils/constants";
import Avatar from "boring-avatars";
import { useState } from "react";
import { useUpdateRoom } from "../../hooks/useRooms";
import Loader from "../CrossApp/Loader";
import { useHasRoomAdminCreds } from "../../hooks/useValidate";
import useAppStore from "../../stores/AppStore";

const RoomUsers = () => {
  const currentRoom = useChatStore((state) => state.currentRoom);
  const auth = useAppStore((state) => state.auth);
  const [selectedUsers, selectUser] = useState<string[]>([]);
  const { mutate, isPending } = useUpdateRoom({
    onSuccess() {
      selectUser([]);
    },
  });

  let hasAdminCreds = useHasRoomAdminCreds(auth!, currentRoom!);

  return (
    <>
      <div className="users__topbar">
        <h2>Tous les participants</h2>
        <div className="actions">
          {selectedUsers.length !== 0 && (
            <button
              type="button"
              className="normal__button"
              onClick={() => {
                mutate({
                  data: selectedUsers,
                  rid: currentRoom?._id,
                  query: "rmp",
                });
              }}
            >
              {isPending ? <Loader height={15} width={15} /> : "Retirer"}
            </button>
          )}
        </div>
      </div>
      <ul>
        {currentRoom?.participants?.map((participant) => {
          let user = participant as UserType;

          return (
            <li key={`${user._id}${user.name}`}>
              <div className="user">
                <Avatar size={25} name={user.name} />
                <span>{user.name}</span>
                {user._id === currentRoom.initiated_by?._id && (
                  <span className="cell">Administrateur</span>
                )}
              </div>

              {hasAdminCreds && auth?._id !== user._id && (
                <div className="actions">
                  {useHasRoomAdminCreds(user, currentRoom) && (
                    <input
                      type="checkbox"
                      style={{ accentColor: COLOR_SCHEMA.accent }}
                      value={user._id}
                      name="input__select__user"
                      id="input__select__user"
                      onChange={(e) => {
                        let { checked, value } = e.target;

                        if (checked) {
                          selectUser((prev) => [...prev, value]);
                        } else {
                          selectUser((prev) =>
                            prev.filter((id) => id !== value)
                          );
                        }
                      }}
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RoomUsers;
