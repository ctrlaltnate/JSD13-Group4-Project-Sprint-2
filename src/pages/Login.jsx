import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { users } from "../mock-data/index" //เดี๋ยวลอง mock user ก่อน

function Login() {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const navigate = useNavigate(); //hook ไปหน้า admin ตามเงื่อนไข
test

    // ลองใช้ user จาก users.js
    const handleLogin = (event) => {
        event.preventDefault();
        const isUser = users.find(user => user.email === email);
        if(isUser){
          alert(`ยินดีต้อนรับ ${isUser.firstName} (${isUser.role}) จ้า`);
        } else {
          alert("เข้าสูระบบแล้ว");
        }
        navigate("/src/pages/Login.jsx"); /**** อย่าลืมเปลี่ยนฮุกไปหน้า admin ****/ 
    };
    return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-amber-900 mb-5">เข้าสู่ระบบ</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">อีเมล</label>
          <input 
            type="email" 
            required
            value={email} 
            onChange={event => setEmail(event.target.value)}
            placeholder="  example@email.com"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">รหัสผ่าน</label>
          <input 
            type="password" 
            required 
            value={pwd} 
            onChange={event => setPwd(event.target.value)} 
            placeholder="  **********"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <button type="submit" className="w-full gb-amber-700 text-white p-2 rounded font-medium hover:bg-amber-800">
          เข้าสู่ระบบ
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        ยังไม่มีบัญชี <Link to="/register" className="text-amber-700 font-bold">สมัครสมาชิก</Link>
      </p>
    </div>
  );
}

export default Login;
