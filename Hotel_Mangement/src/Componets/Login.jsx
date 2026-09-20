import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    try {
      const url = "http://localhost:8080/api/login";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        alert(res?.message || "Login failed");
        return;
      }

      if (res?.accesstoken) {
        localStorage.setItem("accessToken", res.accesstoken);
        navigate("/dashboard", { replace: true });
      } else {
        alert("Login succeeded, but no access token was returned.");
      }
    } catch (err) {
      alert(err?.message || "Something went wrong while logging in.");
    }
  };

  return (
    <main className="auth-page">
      <section className="brand-panel" aria-label="Accountly introduction">
        <div className="brand-mark" aria-label="Accountly">A</div>
        <div className="brand-copy">
          <span className="eyebrow">Welcome to</span>
          <h1>Accountly</h1>
          <p>One secure place for everything that<br />matters to your account.</p>
        </div>
      </section>

      <section className="form-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <h2>Welcome back</h2>
            <p>Sign in to continue to your dashboard.</p>
          </div>

          <label htmlFor="email">
            Email address
            <input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </label>

          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </label>

          <button type="submit">Sign in</button>

          <p className="switch-copy">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
