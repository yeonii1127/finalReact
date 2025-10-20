import "../css/Signup.css";
import { signup } from "../js/authApi";
import { useState } from "react";
import logo from "../assets/로고.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import React, { useEffect } from "react";
import bg3 from "../assets/bg3.jpg";
export default function Signup() {
  const navigate = useNavigate();

  // form 상태 관리: input 값 저장용
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    birth: "", // input[type="date"]이므로 YYYY-MM-DD 형식이 들어옴
  });
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

  const [loading, setLoading] = useState(false); // 버튼 비활성화/로딩용
  const [errMsg, setErrMsg] = useState(""); // 에러 메시지 출력용

  /**
   * 입력 변경 핸들러
   * 모든 input 태그에 name 속성을 지정해두면
   * e.target.name, e.target.value 로 각각의 상태를 쉽게 갱신 가능
   */
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * 간단한 클라이언트 유효성 검사
   * - 이메일 형식 체크
   * - 비밀번호 길이 체크
   * - 이름/생일 입력 여부 체크
   * (프론트에서 한번 걸러주지만, 백엔드에서도 동일한 검증을 반드시 해야 함)
   */
  const validate = () => {
    if (!form.email.includes("@")) return "이메일 형식을 확인해 주세요.";
    if (form.password.length < 6) return "비밀번호는 6자 이상 입력해 주세요.";
    if (!form.name.trim()) return "이름을 입력해 주세요.";
    if (!form.birth) return "생년월일을 선택해 주세요.";
    return "";
  };

  /**
   * 회원가입 버튼 클릭 시 실행되는 함수
   * 1️⃣ 유효성 검사 → 실패 시 메시지 표시
   * 2️⃣ 백엔드 API 요청 → 성공 시 alert + 로그인 페이지로 이동
   * 3️⃣ 실패 시 백엔드에서 받은 에러 메시지 출력
   */
  const onSubmit = async (e) => {
    e.preventDefault(); // form의 기본 submit(새로고침) 방지
    setErrMsg("");
    const v = validate();
    if (v) return setErrMsg(v); // 유효성 실패 시 즉시 리턴

    setLoading(true); // 로딩 시작 (버튼 비활성화 등)
    try {
      // signup(form) → authApi.js의 axios.post("/auth/signup", {...})
      await signup(form);
      alert("회원가입 완료! 로그인해 주세요.");
      navigate("/auth/login"); // ✅ 화면 이동은 React가 직접 수행
    } catch (err) {
      console.error(err.response);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "회원가입에 실패했습니다.";
      setErrMsg(typeof msg === "string" ? msg : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  /**
   * JSX 반환부:
   * - 간단한 회원가입 폼 UI
   * - 각 input은 onChange로 상태 업데이트
   * - 에러 메시지는 빨간 글씨로 출력
   */
  return (
    <div className="signup-wrapper">
      <header className="login-navbar">
        <div className="nav-left">
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
      <div>
        <div className="signup-box">
          <h3 className="signup-title">회원가입</h3>
          <form onSubmit={onSubmit}>
            <div className="signup-group">
              <input
                name="email"
                placeholder="이메일"
                value={form.email}
                onChange={onChange}
              />
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={onChange}
              />
              <br />
              <input
                name="name"
                placeholder="이름"
                value={form.name}
                onChange={onChange}
              />
              <br />
              <input
                type="date"
                value={form.birth}
                onChange={onChange}
                name="birth"
                min="1900-01-01"
                max="2025-12-31"
              />
              <br />
            </div>

            {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}

            <button type="submit" className="signup-btn">
              가입하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
