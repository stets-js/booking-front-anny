import React from "react";
import { useState } from "react";
import path from "../../helpers/routerPath";
import Header from "../../components/Header/Header";
import CurrentMeetingsStatusDefinition from "../../components/CurrentMeetingsStatusDefinition/CurrentMeetingsStatusDefinition";
import DayDatePicker from "../../components/DayDatePicker/DayDatePicker";
import DayTimePicker from "../../components/DayTimePicker/DayTimePicker";
import MeetingsTable from "../../components/MeetingsTable/MeetingsTable";
import SortByBox from "../../components/SortByBox/SortByBox";
import mainstyles from "../SuperAdmin/SuperAdminPage.module.scss";
import { TailSpin } from "react-loader-spinner";

import {
  getCurrentAppointments,
  getWeekId2,
} from "../../helpers/manager/manager";

function CurrentMeetingsPageList() {
  const [currentSortStatus, setcurrentSortStatus] = useState(false);
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);
  const [currentSelectedSortStatus, setcurrentSelectedSortStatus] = useState(false);
  const [currentSelectedStars, setCurrentSelectedStars] = useState(false);
  const styles = {
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: "50px",
    marginBottom: "300px",
    fontSize: "30px",
  };
  const isThatPhone = {
    isPhone: window.innerWidth <= 700,
  };
  const dividerStyles = {
    display: "flex",
    marginRight: "auto",
    marginLeft: "auto",
    maxWidth: "480px",
    width: "100%",
    justifyContent: "space-between",
  };
  const dividerStylesAdpt = {
    display: "flex",
    flexDirection: "column",
    marginRight: "auto",
    marginLeft: "auto",
    width: "100%",
    maxWidth: "480px",
    justifyContent: "space-between",
  };

  const tableDate = new Date().toString();
  const [tableTime, setTableTime] = useState(8);

  const [currentTableData, setCurrentTableData] = useState(null);
  const [isRenderTableAvailable, setIsRenderTableAvailable] = useState(false);
  const [cureentTableDataWeekId, setCureentTableDataWeekId] = useState(0);
  const [date, setDate] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

    async function getTableData(day, month, year) {
    const resManagers = await getCurrentAppointments(`${day}.${month}.${year}`).then(
      (res) => res.data
    );
    const filteredManagers = selectedTeam === "All"
    ? resManagers
    : resManagers.filter((item) => item.team === selectedTeam);
    setDate(`${day}.${month}.${year}`);
    const resWeekId = await getWeekId2(day, month, year).then((res) => res);
    setCurrentTableData(filteredManagers);
    setIsRenderTableAvailable(true);
    setCureentTableDataWeekId(resWeekId);
  }

  return (
    <>
      <Header
        endpoints={[
          { text: "List View", path: path.currentManagersList },
          { text: "Table View", path: path.currentManagersTable }
        ]}
      />
      <div style={isThatPhone.isPhone ? dividerStylesAdpt : dividerStyles}>
        {" "}
        <DayDatePicker tableDate={tableDate} changeDateFn={getTableData} selectedTeam={selectedTeam} setIsLoading={setIsLoading} />
        <DayTimePicker tableTime={tableTime} setTableTime={setTableTime} selectedTeam={selectedTeam} />
      </div>
      <SortByBox
        sortText={"Status"}
        sortTextFunc={setcurrentSortStatus}
        sortMan={"Selected"}
        sortMangFunc={setcurrentSelectedSortStatus}
        // sortStars={"Stars"}
        // sortStarsFunc={setCurrentSelectedStars}
      />
      {isRenderTableAvailable ? (
        <>
        <select
                    className={mainstyles.managers__select}
                    value={selectedTeam}
                    onChange={(e) => {
                      setSelectedTeam(e.target.value);
          
                    }}
                  >
                    <option value="All">All</option>
                    <option value="Chat">Chat</option>
                    <option value="OM">OM</option>
                    <option value="Drop">Drop</option>
                    <option value="Deptor">Deptor</option>
                    <option value="Awake">Awake</option>
                  </select>
                  
          <MeetingsTable
          isLoading={isLoading}
          isListView={true}
          isStatusSorted={currentSortStatus}
          tableTime={tableTime}
          weekId={cureentTableDataWeekId.id}
          dayIndex={cureentTableDataWeekId.day_index}
          selectedManagerIds={selectedManagerIds}
          setSelectedManagerIds={setSelectedManagerIds}
          currentSelectedSortStatus={currentSelectedSortStatus}
          currentSelectedStars={currentSelectedStars}
          table={currentTableData}
        />
        </>
      ) : (
        <div style={styles}>loading</div>
      )}
    </>
  );
}

export default CurrentMeetingsPageList;
