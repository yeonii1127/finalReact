import "../css_2/docupload.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const QGEN_MODELS = [
  { value: "gpt-4o-mini", label: "GPT-4o-mini" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5-turbo" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
];

const EVAL_MODELS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
];

const USER_MODELS = [
  { value: "user-model-1", label: "사용자 모델 1" },
  { value: "user-model-2", label: "사용자 모델 2" },
  { value: "user-model-3", label: "사용자 모델 3" },
];

const FAKE_QUESTIONS = [
  "이 법의 목적은 무엇인가?",
  "소방청장이 수립해야 하는 계획에는 어떤 항목이 포함되는가?",
  "누구든지 위급상황에서 어떤 의무를 가지는가?",
  "국제구조대는 어떤 목적으로 운영되는가?",
  "구급상황관리센터의 주요 업무는 무엇인가?",
  "소방청장이 필요하다고 인정할 때 어떤 조치를 할 수 있는가?",
  "구조란 무엇을 의미하는가?",
  "응급의료체계는 어떤 원칙으로 운영되는가?",
  "재난 대응 시 정부의 역할은 무엇인가?",
];

export default function Docupload() {
  const [file, setFile] = useState(null);
  const [qModel, setQModel] = useState(QGEN_MODELS[0].value);
  const [eModel, setEModel] = useState(EVAL_MODELS[0].value);
  const [uModel, setUModel] = useState(USER_MODELS[0].value);
  const [step, setStep] = useState("upload"); // upload | loading | result | loadingAnswer | customerAnswer
  const [currentPage, setCurrentPage] = useState(0);
  const [flip, setFlip] = useState(true);

  const [answers, setAnswers] = useState([]);
  const [answerPage, setAnswerPage] = useState(0);
  const [answerFlip, setAnswerFlip] = useState(true);

  const handleFileChange = (e) => setFile(e.target.files?.[0] ?? null);

  // ================================
  // ✅ 업로드 클릭 → 로딩 후 질문 회전 단계로 전환
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("파일을 선택해주세요!");

    setStep("loading");
    await new Promise((resolve) => setTimeout(resolve, 2500)); // 2.5초 로딩
    setStep("result");
  };

  // ================================
  // ✅ 질문 회전 애니메이션
  // ================================
  useEffect(() => {
    if (step !== "result") return;
    const interval = setInterval(() => {
      setFlip(false);
      setTimeout(() => {
        setCurrentPage(
          (prev) => (prev + 1) % Math.ceil(FAKE_QUESTIONS.length / 3)
        );
        setFlip(true);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, [step]);

  const startIndex = currentPage * 3;
  const visibleQuestions = FAKE_QUESTIONS.slice(startIndex, startIndex + 3);

  // ================================
  // ✅ Mock 전환 로직
  // ================================
  useEffect(() => {
    if (step !== "result" && step !== "loadingAnswer") return;

    let t1, t2;

    if (step === "result") {
      t1 = setTimeout(() => setStep("loadingAnswer"), 6000);
    }

    if (step === "loadingAnswer") {
      t2 = setTimeout(() => {
        setAnswers([
          {
            question: "이 법의 목적은 무엇인가?",
            answer: "이 법은 재난 예방과 대응 체계를 강화하기 위한 것입니다.",
          },
          {
            question: "국제구조대는 어떤 목적으로 운영되는가?",
            answer:
              "국제구조대는 해외 재난 발생 시 긴급 구조 지원을 수행하기 위해 운영됩니다.",
          },
          {
            question: "응급의료체계는 어떤 원칙으로 운영되는가?",
            answer: "응급의료체계는 신속성, 전문성, 공공성을 원칙으로 운영됩니다.",
          },
          {
            question: "구조란 무엇을 의미하는가?",
            answer:
              "구조란 위급한 상황에 처한 사람을 안전하게 구출하는 활동을 의미합니다.",
          },
          {
            question: "소방청장이 수립해야 하는 계획에는 어떤 항목이 포함되는가?",
            answer: "재난 예방, 대응, 복구를 위한 종합 계획이 포함됩니다.",
          },
          {
            question: "재난 대응 시 정부의 역할은 무엇인가?",
            answer: "정부는 긴급 대책본부를 설치하고 피해 복구를 총괄합니다.",
          },
        ]);
        setStep("customerAnswer");
      }, 3000);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [step]);

  // ================================
  // ✅ 고객 모델 답변 회전 (3개씩 표시)
  // ================================
  useEffect(() => {
    if (step !== "customerAnswer") return;

    const interval = setInterval(() => {
      setAnswerFlip(false);
      setTimeout(() => {
        setAnswerPage(
          (prev) => (prev + 1) % Math.ceil(answers.length / 3)
        );
        setAnswerFlip(true);
      }, 600);
    }, 4000);

    return () => clearInterval(interval);
  }, [step, answers]);

  const answerStart = answerPage * 3;
  const visibleAnswers = answers.slice(answerStart, answerStart + 3);

  return (
    <div className="docs-container">
      {/* -------- 사이드바 -------- */}
      {step !== "loading" && (
        <aside className="docs-sidebar">
          <h2 className="docs-sidebar-title">DEEP DATA</h2>
          <div className="step-wrapper">
            {["등록", "질문 생성", "답변", "결과"].map((label, index) => (
              <div key={index} className="step-item">
                <div
                  className={`step-circle ${
                    (step === "upload" && index === 0) ||
                    (step === "loading" && index === 1) ||
                    (step === "result" && index === 1) ||
                    (step === "loadingAnswer" && index === 2) ||
                    (step === "customerAnswer" && index === 2)
                      ? "active"
                      : ""
                  }`}
                >
                  {index + 1}
                </div>
                <div className="step-label">{label}</div>
                {index < 3 && <div className="step-line"></div>}
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* -------- 메인 -------- */}
      <main className="docs-main">
        {/* ===================== 업로드 단계 ===================== */}
        {step === "upload" && (
          <>
            <h1 className="docs-title">문서 등록</h1>
            <p className="docs-subtitle">
              모델 평가 전 문서를 업로드하고 사용할 모델을 선택해주세요.
            </p>

            <form
              id="uploadForm"
              onSubmit={handleSubmit}
              className="upload-box"
              encType="multipart/form-data"
            >
              <div className="upload-left">
                <p className="upload-text">
                  파일 드래그 & 등록
                  <br />
                  <span className="file-text2">또는 버튼을 눌러 파일 선택</span>
                </p>
                <label htmlFor="fileUpload" className="upload-btn">
                  파일 선택
                </label>
                <input
                  type="file"
                  id="fileUpload"
                  hidden
                  onChange={handleFileChange}
                />
                {file && <p className="file-name">{file.name}</p>}
              </div>

              <div className="upload-right">
                <div className="file-model-box">
                  <p>질의 생성 모델 선택</p>
                  <select
                    value={qModel}
                    onChange={(e) => setQModel(e.target.value)}
                  >
                    {QGEN_MODELS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="file-model-box">
                  <p>평가 모델 선택</p>
                  <select
                    value={eModel}
                    onChange={(e) => setEModel(e.target.value)}
                  >
                    {EVAL_MODELS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="file-model-box">
                  <p>사용자 모델 선택</p>
                  <select
                    value={uModel}
                    onChange={(e) => setUModel(e.target.value)}
                  >
                    {USER_MODELS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="btn-box inside">
                  <button type="submit" className="file-next-btn">
                    업로드
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {/* ===================== 로딩 ===================== */}
        {step === "loading" && (
          <div className="loading-fullscreen">
            <div className="loading-spinner"></div>
            <p>문서를 분석 중입니다...</p>
          </div>
        )}

        {/* ===================== 질문 회전 ===================== */}
        {step === "result" && (
          <div
            className={`question-box carousel-rotate ${
              flip ? "rotate-in" : "rotate-out"
            }`}
          >
            <h2 className="question-title">생성된 질문</h2>
            <ul>
              {visibleQuestions.map((q, i) => (
                <li key={i} className="question-item">
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ===================== 모델 답변 로딩 ===================== */}
        {step === "loadingAnswer" && (
          <div className="loading-fullscreen">
            <div className="loading-spinner"></div>
            <p>고객 모델이 답변을 생성 중입니다...</p>
          </div>
        )}

        {/* ===================== 고객 모델 답변 회전 ===================== */}
        {step === "customerAnswer" && (
          <section
            className={`customer-answer carousel-rotate ${
              answerFlip ? "rotate-in" : "rotate-out"
            }`}
          >
            <h2 className="answer-title">생성된 고객 모델 답변</h2>
            <div className="answer-container">
              {visibleAnswers.map((ans, i) => (
                <div key={i} className="answer-card">
                  <p className="question">{ans.question}</p>
                  <p className="answer">{ans.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
