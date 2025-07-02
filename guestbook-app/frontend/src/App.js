import React, { useEffect, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ name: "", message: "" });

  useEffect(() => {
    fetch("/api/messages")
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    setFormData({ name: "", message: "" });
    const res = await fetch("/api/messages");
    const data = await res.json();
    setMessages(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Guestbook</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Your Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
        <br />
        <textarea
          placeholder="Your Message"
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      <hr />
      <h2>Messages</h2>
      {messages.map((msg, i) => (
        <div key={i}>
          <strong>{msg.name}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
}

export default App;
