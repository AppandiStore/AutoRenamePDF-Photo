import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({ multiples: false });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const file = files.file[0];
    const newName = fields.newName[0];

    const filePath = file.filepath;
    const fileData = fs.readFileSync(filePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${newName}.pdf`);
    res.send(fileData);
  });
}
