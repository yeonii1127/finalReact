// src/api/api.js
import axios from "axios";                 // HTTP 요청 라이브러리

const SPRING = "/api";    // 스프링 서버
const PY     = "http://127.0.0.1:8095";    // 파이썬 서버(FastAPI)

/** 파일 업로드: FormData로 보내야 함 */
export async function uploadFile({ file, title, meta }) {
  const fd = new FormData();               // <form> 데이터를 JS에서 만드는 객체
  fd.append("file", file);                 // 키 "file"에 실제 파일 넣기
  if (title) fd.append("title", title);
  if (meta)  fd.append("meta", meta);

  // axios.post(url, data, 옵션)
  const res = await axios.post(`${SPRING}/files`, fd, {
    withCredentials: true,                 // 세션 쿠키 포함(로그인 유지)
    headers: { "Content-Type": "multipart/form-data" }, // 파일 업로드 헤더
  });
  return res.data;                         // 서버가 준 JSON 본문
}

/** 특정 문서에 달린 질문 목록 조회 */
export async function fetchQuestionsByDoc(documentId) {
  const res = await axios.get(`${SPRING}/questions`, {
    params: { documentId },                // ?documentId=123 쿼리스트링 자동 생성
    withCredentials: true,
  });
  return res.data;                         // Question[]
}

/** 파이썬에 "질문 생성" 요청 (파이썬이 생성 후 스프링에 콜백 저장) */
export async function requestQGen({ documentId, modelName, modelId, lang = "ko" }) {
  const res = await axios.post(`${PY}/generate-questions`, {
    documentId,
    genQModel: { name: modelName, modelId },
    lang,
  });
  return res.data;                         // { ok: true, count: … }
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