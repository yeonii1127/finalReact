import "../css/Main.css";
import http from "../js/http";
import React from "react";
import { useNavigate } from "react-router-dom";
import {logout} from "../js/authApi";



export default function Main() {
  const navigate = useNavigate();

  const onClick=async()=>{
    await logout();
    navigate("/auth/main",{replace:true});
  }

const handleNextEval = () => {
    window.location.href = "/users/domain";
  };
  

  

  return (
    <div>
      <button onClick={handleNextEval}>평가받기</button>
      <button onClick={onClick}>로그아웃 </button> 
    </div>
  );
}
