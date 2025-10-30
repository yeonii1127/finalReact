import "../css_2/docupload.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Docupload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [step, setStep] = useState("upload"); // upload | loading | Q_GEN_DONE | A_GEN_DONE
  const [flip, setFlip] = useState(true);
  const [progress, setProgress] = useState(0);

  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pairs, setPairs] = useState([]);
  const [pairPage, setPairPage] = useState(0);
  const [pairFlip, setPairFlip] = useState(true);

  const handleFileChange = (e) => setFile(e.target.files?.[0] ?? null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep("loading");
    setProgress(0);
  };

  // 로딩 후 질문 표시
  useEffect(() => {
    if (step === "loading") {
      const timeout = setTimeout(() => {
        setStep("Q_GEN_DONE");
        setQuestions([
          { questionText: "이 문서의 주요 목적은 무엇인가요?" },
          { questionText: "해당 제도의 대상 범위는 어떻게 정의되나요?" },
          { questionText: "문서에서 제시된 핵심 정책은 무엇인가요?" },
          { questionText: "이 규정이 시행되면 어떤 효과가 기대되나요?" },
          { questionText: "관련 기관의 역할은 무엇인가요?" },
          { questionText: "주요 조항의 예외 사항은 무엇인가요?" },
        ]);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  // 질문/답변 전환 및 애니메이션 + 진행바
  useEffect(() => {
    if (step !== "Q_GEN_DONE" && step !== "A_GEN_DONE") return;

    const isQuestionStep = step === "Q_GEN_DONE";
    const totalPages = Math.ceil(
      (isQuestionStep ? questions.length : pairs.length) / 3
    );

    // 회전 애니메이션
    const flipInterval = setInterval(() => {
      if (isQuestionStep) {
        setFlip(false);
      } else {
        setPairFlip(false);
      }
      setTimeout(() => {
        if (isQuestionStep) {
          setCurrentPage((prev) => (prev + 1) % totalPages);
          setFlip(true);
        } else {
          setPairPage((prev) => (prev + 1) % totalPages);
          setPairFlip(true);
        }
      }, 500);
    }, 3000);

    // 진행바
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (step === "Q_GEN_DONE") {
            setTimeout(() => {
              setStep("A_GEN_DONE");
              setPairs([
                {
                  q: "이 문서의 주요 목적은 무엇인가요?",
                  a: "이 문서는 공공기관의 정보관리 효율성을 높이기 위한 목적을 가지고 있습니다.",
                },
                {
                  q: "해당 제도의 대상 범위는 어떻게 정의되나요?",
                  a: "대상은 행정기관과 산하 공공단체로 한정되어 있습니다.",
                },
                {
                  q: "문서에서 제시된 핵심 정책은 무엇인가요?",
                  a: "핵심 정책은 데이터 표준화와 자동화된 문서 처리입니다.",
                },
                {
                  q: "이 규정이 시행되면 어떤 효과가 기대되나요?",
                  a: "행정 절차 간소화와 효율성 증대가 기대됩니다.",
                },
                {
                  q: "관련 기관의 역할은 무엇인가요?",
                  a: "중앙 행정기관은 정책 감독을, 지방 기관은 실행을 담당합니다.",
                },
                {
                  q: "주요 조항의 예외 사항은 무엇인가요?",
                  a: "보안 관련 정보는 공개 대상에서 제외됩니다.",
                },
              ]);
              setProgress(0);
            }, 1000);
          } else if (step === "A_GEN_DONE") {
            setTimeout(() => navigate("/users/result2"), 4000);
          }
          return 100;
        }
        return prev + 2;
      });
    }, 200);

    return () => {
      clearInterval(flipInterval);
      clearInterval(progressInterval);
    };
  }, [step, questions, pairs]);

  const getTriplet = (page, list) => list.slice(page * 3, page * 3 + 3);
  const visibleQuestions = getTriplet(currentPage, questions);
  const visiblePairs = getTriplet(pairPage, pairs);

  return (
    <div className="docs-container">
      {/* 사이드바 */}
      {step !== "loading" && (
        <aside className="docs-sidebar">
          <h2 className="docs-sidebar-title" style={{ cursor: "pointer" }}>
            DEEP DATA
          </h2>
          <div className="step-wrapper">
            {["등록", "질문 생성", "답변", "결과"].map((label, index) => (
              <div key={index} className="step-item">
                <div
                  className={`step-circle ${
                    (step === "upload" && index === 0) ||
                    (step === "Q_GEN_DONE" && index === 1) ||
                    (step === "A_GEN_DONE" && index === 2)
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

      {/* 메인 */}
      <main className="docs-main">
        {/* 업로드 */}
        {step === "upload" && (
          <>
            <h1 className="docs-title">문서 등록</h1>
            <p className="docs-subtitle">
              모델 평가 전 문서를 업로드하고 사용할 모델을 선택해주세요.
            </p>
            <form onSubmit={handleSubmit} className="upload-box">
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
                  <select>
                    <option>claude-haiku-4-5-20251001 (anthropic)</option>
                    <option>테스트 모델 2</option>
                  </select>
                </div>

                <div className="file-model-box">
                  <p>평가 모델 선택</p>
                  <select>
                    <option>gpt-4o-mini (openai)</option>
                    <option>Gemini 1.5 Pro</option>
                  </select>
                </div>

                <div className="file-model-box">
                  <p>사용자 모델 선택</p>
                  <select>
                    <option>gpt-3.5-turbo (openai)</option>
                    <option>사용자 모델 2</option>
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

        {/* 로딩 */}
        {step === "loading" && (
          <div className="loading-fullscreen">
            <div className="loading-spinner"></div>
            <p className="loading-text">문서를 처리 중입니다...</p>
          </div>
        )}

        {/* 질문 생성 + 답변 생성 */}
        {(step === "Q_GEN_DONE" || step === "A_GEN_DONE") && (
          <>
            <section className="carousel-rotate">
              <div
                className={`answer-container ${
                  (step === "Q_GEN_DONE" ? flip : pairFlip)
                    ? "rotate-in"
                    : "rotate-out"
                }`}
              >
                {(step === "Q_GEN_DONE"
                  ? visibleQuestions
                  : visiblePairs
                ).map((item, i) => (
                  <div key={i} className="answer-card">
                    <p className="question">
                      <b>Q{i + 1}.</b>{" "}
                      {step === "Q_GEN_DONE" ? item.questionText : item.q}
                    </p>
                    {step === "A_GEN_DONE" && (
                      <p className="answer">
                        <b>A{i + 1}.</b> {item.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* progress bar */}
            <div className="mini-progress-wrapper">
              <div className="mini-progress-text">
                {step === "Q_GEN_DONE"
                  ? "문서를 기반으로 사용자 모델이 답변을 생성 중입니다..."
                  : "답변을 분석하고 결과를 정리 중입니다..."}
              </div>
              <div
                className={`mini-progress-bar ${
                  step === "A_GEN_DONE" ? "green-bar" : ""
                }`}
              >
                <div
                  className="mini-progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mini-progress-percent">{progress}%</div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
