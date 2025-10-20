// src/auth/UsersGuard.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import http from "../js/http";
import React from "react";

export default function UsersGuard() {
  const [ok, setOk] = useState(null); // null=로딩, true=통과, false=차단
  const location = useLocation();

  // useEffect(() => {
  //   let alive = true;
  //   (async () => {
  //     try {
  //       await http.get("/auth/check");   // 세션 있으면 200
  //       if (alive) setOk(true);
  //     } catch (e) {
  //       if (alive) setOk(false);             // 세션 없으면 401 → 인터셉터가 /auth/login 이동
  //     }
  //   })();
  //   return () => { alive = false; };
  // }, []);

  // if (ok === null) return <div style={{ padding: 24 }}>로그인 상태 확인 중…</div>;
  // if (ok === false) return <Navigate to="/auth/login" state={{ from: location }} replace />;

  // ✅ 체크 통과 → 아래 모든 자식 페이지가 여기서 렌더링됨
  return <Outlet />;
}