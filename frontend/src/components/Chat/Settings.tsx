import { XCircle } from "@phosphor-icons/react";
import useAppStore from "../../stores/AppStore";
import { usePushNotifications } from "../../utils/notifications";

const Settings = () => {
  const { setModal } = useAppStore();
  const requestPushNotifications = usePushNotifications();

  return (
    <div className="actual__form">
      <div className="top__bar">
        <h2 className="title">Paramètres</h2>
        <button
          type="button"
          className="close"
          onClick={() => setModal(undefined)}
        >
          <XCircle size={25}></XCircle>
        </button>
      </div>

      <div className="system settings__card">
        <h2>Système</h2>
        <div className="list__btns">
          <div className="wrap__inputs__check">
            <input type="checkbox" name="restricted" id="restricted" />
            <label htmlFor="restricted">
              <span>Jouer un son à la réception d'un message ?</span>
            </label>
          </div>
          <button
            type="button"
            className="btn"
            onClick={requestPushNotifications}
          >
            Cliquez pour autoriser les notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
