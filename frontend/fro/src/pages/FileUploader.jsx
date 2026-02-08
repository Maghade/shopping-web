import axios from "axios";
import { useState } from "react";

const FileUploader = ({ userId, sender, onSent }) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("sender", JSON.stringify(sender));

    setUploading(true);

    const res = await axios.post(
      "http://localhost:4000/api/chat/send-file",
      formData,
      {
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      }
    );

    onSent(res.data);
    setUploading(false);
    setProgress(0);
  };

  return (
    <div>
      <input
        type="file"
        hidden
        id="file"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      <label htmlFor="file" className="cursor-pointer px-2">
        📎
      </label>

      {uploading && (
        <div className="h-1 bg-gray-300 rounded">
          <div
            className="h-1 bg-green-500 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUploader;