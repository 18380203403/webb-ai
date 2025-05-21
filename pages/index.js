import React, { useState } from "react";
import EditableSection from "../components/EditableSection";
import EditableImage from "../components/EditableImage";

export default function Home() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("minimal");
  const [lang, setLang] = useState("en");
  const [output, setOutput] = useState(null);
  const [editableOutput, setEditableOutput] = useState(null); // 新增
  const [loading, setLoading] = useState(false);
  const [editCount, setEditCount] = useState(0); // 编辑次数统计

  const MAX_EDIT = 3; // 免费版最多编辑次数

  const generateSite = async () => {
    setLoading(true);
    const res = await fetch("/api/webb-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input, style, lang }),
    });
    const data = await res.json();
    setOutput(data);
    setEditableOutput(JSON.parse(JSON.stringify(data))); // 拷贝用于编辑
    setLoading(false);
    setEditCount(0); // 新生成后次数清零
  };

  // 可编辑文本回调
  function handleSectionSave(idx, value) {
    if (editCount >= MAX_EDIT) {
      alert("免费用户每个网站只可编辑3次，升级会员可无限编辑！");
      return;
    }
    const copy = { ...editableOutput };
    copy.sections[idx].content = value;
    setEditableOutput(copy);
    setEditCount(editCount + 1);
  }

  // 可上传图片回调
  function handleImageChange(idx, img) {
    if (editCount >= MAX_EDIT) {
      alert("免费用户每个网站只可编辑3次，升级会员可无限编辑！");
      return;
    }
    const copy = { ...editableOutput };
    copy.sections[idx].img = img;
    setEditableOutput(copy);
    setEditCount(editCount + 1);
  }

  // 导出HTML也用editableOutput
  const exportHTML = () => {
    if (!editableOutput) return;
    const html = `<!DOCTYPE html><html><head><meta charset='UTF-8'><title>${editableOutput.title}</title></head><body>
      <h1>${editableOutput.title}</h1>
      <p><em>${editableOutput.slogan}</em></p>
      ${editableOutput.sections
        .map(
          (section) => `
          <h2>${section.heading}</h2>
          ${section.img ? `<img src="${section.img}" style="max-width:200px"/><br/>` : ""}
          ${section.items ? `<ul>${section.items.map((i) => `<li>${i}</li>`).join("")}</ul>` : `<p>${section.content}</p>`}
        `
        )
        .join("")}
      <footer style="margin-top:2em;color:gray;font-size:14px;">Powered by <b>webb ai</b></footer>
    </body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${editableOutput.title.replace(/\s+/g, "_")}.html`;
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* LOGO区域 */}
      <div className="flex items-center mb-3">
        <img src="/webb-logo.png" alt="webb ai" className="h-8 mr-2" />
        <span className="font-bold text-lg">webb ai</span>
        <span className="ml-auto text-sm text-gray-400">Edits: {editCount}/{MAX_EDIT} (免费最多3次)</span>
      </div>
      <h1 className="text-3xl font-bold mb-4">Webb: AI Website Generator</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your website in one sentence..."
        className="w-full border p-2 rounded mb-2"
      />
      <div className="flex gap-2 mb-2">
        <select value={style} onChange={e => setStyle(e.target.value)} className="border p-2 rounded">
          <option value="minimal">Minimal</option>
          <option value="ecommerce">E-commerce</option>
          <option value="portfolio">Portfolio</option>
        </select>
        <select value={lang} onChange={e => setLang(e.target.value)} className="border p-2 rounded">
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
        <button onClick={generateSite} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      {editableOutput && (
        <div className="mt-6 space-y-4">
          <button onClick={exportHTML} className="bg-green-500 text-white px-4 py-2 rounded mb-2">
            Export as HTML
          </button>
          <div className="border rounded p-4">
            <h2 className="text-2xl font-semibold">{editableOutput.title}</h2>
            <p className="text-gray-600 italic">{editableOutput.slogan}</p>
            {editableOutput.sections.map((section, idx) => (
              <div key={idx} className="mt-4">
                <h3 className="text-xl font-medium mb-1">{section.heading}</h3>
                {/* 图片上传区域 */}
                {section.img !== undefined && (
                  <EditableImage
                    src={section.img}
                    alt={section.heading}
                    onChange={img => handleImageChange(idx, img)}
                  />
                )}
                {section.items ? (
                  <ul className="list-disc list-inside space-y-1">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <EditableSection
                    heading={section.heading}
                    content={section.content}
                    onSave={val => handleSectionSave(idx, val)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
