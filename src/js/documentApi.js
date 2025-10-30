// src/api/api.js
import axios from "axios";                 // HTTP 요청 라이브러리

const SPRING = "/api";    // 스프링 서버
const PY = "/worker";    // 파이썬 서버(FastAPI)

/** 파일 업로드: FormData로 보내야 함 */
export async function uploadFile({ file, title, meta }) {
  const fd = new FormData();               // <form> 데이터를 JS에서 만드는 객체
  fd.append("file", file);                 // 키 "file"에 실제 파일 넣기
  if (title) fd.append("title", title);
  if (meta)  fd.append("meta", meta);

  // axios.post(url, data, 옵션)
  const res = await axios.post(`${SPRING}/files`, fd, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  const d = res?.data ?? {};
  // ✅ 다양한 형태 방어적으로 수용
  const documentId = d.documentId ?? d.id ?? d.document_id ?? d?.data?.documentId ?? d?.data?.id;
  if (documentId == null) {
    console.warn("uploadFile 응답에서 documentId를 찾을 수 없음:", d);
  }
  return { ...d, documentId };
}

/** 특정 문서에 달린 질문 목록 조회 */
export async function fetchQuestionsByDoc(documentId) {
  const res = await axios.get(`${SPRING}/questions`, {
    params: { documentId },                // ?documentId=123 쿼리스트링 자동 생성
    withCredentials: true,
  });
  return res.data;                         // Question[]
}

/** 파이썬(q_gen.py 단일파일 서버)에 질문 생성 요청
 *  - 리액트에서 받은 전체 모델 객체(genQModel)를 그대로 전달
 *  - userId, documentId, genQModel, lang
 */
export async function requestQGen({ userId, documentId, genQModel, lang = "ko" }) {
  const res = await axios.post(`${PY}/run-by-document`, {
    userId,
    documentId,
    genQModel, // { modelId, name, provider, modelKey, modelRole, params, createdAt }
    lang,
  });
  return res.data; // { ok, count, filePath, spring:{...} }
}

// 질문 JSON을 평탄화해서 불러오는 API
export async function fetchFlatQuestionsByDoc(documentId) {
  const res = await axios.get(`/api/questions/flat`, {
    params: { documentId },
    withCredentials: true,
  });
  return res.data; // ["질문1","질문2","질문3",...]
}

/** GEN_Q 모델 목록 조회 (DB에서 가져옴) */
export async function fetchGenQModels() {
  const res = await axios.get(`${SPRING}/models/genQ`, {
    withCredentials: true,
  });
  return res.data; // Models[]
}

/** EVALUATION 모델 목록 조회 (DB에서 가져옴) */
export async function fetchEvalModels() {
  const res = await axios.get(`${SPRING}/models/eval`, {
    withCredentials: true,
  });
  return res.data; // Models[]
}

/** USERMODEL 목록 조회 (DB에서 가져옴) */
export async function fetchUserModels() {
  const res = await axios.get(`${SPRING}/models/user`, {
    withCredentials: true,
  });
  return res.data; // Models[]
}
/** FastAPI: 문서 진행 상태 조회 */
export async function getWorkerStatus(documentId) {
  const res = await axios.get(`${PY}/status/${documentId}`);
  return res.data; // { status, progress, message, updatedAt } 또는 DEFAULT_STATUS
}

/** FastAPI: 파이프라인 시작 */
export async function startPipeline({ userId, documentId, userModel, genQModel, evalModel }) {
  const payload = { userId, documentId, userModel, genQModel, evalModel };
  const res = await axios.post(`${PY}/start-pipeline`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data; // FastAPI의 응답(JSON)
}

/** 유틸: 질문을 항상 3개로 맞춰 반환 (마지막에 1~2개면 처음에서 이어붙임) */
export function buildQuestionTriplet(questions, startIndex = 0) {
  if (!Array.isArray(questions) || questions.length === 0) return [];
  const base = questions.slice(startIndex, startIndex + 3);
  if (base.length === 3) return base;
  const need = 3 - base.length;
  return base.concat(questions.slice(0, need));
}

/** 특정 문서에 달린 답변 목록 조회 */
export async function fetchAnswersByDoc(documentId) {
  const res = await axios.get(`/api/answers/mine`, {
    params: { documentId },                // ?documentId=123
    withCredentials: true,
  });
  return res.data;                         // Answer[]
}

/** 답변 JSON을 평탄화해서 불러오기 */
export async function fetchFlatAnswersByDoc(documentId) {
  const res = await axios.get(`/api/answers/flat`, {
    params: { documentId },
    withCredentials: true,
  });
  return res.data; // ["답변1","답변2",...]
}