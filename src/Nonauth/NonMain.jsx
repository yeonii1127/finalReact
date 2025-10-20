import "../css/Main.css";
import React, {useEffect} from "react";
import http from "../js/http";
import { useNavigate } from "react-router-dom";

export default function NonMain() {

// const navigate=useNavigate();
// useEffect(()=>{
//   (async()=>{
//     try{
//       await http.get("/auth/check");
//       navigate("/users/main", {replace :true});
//     }catch(e){

//     }
//   })();
// },[navigate]);

const handleNextLogin=()=>{
  window.location.href="/auth/login";
}

const handleNextSignup=()=>{
  window.location.href="/auth/signup";
}

const handleNextEval=()=>{
  window.location.href="/";
}

  return (
    <div>
      <button onClick={handleNextLogin}>로그인</button>
      <button onClick={handleNextSignup}>회원가입</button>
      <button onClick={handleNextEval}>평가받기</button>
    </div>
  );
}
