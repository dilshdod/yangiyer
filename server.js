const express = require('express');
const path = require('path');
const cors = require('cors');
import { insertUser } from './db.js';

const app = express();

// Render avtomatik PORT beradi
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Frontend statik fayllar
app.use(express.static(path.join(__dirname, 'frontend')));

// Test endpoint (Render uxlab qolmasligi uchun ham foydali)
app.get('/ping', (req, res) => {
   res.json({ status: 'ok', time: new Date() });
});

// Asosiy sahifa
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ✅ FORMADAN kelgan ma’lumotlarni userga yig‘ib DB ga yozish
app.post('/users', async (req, res) => {
   try {
      const { ism, familiya, nomer, parol, turi } = req.body;

      // minimal tekshiruv
      if (!ism || !familiya || !nomer || !parol) {
         return res.status(400).json({
            ok: false,
            error: 'ism, familiya, nomer, parol majburiy',
         });
      }

      // user obyektini yasaymiz
      const user = {
         ism: String(ism).trim(),
         familiya: String(familiya).trim(),
         nomer: String(nomer).trim(),
         parol: String(parol), // hozircha shunday (keyin hash qilamiz)
         turi: turi ? String(turi).trim() : 'user',
      };

      const saved = await insertUser(user);

      res.json({ ok: true, user: saved });
   } catch (e) {
      res.status(500).json({ ok: false, error: e.message });
   }
});

// Server ishga tushdi
app.listen(PORT, () => {
   console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
});
