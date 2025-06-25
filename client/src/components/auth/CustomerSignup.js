import React, { useState } from "react";
import { customerSignup } from "../../api";

export default function CustomerSignup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await customerSignup(username, password);
      setMsg("Signup successful! Please login.");
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Customer Signup</h3>
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
      <button type="submit">Signup</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
