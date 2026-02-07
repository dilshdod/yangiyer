import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { insertUser, initDB, getAllUsers } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// test
app.get('/ping', (req, res) => {
   res.json({ ok: true, time: new Date() });
});

// home
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// user qo‘shish
app.post('/users', async (req, res) => {
   try {
      const { ism, familiya, nomer, parol, turi } = req.body;

      if (!ism || !familiya || !nomer || !parol) {
         return res
            .status(400)
            .json({ ok: false, error: 'Majburiy maydonlar yo‘q' });
      }

      const user = {
         ism: ism.trim(),
         familiya: familiya.trim(),
         nomer: nomer.trim(),
         parol,
         turi: turi || 'user',
      };

      const saved = await insertUser(user);
      res.sendFile(path.join(__dirname, 'frontend', 'success.html'));
   } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
   }
});

// barcha userlarni olish
app.get('/allusers', async (req, res) => {
   try {
      const users = await getAllUsers();
      res.json({ ok: true, users });
   } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
   }
});

// 🔥 DB ni ishga tushiramiz, keyin server
await initDB();

app.listen(PORT, () => {
   console.log(`🚀 Server ishga tushdi: ${PORT}`);
});

