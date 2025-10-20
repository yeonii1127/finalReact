import "../css/update.css";

export default function update() {
  return (
    <div className="update-wrapepr">
      <div className="update-box">
        <h3 className="update-title">회원정보 수정</h3>

         <div className="update-inputbox">
            <input placeholder="비밀번호" />
        </div>

        <button className="update-btn">가입하기</button>
      </div>
    </div>
  );
}
