import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleOnChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = data;

    // Field validations
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const url = "http://localhost:8080/api/user";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        alert(res?.message || "Registration failed.");
        return;
      }

      // If backend logs user in directly on register:
      if (res?.accesstoken) {
        localStorage.setItem("accessToken", res.accesstoken);
        navigate("/dashboard", { replace: true });
        return;
      }

      // Otherwise, redirect to login
      alert("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      alert(err?.message || "Something went wrong while creating the account.");
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
            <h2>Create your account</h2>
            <p>Start managing your account in a few seconds.</p>
          </div>

          <label htmlFor="name">
            Full name
            <input
              id="name"
              type="text"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </label>

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

          <label htmlFor="confirmPassword">
            Confirm password
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleOnChange}
              required
            />
          </label>

          <button type="submit">Create account</button>

          <p className="switch-copy">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
