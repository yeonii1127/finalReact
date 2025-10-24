import "../css/HistoryResult.css";
import { useState } from "react";
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function HistoryResult() {
  const [selectedDate, setSelectedDate] = useState("");
  const [result, setResult] = useState(null);
  const [rows, setRows] = useState([]);

  // ✅ 가짜 날짜별 데이터
  const fakeResultsByDate = {
    "2025-10-01": {
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
      ],
    },
    "2025-10-15": {
      factualityAvg: 92.3,
      relevanceAvg: 88.4,
      results: [
        {
          question: "재난대응체계의 핵심은 무엇인가?",
          modelAnswer: "신속한 구조와 협력",
          factuality: 95,
          relevance: 90,
        },
        {
          question: "위기경보 단계는 몇 단계로 나뉘는가?",
          modelAnswer: "4단계",
          factuality: 90,
          relevance: 87,
        },
      ],
    },
  };

  // ✅ 날짜 선택 시 해당 결과 로드
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    const selectedData = fakeResultsByDate[date];
    if (selectedData) {
      setResult({
        factuality: selectedData.factualityAvg,
        relevance: selectedData.relevanceAvg,
      });
      setRows(selectedData.results);
    } else {
      setResult(null);
      setRows([]);
    }
  };

  // ✅ 점수 색상
  function getScoreColor(score) {
    if (score >= 80) return "rnew-score-high";
    if (score >= 60) return "rnew-score-mid";
    return "rnew-score-low";
  }

  // ✅ 파이차트 구성요소
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

  return (
    <div className="history-container">
      <main className="history-main">

        {/* ✅ 날짜 선택 */}
        <div className="history-date-select">
          <select value={selectedDate} onChange={handleDateChange}>
            <option value="">날짜 선택</option>
            {Object.keys(fakeResultsByDate).map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ 선택된 결과가 있을 때만 표시 */}
        {result && (
          <>
            <div className="history-upper-section">
              {/* 왼쪽: 점수 카드 + 피드백 */}
              <div className="history-left-box">
                <div className="history-card-wrapper">
                  <div className="history-mini-card">
                    <h2>사실성 (Factuality)</h2>
                    <p
                      className={`history-mini-score ${getScoreColor(
                        result.factuality
                      )}`}
                    >
                      {Math.floor(result.factuality)}
                      <span className="rnew-decimal">
                        .{String(result.factuality.toFixed(1)).split(".")[1]}
                      </span>
                    </p>
                  </div>

                  <div className="history-mini-card">
                    <h2>관련성 (Relevance)</h2>
                    <p
                      className={`history-mini-score ${getScoreColor(
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

                <div className="history-feedback">
                  <h3>종합 피드백</h3>
                  <p>
                    이 모델은 대부분의 질문에 대해 사실적인 답변을 제공했지만,
                    일부 정의적 질문에서는 정확도가 낮게 나타났습니다.
                  </p>
                </div>
              </div>

              {/* 오른쪽: 테이블 */}
              <div className="history-right-box">
                <div className="history-table-wrapper">
                  <table className="history-table">
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

            {/* ✅ 그래프 섹션 */}
            <div className="history-graph-section">
              <div className="history-graph-box">
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

              <div className="history-graph-box">
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
          </>
        )}
      </main>
    </div>
  );
}
