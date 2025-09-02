import formidable from "formidable";
import fs from "fs";
import { PDFDocument, rgb } from "pdf-lib";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ error: "Upload error" });
    }

    try {
      const mode = fields.mode?.[0] || "rename";
      const newName = fields.newName?.[0] || "output";
      const pdfFile = files.pdf?.[0];
      const imageFile = files.image?.[0];

      if (!pdfFile) {
        return res.status(400).json({ error: "No PDF uploaded" });
      }

      // Baca PDF
      const pdfBytes = fs.readFileSync(pdfFile.filepath);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      if (mode === "addImage" && imageFile) {
        const imgBytes = fs.readFileSync(imageFile.filepath);
        let img;

        if (imageFile.mimetype === "image/png") {
          img = await pdfDoc.embedPng(imgBytes);
        } else {
          img = await pdfDoc.embedJpg(imgBytes);
        }

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        // Tempatkan gambar di tengah halaman pertama
        const imgWidth = 200;
        const imgHeight = (img.height / img.width) * imgWidth;

        firstPage.drawImage(img, {
          x: width / 2 - imgWidth / 2,
          y: height / 2 - imgHeight / 2,
          width: imgWidth,
          height: imgHeight,
        });
      }

      // Simpan hasil
      const resultPdf = await pdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${newName}.pdf"`
      );
      return res.send(Buffer.from(resultPdf));
    } catch (error) {
      console.error("Processing error:", error);
      return res.status(500).json({ error: "Failed to process PDF" });
    }
  });
}
