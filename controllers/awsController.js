export const uploadFile = (req, res) => {
  if (req.file) {
    const fileUrl = req.file.location;
    if (fileUrl) {
      res.status(201).json({ file_url: fileUrl });
    } else {
      res.status(400).json({ error: "File upload failed!" });
    }
  } else {
    res.status(400).json({ error: "File upload failed" });
  }
};
