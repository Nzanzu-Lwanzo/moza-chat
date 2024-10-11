import React from "react";

interface Props {
  message?: string;
  action?(e: React.PointerEvent<HTMLButtonElement>): void;
  btnLabel?: string;
  bg?: "dark" | "light";
}

const Placeholder = ({
  children,
  message,
  bg,
}: React.PropsWithChildren<Props>) => {
  return (
    <div className="illustration__placeholder">
      <div>{children}</div>
      {message && <span className={`message ${bg || "dark"}`}>{message}</span>}
    </div>
  );
};

export default Placeholder;
