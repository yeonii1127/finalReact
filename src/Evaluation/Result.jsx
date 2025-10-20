import "../css/Result.css";
import { useEffect, useState } from "react";
import React from "react";

export default function Result() {
  const [result, setResult] = useState({ factuality: 0, relevance: 0 });

  useEffect(() => {
    // 🚀 여기서 fake 데이터 세팅
    const fakeResult = {
      factuality: 87.4,
      relevance: 92.1,
    };

    // 1초 후에 데이터 들어오는 것처럼 시뮬레이션
    const timer = setTimeout(() => {
      setResult(fakeResult);
      console.log("📊 임시 데이터 로드 완료:", fakeResult);
    }, 1000);

    // cleanup
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="result-container">
      <aside className="result-sidebar">
        <h2 className="result-sidebar-title">DEEP DATA</h2>
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
                  index === 5 ? "active" : index < 5 ? "completed" : ""
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

      <main className="result-main">
        <h1 className="result-title">평가 결과</h1>
        <p className="result-subtitle">모델의 평가 지표 결과입니다.</p>

        <div className="result-card-wrapper">
          <div className="result-mini-card">
            <h2>사실성 (Factuality)</h2>
            <p className="mini-score">
              {result.factuality.toFixed(1)}
            </p>
          </div>

          <div className="result-mini-card">
            <h2>관련성 (Relevance)</h2>
            <p className="mini-score">
              {result.relevance.toFixed(1)}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
