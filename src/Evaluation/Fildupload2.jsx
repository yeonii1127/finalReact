import "../css/FileUpload.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState("모델1");
  const navigate = useNavigate();
  // 파일 등록
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 모델 
  const handleModelChange = (e) => {
    setModel(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("파일을 선택해주세요!");
      return;
    }

    console.log("선택된 파일:", file);
    console.log("선택된 모델:", model);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", model);
    try {
      const response = await axios.post("http://localhost:8080/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      const fakeQuestions = [
        "그램-리치-블라일리법의 주된 내용은 무엇이며, 이 법이 제정된 배경은 무엇인가?",
        "상품수지에서 수출이 수입보다 많을 경우, 이는 어떤 상태로 표시되며, 상품수지의 수출입은 어떤 기준에 따라 계상되는가?",
        "가동률이 높은 상황이 항상 긍정적인 신호가 아닌 이유는 무엇인가?",
        "배당할인모형에서 주식의 현재가치는 어떻게 평가되며, 이 모형의 핵심 요인은 무엇인가?",
        "국제회계기준(IFRS)의 제정 주체는 누구이며, 이 기준이 필요하게 된 배경은 무엇인가?",
        "부실채권정리기금은 어떤 법률에 의거하여 설립되었으며, 언제 종료되었나요?",
        "결제가 이루어지는 과정에서 자금이체시스템을 통해 자금이 어떻게 이동되는지 설명할 수 있습니까?",
        "브렉시트란 무엇을 의미하며, 영국이 EU 탈퇴를 결정하게 된 배경은 무엇인가?",
        "삼불원칙(impossible trinity)은 어떤 세 가지 정책목표를 동시에 만족시키는 것이 어렵다고 설명하고 있나요?",
        "기준순환일이란 무엇이며, 그 중요성은 무엇인가?",
      ];

      navigate("/Qmake", { state: { questions: fakeQuestions } });
    } catch (error) {
      console.error("업로드 실패:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="file-container">
      <aside className="file-sidebar">
        <h2 className="file-sidebar-title">SERVICE</h2>
        <ul>
          <li className="active">모델 평가</li>
          <li>데이터 마켓</li>
        </ul>
      </aside>

      <main className="file-main">
        <div className="box-title">
          <h1 className="title">파일 등록 & 질의 생성 모델 선택</h1>
          <p className="subtitle">
            평가할 문서를 등록하고 Q 생성을 위한 모델을 선택해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="upload-box" encType="multipart/form-data">
          <p className="upload-text">
            파일 드래그 & 등록<br />
            <span className="file-text2">또는 버튼을 눌러 파일 선택</span>
          </p>

          <label htmlFor="fileUpload" className="upload-btn">
            파일 선택
          </label>
          <input type="file" id="fileUpload" hidden onChange={handleFileChange} />

          {file && <p className="file-name">{file.name}</p>}

          <div className="file-model-box">
            <p>질의 생성 모델 선택</p>
            <select value={model} onChange={handleModelChange}>
              <option>모델1</option>
              <option>모델2</option>
              <option>모델3</option>
            </select>
          </div>

          <button type="submit" className="file-next-btn">
            업로드
          </button>
        </form>
      </main>
    </div>
  );
}
