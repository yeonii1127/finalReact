import React from "react";
import "../css/MainPage.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/로고.png";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      {/* 상단 네비게이션 */}
      <header className="navbar">
        <div className="nav-left">
          <img
            src={logo}
            alt="로고"
            className="site-logo"
            onClick={() => navigate("/auth/main")}
          />
        </div>
        <nav className="nav-menu">
          <ul>
            <li>서비스 이용</li>
            <li>COMPANY</li>
            <li onClick={() => navigate("/users/domain")}>데이터 평가</li>
            <li>포트폴리오</li>
            <li onClick={() => navigate("/auth/aidic")}>커뮤니티</li>
            <li onClick={() => navigate("/auth/login")}>로그인 / 회원가입</li>
          </ul>
        </nav>
      </header>

      {/* 중앙 본문 */}
      <main className="main-centered">
        <div className="main-text-box">
          <h1>
            Reliable AI Starts
            <br />
            With Reliable Data
          </h1>
          <p>정확하고 검증된 LLM 평가 및 검수 솔루션</p>
          <button
            onClick={() => navigate("/users/domain")}
            className="main-start-btn"
          >
            LLM 모델 평가하기
          </button>
        </div>
      </main>
    </div>
  );
}
