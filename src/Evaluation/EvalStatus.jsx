import "../css/EvalStatus.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EvalStatus() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);   // 진행률 (퍼센트)
  const [currentStep, setCurrentStep] = useState(0); // 현재 단계 수
  const totalSteps = 10; // 전체 평가 개수 (ex: QA 10문항)
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentStep < totalSteps) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= totalSteps) {
            setIsComplete(true);
            clearInterval(interval);
          }
          return next;
        });
        setProgress((prev) => Math.min(prev + 10, 100));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  return (
    <div className="eval-container">
      <aside className="domain-sidebar">
        <h2 className="domain-sidebar-title">DEEP DATA</h2>
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
                  index === 4 ? "active" : index < 4 ? "completed" : ""
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

      <main className="eval-main">
        <h1 className="eval-title">평가 진행 현황</h1>
        <p className="eval-subtitle">
          모델 평가가 진행 중입니다. 잠시만 기다려주세요.
        </p>

        {/* ✅ 진행률 바 */}
        <div className="progress-wrapper">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">
            {currentStep} / {totalSteps} ({progress}%)
          </span>
        </div>

        {/* ✅ 현재 상태 메시지 */}
        <div className="status-text">
          {isComplete
            ? "평가 완료"
            : `${currentStep + 1}번째 문항을 평가 중입니다...`}
        </div>

        {/* ✅ 완료 시 이동 버튼 */}
        {isComplete && (
          <button className="result-btn" onClick={() => navigate("/users/result")}>
            결과 페이지로 이동 →
          </button>
        )}
      </main>
    </div>
  );
}
