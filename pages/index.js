import React, { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("minimal");
  const [lang, setLang] = useState("en");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateSite = async () => {
    setLoading(true);
    const res = await fetch("/api/webb-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input, style, lang }),
    });
    const data = await res.json();
    setOutput(data);
    setLoading(false);
  };

  const exportHTML = () => {
    if (!output) return;
    const html = `<!DOCTYPE html><html><head><meta charset='UTF-8'><title>${output.title}</title></head><body>
      <h1>${output.title}</h1>
      <p><em>${output.slogan}</em></p>
      ${output.sections
        .map(
          (section) => `
          <h2>${section.heading}</h2>
          ${section.items ? `<ul>${section.items.map((i) => `<li>${i}</li>`).join("")}</ul>` : `<p>${section.content}</p>`}
        `
        )
        .join("")}
    </body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${output.title.replace(/\s+/g, "_")}.html`;
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
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
      {output && (
        <div className="mt-6 space-y-4">
          <button onClick={exportHTML} className="bg-green-500 text-white px-4 py-2 rounded mb-2">
            Export as HTML
          </button>
          <div className="border rounded p-4">
            <h2 className="text-2xl font-semibold">{output.title}</h2>
            <p className="text-gray-600 italic">{output.slogan}</p>
            {output.sections.map((section, idx) => (
              <div key={idx} className="mt-4">
                <h3 className="text-xl font-medium mb-1">{section.heading}</h3>
                {section.items ? (
                  <ul className="list-disc list-inside space-y-1">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{section.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
