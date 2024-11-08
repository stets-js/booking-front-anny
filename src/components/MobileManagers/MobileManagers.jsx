import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../../helpers/user/user";
import styles from "./MobileManagers.module.scss";
import ChangeUser from "../modals/ChangeUser/ChangeUser";
import { Fade } from "react-awesome-reveal";
import { getManagers } from "../../helpers/manager/manager";

export default function MobileManagers({ isOpenModal, isAdmin, data }) {
  const [selectedRole, setSelectedRole] = useState("Administrator");
  const [managers, setManagers] = useState(data);
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [slack, setSlack] = useState("");
  const [team, setTeam] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newRole, setRole] = useState("");
  const [newLogin, setLogin] = useState("");
  const [zohoId, setZohoId] = useState("");
  const [slackId, setSlackId] = useState("");
  const [password, setPassword] = useState("");

  const usersArray = [
    
    {
      text: "Managers",
      role: "Manager",
      roleId: 2,
      isAdmin: false,
      isManager: true,
    },
   
  ];

  const getUsersData = async (teamNum) => {
    const arr = [];
    const res = await getUsers().then((res) =>
      res.users.filter((item) => item.role_id > 2)
    );
    const resManagers = await getManagers().then((res) => res.data);
    resManagers.map((item) => (item.role_id = 2));
    
    const filteredManagers = teamNum === "All"
    ? resManagers
    : resManagers.filter((item) => item.team === teamNum);
    const sortedManagers = filteredManagers.sort((a, b) => a.name.localeCompare(b.name));
    arr.push(...res);
    arr.push(...sortedManagers);
  
    return setManagers(arr);
  };

  useEffect(() => {
    getUsersData(selectedTeam);
  }, [isOpen, isOpenModal, selectedTeam]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <>
      <select
        className={styles.roles__select}
        value={selectedRole}
        onChange={handleRoleChange}
      >
        {usersArray.map((role) => (
          <option key={role.role} value={role.role}>
            {role.text}
          </option>
        ))}
      </select>

      {managers?.length > 0 && (
        <React.Fragment>
          <div className={styles.wrapper}>
            {selectedRole === "Manager" && (
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
            )}
            <ul className={styles.main_wrapper}>
              {managers.map((item) => {
                if (
                  selectedRole === "Manager"
                    ? item.role_id === 2
                    : item.role_id === usersArray.find(role => role.role === selectedRole).roleId
                ) {
                  return (
                    <Fade
                      cascade
                      triggerOnce
                      duration={300}
                      direction="up"
                      key={item.id}
                    >
                      <li className={styles.ul_items} key={item.name}>
                        <Link
                          className={styles.ul_items_link}
                          target="_self"
                          to={selectedRole === "Manager" && `/manager/${item.id}/planning/`}
                        >
                          <p className={styles.ul_items_text}>
                            {item.name} ({item.id})
                          </p>
                        </Link>
                        <button
                          className={styles.ul_items_btn}
                          data-modal="change-user"
                          onClick={() => {
                            setIsOpen(!isOpen);
                            setId(item.id);
                            setName(item.name);
                            setRating(item.rating);
                            if (!item.role_id) setRole(2);
                            else {
                              setRole(item.role_id);
                            }
                            setLogin(item.login);
                            setSlack(item.slack);
                            setTeam(item.team);
                            setZohoId(item.zoho_id);
                            setPassword(item.password);
                            setSlackId(item.slack_id);
                          }}
                        />
                      </li>
                    </Fade>
                  );
                }
              })}
            </ul>
          </div>
        </React.Fragment>
      )}

      <ChangeUser
        isOpen={isOpen}
        handleClose={() => setIsOpen(!isOpen)}
        id={id}
        dataName={name}
        dataDesc={rating}
        administrator={isAdmin}
        dataRole={newRole}
        dataLogin={newLogin}
        dataTeam={team}
        dataSlack={slack}
        dataZohoId={zohoId}
        dataSlackId={slackId}
        dataPassword={password}
      />
    </>
  );
}
