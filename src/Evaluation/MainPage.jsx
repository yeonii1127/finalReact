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

  return (
    <div className="scroll-wrapper">
      {/* ===== 섹션 1: Hero ===== */}
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
                  <li onClick={() => navigate("/users/domain")}>도메인 선택</li>
                  <li onClick={() => navigate("/users/dupload")}>문서 업로드</li>
                </ul>
              </li>
              <li>포트폴리오</li>
              <li>커뮤니티</li>
              <li onClick={() => navigate("/auth/login")}>로그인 / 회원가입</li>
            </ul>
          </nav>
        </header>

        <main className="main-centered fade-in">
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
      </section>

      {/* ===== 섹션 2: 서비스 단계 안내 ===== */}
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
