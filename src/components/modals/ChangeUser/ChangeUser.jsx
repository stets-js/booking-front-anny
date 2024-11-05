import styles from "./ChangeUser.module.scss";
import Modal from "../../Modal/Modal";
import React, { useState, useEffect } from "react";

import { putUser, deleteUser, getRoles } from "../../../helpers/user/user";
import {
  putManager,
  postManager,
  deleteManager,
  getManagerByName,
} from "../../../helpers/manager/manager";
import FormInput from "../../FormInput/FormInput";
import Select from "../../Select/Select";
import Form from "../../Form/Form";
const ChangeUser = ({
  isOpen,
  handleClose,
  id,
  dataName,
  dataRole,
  dataLogin,
  dataPassword,
  administrator,
  dataTeam,
}) => {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(2);
  const [team, setTeam] = useState("");

  
  useEffect(() => {
    setName(dataName);
    setRole(dataRole);
    setLogin(dataLogin);
    setTeam(dataTeam);
    setPassword(dataPassword);
  }, [isOpen, dataLogin, dataRole, dataName, dataTeam, dataPassword]);

  return (
    <>
      {isOpen && (
        <Modal open={isOpen} onClose={handleClose}>
          <Form
            type={{ type: "put", additionalType: "delete" }}
            requests={{
              put: putUser,
              additional: id,
              delete: deleteUser,
              user: putManager,
              post: postManager,
              getByName: getManagerByName,
              managerDelete: deleteManager,
            }}
            startRole={dataRole}
            role={role}
            startName={dataName}
            name={name}
            id={id}
            onSubmit={() => {
              handleClose();
              setRole("");
              setPassword("");
              setLogin("");
              setName("");
              setTeam("");
            }}
            team={team}
            login={login}
            status={{
              successMessage: "Successfully changed user",
              failMessage: "Failed to change user",
              successMessageDelete: "Successfully deleted user",
              failMessageDelete: "Failed to delete user",
            }}
            password={password}
            role_id={role}
            title="Change user's info"
          >
            <FormInput
              title="Name:"
              type="text"
              name="name"
              max={50}
              value={name}
              placeholder="Name"
              isRequired={true}
              handler={setName}
            />
            {/* <FormInput
                classname="input__bottom"
                title="Team:"
                type="text"
                name="team"
                value={team}
                placeholder="Team"
                handler={setTeam}
              /> */}
              <Select
              title="Team:"
              type="no-request"
              setValue={setTeam}
              value={team}
              manager={true}
            
              defaultValue={team}
            >
              <option value="Chat">Chat</option>
                    <option value="OM">OM</option>
                    <option value="Drop">Drop</option>
                    <option value="Deptor">Deptor</option>
                    <option value="Awake">Awake</option>
            </Select>
            
            <div className={styles.input__block}>
              <FormInput
                classname="input__bottom"
                title="Login:"
                type="text"
                name="login"
                max={50}
                value={login}
                placeholder="Login"
                isRequired={true}
                handler={setLogin}
              />
              <FormInput
                classname="input__bottom"
                title="Password:"
                type="text"
                name="password"
                value={password}
                max={50}
                isRequired={true}
                placeholder="Password"
                handler={setPassword}
              />
            </div>
            
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ChangeUser;
