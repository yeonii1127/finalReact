import "../css/Result.css";
import { useEffect, useState } from "react";
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  function getScoreColor(score) {
    if (score >= 80) return "rnew-score-high";
    if (score >= 60) return "rnew-score-mid";
    return "rnew-score-low";
  }

  const [result, setResult] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fakeData = {
      factualityAvg: 87.4,
      relevanceAvg: 72.1,
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
      setResult({
        factuality: fakeData.factualityAvg,
        relevance: fakeData.relevanceAvg,
      });
      setRows(fakeData.results);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!result) return null;

  const factualityBreakdown = [
    { name: "정확성", value: 40 },
    { name: "근거제시", value: 30 },
    { name: "논리성", value: 17 },
    { name: "기타", value: 13 },
  ];

  const relevanceBreakdown = [
    { name: "문맥일치", value: 45 },
    { name: "질문유사도", value: 35 },
    { name: "핵심포착", value: 20 },
  ];

  const COLORS1 = ["#2f9e44", "#6ecb63", "#9de090", "#c8f0c8"];
  const COLORS2 = ["#e0b100", "#f4ca64", "#ffe699"];

    const handleLogoClick = () => {
    navigate("/users/main2");
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

      {/* ===== 본문 ===== */}
      <main className="rnew-main">
        <h1 className="rnew-title">평가 결과</h1>
        <p className="rnew-subtitle">모델의 평가 지표 결과입니다.</p>

        {/* ✅ 상단: 왼쪽(카드+피드백) / 오른쪽(표) */}
        <div className="rnew-upper-section">
          {/* 왼쪽 */}
          <div className="rnew-left-box">
            <div className="rnew-card-wrapper">
              <div className="rnew-mini-card">
                <h2>사실성 (Factuality)</h2>
                <p
                  className={`rnew-mini-score ${getScoreColor(
                    result.factuality
                  )}`}
                >
                  {Math.floor(result.factuality)}
                  <span className="rnew-decimal">
                    .{String(result.factuality.toFixed(1)).split(".")[1]}
                  </span>
                </p>
              </div>

              <div className="rnew-mini-card">
                <h2>관련성 (Relevance)</h2>
                <p
                  className={`rnew-mini-score ${getScoreColor(
                    result.relevance
                  )}`}
                >
                  {Math.floor(result.relevance)}
                  <span className="rnew-decimal">
                    .{String(result.relevance.toFixed(1)).split(".")[1]}
                  </span>
                </p>
              </div>
            </div>

            <div className="rnew-feedback">
              <h3>종합 피드백</h3>
              <p>
                이 모델은 대부분의 질문에 대해 사실적인 답변을 제공했지만, 일부
                정의적 질문에서는 정확도가 낮게 나타났습니다.
              </p>
            </div>
          </div>

          {/* 오른쪽 */}
          <div className="rnew-right-box">
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
          </div>
        </div>

        {/* ✅ 그래프 섹션 (아래쪽 유지) */}
        <div className="rnew-graph-section">
          <div className="rnew-graph-box">
            <h3>사실성 구성요소</h3>
            <PieChart width={320} height={300}>
              <Pie
                data={factualityBreakdown}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {factualityBreakdown.map((entry, index) => (
                  <Cell
                    key={`f-${index}`}
                    fill={COLORS1[index % COLORS1.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="rnew-graph-box">
            <h3>관련성 구성요소</h3>
            <PieChart width={320} height={300}>
              <Pie
                data={relevanceBreakdown}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {relevanceBreakdown.map((entry, index) => (
                  <Cell
                    key={`r-${index}`}
                    fill={COLORS2[index % COLORS2.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </main>
    </div>
  );
}
