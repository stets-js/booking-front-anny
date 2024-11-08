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
  
  // Стан для фільтра статусу
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setDataLoading(true);
    if (weekId) {
      dispatch(
        getTeamCalendarWeek2({
          weekId,
          status_id: statusFilter || null, // Передаємо статус, якщо він обраний
        })
      ).finally(() => setDataLoading(false));
    }
  }, [dispatch, weekId, statusFilter]); // Додаємо статус до залежностей

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  function setDayIndex(num) {
    setCurrentDayIndex(num);
  }

  return (
    <>
      <Header
        endpoints={[
          { text: "Users", path: path.users },
          { text: "Current Meetings", path: path.currentManagersTable },
          { text: "History", path: path.history },
          { text: "Team calendar", path: path.teamCalendar },
        ]}
      />
      <div className={styles.main__wrapper}>
        <BgWrapper top={-160} />
        <section className={styles.tableSection}>
          {dataLoading ? <div className={styles.loadingBackdrop}></div> : null}

          {/* Фільтр по статусу */}
          <div className={styles.statusFilter}>
            <label className={styles.selectLabel}>Filter by Status: </label>
            <select className={styles.id__select} onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
              <option value="">All</option>
              <option value="1">Chat</option>
              <option value="2">OM</option>
              <option value="3">Drop</option>
              <option value="4">Deptor</option>
              <option value="8">Awake</option>
            </select>
          </div>

          <DatePicker
            changeDateFn={getTeamCalendarWeek2}
            tableDate={tableDate}
            teamCalendar
          />

          {window.innerWidth > 1100 ? (
            <Days />
          ) : (
            <DaysPicker setDayIndex={setDayIndex} />
          )}

          {window.innerWidth > 1100 ? (
            <Table table={table} weekId={weekId} teamCalendar />
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
