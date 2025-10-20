import "../css/FileUpload.css";
import "../css/Domain.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, requestQGen, fetchQuestionsByDoc } from "../js/documentApi";

const MODELS = [
  { value: "swin_large_patch4_window7_224", label: "Swin-L (224)" },
  { value: "resnet50", label: "ResNet-50" },
  { value: "gpt-4o-mini", label: "GPT-4o-mini" }, // 예시
];

export default function FileUpload() {
  // React 상태(state)
  const [file, setFile] = useState(null);               // 선택한 파일
  const [model, setModel] = useState(MODELS[0].value);  // 선택한 모델값
  const [docId, setDocId] = useState(null);             // 업로드 결과 문서 ID
  const [qs, setQs] = useState([]);                     // 생성된 질문 목록
  const [loading, setLoading] = useState(false);        // 로딩 표시
  const [msg, setMsg] = useState("");                  // 상태 메시지
  const navigate = useNavigate();

  // 파일 등록
  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null);
  };

  // 모델 선택
  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  // 업로드 + 질문 생성 + 조회
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("파일을 선택해주세요!");
      return;
    }

    setLoading(true);
    setMsg("");
    setQs([]);

    try {
      // 1) 파일 업로드 → documentId 획득
      const u = await uploadFile({ file });
      setDocId(u.documentId);

      // 2) 파이썬에 질문 생성 요청
      await requestQGen({ documentId: u.documentId, model });
      // 질문 생성 트리거 후 이동 (필요 시 약간의 대기를 둘 수도 있음)
      navigate(`/users/questions`);

    
    } catch (error) {
      console.error("업로드/생성 실패:", error);
      setMsg(error?.response?.data || error.message || "오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-container">
      {/* ---- 사이드바 ---- */}
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
                  index === 1 ? "active" : index < 1 ? "completed" : ""
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

      {/* ---- 메인 ---- */}
      <main className="file-main">
        <div className="box-title">
          <h1 className="upload-title">파일 등록 & 질의 생성 모델 선택</h1>
          <p className="upload-subtitle">
            평가할 문서를 등록하고 Q 생성을 위한 모델을 선택해주세요.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="upload-box"
          encType="multipart/form-data"
        >
          <p className="upload-text">
            파일 드래그 & 등록<br />
            <span className="file-text2">또는 버튼을 눌러 파일 선택</span>
          </p>

          <label htmlFor="fileUpload" className="upload-btn">
            파일 선택
          </label>
          <input type="file" id="fileUpload" hidden onChange={handleFileChange} />

          {file && <p className="file-name">{file.name}</p>}

          <div className="file-model-box">
            <p>질의 생성 모델 선택</p>
            <select value={model} onChange={handleModelChange}>
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

{/* 바뀐 부분 */}
<button type="submit" className="file-next-btn" disabled={loading}>
  {loading ? "처리 중..." : "업로드"}
</button>

        </form>

        <button
          className="qmake-btn"
          onClick={() => navigate("/users/domain")}
        >
          이전
        </button>

      
      </main>
    </div>
  );
}