import { InfinitySpin } from "react-loader-spinner";
import { COLOR_SCHEMA } from "../../utils/constants";
import React, { PropsWithChildren } from "react";

const WholeElementLoader = ({
  message,
  bg,
  loader,
}: PropsWithChildren<{
  message?: string;
  bg?: "dark" | "light";
  loader?: React.ReactElement | undefined;
}>) => {
  return (
    <div className="whole__element__loader">
      {loader ? (
        loader
      ) : (
        <InfinitySpin color={COLOR_SCHEMA.accent}></InfinitySpin>
      )}
      <span className={`message ${bg}`}>{message}</span>
    </div>
  );
};

export default WholeElementLoader;
