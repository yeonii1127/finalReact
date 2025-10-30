import "../css/Result.css";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // 🧪 fakeData - 서버 미연결 상태용
    const fakeData = {
      factuality: 87.4,
      relevance: 72.1,
      average: (87.4 + 72.1) / 2,
      feedback:
        "이 모델은 대부분의 질문에 대해 사실적인 답변을 제공했지만, 일부 정의적 질문에서는 정확도가 낮게 나타났습니다.",
      results: [
        {
          question: "이 법의 목적은?",
          modelAnswer: "공공안전을 확보하기 위함",
          factuality: 90,
          relevance: 95,
        },
        {
          question: "‘구조’란 무엇을 의미하는가?",
          modelAnswer: "재해 상황에서의 조치",
          factuality: 70,
          relevance: 65,
        },
        {
          question: "위급상황에서 국민이 가지는 권리는?",
          modelAnswer: "국가와 지자체의 구호 지원을 받을 권리",
          factuality: 95,
          relevance: 80,
        },
      ],
    };

    const timer = setTimeout(() => {
      setResult(fakeData);
      setRows(fakeData.results);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!result) return <div className="rnew-loading">결과를 불러오는 중...</div>;

  const getScoreColor = (score) => {
    if (score >= 80) return "rnew-score-high";
    if (score >= 60) return "rnew-score-mid";
    return "rnew-score-low";
  };

  const handleLogoClick = () => {
    navigate("/users/main2"); // ✅ 메인으로 이동
  };

  return (
    <div className="rnew-container">
      {/* ===== 사이드바 ===== */}
      <aside className="rnew-sidebar">
        <h2
          className="rnew-sidebar-title"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        >
          DEEP DATA
        </h2>

        <div className="rnew-step-wrapper">
          {[
            "도메인 설정",
            "파일 등록",
            "질문 생성",
            "답변 등록 / 모델 등록",
            "평가 진행 현황",
            "결과",
          ].map((label, index) => (
            <div key={index} className="rnew-step-item">
              <div
                className={`rnew-step-circle ${
                  index === 5 ? "active" : index < 5 ? "completed" : ""
                }`}
              >
                {index + 1}
              </div>
              <div className="rnew-step-label">{label}</div>
              {index < 5 && <div className="rnew-step-line"></div>}
            </div>
          ))}
        </div>
      </aside>

      {/* ===== 메인 영역 ===== */}
      <main className="rnew-main">
        <h1 className="rnew-title">평가 결과</h1>
        <p className="rnew-subtitle">모델의 평가 지표 결과입니다.</p>

        {/* === 상단 카드 === */}
        <div className="rnew-card-wrapper">
          
          <div className="rnew-mini-card">
            <h2>종합 점수</h2>
            <p className="average-score">
              {result.average?.toFixed(1) ?? "-"}
            </p>
          </div>
          <div className="rnew-mini-card">
            <h2>사실성 (Factuality)</h2>
            <p
              className={`rnew-mini-score ${getScoreColor(result.factuality)}`}
            >
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

        {/* === 종합 피드백 === */}
        <div className="rnew-feedback-wrapper">
          <div className="rnew-feedback">
            <h3>종합 피드백</h3>
            <p>{result.feedback}</p>
          </div>
        </div>

        {/* === 결과 표 === */}
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
                  <td className={getScoreColor(row.factuality)}>
                    {row.factuality}
                  </td>
                  <td className={getScoreColor(row.relevance)}>
                    {row.relevance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
