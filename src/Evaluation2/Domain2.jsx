import "../css_2/Domain2.css";
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
     navigate("/users/dupload", { replace: true });
   
  };

  
    const handleLogoClick = () => {
    navigate("/users/main2");
  };
  return (
    <div className="domain-container">
    <aside className="docs-sidebar">
        <h2 className="docs-sidebar-title" onClick={handleLogoClick} style={{cursor:"pointer"}}>DEEP DATA</h2>
        <div className="step-wrapper">
          {["등록", "질문 생성", "답변", "결과"].map((label, index) => (
            <div key={index} className="step-item">
              <div
                className={`step-circle ${
                  index === 0 ? "active" : index < 0 ? "completed" : ""
                }`}
              >
                {index + 1}
              </div>
              <div className="step-label">{label}</div>
              {index < 3 && <div className="step-line"></div>}
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
            <option value="finance">금융</option>
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
