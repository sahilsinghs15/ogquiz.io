import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import * as questions from "./questions.json" assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the dist directory
const staticPath = path.join(__dirname);
app.use(express.static(staticPath));

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// Serve quiz questions
app.get('/api/questions', (req, res) => {
    try {
        res.json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Failed to fetch questions" });
    }
});
console.log(questions);

// Receive user answers
app.post('/api/submit', (req, res) => {
    const userAnswers = req.body.answers;
    let score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions.default[index].correctAnswer) {
            score++;
        }
    });

    res.json({ score });
});
// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
