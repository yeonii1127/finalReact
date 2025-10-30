import "../css/Mypage.css";
import logo from "../assets/로고.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HistoryResult from "../Evaluation/HistoryResult"; 

export default function Mypage() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("default"); // default | checkPw | changePw | history
  const [password, setPassword] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [errMsg, setErrMsg] = useState("");
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const logout=()=>{
  localStorage.removeItem("isLoggedIn");
  setIsLoggedIn(false);
  navigate("/auth/main");
 }

  // ✅ 비밀번호 확인
  // const handlePasswordCheck = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post("/api/member/checkPassword", { password });
  //     if (res.data.success) {
  //       setCurrentView("changePw");
  //       setErrMsg("");
  //     } else {
  //       setErrMsg("비밀번호가 일치하지 않습니다.");
  //     }
  //   } catch {
  //     setErrMsg("서버 오류가 발생했습니다.");
  //   }
  // };
// ✅ 비밀번호 확인 (테스트용 - 백엔드 연결 없이 화면 전환)
const handlePasswordCheck = async (e) => {
  e.preventDefault();

  // 🔹 서버 요청 생략하고 바로 화면 전환
  if (password.trim() === "") {
    setErrMsg("비밀번호를 입력해주세요.");
    return;
  }

  // 실제 백엔드 연동 시엔 아래 axios 부분 복원
  // const res = await axios.post("/api/member/checkPassword", { password });

  setErrMsg("");
  setCurrentView("changePw"); // 바로 비밀번호 변경 화면으로 이동
};



  // ✅ 비밀번호 변경
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setErrMsg("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await axios.post("/api/member/changePassword", {
        newPassword: newPw,
      });
      if (res.data.success) {
        alert("비밀번호가 변경되었습니다!");
        setCurrentView("default");
        setPassword("");
        setNewPw("");
        setConfirmPw("");
        setErrMsg("");
      } else {
        setErrMsg("비밀번호 변경 실패");
      }
    } catch {
      setErrMsg("서버 오류가 발생했습니다.");
    }
  };

  // ✅ 오른쪽 영역 전환
  const renderSection = () => {
    switch (currentView) {
     case "checkPw":
  return (
    <div className="pw-check-container">
      <h3 className="pw-check-title">비밀번호 확인</h3>
      <p className="pw-check-desc">회원정보 수정을 위해 비밀번호를 입력해주세요.</p>
      <form onSubmit={handlePasswordCheck} className="pw-check-form">
        <input
          type="password"
          className="pw-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="현재 비밀번호를 입력하세요"
          required
        />
        {errMsg && <p className="pw-error">{errMsg}</p>}
        <button type="submit" className="pw-submit-btn">확인</button>
      </form>
    </div>
  );

      case "changePw":
        return (
          <form onSubmit={handleChangePassword} className="pw-change-form">
            <h3 className="pwCh">비밀번호 변경</h3>
            <input
              type="password"
              className="pw-change"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="새 비밀번호"
              required
            />
            <br/>
            <input
              type="password"
              className="pw-change"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="새 비밀번호 확인"
              required
            />
            {errMsg && <p className="error">{errMsg}</p>}
            <button className="changeButton" type="submit">비밀번호 변경</button>
          </form>
        );

      case "history":
        return <HistoryResult />; 

      default:
      
    }
  };
   
  return (
    <div className="mypage-wrapper">
      {/* 상단 네비게이션 */}
      <header className="mypage-navbar">
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
            <li onClick={() => navigate("/auth/aidic")}>커뮤니티</li>
            <li onClick={() => navigate("/users/mypage")}>마이페이지</li>
          </ul>
        </nav>
      </header>

      {/* 메인 */}
      <main className="mypage-main">
        <h1 className="mypage-title">마이페이지</h1>

        <div className="mypage-content">
          {/* 좌측 메뉴 */}
          <aside className="mypage-sidebar">
            <ul>
              <li
                className={`sidebar-item ${
                  currentView === "history" ? "active" : ""
                }`}
                onClick={() => setCurrentView("history")}
              >
                평가 히스토리
              </li>
              <hr />
              <li
                className={`sidebar-item ${
                  currentView === "checkPw" || currentView === "changePw"
                    ? "active"
                    : ""
                }`}
                onClick={() => setCurrentView("checkPw")}
              >
                회원정보 수정
              </li>
             
              <hr/>
              <li 
              className="logout"
              onClick={()=>logout()}>
                로그아웃
              </li>
            </ul>
          </aside>

          {/* 오른쪽 내용 */}
          <section className="mypage-section">{renderSection()}</section>
        </div>
      </main>
    </div>
  );
}
