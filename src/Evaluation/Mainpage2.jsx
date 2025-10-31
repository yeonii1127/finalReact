import React, { useEffect, useState } from "react";
import "../css/MainPage.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/로고.png";

export default function MainPage2() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // 메뉴 패널 상태

  // ✅ 로그인 상태 확인
  useEffect(() => {
    const loginStatus = sessionStorage.getItem("isLoggedIn");
    setIsLoggedIn(loginStatus === "true");
  }, []);

  // ✅ 로그아웃
  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userName");
    alert("로그아웃 되었습니다.");
    setIsLoggedIn(false);
    navigate("/auth/main");
  };
  return (
    <div className="main-container">
      {/* ===== 상단 네비게이션 ===== */}
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
            <li className="dropdown">
              데이터 평가
              <ul className="dropdown-menu">
                <li onClick={() => navigate("/users/domain")}>도메인 선택</li>
                <li onClick={() => navigate("/users/domain2")}>문서 업로드</li>
              </ul>
            </li>
            <li>포트폴리오</li>
            <li>커뮤니티</li>
            <li onClick={() => navigate("/users/mypage")}>마이페이지</li>
          </ul>
        </nav>
      </header>

      {/* ===== 중앙 콘텐츠 ===== */}
      <main className="main-centered">
        {/* 가운데 카드 (기본 중앙, 버튼 누르면 왼쪽으로 이동) */}
        <div className={`main-text-box ${showMenu ? "slide-out" : "slide-in"}`}>
          <h1>
            Reliable AI Starts
            <br />
            With Reliable Data
          </h1>
          <p>정확하고 검증된 LLM 평가 및 검수 솔루션</p>
          <button
            onClick={() => setShowMenu(true)}
            className="main-start-btn"
          >
            LLM 모델 평가하기
          </button>
        </div>

        {/* 오른쪽에서 슬라이드 인되는 패널 */}
        <div className={`data-menu-box ${showMenu ? "show" : "hide"}`}>
          <h2>데이터 평가 시작하기</h2>
          <p>평가할 방식을 선택하세요.</p>
          <div className="data-menu-buttons">
            <button
              className="data-btn"
              onClick={() => navigate("/users/domain")}
            >
              서비스 1
            </button>
            <button
              className="data-btn"
              onClick={() => navigate("/users/domain2")}
            >
              서비스 2
            </button>
          </div>
          <button className="back-btn" onClick={() => setShowMenu(false)}>
            ← 돌아가기
          </button>
        </div>
      </main>
    </div>
  );
}
