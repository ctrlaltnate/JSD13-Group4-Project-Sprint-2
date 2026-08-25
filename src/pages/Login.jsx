import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();
        // แกล้งๆเข้าสู่ระบบ
        alert("เข้าสูระบบแล้ว");
    };

    return (
    <div>
      <h2>เข้าสู่ระบบ</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>อีเมล</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={event => setEmail(event.target.value)}  
          />
        </div>
        <div>
          <label>รหัสผ่าน</label>
          <input 
            type="password" 
            required 
            value={pwd} 
            onChange={event => setPwd(event.target.value)} 
          />
        </div>
        <button type="submit">
          เข้าสู่ระบบ
        </button>
      </form>
      <p>
        ยังไม่มีบัญชี <Link to="/register">สมัครสมาชิก</Link>
      </p>
    </div>
  );
}

export default Login;