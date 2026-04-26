require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
  const number = parseInt(req.query.number);

  if (!number || number < 1 || number > 133) {
    return res.status(400).json({ error: 'அதிகார எண் 1 முதல் 133 வரை மட்டுமே' });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a Thirukkural expert. Return ONLY a valid JSON array for all 10 kurals of Thirukkural chapter (adhikaram) number ${number}. No markdown, no explanation, just JSON array:
[
  {
    "number": kural_number_as_integer,
    "line1": "first line in Tamil",
    "line2": "second line in Tamil",
    "meaning": "meaning in Tamil in 1-2 sentences"
  }
]`;

  try {
    const result  = await model.generateContent(prompt);
    const text    = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const kurals  = JSON.parse(text);
    res.json(kurals);
  } catch (err) {
    res.status(500).json({ error: 'Gemini API பிழை: ' + err.message });
  }
};
