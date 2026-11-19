
const Groq = require("groq-sdk");

exports.analyzeCrop = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        message: "Groq API key is missing from backend environment."
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a crop image."
      });
    }

    const cropType = req.body.cropType || "Not specified";

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const base64Image = req.file.buffer.toString("base64");

    const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
You are an agricultural crop health assistant.

Analyse this crop image.

Crop type: ${cropType}

Identify possible:
- Crop disease
- Pest infestation
- Visible symptoms
- Severity
- Suggested treatment
- Prevention methods

Return ONLY a valid JSON object with these fields:

{
  "disease": "Possible disease or pest name",
  "confidence": "Low, Medium or High",
  "severity": "Low, Moderate, High or Unknown",
  "symptoms": ["symptom 1", "symptom 2"],
  "treatment": ["suggestion 1", "suggestion 2"],
  "prevention": ["method 1", "method 2"],
  "observation": "What you can visibly observe in the image"
}

Important:
- Do not invent a disease if the image is unclear.
- If no disease is visible, say so.
- Distinguish visual observations from possible diagnoses.
- Never present an uncertain diagnosis as confirmed.
- Recommend consulting an agricultural expert before using pesticides.
- If the image does not show a crop or plant, clearly mention that.
              `
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      temperature: 0.2,
      max_completion_tokens: 1200,
      response_format: {
        type: "json_object"
      }
    });

    const result = JSON.parse(
      completion.choices[0].message.content
    );

    res.json({
      success: true,
      analysis: result
    });

  } catch (error) {
    console.error("Crop analysis error:", error);

    res.status(500).json({
      message: "Unable to analyse the crop image. Please try again."
    });
  }
};
