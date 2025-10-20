import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../css/Qmake.css";
import React from "react";
import { fetchQuestionsByDoc } from "../js/documentApi";
import axios from "axios";

export default function Qmake() {
  const navigate = useNavigate();

  // 상태값
  const [documentId, setDocumentId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 로그인 세션 기반 문서 ID 불러오기
  useEffect(() => {
    const fetchLatestDoc = async () => {
      try {
        const res = await axios.get("/api/documents/latest", {
          withCredentials: true,
        });
        setDocumentId(res.data.documentId);
      } catch (e) {
        console.error("문서 ID 조회 실패:", e);
        setError("문서 ID를 불러오지 못했습니다.");
      }
    };
    fetchLatestDoc();
  }, []);

  // 질문 불러오기
  const loadQuestions = async () => {
    if (!documentId) return;
    setLoading(true);
    setError("");
    try {
      const list = await fetchQuestionsByDoc(documentId);
      setQuestions(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data || e?.message || "질문 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  // 질문 다운로드
  const handleDownload = () => {
    const lines = questions.map((q) => q.questionText ?? String(q ?? ""));
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `generated_questions_doc_${documentId ?? "unknown"}.txt`;
    link.click();
  };
  const handleServerDownload = () => {
    if (!documentId) return;
    // 프록시(/api → 8080) 덕분에 같은 오리진처럼 동작 → 세션 쿠키 자동 포함
    const url = `/api/documents/download?documentId=${documentId}`;
    // 새 탭/다운로드 트리거
    window.open(url, "_self"); // 새 탭 원하면 "_blank"
  };

  return (
    <div className="qmake-container">
      {/* ---- 사이드바 ---- */}
      <aside className="qmake-sidebar">
        <h2 className="qmake-sidebar-title">DEEP DATA</h2>

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
                  index === 2 ? "active" : index < 2 ? "completed" : ""
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
      <main className="qmake-main">
        <h1 className="qmake-title">생성된 질의(Q) 확인</h1>
        <p className="qmake-subtitle">
          업로드된 파일을 기반으로 생성된 질문을 확인하세요.
        </p>

        {documentId && (
          <p style={{ marginBottom: 8 }}>
            문서 ID: <b>{documentId}</b>
          </p>
        )}
        {loading && <p>불러오는 중...</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <div className="qmake-q-box">
          {!loading && !error && questions.length > 0
            ? questions.slice(0, 5).map((q, i) => (
                <div key={q.questionId ?? i} className="q-item">
                  <span className="q-number">Q{i + 1}.</span>
                  <span className="q-text">
                    {q.questionText ?? String(q ?? "")}
                  </span>
                </div>
              ))
            : !loading && !error && <p>질문 데이터가 없습니다.</p>}
        </div>

        <div className="q-btns">
          <button
            className="qmake-btn"
            onClick={() => setShowModal(true)}
            disabled={questions.length === 0}
          >
            전체보기
          </button>
          {/* 살짝 바뀜 button */}
          <button
            className="qmake-btn"
            onClick={handleServerDownload}
            disabled={!documentId}
          >
            질문 다운로드
          </button>
        </div>

        <div className="qmake-card-wrapper">
          <div className="qmake-card">
            <h3>직접 답변 입력하기</h3>
            <p>
              생성된 Q를 다운로드하여 직접 모델을 돌린 후 제출할 수 있습니다.
            </p>
            <button
              className="run-btn"
              onClick={() =>
                navigate("/users/answerUpload", {
                  state: {
                    documentId, // 있으면 함께 전달
                    placeholder: (questions || [])
                      .map(
                        (q, i) =>
                          `Q${i + 1}. ${q?.questionText ?? String(q ?? "")}`
                      )
                      .join("\n\n"),
                  },
                })
              }
            >
              진행하기
            </button>
          </div>

          <div className="qmake-card">
            <h3>내 모델 등록하기</h3>
            <p>
              사용자 모델을 등록하면 자동으로 답변이 생성되고 평가가 진행됩니다.
            </p>
            <button
              className="run-btn"
              onClick={() => navigate("/users/modelUpload")}
            >
              진행하기
            </button>
          </div>
        </div>

        {showModal && (
          <div
            className="qmake-modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div
              className="qmake-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>전체 질문 목록</h2>
              <div className="qmake-modal-questions">
                {questions.map((q, i) => (
                  <div key={q.questionId ?? i} className="modal-q-item">
                    <span className="q-number">Q{i + 1}.</span>
                    <span className="q-text">
                      {q.questionText ?? String(q ?? "")}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className="qmake-modal-close"
                onClick={() => setShowModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
