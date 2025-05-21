import React, { useState } from "react";

export default function EditableImage({ src, alt, onChange }) {
  const [preview, setPreview] = useState(src);

  function handleUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target.result);
        onChange(ev.target.result); // base64图片
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div>
      <img src={preview} alt={alt} className="h-32 mb-2" />
      <input type="file" accept="image/*" onChange={handleUpload} />
    </div>
  );
}
