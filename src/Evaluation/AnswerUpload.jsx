import "../css/AnswerUpload.css";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import http from "../js/http";

export default function AnswerUpload() {
  const navigate = useNavigate();
  const { state } = useLocation();
  // ---- 평가 모델 선택 상태 및 유저 ID ----
  const [evalModelName, setEvalModelName] = useState("");
  const [selectedModel, setSelectedModel] = useState(null); // 전체 모델 객체


  // ============ 상태: 문서 목록 & 선택값 ============
  // 초기값을 이전 페이지(state?.documentId)로 맞추고 없으면 빈값
  const [documentList, setDocumentList] = useState([]);
  const initialDocId = state?.documentId ? String(state.documentId) : "";
  const [selectedDocument, setSelectedDocument] = useState(initialDocId);


  // 평가용 모델 카탈로그(tb_model) 목록
  const [models, setModels] = useState([]);          // [{modelId, name, provider, ...}]
  const [loadingModels, setLoadingModels] = useState(true);

  const [answerText, setAnswerText] = useState("");
  const placeholder =
    state?.placeholder || "답변 텍스트를 여기에 입력하세요";
  const documentId = state?.documentId ?? null;

  // ======== Debug helpers ========
  const tlog = (...args) => {
    const ts = new Date().toISOString();
    // eslint-disable-next-line no-console
    console.log("[ANS][" + ts + "]", ...args);
  };
  const pick = (obj, keys) => {
    const out = {}; if (!obj) return out; keys.forEach(k => out[k] = obj[k]); return out;
  };
  const parseAxiosError = (err) => {
    const status = err?.response?.status ?? null;
    const data = err?.response?.data ?? null;
    const text = typeof data === "string" ? data : JSON.stringify(data);
    return { status, text, url: err?.config?.url, method: err?.config?.method };
  };

  const handleAnswerTextChange = (e) => {
    setAnswerText(e.target.value);
  }

  const handleEvalModelChange = (e) => {
    const name = e.target.value;
    setEvalModelName(name);
    const found = models.find((m) => m.name === name) || null;
    setSelectedModel(found);
  };

  // ============ 문서 목록 로드(useEffect) ============
  // 세션 기반으로 내 문서 목록을 스프링에서 가져옵니다: GET /api/files
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await axios.get("/api/files", { withCredentials: true });
        if (!alive) return;
        const list = Array.isArray(data) ? data : [];
        setDocumentList(list);

        // 초기 선택 없으면 첫 항목으로 자동 설정
        if (!selectedDocument && list.length > 0) {
          setSelectedDocument(String(list[0].documentId));
        }
      } catch (e) {
        console.error("문서 목록 불러오기 실패:", e);
        setDocumentList([]);
      }
    })();
    return () => { alive = false; };
  }, []);

  // 평가용 모델 목록 로드 (tb_model, model_role='EVALUATION')
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingModels(true);
        const { data } = await axios.get("/api/models/eval", {
          withCredentials: true,
        });
        if (!alive) return;
        const list = Array.isArray(data) ? data : [];
        setModels(list);
        if (list.length > 0) {
          // 기본 선택값: 첫 번째 모델
          setEvalModelName(list[0].name);
          setSelectedModel(list[0]);
        }
      } catch (e) {
        console.error("평가용 모델 목록 로드 실패:", e);
        setModels([]);
      } finally {
        if (alive) setLoadingModels(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  // ---------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalDocumentId = Number(selectedDocument || documentId);
    if (!finalDocumentId) { alert("문서를 먼저 선택해주세요."); return; }
    if (!answerText.trim()) { alert("답변 텍스트를 입력해주세요."); return; }
    if (!selectedModel) { alert("평가용 모델을 선택해주세요."); return; }

    // 1) ✅ 스프링에 엔서 저장 (documentId 기반)
    let answerId = null;
    let questionId = null;
    const t0 = performance.now();
    try {
      tlog("CALL SPRING /answers payload=", { documentId: finalDocumentId, answerTextLen: answerText.length });
      const { data } = await http.post("/answers", { documentId: finalDocumentId, answerText });
      const t1 = performance.now();
      // 바깥 스코프 변수에 대입
      answerId = data?.answerId ?? data?.id ?? data?.data?.answerId ?? null;
      questionId = data?.questionId ?? data?.data?.questionId ?? null;
      tlog(`RESP SPRING /answers in ${(t1 - t0).toFixed(0)}ms`, pick(data, ["answerId","questionId","status","ok"]) );
      if (!answerId) {
        tlog("SPRING /answers missing answerId, raw=", data);
        alert("answerId를 받지 못했습니다. (스프링 응답 확인 필요)");
        return;
      }
      if (!questionId) {
        tlog("SPRING /answers missing questionId, raw=", data);
      }
    } catch (e) {
      const info = parseAxiosError(e);
      tlog("SPRING /answers FAIL", info);
      alert(`엔서를 저장하지 못했습니다.\nstatus=${info.status}\nurl=${info.url}\nbody=${(info.text||"").slice(0,200)}`);
      return;
    }

    // 2) ✅ FastAPI에 평가 트리거 (documentId + answerId + questionId + 모델)
    const payload = {
      documentId: finalDocumentId,
      answerId,
      questionId,
      evalModel: selectedModel,
    };
    try {
      tlog("CALL /worker/submit-answer payload=", payload);
      const { data } = await axios.post(
        "/worker/submit-answer",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      tlog("RESP /worker/submit-answer", data);

      // FastAPI는 { ok:boolean, step?:string, spring?:{status,text}, message?:string } 형태를 기대
      if (data?.ok || data?.success) {
        alert(data?.message || "평가 요청이 접수되었습니다.");
        navigate("/users/result");
      } else {
        const step = data?.step || "unknown";
        const s = data?.spring?.status ?? "-";
        const txt = data?.spring?.text ? String(data.spring.text).slice(0, 200) : "";
        alert(`평가 중 오류가 발생했습니다.\nstep=${step}\nstatus=${s}\n${txt}`);
      }
    } catch (err) {
      const info = parseAxiosError(err);
      tlog("/worker/submit-answer FAIL", info);
      alert(`평가 요청 중 오류가 발생했습니다.\nstatus=${info.status}\nurl=${info.url}\nbody=${(info.text||"").slice(0,200)}`);
    }
  };

     const handleLogoClick = () => {
    navigate("/users/main2");
  };
  return (
    <div className="ans-container">
      <aside className="domain-sidebar">
        <h2 className="domain-sidebar-title"  onClick={handleLogoClick} style={{cursor: "pointer"}}>DEEP DATA</h2>
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
                className={`step-circle ${index === 3 ? "active" : index < 3 ? "completed" : ""
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
        {/* ============ 셀렉트 렌더링 (라벨 뒤에 " Question" 붙이기) ============ */}
          <div className="doc-select">
            <select
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}
              required
            >
              <option value="">-- 문서 선택 --</option>
              {documentList.map((doc) => {
                // 백엔드의 필드명이 documentTitle 이므로 우선 사용, 없으면 title 대체
                const labelBase = doc.documentTitle || doc.title || `문서 ${doc.documentId}`;
                return (
                  <option key={doc.documentId} value={doc.documentId}>
                    {`${labelBase} Question`}
                  </option>
                );
              })}
            </select>
          </div>
          <textarea
            placeholder={placeholder}
            className="answer-textarea"
            value={answerText}
            onChange={handleAnswerTextChange}
            rows={10}
          />
          {/* 평가용 모델 선택 시작 */}
          <div className="model-box">
            <p>평가용 모델 선택</p>
            {loadingModels ? (
              <div>모델 목록을 불러오는 중...</div>
            ) : (
              <select value={evalModelName} onChange={handleEvalModelChange} required>
                {models.map((m) => (
                  <option key={m.modelId} value={m.name}>
                    {m.name}{m.provider ? ` / ${m.provider}` : ""}
                  </option>
                ))}
              </select>
            )}
            {/* 평가용 모델 선택 끝 */}
          </div>
          <button className="ans-btn" type="submit">
            평가 실행
          </button>
        </form>
      </main>
    </div>
  );
}
