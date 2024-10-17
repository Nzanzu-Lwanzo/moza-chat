import { PaperPlane } from "@phosphor-icons/react";
import { COLOR_SCHEMA } from "../../utils/constants";
import useAppStore from "../../stores/AppStore";
import { useState } from "react";
import { XCircle } from "@phosphor-icons/react";

const MessageForm = () => {
  const auth = useAppStore((state) => state.auth);
  let [focus, setFocus] = useState(false);

  return (
    <div className={`messagery__form ${focus ? "input__has__focus" : ""}`}>
      <div className="container">
        <textarea
          name="message"
          className="input"
          placeholder={`Vous écrivez en tant que ${auth?.name}`}
          onFocus={() => setFocus(true)}
        ></textarea>
        <button type="button" className="btn">
          <PaperPlane fill={COLOR_SCHEMA.secondDark} size={25} />
        </button>
        <button type="button" className="close" onClick={() => setFocus(false)}>
          <XCircle size={25} fill="#FFF"></XCircle>
        </button>
      </div>
    </div>
  );
};

export default MessageForm;
