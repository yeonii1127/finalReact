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

   // ✅ 바깥 클릭 시 자동 닫기
    useEffect(() => {
      if (!showMenu) return;
      const handleClickOutside = (e) => {
        const menu = document.querySelector(".menu-wrapper");
        const button = document.querySelector(".main-start-btn");
        if (menu && !menu.contains(e.target) && !button.contains(e.target)) {
          setShowMenu(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [showMenu]);
  return (
    <div className="main-container">
      {/* ===== 상단 네비게이션 ===== */}
      <header className="navbar">
        <div className="nav-left">
          <img
            src={logo}
            alt="로고"
            className="site-logo"
            onClick={() => navigate("/users/main2")}
          />
        </div>

        <nav className="nav-menu">
          <ul>
            <li >서비스 이용</li>
            <li >COMPANY</li>
            <li className="dropdown">
              데이터 평가
              <ul className="dropdown-menu">
                <li onClick={() => navigate("/users/domain")}>모델 평가</li>
                <li onClick={() => navigate("/users/domain2")}>자동화</li>
              </ul>
            </li>
            <li >포트폴리오</li>
            <li >커뮤니티</li>
            {isLoggedIn ? (
              <li onClick={handleLogout}>로그아웃</li>
            ) : (
              <li onClick={() => navigate("/auth/login")}>로그인</li>
            )}
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

        {/* ✅ showMenu가 true일 때만 표시되도록 수정 */}
      <div className={`menu-wrapper ${showMenu ? "show" : "hide"}`}>
            {/* 모델 평가 박스 */}
            <div className="data-menu-box model-box" onClick={() => navigate("/users/domain")}>
              <h2>모델 평가 시작하기</h2>
              <p>도메인을 선택하고 모델을 등록하세요.</p>
                
            </div>

            {/* 자동화 박스 */}
            <div className="data-menu-box auto-box" onClick={() => navigate("/users/domain2")}>
              <h2>자동화 서비스 시작하기</h2>
              <p>문서 업로드부터 평가까지 자동 처리됩니다.</p>
           
            </div>
          </div>
      </main>
    </div>
  );
}
