export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Rename / Edit PDF</h1>

        <form
          method="POST"
          action="/api/upload"
          encType="multipart/form-data"
          className="space-y-4"
        >
          {/* Upload PDF */}
          <input
            type="file"
            name="pdf"
            accept="application/pdf"
            required
            className="block w-full border p-2 rounded"
          />

          {/* Upload Image (opsional) */}
          <input
            type="file"
            name="image"
            accept="image/*"
            className="block w-full border p-2 rounded"
          />

          {/* Input Nama Baru */}
          <input
            type="text"
            name="newName"
            placeholder="Nama baru (tanpa .pdf)"
            className="block w-full border p-2 rounded"
          />

          {/* Mode pilihan */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="mode" value="rename" defaultChecked />
              <span>Rename PDF</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="mode" value="addImage" />
              <span>Tambahkan Foto ke PDF</span>
            </label>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Proses
          </button>
        </form>
      </div>
    </div>
  )
}
