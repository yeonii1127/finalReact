import "../css/Domain.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendDomain } from "../js/domainApi"; 

export default function Domain() {
  const [domain, setDomain] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setDomain(selectedValue);
    sessionStorage.setItem("selectedDomain", selectedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    if (!domain || domain === "선택하세요") {
      setErrMsg("도메인을 선택해주세요!");
      alert("도메인을 선택해주세요!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await sendDomain(domain);
      console.log("서버 응답:", data);

      if (data.success) {
        sessionStorage.setItem("selectedDomain", domain);
        navigate("/users/upload", { replace: true });
      } else {
        setErrMsg("도메인 설정 실패");
      }
    } catch (error) {
      console.error("도메인 전송 오류:", error);
      const msg =
        error?.response?.data?.message ||
        "서버와의 통신에 실패했습니다. 다시 시도해주세요.";
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

    const handleLogoClick = () => {
    navigate("/auth/main");
  };

  return (
    <div className="domain-container">
      <aside className="domain-sidebar">
        <h2 className="domain-sidebar-title" onClick={handleLogoClick} style={{cursor: "pointer"}}>DEEP DATA</h2>
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
            <option value="법률">법률</option>
            <option value="금융">금융</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "전송 중..." : "다음"}
          </button>

          {errMsg && <p style={{ color: "red", marginTop: "10px" }}>{errMsg}</p>}
        </form>
      </main>
    </div>
  );
}
