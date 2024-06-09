const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

app.post('/chat', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{
                role: "user",
                content: text
            }]
        });
        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error('ChatGPT API Error:', error);
        res.status(500).json({ error: 'Failed to fetch response from ChatGPT' });
    }
});

app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No image uploaded.');
    }
    try {
        const base64Image = req.file.buffer.toString('base64');
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{
                role: "system",
                content: "Analyze this image and describe what you see."
            }, {
                role: "user",
                content: `![image](data:image/jpeg;base64,${base64Image})`
            }]
        });
        res.json({ analysis: response.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ error: 'Error processing image' });
    }
});

app.use('/users', require('./routes/router.user'));

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
