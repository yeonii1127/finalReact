import "../css/ModelUpload.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ModelUpload() {
  const [evalModel, setEvalModel] = useState("모델1");
  const [frontierModel, setFrontierModel] = useState("모델1");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { evalModel, frontierModel };
    console.log("사용자 입력값:", data);

    try {
      const response = await axios.post("/api/model", data, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("서버 응답:", response.data);

      if (response.data.success) {
        alert(response.data.message);
        navigate("/users/result");
      } else {
        alert(response.data.message || "모델 등록 실패");
      }
    } catch (error) {
      console.error("모델 등록 중 오류:", error);
      alert("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="model-container">
      <aside className="domain-sidebar">
        <h2 className="domain-sidebar-title">DEEP DATA</h2>
        <div className="step-wrapper">
          {[
            "도메인 설정",
            "파일 등록",
            "질문 생성",
            "평가 실행",
            "평가 진행 현황",
            "결과",
          ].map((label, index) => (
            <div key={index} className="step-item">
              <div
                className={`step-circle ${
                  index === 3 ? "active" : index < 3 ? "completed" : ""
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
      <main className="model-upload-main">
        <h1 className="model-upload-title">내 모델 등록</h1>
        <p className="model-upload-subtitle">
          모델 API 정보를 등록하면 자동으로 답변이 생성되고, 선택한 평가 모델로
          평가가 진행됩니다.
        </p>

        <form className="model-upload-text" onSubmit={handleSubmit}>
        

          <div>
            <p>내 모델 선택</p>
            <select
              value={evalModel}
              onChange={(e) => setEvalModel(e.target.value)}
            >
              <option>gpt-4o-mini</option>
              <option>모델2</option>
              <option>모델3</option>
            </select>
          </div>

          <div>
            <p>평가용 모델 선택</p>
            <select
              value={frontierModel}
              onChange={(e) => setFrontierModel(e.target.value)}
            >
              <option>gpt-4o-mini</option>
              <option>모델2</option>
              <option>모델3</option>
            </select>
          </div>

          <button type="submit" className="model-btn">
            평가 실행
          </button>
        </form>
      </main>
    </div>
  );
}
