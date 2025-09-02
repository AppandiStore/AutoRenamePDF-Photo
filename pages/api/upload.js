import formidable from "formidable";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

// Nonaktifkan bodyParser bawaan Next.js (biar bisa pakai formidable)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parsing form-data dengan formidable
    const form = formidable({ multiples: false, keepExtensions: true });
    const [fields, files] = await form.parse(req);

    const uploadedFile = files.file?.[0];
    const uploadedImage = files.image?.[0];

    if (!uploadedFile) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    // Baca file PDF
    const pdfBytes = fs.readFileSync(uploadedFile.filepath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Kalau ada gambar, masukkan ke halaman terakhir
    if (uploadedImage) {
      const imageBytes = fs.readFileSync(uploadedImage.filepath);
      let imageEmbed;

      if (uploadedImage.mimetype === "image/jpeg") {
        imageEmbed = await pdfDoc.embedJpg(imageBytes);
      } else {
        imageEmbed = await pdfDoc.embedPng(imageBytes);
      }

      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width, height } = lastPage.getSize();

      // Skala gambar biar muat di halaman
      const scale = Math.min(
        width / imageEmbed.width,
        height / imageEmbed.height
      );
      const imgWidth = imageEmbed.width * scale;
      const imgHeight = imageEmbed.height * scale;

      lastPage.drawImage(imageEmbed, {
        x: (width - imgWidth) / 2,
        y: (height - imgHeight) / 2,
        width: imgWidth,
        height: imgHeight,
      });
    }

    // Rename file dengan format tetap (tidak menambahkan tanggal di awal)
    const originalName = path.basename(uploadedFile.originalFilename, ".pdf");
    const safeName = originalName.replace(/\s+/g, "_");
    const outputName = `${safeName}.pdf`;

    const finalPdfBytes = await pdfDoc.save();

    res.setHeader("Content-Disposition", `attachment; filename=${outputName}`);
    res.setHeader("Content-Type", "application/pdf");
    return res.send(Buffer.from(finalPdfBytes));
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Failed to process file" });
  }
}
