import useChatStore from "../../stores/ChatStore";
import { UserType } from "../../utils/@types";
import { ArrowsCounterClockwise } from "@phosphor-icons/react";
import { COLOR_SCHEMA } from "../../utils/constants";
import Avatar from "boring-avatars";
import { useState } from "react";
import { useUpdateRoom } from "../../hooks/useRooms";
import Loader from "../CrossApp/Loader";
import { useHasCredentialsOnRoom } from "../../hooks/useValidate";

const RoomUsers = () => {
  const currentRoom = useChatStore((state) => state.currentRoom);
  let hasCreds = useHasCredentialsOnRoom();
  const [selectedUsers, selectUser] = useState<string[]>([]);
  const { mutate, isPending } = useUpdateRoom();

  return (
    <>
      <div className="users__topbar">
        <h2>Tous les participants</h2>
        <div className="actions">
          <button type="button" className="icon__btn__on__dark">
            <ArrowsCounterClockwise size={20} fill={COLOR_SCHEMA.whity} />
          </button>
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
            <li key={user._id}>
              <div className="user">
                <Avatar size={25} name={user.name} />
                <span>
                  {user.name} [ {user.email} ]
                </span>
              </div>

              {hasCreds && (
                <div className="actions">
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
                        selectUser((prev) => prev.filter((id) => id !== value));
                      }
                    }}
                  />
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