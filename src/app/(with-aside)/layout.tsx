import SideMenu from "@/components/SideMenu";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SideMenu />
      <div className="page_section">{children}</div>
    </>
  );
};

export default layout;
