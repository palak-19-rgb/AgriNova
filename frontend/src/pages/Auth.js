
import React, { useState } from "react";
import { loginUser, registerUser } from "../services/authService";

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    greenhouseName: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;

      if (isRegister) {
        data = await registerUser(form);
      } else {
        data = await loginUser({
          email: form.email,
          password: form.password,
        });
      }

      // Expected backend response: { token, user }
      const token = data.token || data.accessToken;

      if (!token) {
        throw new Error("Authentication token was not returned by server.");
      }

      localStorage.setItem("agrinova_token", token);

      if (data.user) {
        localStorage.setItem(
          "agrinova_user",
          JSON.stringify(data.user)
        );
      }

      onLogin(data.user || null, token);

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f5f7ef;
          font-family: "DM Sans", sans-serif;
        }

        .auth-visual {
          background: linear-gradient(
            145deg,
            #173f2b,
            #285d3d,
            #527d52
          );
          color: white;
          padding: 65px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .auth-brand {
          font-size: 1.7rem;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .auth-brand span {
          color: #c5dcae;
        }

        .auth-visual-content {
          max-width: 480px;
        }

        .auth-visual h1 {
          font-family: "Playfair Display", serif;
          font-size: clamp(2.5rem, 4vw, 4rem);
          line-height: 1.15;
          margin-bottom: 20px;
        }

        .auth-visual p {
          color: #d4e3d2;
          font-size: 0.95rem;
          line-height: 1.8;
        }

        .auth-visual-footer {
          color: #c5dcae;
          font-size: 0.75rem;
        }

        .auth-form-side {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 35px;
        }

        .auth-form {
          width: 100%;
          max-width: 420px;
        }

        .auth-form h2 {
          font-family: "Playfair Display", serif;
          color: #173f2b;
          font-size: 2.2rem;
          margin-bottom: 10px;
        }

        .auth-subtitle {
          color: #7c897e;
          font-size: 0.85rem;
          margin-bottom: 32px;
        }

        .auth-field {
          margin-bottom: 17px;
        }

        .auth-field label {
          display: block;
          color: #36523d;
          font-size: 0.78rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .auth-field input {
          width: 100%;
          padding: 14px 15px;
          border: 1px solid #dce5d8;
          border-radius: 11px;
          background: white;
          outline: none;
          font: inherit;
          font-size: 0.85rem;
          box-sizing: border-box;
          color: #173f2b;
          transition: border 0.2s;
        }

        .auth-field input:focus {
          border-color: #4f8f5b;
        }

        .auth-submit {
          width: 100%;
          padding: 15px;
          margin-top: 8px;
          background: #173f2b;
          color: white;
          border: none;
          border-radius: 11px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .auth-submit:hover {
          background: #285d3d;
        }

        .auth-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .auth-error {
          background: #fff0ed;
          color: #b64c3e;
          padding: 12px;
          border-radius: 9px;
          font-size: 0.78rem;
          margin-bottom: 16px;
        }

        .auth-switch {
          text-align: center;
          margin-top: 23px;
          font-size: 0.82rem;
          color: #7c897e;
        }

        .auth-switch button {
          border: none;
          background: none;
          color: #397447;
          font-weight: 800;
          cursor: pointer;
          font-size: inherit;
        }

        @media(max-width: 800px) {
          .auth-page {
            grid-template-columns: 1fr;
          }

          .auth-visual {
            display: none;
          }

          .auth-form-side {
            min-height: 100vh;
          }
        }
      `}</style>

      <section className="auth-visual">
        <div className="auth-brand">
          Agri<span>Nova.</span>
        </div>

        <div className="auth-visual-content">
          <h1>Grow smarter. Farm better.</h1>
          <p>
            Your greenhouse, your data, your decisions.
            Monitor environmental conditions and understand
            what your crops need, all in one place.
          </p>
        </div>

        <div className="auth-visual-footer">
          SMART AGRICULTURE · INTELLIGENT GREENHOUSES
        </div>
      </section>

      <section className="auth-form-side">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>
            {isRegister ? "Create your account." : "Welcome back."}
          </h2>

          <p className="auth-subtitle">
            {isRegister
              ? "Set up your personal greenhouse workspace."
              : "Sign in to access your greenhouse dashboard."}
          </p>

          {error && (
            <div className="auth-error">{error}</div>
          )}

          {isRegister && (
            <>
              <div className="auth-field">
                <label>Full name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="auth-field">
                <label>Greenhouse name</label>
                <input
                  name="greenhouseName"
                  value={form.greenhouseName}
                  onChange={handleChange}
                  placeholder="e.g. My Greenhouse"
                  required
                />
              </div>
            </>
          )}

          <div className="auth-field">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              minLength={8}
            />
          </div>

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account"
                : "Sign In"}
          </button>

          <div className="auth-switch">
            {isRegister
              ? "Already have an account? "
              : "New to AgriNova? "}

            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
            >
              {isRegister ? "Sign In" : "Create Account"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Auth;
