import React, { useState, useContext, useEffect } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import styles from './style.module.css'
const { io } = require("socket.io-client");

const UserForm = () => {
  const [username, setUsername] = useState("");
  const [state, dispatch] = useContext(AppContext);
  const history = useHistory();

  useEffect(() => {
    if (state.connected) {
      return;
    }
    const socket = io("https://instaminutesbackend.herokuapp.com/");
    dispatch({
      type: "SET_SOCKET_CONNECTION",
      payload: socket,
    });
  }, [state.connected, state.socket, dispatch]);

  if (state.user) {
    return <Redirect to="/" />;
  }
  return (
    <div className={styles.joinIn}>
      <div>JOIN ROOM</div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your name"
      />
      <button
        onClick={() => {
          if(username === ""){
            return
          }
          dispatch({
            type: "UPDATE_USER",
            payload: username,
          });
          history.push("/room");
        }}
      >
        SUBMIT
      </button>
    </div>
  );
};

export default UserForm;
