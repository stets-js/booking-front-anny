import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ControlButton.module.scss";

import { changeTypeSelection } from "../../redux/manager/manager-operations";
import { getTypeSelection } from "../../redux/manager/manager-selectors";

import RadioButton from "../RadioButton/RadioButton";
import BgWrapper from "../BgWrapper/BgWrapper";

const ControlButtons = () => {
  const dispatch = useDispatch();
  const buttonType = useSelector(getTypeSelection);
  const onCheckedButton = (event) => {
    dispatch(changeTypeSelection(event.target.name));
  };
  return (
    <>
      <BgWrapper top={-80} title="Manager"></BgWrapper>

      <div className={styles.wrapperControlButtons}>
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonGreenFocus}
          styleColor={styles.controlButtonGreen}
          onChangeType={onCheckedButton}
          title="Chat"
        />
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonOrangeFocus}
          styleColor={styles.controlButtonOrange}
          onChangeType={onCheckedButton}
          title="OM"
        />
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonBlueFocus}
          styleColor={styles.controlButtonBLue}
          onChangeType={onCheckedButton}
          title="Drop"
        />
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonPurpleFocus}
          styleColor={styles.controlButtonPurple}
          onChangeType={onCheckedButton}
          title="Deptor"
        />
        <RadioButton
          buttonType={buttonType}
          style={styles.controlButton}
          styleActive={styles.controlButtonRedFocus}
          styleColor={styles.controlButtonRed}
          onChangeType={onCheckedButton}
          title="Awake"
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
    </>
  );
};

export default ControlButtons;
