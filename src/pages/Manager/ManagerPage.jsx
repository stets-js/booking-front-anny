import React, { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import path from "../../helpers/routerPath";
import { getManagerById } from "../../helpers/manager/manager";

export default function ManagerPage() {
  const { managerId } = useParams();
  const [managerName, setManagerName] = useState("");
  useEffect(() => {
    getManagerById(+managerId).then((data) => {
      setManagerName(data.name);
    });
  }, [managerId]);
  return (
    <>
      <Header
        endpoints={[
          { text: "Planning", path: path.planning },
        ]}
        user={{ name: managerName, role: "Manager" }}
      />
      <Outlet urlManager_Id={managerId} />
    </>
  );
}
