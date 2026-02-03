import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { insertUser, initDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname (ES module’da yo‘q, qo‘lda beramiz)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());

// frontend static
app.use(express.static(path.join(__dirname, 'frontend')));

// ping
app.get('/ping', (req, res) => {
  res.json({ ok: true, time: new Date() });
});

// home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// users
app.post('/users', async (req, res) => {
  try {
    const { ism, familiya, nomer, parol, turi } = req.body;

    if (!ism || !familiya || !nomer || !parol) {
      return res.status(400).json({ ok: false, error: 'Majburiy maydonlar yo‘q' });
    }

    const user = {
      ism: ism.trim(),
      familiya: familiya.trim(),
      nomer: nomer.trim(),
      parol,
      turi: turi || 'user',
    };

    const saved = await insertUser(user);
    res.json({ ok: true, user: saved });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 🔥 DB init
await initDB();

// start
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
