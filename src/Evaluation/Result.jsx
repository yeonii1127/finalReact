import "../css/Result.css";
import { useEffect, useState } from "react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function Result() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const scoreIdFromState = state?.scoreId;
  const [scoreId, setScoreId] = useState(scoreIdFromState || null);
  const [result, setResult] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!scoreId) {
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
    }
    // scoreId가 있으면 Spring에서 점수 정보 조회
    (async () => {
      try {
        const { data } = await axios.get(`/api/scores/${scoreId}`, { withCredentials: true });

        // metrics_json 파싱
        let metrics = data?.metricsJson;
        if (typeof metrics === "string") {
          try { metrics = JSON.parse(metrics); } catch { metrics = null; }
        }

        // grader_response_raw 파싱
        let rawResp = data?.graderResponseRaw;
        if (typeof rawResp === "string") {
          try { rawResp = JSON.parse(rawResp); } catch { rawResp = null; }
        }

        // === 상단 카드 ===
        // 평균 점수: mean_final_percent 사용 (없으면 mean_final*100 폴백)
        const meanFinalPercent =
          metrics?.mean_final_percent != null
            ? metrics.mean_final_percent
            : (metrics?.mean_final != null ? metrics.mean_final * 100 : 0);

        // 유사성: mean_similarity_norm -> % 변환
        const factuality =
          metrics?.mean_similarity_norm != null
            ? Math.round(metrics.mean_similarity_norm * 1000) / 10
            : null;

        // 관련성: mean_relevance_norm -> % 변환
        const relevance =
          metrics?.mean_relevance_norm != null
            ? Math.round(metrics.mean_relevance_norm * 1000) / 10
            : null;

        const average = meanFinalPercent != null ? Math.round(meanFinalPercent * 10) / 10 : null;

        // === 테이블 ===
        // grader_response_raw.pairs[]에서 q, a, metrics.similarity_norm, metrics.relevance_norm 추출
        const pairs = Array.isArray(rawResp?.pairs) ? rawResp.pairs : [];
        const tableRows = pairs.map((p) => ({
          question: p.q,
          modelAnswer: p.a,
          factuality:
            p?.metrics?.similarity_norm != null
              ? Math.round(p.metrics.similarity_norm * 1000) / 10
              : null,
          relevance:
            p?.metrics?.relevance_norm != null
              ? Math.round(p.metrics.relevance_norm * 1000) / 10
              : null,
        }));

        setResult({
          factuality,
          relevance,
          average,
          feedback: rawResp?.overallFeedback || "평가 결과입니다.",
          results: tableRows,
        });
        setRows(tableRows);
      } catch (e) {
        console.error("/api/scores fetch failed", e);
      }
    })();
  }, [scoreId]);

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
          {(() => {
            const steps = ["도메인 설정", "파일 등록", "질문 생성", "답변 등록", "결과"];
            const last = steps.length - 1;
            return steps.map((label, index) => (
              <div key={index} className="rnew-step-item">
                <div
                  className={`rnew-step-circle ${
                    index === last ? "active" : "completed"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="rnew-step-label">{label}</div>
                {index < last && <div className="rnew-step-line"></div>}
              </div>
            ));
          })()}
        </div>
      </aside>

      {/* ===== 메인 영역 ===== */}
      <main className="rnew-main">
        <div className="rnew-head">
          <h1 className="rnew-title">평가 결과</h1>
          <p className="rnew-subtitle">모델의 평가 지표 결과입니다.</p>
        </div>

        {/* === 상단 카드 === */}
        <div className="rnew-card-wrapper">
          
          <div className="rnew-mini-card">
            <h2>종합 점수</h2>
            <p className="average-score">
              {result.average?.toFixed(1) ?? "-"}
            </p>
          </div>
          <div className="rnew-mini-card">
            <h2>유사성 (Similarity)</h2>
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
        <div className="rnew-feedback">
          <h3>종합 피드백</h3>
          <p>{result.feedback}</p>
        </div>

        {/* === 결과 표 === */}
        <div className="rnew-table-wrapper">
          <table className="rnew-table">
            <thead>
              <tr>
                <th>질문</th>
                <th>모델 답변</th>
                <th>유사성</th>
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
