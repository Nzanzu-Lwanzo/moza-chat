import { Info, SignOut, User } from "@phosphor-icons/react";
import { memo } from "react";
import { useAuthenticate } from "../../hooks/useAuth";
import Loader from "../CrossApp/Loader";
import { formatUserName } from "../../utils/formatters";
import useAppStore from "../../stores/AppStore";
import { Link } from "react-router-dom";

const BottomActions = memo(() => {
  const { isLogginOut, logout } = useAuthenticate();
  const { auth, setModal } = useAppStore();

  return (
    <>
      <div className="bottom">
        <button type="button" className="log__out action" onClick={logout}>
          {isLogginOut ? (
            <Loader height={20} width={20} />
          ) : (
            <SignOut size={20} />
          )}
        </button>
        <button type="button" className="action">
          <User size={20} />
        </button>
        <Link to="/#about" type="button" className="action">
          <Info size={20} />
        </Link>
        <button
          type="button"
          className="new__room__btn"
          onClick={() => setModal("ROOM_FORM")}
        >
          Créez une chat room
        </button>
        <span className="username">{formatUserName(auth?.name)}</span>
      </div>
    </>
  );
});
export default BottomActions;
