import "../css_2/Result2.css";
import "../css_2/docupload.css"; // ✅ Domain2와 같은 사이드바 스타일 사용
import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Result2() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fakeData = {
      factuality: 87.4,
      relevance: 72.1,
      average: (87.4 + 72.1) / 2,
      feedback:
        "이 모델은 대부분의 질문에 대해 사실적인 답변을 제공했지만, 일부 정의적 질문에서는 정확도가 낮게 나타났습니다.",
      results: [
        { question: "이 법의 목적은?", modelAnswer: "공공안전을 확보하기 위함", factuality: 90, relevance: 95 },
        { question: "‘구조’란 무엇을 의미하는가?", modelAnswer: "재해 상황에서의 조치", factuality: 70, relevance: 65 },
        { question: "위급상황에서 국민이 가지는 권리는?", modelAnswer: "국가와 지자체의 구호 지원을 받을 권리", factuality: 95, relevance: 80 },
      ],
    };
    const t = setTimeout(() => {
      setResult(fakeData);
      setRows(fakeData.results);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const getScoreColor = (s) => (s >= 80 ? "rnew-score-high" : s >= 60 ? "rnew-score-mid" : "rnew-score-low");
  const handleLogoClick = () => navigate("/users/main2");

  if (!result) return null;

  return (
    <div className="rnew-container">
      {/* ===== 사이드바: Domain2와 완전히 동일한 마크업/클래스 ===== */}
      <aside className="docs-sidebar">
        <h2 className="docs-sidebar-title" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          DEEP DATA
        </h2>
        <div className="step-wrapper">
          {["등록", "질문 생성", "답변", "결과"].map((label, index) => (
            <div key={index} className="step-item">
              <div className={`step-circle ${index < 3 ? "completed" : index === 3 ? "active" : ""}`}>{index + 1}</div>
              <div className="step-label">{label}</div>
              {index < 3 && <div className="step-line"></div>}
            </div>
          ))}
        </div>
      </aside>

      {/* ===== 메인 ===== */}
      <main className="rnew-main">
        <h1 className="rnew-title">평가 결과</h1>
        <p className="rnew-subtitle">모델의 평가 지표 결과입니다.</p>

        <div className="rnew-card-wrapper">
          <div className="rnew-mini-card">
            <h2>종합 점수</h2>
            <p className={`rnew-mini-score ${getScoreColor(result.average)}`}>
              {result.average?.toFixed(1) ?? "-"}
            </p>
          </div>
          <div className="rnew-mini-card">
            <h2>사실성 (Factuality)</h2>
            <p className={`rnew-mini-score ${getScoreColor(result.factuality)}`}>
              {result.factuality?.toFixed(1) ?? "-"}
            </p>
          </div>
          <div className="rnew-mini-card">
            <h2>관련성 (Relevance)</h2>
            <p className={`rnew-mini-score ${getScoreColor(result.relevance)}`}>
              {result.relevance?.toFixed(1) ?? "-"}
            </p>
          </div>
        </div>

        <div className="rnew-feedback">
          <h3>종합 피드백</h3>
          <p>{result.feedback}</p>
        </div>

        <div className="rnew-table-wrapper">
          <table className="rnew-table">
            <thead>
              <tr>
                <th>질문</th>
                <th>모델 답변</th>
                <th>사실성</th>
                <th>관련성</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>{row.question}</td>
                  <td>{row.modelAnswer}</td>
                  <td className={getScoreColor(row.factuality)}>{row.factuality}</td>
                  <td className={getScoreColor(row.relevance)}>{row.relevance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
