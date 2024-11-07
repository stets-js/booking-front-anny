import React from "react";
import path from "../../helpers/routerPath";
import Header from "../../components/Header/Header";
import { Outlet } from "react-router-dom";

const History = () => {
  return (
    <>
      <Header
        endpoints={[
          { text: "Users", path: path.users },
          {text:"Login history", path: path.authorization},
          {text:"Slot history", path: path.slotHistory},
          {text:"Current Meetings", path: path.currentManagersTable},
          {text:"Google sheets", path: path.googleSheets},
        ]}
      />
    
      <Outlet />
    </>
  );
};

export default History;
