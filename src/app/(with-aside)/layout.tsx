import SideMenu from "@/components/SideMenu";
import React from "react";

const layout = ({ children }) => {
  return (
    <>
      <SideMenu />
      <div className="page_section">{children}</div>
    </>
  );
};

export default layout;
