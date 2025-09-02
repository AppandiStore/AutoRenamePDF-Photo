import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState("n");
  const [nValue, setNValue] = useState("");
  const [otherValue, setOtherValue] = useState("1");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Upload file PDF dulu!");

    const formData = new FormData();
    formData.append("file", file);
    if (image) formData.append("image", image);
    formData.append("type", type);
    formData.append("nValue", nValue);
    formData.append("otherValue", otherValue);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hasil.pdf";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Rename + Tambah Foto PDF</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border p-2 rounded"
          />

          <div>
            <label className="font-medium">Pilih Jenis Surat:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="n">N 1-10</option>
              <option value="other">Jenis Surat Lain</option>
            </select>
          </div>

          {type === "n" ? (
            <input
              type="number"
              min="1"
              max="10"
              value={nValue}
              onChange={(e) => setNValue(e.target.value)}
              placeholder="Masukkan angka 1-10"
              className="w-full border p-2 rounded"
            />
          ) : (
            <select
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="1">Surat Penolakan Kehendak Nikah</option>
              <option value="2">Permohonan Duplikat Nikah</option>
              <option value="3">Penerimaan Surat Masuk</option>
              <option value="4">Permohonan Perubahan Nama/Tanggal Lahir</option>
              <option value="5">Permohonan Rekomendasi Nikah</option>
              <option value="6">Pendaftaran Nikah / Rujuk</option>
              <option value="7">Rapat Kordinasi Rutin KUA</option>
            </select>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow"
          >
            Proses PDF
          </button>
        </form>
      </div>
    </div>
  );
}
