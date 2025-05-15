import { useNavigate } from "react-router-dom";

export default function Form() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;

        fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Login failed");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Đăng nhập thành công:", data);
                sessionStorage.setItem("userId", data.user.id);
                sessionStorage.setItem("token", data.token);
                navigate("/users");
                window.location.reload(); // ✅ đảm bảo App đọc lại token
            })
            .catch((err) => {
                alert("Sai tài khoản hoặc mật khẩu");
                console.error(err);
            });
    };

    return (
        <div>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <br />
                <input type="submit" value="Đăng nhập" />
            </form>
            <p>
                Chưa có tài khoản?{" "}
                <span
                    style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate("/users/new")}
                >
                    Đăng ký ngay
                </span>
            </p>
        </div>
    );
}