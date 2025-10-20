import "../css/Aidic.css";
import React from "react";

import { Navigate, useNavigate } from "react-router-dom";
export default function Aidic() {
  const navigate=useNavigate();
  return (
    <div className="ad-container">
      <header className="navbar">
        <nav className="nav-menu">
          <ul>
            <li>서비스 이용</li>
            <li>COMPANY</li>
            <li
              className="login-link"
              onClick={() => navigate("/users/domain")}
            >
              데이터 평가
            </li>
            <li>포트폴리오</li>
            <li>커뮤니티</li>
            <li className="login-link" onClick={() => navigate("/auth/login")}>
              로그인 / 회원가입
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
