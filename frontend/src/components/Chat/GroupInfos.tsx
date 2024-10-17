import {
  MarkerCircle,
  Trash,
  ArrowLeft,
  Info,
  UserPlus,
  Users,
} from "@phosphor-icons/react";
import { COLOR_SCHEMA } from "../../utils/constants";
import useChatStore from "../../stores/ChatStore";
import { useReducer, useState } from "react";
import { formatDate } from "../../utils/formatters";
import AllUsers from "./AllUsers";
import RoomUsers from "./RoomUsers";
import EditRoomForm from "../Form/EditRoomForm";
import { useHasCredentialsOnRoom } from "../../hooks/useValidate";
import { useDeleteRoom } from "../../hooks/useRooms";
import Loader from "../CrossApp/Loader";

type ActionType = "all_users" | "room_users" | "edit_form";

interface Actions {
  section: ActionType;
}

const reducer = (state: ActionType, action: Actions) => {
  switch (action.section) {
    case "all_users":
      return "all_users";
    case "room_users":
      return "room_users";
    case "edit_form":
      return "edit_form";
  }
};

const GroupInfos = () => {
  const { setCurrentMainPanel, currentRoom } = useChatStore();
  const [showDetails, setShowDetails] = useState(true);
  const [currentSection, switchToSection] = useReducer(reducer, "room_users");
  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom({
    onSuccess() {
      // RESET ALL THE LOCAL STATES
      setCurrentMainPanel("MESSAGES");
      setShowDetails(true);
      switchToSection({ section: "room_users" });
    },
  });

  let hasCreds = useHasCredentialsOnRoom();

  return (
    <div className="room__infos__panel">
      <div className="top__and__actions">
        <div>
          <button
            type="button"
            className="icon__btn__on__dark"
            onClick={() => setCurrentMainPanel("MESSAGES")}
          >
            <ArrowLeft size={20} fill={COLOR_SCHEMA.whity} />
          </button>
        </div>
        <div className="room__actions">
          {/* Only show the button to list users 
              and the one to show room details
              if we're not in the editForm section */}

          {currentSection !== "edit_form" && (
            <>
              <button
                type="button"
                className="icon__btn__on__dark"
                onClick={() => setShowDetails((prev) => !prev)}
              >
                <Info size={20} fill={COLOR_SCHEMA.whity} />
              </button>
              <button
                type="button"
                className="icon__btn__on__dark"
                onClick={() =>
                  switchToSection({
                    section:
                      currentSection === "all_users"
                        ? "room_users"
                        : "all_users",
                  })
                }
              >
                {currentSection === "room_users" ? (
                  <UserPlus size={20} fill={COLOR_SCHEMA.whity} />
                ) : currentSection === "all_users" ? (
                  <Users size={20} fill={COLOR_SCHEMA.whity} />
                ) : null}
              </button>
            </>
          )}

          {/* Only the iniator of the room can perform theses actions the room if the room is restricted */}
          {hasCreds && (
            <>
              <button
                type="button"
                className="icon__btn__on__dark"
                onClick={() => {
                  deleteRoom(currentRoom?._id);
                }}
              >
                {isDeleting ? (
                  <Loader
                    height={18}
                    width={18}
                    trackColor={COLOR_SCHEMA.accent}
                    ringColor={COLOR_SCHEMA.whity}
                  />
                ) : (
                  <Trash size={20} fill={COLOR_SCHEMA.whity} />
                )}
              </button>
              <button
                type="button"
                className="icon__btn__on__dark"
                onClick={() => {
                  switchToSection({ section: "edit_form" });
                  setShowDetails(true);
                }}
              >
                <MarkerCircle size={20} fill={COLOR_SCHEMA.whity} />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="content">
        {/* Only show the details about the room if we're not in the editForm section */}

        {showDetails && currentSection !== "edit_form" && (
          <div className="infos">
            <h2>{currentRoom?.name}</h2>
            {currentRoom?.description ? (
              <p>{currentRoom?.description}</p>
            ) : (
              <p>
                L'auteur de cette Chat Room n'a fourni aucune description ...
              </p>
            )}
            <div className="tags">
              {currentRoom?.restricted && (
                <span className="tag">#Restreinte</span>
              )}
              {currentRoom?.private && <span className="tag">#Privée</span>}
              <span className="tag">{formatDate(currentRoom?.createdAt)}</span>
              <span className="tag">{currentRoom?.initiated_by?.name}</span>
              <span className="tag">
                {currentRoom?.participants?.length || "Null"} participants
              </span>
            </div>
          </div>
        )}

        <div className="users">
          {currentSection === "all_users" ? (
            <AllUsers />
          ) : currentSection === "room_users" ? (
            <RoomUsers />
          ) : currentSection === "edit_form" ? (
            <EditRoomForm
              hideForm={() => switchToSection({ section: "room_users" })}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GroupInfos;
