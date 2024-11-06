import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getTable,
  getWeekId,
  getDate
} from "../../redux/manager/manager-selectors";
import { getTeamCalendarWeek2 } from "../../redux/manager/manager-operations";
import Header from "../../components/Header/Header";
import styles from "./TeamCalendar.module.scss";
import BgWrapper from "../../components/BgWrapper/BgWrapper";
import DatePicker from "../../components/DatePicker/DatePicker";
import Table from "../../components/Table/Table";
import DayTable from "../../components/DayTable/DayTable";
import Days from "../../components/Days/Days";
import DaysPicker from "../../components/DaysPicker/DaysPicker";
import "react-calendar/dist/Calendar.css";
import path from "../../helpers/routerPath";


export default function TeamCalendar() {
  const tableDate = useSelector(getDate);
  const table = useSelector(getTable);
  const weekId = useSelector(getWeekId);
  
  const dispatch = useDispatch();
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [selectedManager, setSelectedManager] = useState("All");
  const [teamsAndManagers, setTeamsAndManagers] = useState({});
  

  
  useEffect(() => {
    setDataLoading(true);
    if (weekId) {
      dispatch(
        getTeamCalendarWeek2({
          weekId,
          team: selectedTeam !== "All" ? selectedTeam : null,
          manager: selectedManager !== "All" ? selectedManager : null
        })
      )
        .then((response) => {
          if (response.payload.teamsAndManagers) {
            setTeamsAndManagers(response.payload.teamsAndManagers);
          }
          
        })
        .finally(() => setDataLoading(false));
    }
  }, [dispatch, weekId, selectedTeam, selectedManager]);


  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
    setSelectedManager("All");
  };

  const handleManagerChange = (e) => {
    setSelectedManager(e.target.value);
  };


  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  function setDayIndex(num) {
    setCurrentDayIndex(num);
  }

  return (
    <>
      <Header
        endpoints={[
          { text: "Users", path: path.users },
          // { text: "Current Meetings", path: path.currentManagers },
          { text: "History", path: path.history },
          { text: "Team calendar", path: path.teamCalendar },
        ]}
      />
      <div className={styles.main__wrapper}>
        <BgWrapper top={-160} />
        <section className={styles.tableSection}>
          {dataLoading ? <div className={styles.loadingBackdrop}></div> : null}
          <div className={styles.selectWrapper}>
            <p className={styles.selectLabel}>Team:</p>
            <select
              className={styles.teams__select}
              value={selectedTeam}
              onChange={handleTeamChange}
            >
              <option value="All">All</option>
              {Object.keys(teamsAndManagers).map((teamId) => (
                <option value={teamId} key={teamId}>{`Team ${teamId}`}</option>
              ))}
            </select>
            <p className={styles.selectLabel}>Manager:</p>
            <select
              className={styles.managers__select}
              value={selectedManager}
              onChange={handleManagerChange}
            >
              <option value="All">All</option>
              {selectedTeam !== "All" &&
                teamsAndManagers[selectedTeam] &&
                teamsAndManagers[selectedTeam].map((manager) => (
                  <option value={manager} key={manager}>
                    {manager}
                  </option>
                ))}
            </select>
            
          </div>
          <DatePicker
            changeDateFn={getTeamCalendarWeek2}
            tableDate={tableDate}
            teamCalendar
          />
          {window.innerWidth > 1100 ? (
            <Days  />
          ) : (
            <DaysPicker setDayIndex={setDayIndex} />
          )}
          {window.innerWidth > 1100 ? (
            <Table table={table}     weekId={weekId} teamCalendar />
          ) : (
            <DayTable
              weekId={weekId}
              table={table[currentDayIndex]}
              dayIndex={currentDayIndex}
              teamCalendar
            />
          )}
        </section>
      </div>
    </>
  );
}
