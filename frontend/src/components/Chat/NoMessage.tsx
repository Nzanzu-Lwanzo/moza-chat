import NoMessages from "../../assets/illustrations/NoMessages";
import Placeholder from "../CrossApp/Placeholder";

const NoMessage = () => {
  return (
    <div className="no__message">
      <Placeholder message="Oups ! Cette Chat Room est vide !">
        <NoMessages></NoMessages>
      </Placeholder>
    </div>
  );
};

export default NoMessage;
