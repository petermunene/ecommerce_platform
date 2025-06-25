import React, { useState } from "react";
import { customerLogin } from "../../api";

export default function CustomerLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = await customerLogin(username, password);
      onLogin(user);
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Customer Login</h3>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      /><br/>
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /><br/>
      <button type="submit">Login</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
