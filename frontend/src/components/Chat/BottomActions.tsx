import { Info, SignOut, User } from "@phosphor-icons/react";
import { memo } from "react";
import { useAuthenticate } from "../../hooks/useAuth";
import Loader from "../CrossApp/Loader";

const BottomActions = memo(() => {
  const { isLogginOut, logout } = useAuthenticate();

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
        <button type="button" className="action">
          <Info size={20} />
        </button>
      </div>
    </>
  );
});
export default BottomActions;
