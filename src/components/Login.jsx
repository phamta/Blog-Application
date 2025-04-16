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
            .then((user) => {
                console.log("Đăng nhập thành công:", user);
                localStorage.setItem("userId", user.id); // lưu lại để dùng sau
                navigate("/users");
            })
            .catch((err) => {
                alert("Sai tài khoản hoặc mật khẩu");
                console.error(err);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />
                <br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
                <br />
                <input type="submit" value="Login" />
            </form>
        </div>
    );
}