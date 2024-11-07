import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../SuperAdmin/SuperAdminPage.module.scss";
import path from "../../helpers/routerPath";
import Header from "../../components/Header/Header";
import CurrentMeetingsStatusDefinition from "../../components/CurrentMeetingsStatusDefinition/CurrentMeetingsStatusDefinition";
import DayDatePicker from "../../components/DayDatePicker/DayDatePicker";
import MeetingsTable from "../../components/MeetingsTable/MeetingsTable";
import SortByBox from "../../components/SortByBox/SortByBox";

import {
  getCurrentAppointments,
  getWeekId2,
} from "../../helpers/manager/manager";
import CrmLinks from "../../components/CrmLinks/CrmLinks";

import RadioButton from "../../components/RadioButton/RadioButton";
import { changeTypeSelection } from "../../redux/manager/manager-operations";
import { getTypeSelection } from "../../redux/manager/manager-selectors";
import {
  changeStatusSlot,
  setManagerError,
  setManagerLoading,
} from "../../redux/manager/manager-operations";
import { updateSlot } from "../../helpers/week/week";
import SwapManagersComponent from "./SwapManagers";
import { TailSpin } from "react-loader-spinner";

function CurrentMeetingsPageTable() {
  const [currentSelectedSortStatus, setcurrentSelectedSortStatus] = useState(false);
  const [currentSelectedStars, setCurrentSelectedStars] = useState(false);
  const [hideFreeSlots, setHideFreeSlots] = useState(false);
  const [selectedManagerIds, setSelectedManagerIds] = useState([]);
  const isThatPhone = {
    isPhone: window.innerWidth <= 700,
  };

  const tableDate = new Date().toString();

  const [currentTableData, setCurrentTableData] = useState(null);
  const [isRenderTableAvailable, setIsRenderTableAvailable] = useState(false);
  const [cureentTableDataWeekId, setCureentTableDataWeekId] = useState(0);
  const [date, setDate] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  const sortManagers = (managers) => {
    // Сортування по пріоритету
    return managers.sort((a, b) => {
      const aName = a.manager_name.toLowerCase();
      const bName = b.manager_name.toLowerCase();
  
      // Перевірка на наявність "overbooking"
      const aHasOverbooking = aName.includes("overbooking");
      const bHasOverbooking = bName.includes("overbooking");
  
      // Якщо a має "overbooking", а b не має - a має бути перед b
      if (aHasOverbooking && !bHasOverbooking) {
        return -1;
      }
      // Якщо b має "overbooking", а a не має - b має бути перед a
      if (!aHasOverbooking && bHasOverbooking) {
        return 1;
      }
  
      // Якщо обидва мають або не мають "overbooking", сортуємо по алфавіту
      return aName.localeCompare(bName);
    });
  };

  async function getTableData(day, month, year) {
    const resManagers = await getCurrentAppointments(`${day}.${month}.${year}`).then(res => res.data);
  
    // Фільтрація по команді
    const filteredManagers = selectedTeam === "All"
      ? sortManagers(resManagers)
      : sortManagers(resManagers.filter(item => item.team === selectedTeam));
  
        
    setDate(`${day}.${month}.${year}`);
    const resWeekId = await getWeekId2(day, month, year).then(res => res);
    setCurrentTableData(filteredManagers);
    setCureentTableDataWeekId(resWeekId);
    setIsRenderTableAvailable(true);
  }
  
  async function getNewTableData(day, month, year) {
    const resManagers = await getCurrentAppointments(`${day}.${month}.${year}`).then(res => res.data);
  
    // Фільтрація по команді
    const filteredManagers = selectedTeam === "All"
      ? sortManagers(resManagers)
      : sortManagers(resManagers.filter(item => item.team === selectedTeam));
  
      
    setCurrentTableData(filteredManagers);
    setIsRenderTableAvailable(true);
  }

  const dispatch = useDispatch();
  const buttonType = useSelector(getTypeSelection);
  const onCheckedButton = (event) => {
    dispatch(changeTypeSelection(event.target.name));
  };

  return (
    <>
      <Header
        endpoints={[
          // { text: "List View", path: path.currentManagersList },
          { text: "Users", path: path.users },
          { text: "Table View", path: path.currentManagersTable }
        ]}
      />
      {/* <CurrentMeetingsStatusDefinition /> */}
      <div className={styles.wrapperControlButtons}>
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonGreenFocus}
          styleColor={styles.controlButtonGreen}
          onChangeType={onCheckedButton}
          title="Working time"
        />
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonOrangeFocus}
          styleColor={styles.controlButtonOrange}
          onChangeType={onCheckedButton}
          title="Working second"
        />
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonGrayFocus}
          styleColor={styles.controlButtonGray}
          onChangeType={onCheckedButton}
          title="Free"
        />
      </div>
      <DayDatePicker
        tableDate={tableDate}
        changeDateFn={getTableData}
        selectedTeam={selectedTeam}
        setIsLoading={setIsLoading}
      />
      <SortByBox
        sortText={"Selected"}
        sortTextFunc={setcurrentSelectedSortStatus}
        // sortStars={"Stars"}
        // sortStarsFunc={setCurrentSelectedStars}
        sortFree={"Hide Free slots"}
        sortFreeFunc={setHideFreeSlots}
      />
  
      {!isThatPhone.isPhone ? (
        isRenderTableAvailable ? (
          <>
            <select
              className={styles.managers__select}
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
              isTableView={true}
              isListView={false}
              weekId={cureentTableDataWeekId.id}
              dayIndex={cureentTableDataWeekId.day_index}
              table={currentTableData}
              selectedManagerIds={selectedManagerIds}
              setSelectedManagerIds={setSelectedManagerIds}
              currentSelectedSortStatus={currentSelectedSortStatus}
              currentSelectedStarsTable={currentSelectedStars}
              hideFreeSlots={hideFreeSlots}
              date={date}
              getNewTableData={getNewTableData}
            />
  
          </>
        ) : (
          <div className={styles.blank}>loading...</div>
        )
      ) : (
        <div className={styles.blank}>this table is for PC use only</div>
      )}
    </>
  );
}

export default CurrentMeetingsPageTable;
