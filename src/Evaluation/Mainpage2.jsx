import React, { useEffect, useState } from "react";
import "../css/MainPage.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/로고.png";

export default function MainPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      {/* 상단 네비게이션 */}
      <header className="navbar">
        <div className="nav-left">
          <img
            src={logo}
            alt="로고"
            className="site-logo"
            onClick={() => navigate("/users/mypage")}
          />
        </div>

        <nav className="nav-menu">
          <ul>
            <li>서비스 이용</li>
            <li>COMPANY</li>

            {/* ✅ 드롭다운 메뉴 */}
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
