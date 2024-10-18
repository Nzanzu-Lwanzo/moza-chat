import { UserType } from "../../utils/@types";
import Avatar from "boring-avatars";
import { ArrowsCounterClockwise } from "@phosphor-icons/react";
import { COLOR_SCHEMA } from "../../utils/constants";
import useChatStore from "../../stores/ChatStore";
import AccessDenied from "../../assets/illustrations/AccessDenied";
import Placeholder from "../CrossApp/Placeholder";
import { useMemo, useState } from "react";
import { useUpdateRoom } from "../../hooks/useRooms";
import WholeElementLoader from "../CrossApp/WholeElementLoader";
import Loader from "../CrossApp/Loader";
import { useHasCredentialsOnRoom } from "../../hooks/useValidate";
import { useGetAllUsers } from "../../hooks/useUsers";

const AllUsers = () => {
  const { allUsers: users, currentRoom } = useChatStore();
  const [selectedUsers, selectUser] = useState<string[]>([]);
  const { requestAll, status: getAllStatus } = useGetAllUsers();

  const usersToAdd = useMemo(() => {
    // Liste des participants : peut être une liste de strings ou une liste d'objets
    // Mais la chance que ce soit une liste d'objets est de 70%
    const participants = currentRoom?.participants;

    if (!participants) return users;

    const notAddedYet = users?.filter((user) => {
      return !participants
        .map((participant) => (participant as UserType)._id)
        .includes(user._id);
    });

    return notAddedYet;
  }, [users, currentRoom]);

  const { mutate, isPending } = useUpdateRoom({
    onSuccess() {
      selectUser([]);
    },
  });

  let hasCreds = useHasCredentialsOnRoom();
  let isRequestingAll = getAllStatus === "pending";

  return (
    <>
      {hasCreds ? (
        <>
          {!isPending && !isRequestingAll ? (
            <>
              <div className="users__topbar">
                <h2>Ajouter des utilisateurs</h2>
                <div className="actions">
                  <button
                    type="button"
                    className="icon__btn__on__dark"
                    onClick={requestAll}
                  >
                    {isRequestingAll ? (
                      <Loader
                        height={15}
                        width={15}
                        trackColor={COLOR_SCHEMA.accent}
                        ringColor={COLOR_SCHEMA.whity}
                      />
                    ) : (
                      <ArrowsCounterClockwise
                        size={20}
                        fill={COLOR_SCHEMA.whity}
                      />
                    )}
                  </button>
                  {selectedUsers.length !== 0 && (
                    <button
                      type="button"
                      className="normal__button"
                      onClick={() => {
                        mutate({
                          data: selectedUsers,
                          rid: currentRoom?._id,
                          query: "adp",
                        });
                      }}
                    >
                      {isPending ? (
                        <Loader height={15} width={15} />
                      ) : (
                        "Ajouter"
                      )}
                    </button>
                  )}
                </div>
              </div>
              <ul>
                {(usersToAdd as UserType[])?.map((user) => {
                  return (
                    <li key={user._id}>
                      <div className="user">
                        <Avatar size={25} name={user.name} />
                        <span>
                          {user.name} [ {user.email} ]
                        </span>
                      </div>
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
                              selectUser((prev) =>
                                prev.filter((id) => id !== value)
                              );
                            }
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <WholeElementLoader message="Nous mettons cette room à jour ! Merci de patienter !" />
          )}
        </>
      ) : (
        <Placeholder
          style={{ marginTop: "3rem" }}
          message="Cette room est restreinte ! Seul l'administrateur peut ajouter des participants ! !"
        >
          <AccessDenied />
        </Placeholder>
      )}
    </>
  );
};

export default AllUsers;
