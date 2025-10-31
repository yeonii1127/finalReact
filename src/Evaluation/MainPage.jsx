import React, { useEffect, useState } from "react";
import "../css/MainPage.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/로고.png";
import uploadImg from "../assets/doc_upload_preview.png";
import questionImg from "../assets/question_preview.png";
import resultImg from "../assets/result_preview.png";

export default function MainPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const loginStatus = sessionStorage.getItem("isLoggedIn");
    setIsLoggedIn(loginStatus === "true");
  }, []);

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
    <div className="scroll-wrapper">
      {/* ===== Hero Section ===== */}
      <section className="page-section hero-section">
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
                  <li onClick={() => navigate("/users/domain")}>모델 평가</li>
                  <li onClick={() => navigate("/users/domain2")}>자동화</li>
                </ul>
              </li>
              <li>포트폴리오</li>
              <li>커뮤니티</li>
              <li onClick={() => navigate("/auth/login")}>로그인 / 회원가입</li>
            </ul>
          </nav>
        </header>

        {/* 중앙 콘텐츠 */}
        <main className="main-centered">
          <div
            className={`main-text-box ${showMenu ? "slide-out" : "slide-in"}`}
          >
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

          {/* 오른쪽 2개 박스 */}
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
      </section>

      {/* ===== 서비스 안내 ===== */}
      <section className="page-section service-section fade-in">
        <p className="flow-subtitle">
          문서를 업로드하고, 자동으로 생성된 질문을 통해 모델을 평가합니다.
        </p>

        <div className="flow-cards">
          <div className="flow-card">
            <img src={uploadImg} alt="문서 업로드" />
            <h3>문서 업로드</h3>
            <p>도메인을 선택하고 문서를 등록하면 자동으로 분석이 시작됩니다.</p>
          </div>
          <div className="flow-card">
            <img src={questionImg} alt="질문 생성" />
            <h3>질문 생성</h3>
            <p>등록된 문서를 기반으로 LLM이 질문을 자동으로 생성합니다.</p>
          </div>
          <div className="flow-card">
            <img src={resultImg} alt="평가 결과" />
            <h3>평가 결과 확인</h3>
            <p>모델의 사실성, 관련성, 점수를 종합하여 시각화된 결과로 제공합니다.</p>
          </div>
        </div>

        <button
          className="flow-cta-btn"
          onClick={() => navigate("/users/domain")}
        >
          지금 바로 검사 시작하기 →
        </button>
      </section>
    </div>
  );
}
