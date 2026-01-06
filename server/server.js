const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const MUSIC_DIR = '/opt/berryradio/music';
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/songs', (req, res) => {
  try {
    const files = fs.readdirSync(MUSIC_DIR).filter(f => f.match(/\.(mp3|wav)$/i));
    res.json({ songs: files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/play', (req, res) => {
  const { music, frequency } = req.body;
  if (!music || !frequency) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const filepath = path.join(MUSIC_DIR, music);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  exec('killall pi_fm_rds 2>/dev/null', () => {
    const cmd = `/opt/berryradio/fm_transmitter -freq ${frequency} -audio "${filepath}"`;
    exec(cmd, (err) => {
      if (err) console.error('Radio error:', err);
    });
  });
  res.json({ ok: true });
});

app.post('/api/stop', (req, res) => {
  exec('killall pi_fm_rds 2>/dev/null');
  res.json({ ok: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log('🍓 BerryRadio listening on port ' + PORT);
});
