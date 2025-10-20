import "../css/login.css";
import { useState } from "react";
import bg3 from "../assets/bg3.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../js/authApi";
import React from "react";
import logo from "../assets/로고.png";
import { useEffect } from "react";
import http from "../js/http";
export default function Login() {
  // 로그인 후 돌아갈 경로 (보호 라우트에서 넘겨줬다고 가정)
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // input 변동 처리
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${bg3})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundColor = "rgba(255,255,255,0.3)";
    document.body.style.backdropFilter = "blur(15px)";

    // ✅ cleanup (다른 페이지로 넘어가면 원래대로)
    return () => {
      document.body.style.background = "none";
      document.body.style.backdropFilter = "none";
    };
  }, []);

  // 간단한 유효성 검사
  const validate = () => {
    if (!form.email.includes("@")) return "이메일 형식을 확인해 주세요.";
    if (!form.password) return "비밀번호를 입력해 주세요.";
    return "";
  };

  // 제출
  const onSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    const v = validate();
    if (v) return setErrMsg(v);

    setLoading(true);
    try {
      // 서버로 로그인 요청 → 성공 시 세션 쿠키 설정됨(JSESSIONID)
      const { data: user } = await login(form);

      /**
       * 이 시점:
       * - 브라우저 쿠키에 JSESSIONID 저장됨(서버가 Set-Cookie 응답)
       * - 이후 요청은 withCredentials:true 덕분에 자동으로 쿠키 첨부됨
       *
       * 선택) 전역에서 사용자 정보를 쓰고 싶다면 localStorage나 전역상태에 보관
       *  - 보안 상 민감정보(비번, 토큰 등)는 절대 저장 금지
       */
      localStorage.setItem(
        "loginUser",
        JSON.stringify({
          userId: user.userId,
          email: user.userEmail,
          name: user.userName,
        })
      );

      // 로그인 성공 후 이동
      navigate("/users/main", { replace: true });
    } catch (err) {
      // 백엔드에서 401/400 시 보낸 메시지를 최대한 살려서 노출
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "로그인에 실패했습니다. 이메일/비밀번호를 확인해 주세요.";
      setErrMsg(typeof msg === "string" ? msg : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-wrapper">
      <header className="login-navbar">
        <div className="nav-left">
          {/* ✅ 로고 이미지 */}
          <img
            src={logo}
            alt="로고"
            className="site-logo"
            onClick={() => navigate("/auth/main")}
          />
        </div>
        <nav className="nav-menu">
          <ul>
            <li>서비스 이용</li>
            <li>COMPANY</li>
            <li
              className="login-link"
              onClick={() => navigate("/users/domain")}
            >
              데이터 평가
            </li>
            <li>포트폴리오</li>
            <li className="aidic-link" onClick={() => navigate("/auth/aidic")}>
              커뮤니티
            </li>
            <li className="login-link" onClick={() => navigate("/auth/login")}>
              로그인 / 회원가입
            </li>
          </ul>
        </nav>
      </header>
      <div className="login-center">
        <div className="login-box">
          <h3 className="login-title">로그인</h3>

          <form onSubmit={onSubmit}>
            <div className="input-group">
              <label>이메일</label>
              <input
                name="email"
                value={form.email}
                placeholder="you@example.com"
                onChange={onChange}
                autoComplete="username"
              />
            </div>

            <div className="input-group">
              <label>비밀번호</label>
              <input
                name="password"
                type="password"
                value={form.password}
                placeholder="비밀번호 입력"
                onChange={onChange}
                autoComplete="current-password"
              />
            </div>

            <button className="login-btn">로그인</button>
            <span className="signup-text">
              아직 계정이 없으신가요?{" "}
              <span
                className="signup-link"
                onClick={() => navigate("/auth/signup")}
              >
                회원가입
              </span>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
