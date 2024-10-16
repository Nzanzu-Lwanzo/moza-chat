import React from "react";

interface Props {
  message?: string;
  action?(e: React.PointerEvent<HTMLButtonElement>): void;
  btnLabel?: string;
  bg?: "dark" | "light";
  style? : React.CSSProperties;
}

const Placeholder = ({
  children,
  message,
  bg,
  style
}: React.PropsWithChildren<Props>) => {
  return (
    <div className="illustration__placeholder" style={style}>
      <div>{children}</div>
      {message && <span className={`message ${bg || "dark"}`}>{message}</span>}
    </div>
  );
};

export default Placeholder;
