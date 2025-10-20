// src/App2.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UsersGuard from "./Guard/UsersGuard.jsx";
import UsersMain from "./Evaluation/UserMain.jsx"; // /users/main
import UsersDomain from "./Evaluation/Domain.jsx"; // /users/domain
import Login from "./Evaluation/Login.jsx"; // /auth/login
import NonMain from "./Nonauth/NonMain.jsx"; // 공개 홈(예시)
import Signup from "./Evaluation/Signup.jsx";
import UsersUpload from "./Evaluation/FileUpload.jsx";
import QuestionList from "./Evaluation/Qmake.jsx";
import UserModelUpload from "./Evaluation/ModelUpload.jsx";
import UserAnswerUpload from "./Evaluation/AnswerUpload.jsx";
import UserResult from "./Evaluation/Result.jsx";
import UserUpdate from "./Evaluation/Update.jsx";
import EvalStatus from "./Evaluation/EvalStatus.jsx";
import MainPage from "./Evaluation/MainPage.jsx";
import Aidic from "./Evaluation/Aidic.jsx";
import React from 'react';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 페이지(로그인 없이 접근 가능) */}
        <Route path="/" element={<NonMain />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path='/auth/main' element={<MainPage/>}/>
        <Route path='/auth/aidic' element={<Aidic />}/>
        {/* 필요 시 회원가입 등도 여기서 공개로 라우팅
            <Route path="/auth/signup" element={<Signup />} /> */}

        {/* ✅ /users 이하 전체를 가드로 보호 (세션 확인 → OK면 Outlet 하위 렌더) */}
        <Route path="/users" element={<UsersGuard />}>
          <Route path="main" element={<UsersMain />} />
          <Route path="domain" element={<UsersDomain />} />
          <Route path="upload" element={<UsersUpload />} />
          <Route path="questions" element={<QuestionList />} />
          <Route path="modelupload" element={<UserModelUpload />} />
          <Route path="answerupload" element={<UserAnswerUpload />} />
          <Route path="result" element={<UserResult />} />
          <Route path ="update" element={<UserUpdate />}/>
          <Route path ="evalstatus" element={<EvalStatus />}/>

          {/* 계속 추가: 
              <Route path="upload" element={<FileUpload />} />
              <Route path="result" element={<Result />} />
          */}
        </Route>

        {/* 잘못된 경로 → 홈으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}




