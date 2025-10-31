import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/Qmake.css";
import React from "react";
import { fetchFlatQuestionsByDoc } from "../js/documentApi";
import axios from "axios";

export default function Qmake() {
  const navigate = useNavigate();
  const location = useLocation();
  const [documentId, setDocumentId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ✅ 문서 ID 결정 우선순위: (1) URL ?documentId → (2) 내 최신 질문 documentId → (3) 최신 업로드 문서
  useEffect(() => {
    const resolveDocumentId = async () => {
      try {
        // (1) URL 쿼리파라미터 우선
        const sp = new URLSearchParams(location.search);
        const fromUrl = sp.get("documentId");
        if (fromUrl) {
          setDocumentId(Number(fromUrl));
          return;
        }

        // (2) 내 최신 질문 묶음의 documentId
        try {
          const mine = await axios.get("/api/questions/mine", { withCredentials: true });
          const latestQ = Array.isArray(mine.data) ? mine.data[0] : null; // DESC 가정
          if (latestQ?.documentId) {
            setDocumentId(latestQ.documentId);
            return;
          }
        } catch (_) { /* fallback 진행 */ }

        // (3) 최신 업로드 문서
        const res = await axios.get("/api/documents/latest", { withCredentials: true });
        setDocumentId(res?.data?.documentId ?? res?.data?.id);
      } catch (e) {
        console.error("문서 ID 결정 실패:", e);
        setError("문서 ID를 불러오지 못했습니다.");
      }
    };
    resolveDocumentId();
  }, [location.search]);

  // ✅ 질문 목록 불러오기
  const loadQuestions = async () => {
    if (!documentId) return;
    setLoading(true);
    setError("");
    try {
      const list = await fetchFlatQuestionsByDoc(documentId);
      setQuestions(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.response?.data || e?.message || "질문 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) loadQuestions();
  }, [documentId]);

  // ✅ 질문 다운로드
  const handleServerDownload = () => {
    if (!documentId) return;
    const url = `/api/documents/download?documentId=${documentId}`;
    window.open(url, "_self");
  };
  const handleLogoClick = () => {
    navigate("/users/main2");
  };

  return (
    <div className="qmake-container">
      {/* ---- 사이드바 ---- */}
      <aside className="qmake-sidebar">
        <h2 className="qmake-sidebar-title" onClick={handleLogoClick} style={{ cursor: "pointer" }}>DEEP DATA</h2>

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
                className={`step-circle ${index === 2 ? "active" : index < 2 ? "completed" : ""
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

        {/* ✅ 문서 ID + 버튼 한 줄 정렬 */}
        <div className="qmake-top-bar">
          <div className="qmake-doc-id">
            {documentId ? (
              <>
                문서 ID: <b>{documentId}</b>
              </>
            ) : error ? (
              <span style={{ color: "crimson" }}>{error}</span>
            ) : (
              <span>문서 ID 불러오는 중...</span>
            )}
          </div>

          <div className="q-btns-inline">
            <button
              className="qmake-btn"
              onClick={() => setShowModal(true)}
              disabled={questions.length === 0}
            >
              전체보기
            </button>
            <button
              className="qmake-btn"
              onClick={handleServerDownload}
              disabled={!documentId}
            >
              질문 다운로드
            </button>
          </div>
        </div>

        {/* 질문 박스 */}
        <div className="qmake-q-box">
          {!loading && !error && questions.length > 0 ? (
            questions.slice(0, 5).map((text, i) => (
              <div key={i} className="q-item">
                <span className="q-number">Q{i + 1}.</span>
                <span className="q-text">{String(text ?? "")}</span>
              </div>
            ))
          ) : (
            !loading &&
            !error && <p>질문 데이터가 없습니다.</p>
          )}
        </div>

        {/* 카드 영역 */}
        <div className="qmake-card-wrapper">
          <div className="qmake-card">
            <h3>직접 답변 입력하기</h3>
            <p>생성된 Q를 다운로드하여 직접 모델을 돌린 후 제출할 수 있습니다.</p>
            <button
              className="run-btn"
              onClick={() =>
                navigate("/users/answerUpload", {
                  state: {
                    documentId,
                    placeholder: (questions || [])
                      .map((q, i) => `Q${i + 1}. ${String(q ?? "")}`)
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
            <p>사용자 모델을 등록하면 자동으로 답변이 생성되고 평가가 진행됩니다.</p>
            <button
              className="run-btn"
              onClick={() => navigate("/users/modelUpload")}
            >
              진행하기
            </button>
          </div>
        </div>

        {/* 전체보기 모달 */}
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
                  <div key={i} className="modal-q-item">
                    <span className="q-number">Q{i + 1}.</span>
                    <span className="q-text">{String(q ?? "")}</span>
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
