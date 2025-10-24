import "../css/FileUpload.css";
import "../css/Domain.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, requestQGen } from "../js/documentApi";

const MODELS = [
  { value: "swin_large_patch4_window7_224", label: "Swin-L (224)" },
  { value: "resnet50", label: "ResNet-50" },
  { value: "gpt-4o-mini", label: "GPT-4o-mini" },
];

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState(MODELS[0].value);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("파일을 선택해주세요!");
      return;
    }

    setLoading(true);

    try {
      const u = await uploadFile({ file });
      await requestQGen({ documentId: u.documentId, model });
      navigate(`/users/questions`);
    } catch (error) {
      console.error("업로드/생성 실패:", error);
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-container">
      {/* ---- 사이드바 ---- */}
      <aside className="file-sidebar">
        <h2 className="file-sidebar-title">DEEP DATA</h2>

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

        <form onSubmit={handleSubmit} className="upload-box" encType="multipart/form-data">
          {/* 왼쪽 - 파일 등록 */}
          <div className="upload-left">
            <p className="upload-text">파일 드래그 & 등록</p>
            <p className="file-text2">또는 버튼을 눌러 파일 선택</p>

            <label htmlFor="fileUpload" className="upload-btn">
              파일 선택
            </label>
            <input type="file" id="fileUpload" hidden onChange={handleFileChange} />

            {file && <p className="file-name">{file.name}</p>}
          </div>

          {/* 오른쪽 - 모델 선택 + 업로드 */}
          <div className="upload-right">
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

            <button type="submit" className="file-next-btn" disabled={loading}>
              {loading ? "처리 중..." : "업로드"}
            </button>
          </div>
        </form>

        <button className="qmake-btn" onClick={() => navigate("/users/domain")}>
          이전
        </button>
      </main>
    </div>
  );
}
