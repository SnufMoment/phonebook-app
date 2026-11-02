const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const DB_PATH = path.join(__dirname, "database.json");

function readDB() {
    try {
        const data = fs.readFileSync(DB_PATH, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return { contacts: [] };
    }
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// --- API МАРШРУТЫ (CRUD) ---
app.get("/api/contacts", (req, res) => {
    try {
        const db = readDB();
        res.json(db.contacts || []);
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения данных" });
    }
});

app.get("/api/contacts/:id", (req, res) => {
    try {
        const db = readDB();
        const contact = (db.contacts || []).find(c => c._id === req.params.id);
        if (!contact) return res.status(404).json({ error: "Контакт не найден" });
        res.json(contact);
    } catch (err) {
        res.status(500).json({ error: "Ошибка поиска" });
    }
});

app.post("/api/contacts", (req, res) => {
    try {
        const db = readDB();
        if (!db.contacts) db.contacts = [];
        const newContact = req.body;
        newContact._id = uuidv4();
        db.contacts.push(newContact);
        writeDB(db);
        res.status(201).json(newContact);
    } catch (err) {
        res.status(500).json({ error: "Ошибка создания" });
    }
});

app.put("/api/contacts/:id", (req, res) => {
    try {
        const db = readDB();
        const index = (db.contacts || []).findIndex(c => c._id === req.params.id);
        if (index === -1) return res.status(404).json({ error: "Контакт не найден" });
        const updatedContact = { ...req.body, _id: req.params.id };
        db.contacts[index] = updatedContact;
        writeDB(db);
        res.json(updatedContact);
    } catch (err) {
        res.status(500).json({ error: "Ошибка обновления" });
    }
});

app.delete("/api/contacts/:id", (req, res) => {
    try {
        const db = readDB();
        const index = (db.contacts || []).findIndex(c => c._id === req.params.id);
        if (index === -1) return res.status(404).json({ error: "Контакт не найден" });
        db.contacts.splice(index, 1);
        writeDB(db);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: "Ошибка удаления" });
    }
});

// --- ОБСЛУЖИВАНИЕ ANGULAR ---
const distDir = path.join(__dirname, "frontend", "dist", "frontend", "browser");

if (fs.existsSync(distDir)) {
    // 1. Раздаем статические файлы (CSS, JS, картинки Angular)
    app.use(express.static(distDir));
    
    // 2. Финальный catch-all для Angular SPA. 
    // Используем app.use без пути, чтобы обойти строгий парсер path-to-regexp
    app.use((req, res) => {
        res.sendFile(path.join(distDir, "index.html"));
    });
    
    console.log("✅ Фронтенд успешно подключен из:", distDir);
} else {
    console.log("⚠️ ВНИМАНИЕ: Папка сборки Angular не найдена по пути:", distDir);
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("🚀 Сервер запущен на порту", PORT);
});
