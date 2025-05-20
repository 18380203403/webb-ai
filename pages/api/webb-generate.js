// /pages/api/webb-generate.js
export default async function handler(req, res) {
  const { prompt, style, lang } = req.body;

  // 构造 AI 提示词
  const sysPrompt = `
You are an expert website copywriter and web designer. Given the user's prompt, style, and language, output a JSON for a brand website. JSON format:
{
  "title": "...",
  "slogan": "...",
  "sections": [
    {
      "heading": "...",
      "content": "...", // 若为产品展示则为 items
      "items": ["...", "..."]
    }
  ]
}
Requirements:
- Make it suitable for the style: "${style}".
- Language: "${lang}".
- For product section use 'items' array.
- Less than 6 sections.
- For brand, include About, Product/Portfolio/Shop, Contact.
`;

  const messages = [
    { role: "system", content: sysPrompt },
    { role: "user", content: prompt }
  ];

  const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 800
    })
  });

  const data = await apiRes.json();
  // 解析大模型返回的 json 字符串
  const text = data.choices[0].message.content;
  try {
    const site = JSON.parse(text);
    res.status(200).json(site);
  } catch (e) {
    // AI 生成的内容可能不是严格 JSON，需要做预处理或报错
    res.status(200).json({
      title: "Webb Demo",
      slogan: "AI Web Generator",
      sections: [
        { heading: "Output Error", content: text }
      ]
    });
  }
}
