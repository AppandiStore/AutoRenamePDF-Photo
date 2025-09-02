import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [newName, setNewName] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !newName) {
      alert("Pilih file dan masukkan nama baru!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("newName", newName);

    const res = await fetch("/api/rename", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = newName + ".pdf";
      a.click();
    } else {
      alert("Gagal rename file.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Rename PDF Online</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <br />
      <input
        type="text"
        placeholder="Nama Baru"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Rename & Download</button>
    </div>
  );
}
