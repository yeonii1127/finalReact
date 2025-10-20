import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // ✅ JSESSIONID 쿠키 왕복
});

// 중복 리다이렉트 방지용 플래그
let redirecting = false;

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    // 세션 없음/만료 → 로그인 페이지로 이동
    if (status === 401 && !redirecting) {
      redirecting = true;

      // (선택) 표시용 로그인 정보가 있다면 지우기
      try { localStorage.removeItem("loginUser"); } catch {}

      // 현재가 이미 /login 이면 루프 방지
      if (window.location.pathname !== "/auth/login") {
        // 메시지를 띄우고 싶다면:
        // alert("로그인이 필요합니다.");
        window.location.assign("/auth/login");
      } else {
        redirecting = false; // 이미 로그인 페이지면 플래그 해제
      }
    }

    return Promise.reject(err);
  }
);

export default http;