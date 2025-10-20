import "../css/AnswerUpload.css";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";


export default function AnswerUpload() {
  const [file, setFile] = useState(null);
  const [evalModel, setEvalModel] = useState("모델1");
  const navigate = useNavigate();
  const { state } = useLocation();
  const [answerText, setAnswerText] = useState("");
  const placeholder =
  state?.placeholder || "답변 텍스트를 여기에 입력하세요";
  const documentId =state?.documentId ?? null;
  
  const handleAnswerTextChange=(e)=>{
    setAnswerText(e.target.value);
  }

  const handleEvalModelChange = (e) => {
    setEvalModel(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("파일을 선택해주세요");
      return;
    }

    console.log("선택된 파일:", file.name);
    console.log("평가용 모델:", evalModel);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("evalModel", evalModel);

    
      const response = await axios.post(
        "http://127.0.0.1:8095/submit-answer",
        {
          documentId,
          answerText,
          evalModel,
        },
        {
          headers: { "Content-Type": "application/josn" },
        }
      );

      console.log("서버 응답:", response.data);

      if (response.data.success) {
        alert(response.data.message);

        navigate("/users/result");
      } else {
        alert(response.data.message || "평가 중 오류가 발생했습니다.");
      }
    
  };
  return (
    <div className="ans-container">
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
      <main className="ans-main">
        <h1 className="ans-title">답변 파일 등록</h1>
        <p className="ans-subtitle">
          생성된 Q에 대한 답변 파일을 업로드하고, 평가할 모델을 선택하세요.
        </p>

     <form onSubmit={handleSubmit} encType="multipart/form-data">
            <textarea
              placeholder={placeholder}
              className="answer-textarea"
              value={answerText}
              onChange={handleAnswerTextChange}
              rows={10}
            />
          <div className="model-box">
            <p>평가용 모델 선택</p>
            <select value={evalModel} onChange={handleEvalModelChange}>
              <option>모델1</option>
              <option>모델2</option>
              <option>모델3</option>
            </select>
          </div>
          <button className="ans-btn" type="submit">
            평가 실행
          </button>
        </form>
      </main>
    </div>
  );
}
