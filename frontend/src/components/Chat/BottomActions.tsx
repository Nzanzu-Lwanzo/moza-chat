import { Info, SignOut, User } from "@phosphor-icons/react";
import { memo } from "react";
import { useAuthenticate } from "../../hooks/useAuth";
import Loader from "../CrossApp/Loader";
import { formatUserName } from "../../utils/formatters";
import useAppStore from "../../stores/AppStore";
import { Link } from "react-router-dom";

const BottomActions = memo(() => {
  const { isLogginOut, logout } = useAuthenticate();
  const { auth } = useAppStore();

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
        <span className="username">{formatUserName(auth?.name)}</span>
      </div>
    </>
  );
});
export default BottomActions;
