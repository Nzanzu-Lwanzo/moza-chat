import { InfinitySpin } from "react-loader-spinner";
import { COLOR_SCHEMA } from "../../utils/constants";
import { PropsWithChildren } from "react";

const WholeElementLoader = ({
  message,
  bg
}: PropsWithChildren<{ message?: string,bg?:"dark" | "light" }>) => {
  return (
    <div className="whole__element__loader">
      <InfinitySpin color={COLOR_SCHEMA.accent}></InfinitySpin>
      <span className={`message ${bg}`}>{message}</span>
    </div>
  );
};

export default WholeElementLoader;
