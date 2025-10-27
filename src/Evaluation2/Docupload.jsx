import "../css_2/docupload.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchGenQModels,
  fetchEvalModels,
  fetchUserModels,
  uploadFile,
  fetchFlatQuestionsByDoc,
  fetchFlatAnswersByDoc,
} from "../js/documentApi";

export default function Docupload() {
  const navigate = useNavigate();
  const USER_ID = 41; // TODO: 로그인 연동 시 교체

  // ===== 상태 변수 =====
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState(null);

  const [qModels, setQModels] = useState([]);
  const [eModels, setEModels] = useState([]);
  const [uModels, setUModels] = useState([]);

  const [qModel, setQModel] = useState("");
  const [eModel, setEModel] = useState("");
  const [uModel, setUModel] = useState("");

  const [step, setStep] = useState("upload"); // upload | loading | Q_GEN_DONE | A_GEN_DONE
  const [flip, setFlip] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [pairs, setPairs] = useState([]); // [{ q, a }]
  const [pairPage, setPairPage] = useState(0);
  const [pairFlip, setPairFlip] = useState(true);

  // ==== 파일 선택 ====
  const handleFileChange = (e) => setFile(e.target.files?.[0] ?? null);

  // ==== 모델 선택 매핑 ====
  const pickModel = (list, selected) => {
    const found = list.find((m) => (m.modelKey || m.name) === selected);
    return found ? { name: found.name, modelId: found.modelId } : null;
  };

  // ✅ DB에서 모델 목록 로드
  useEffect(() => {
    (async () => {
      try {
        const [genQ, evals, users] = await Promise.all([
          fetchGenQModels(),
          fetchEvalModels(),
          fetchUserModels(),
        ]);

        setQModels(genQ || []);
        setEModels(evals || []);
        setUModels(users || []);

        if (genQ?.length) setQModel(genQ[0].modelKey || genQ[0].name);
        if (evals?.length) setEModel(evals[0].modelKey || evals[0].name);
        if (users?.length) setUModel(users[0].modelKey || users[0].name);
      } catch (err) {
        console.error("모델 목록 불러오기 실패:", err);
        alert("모델 목록을 불러오지 못했습니다.");
      }
    })();
  }, []);

  // ✅ 파일 업로드 + 파이프라인 시작
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("파일을 선택해주세요.");
    if (!qModel || !eModel || !uModel) return alert("모델을 모두 선택해주세요.");

    try {
      setStep("loading");

      // (1) 파일 업로드
      const uploadResp = await uploadFile({ file });
      const docId = uploadResp?.documentId ?? uploadResp?.data?.documentId;
      if (!docId) throw new Error("documentId를 응답에서 찾을 수 없습니다.");
      setDocumentId(docId);

      // (2) 모델 객체 구성
      const payload = {
        userId: USER_ID,
        documentId: docId,
        userModel: pickModel(uModels, uModel),
        genQModel: pickModel(qModels, qModel),
        evalModel: pickModel(eModels, eModel),
      };

      // (3) FastAPI 호출
      const resp = await fetch("http://127.0.0.1:8095/start-pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`파이썬 요청 실패: ${text}`);
      }
    } catch (err) {
      console.error("업로드 오류:", err);
      alert(`업로드 실패: ${err.message}`);
      setStep("upload");
    }
  };

  // ✅ 폴링: FastAPI 상태 체크
  useEffect(() => {
    if (!documentId) return;

    let stopped = false;
    const poll = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8095/status/${documentId}`);
        const data = await res.json();
        const status = data?.status ?? "UNKNOWN";
        if (stopped) return;

        if (status === "Q_GEN_DONE") {
          setStep("Q_GEN_DONE");
          const qList = await fetchFlatQuestionsByDoc(documentId);
          setQuestions(Array.isArray(qList) ? qList : []);
        } else if (status === "A_GEN_DONE") {
          setStep("A_GEN_DONE");
          const qList = await fetchFlatQuestionsByDoc(documentId);
          const aList = await fetchFlatAnswersByDoc(documentId);

          const len = Math.min(qList.length, aList.length);
          const combined = Array.from({ length: len }, (_, i) => ({
            q: qList[i]?.questionText ?? qList[i],
            a: aList[i],
          }));
          setPairs(combined);
        } else if (status === "EVAL_DONE") {
          stopped = true;
          navigate("/users/result2");
        } else {
          setStep("loading");
        }
      } catch (e) {
        console.error("상태 확인 실패:", e);
      }
    };

    poll();
    const id = setInterval(poll, 2000);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [documentId, navigate]);

  // ✅ 질문 회전
  useEffect(() => {
    if (step !== "Q_GEN_DONE" || !questions.length) return;
    const interval = setInterval(() => {
      setFlip(false);
      setTimeout(() => {
        const pages = Math.ceil(questions.length / 3);
        setCurrentPage((p) => (p + 1) % pages);
        setFlip(true);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, [step, questions]);

  // ✅ Q/A 회전
  useEffect(() => {
    if (step !== "A_GEN_DONE" || !pairs.length) return;
    const interval = setInterval(() => {
      setPairFlip(false);
      setTimeout(() => {
        const pages = Math.ceil(pairs.length / 3);
        setPairPage((p) => (p + 1) % pages);
        setPairFlip(true);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, [step, pairs]);

  // ==== 3개씩 보여주기 ====
  const getTriplet = (page, list) => {
    const idx = page * 3;
    return list.slice(idx, idx + 3);
  };
  const visibleQuestions = getTriplet(currentPage, questions);
  const visiblePairs = getTriplet(pairPage, pairs);

  // ==== 로고 클릭 ====
  const handleLogoClick = () => navigate("/users/main2");

  return (
    <div className="docs-container">
      {/* -------- 사이드바 -------- */}
      {step !== "loading" && (
        <aside className="docs-sidebar">
          <h2
            className="docs-sidebar-title"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          >
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

      {/* -------- 메인 -------- */}
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
                  <select
                    value={qModel}
                    onChange={(e) => setQModel(e.target.value)}
                  >
                    {qModels.map((m) => (
                      <option key={m.modelId} value={m.modelKey || m.name}>
                        {m.name}
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
                    {eModels.map((m) => (
                      <option key={m.modelId} value={m.modelKey || m.name}>
                        {m.name}
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
                    {uModels.map((m) => (
                      <option key={m.modelId} value={m.modelKey || m.name}>
                        {m.name}
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

        {/* 로딩 */}
        {step === "loading" && (
          <div className="loading-fullscreen">
            <div className="loading-spinner"></div>
            <p>문서를 분석 중입니다...</p>
          </div>
        )}

        {/* 질문 회전 */}
        {step === "Q_GEN_DONE" && (
          <div
            className={`question-box carousel-rotate ${
              flip ? "rotate-in" : "rotate-out"
            }`}
          >
            <h2 className="question-title">생성된 질문</h2>
            <ul>
              {visibleQuestions.map((q, i) => (
                <li key={i} className="question-item">
                  {typeof q === "string" ? q : q?.questionText}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Q/A 회전 */}
        {step === "A_GEN_DONE" && (
          <section
            className={`customer-answer carousel-rotate ${
              pairFlip ? "rotate-in" : "rotate-out"
            }`}
          >
            <h2 className="answer-title">질문 · 답변 매칭</h2>
            <div className="answer-container">
              {visiblePairs.map((p, i) => (
                <div key={i} className="answer-card">
                  <p className="question">
                    <b>Q{i + 1}.</b> {p.q}
                  </p>
                  <p className="answer">
                    <b>A{i + 1}.</b> {p.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
