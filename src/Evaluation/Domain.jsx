import "../css/Domain.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Domain() {
  const [domain, setDomain] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ 새로고침 or 뒤로가기 시 세션 상태 유지
  useEffect(() => {
    const savedDomain = sessionStorage.getItem("selectedDomain");
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    if (navType === "back_forward" && savedDomain) {
      setDomain(savedDomain);
    } else {
      sessionStorage.removeItem("selectedDomain");
      setDomain("");
    }
  }, []);

  // ✅ 도메인 선택 시 sessionStorage에 저장
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setDomain(selectedValue);
    sessionStorage.setItem("selectedDomain", selectedValue);
  };

  // ✅ “다음” 버튼 클릭 시 페이지 이동
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    if (!domain || domain === "선택하세요") {
      setErrMsg("도메인을 선택해주세요!");
      alert("도메인을 선택해주세요!");
      return;
    }

    // ✅ 로딩 애니메이션 약간만 보여주기
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem("selectedDomain", domain);
      navigate("/users/upload", { replace: true });
      setLoading(false);
    }, 800);
  };

  const handleLogoClick = () => {
    navigate("/users/main2");
  };

  return (
    <div className="domain-container">
      {/* ===== 사이드바 ===== */}
      <aside className="domain-sidebar">
        <h2
          className="domain-sidebar-title"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          DEEP DATA
        </h2>
        <div className="step-wrapper">
          {[
            "도메인 설정",
            "파일 등록",
            "질문 생성",
            "답변 등록 / 모델 등록",
            "평가 진행 현황",
            "결과",
          ].map((label, index) => (
            <div key={index} className="step-item">
              <div
                className={`step-circle ${
                  index === 0 ? "active" : index < 0 ? "completed" : ""
                }`}
              >
                {index + 1}
              </div>
              <div className="step-label">{label}</div>
              {index < 5 && <div className="step-line"></div>}
            </div>
          ))}
        </div>
      </aside>

      {/* ===== 메인 영역 ===== */}
      <main className="domain-main">
        <div className="domain-box-title">
          <h1 className="domain-title">도메인 설정</h1>
          <p className="domain-subtitle">
            모델 평가 전 도메인을 설정해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="domain-box">
          <label htmlFor="domain_select_value">도메인 선택</label>
          <select
            value={domain || "선택하세요"}
            onChange={handleSelectChange}
            className="domain_value"
            id="domain_select_value"
          >
            <option value="선택하세요">선택하세요</option>
            <option value="finance">금융</option>
            
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "전송 중..." : "다음"}
          </button>

          {errMsg && (
            <p style={{ color: "red", marginTop: "10px" }}>{errMsg}</p>
          )}
        </form>
      </main>
    </div>
  );
}
