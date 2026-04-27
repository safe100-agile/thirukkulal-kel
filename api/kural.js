require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
  const number = parseInt(req.query.number);

  if (!number || number < 1 || number > 1330) {
    return res.status(400).json({ error: 'குறள் எண் 1 முதல் 1330 வரை மட்டுமே' });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a Thirukkural expert. Return ONLY a valid JSON object for Thirukkural number ${number}. No markdown, no explanation, just JSON:
{
  "number": ${number},
  "line1": "first line of the kural in Tamil",
  "line2": "second line of the kural in Tamil",
  "adhikaram_number": chapter_number_as_integer,
  "adhikaram_name": "chapter name in Tamil",
  "book": "book name in Tamil (அறத்துப்பால் or பொருட்பால் or காமத்துப்பால்)",
  "meaning": "meaning in Tamil in 2-3 sentences"
}`;

  const delay = ms => new Promise(r => setTimeout(r, ms));

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text   = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const kural  = JSON.parse(text);
      return res.json(kural);
    } catch (err) {
      const is503 = err.message && err.message.includes('503');
      if (is503 && attempt < 4) {
        await delay(attempt * 1000);
        continue;
      }
      return res.status(500).json({ error: 'Gemini API பிழை: ' + err.message });
    }
  }
};
