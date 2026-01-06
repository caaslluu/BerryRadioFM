# 🍓 BerryRadio

🍓 Transforme ton Raspberry Pi en station radio FM avec une interface web intuitive

<img src="/docs/assets/interface-berryradio.png" width="700">


## Installation rapide

### Option 1: Installation directe (recommandé)
```bash
curl -fsSL https://raw.githubusercontent.com/caaslluu/BerryRadioFM/main/scripts/install.sh | bash
```

### Option 2: Docker
```bash
git clone https://github.com/caaslluu/BerryRadioFM.git
cd BerryRadioFM
sudo docker-compose -f docker/docker-compose.yml up -d
```

Puis ouvrez `http://votre-ip-raspberry:5000`

## Features

- 🌓 Dark/Light mode
- 🎵 Support MP3/WAV
- 📻 Contrôle FM 87.5-108.8 MHz
- 🚀 Installation automatisée
- 🐳 Support Docker

## Architecture

- Backend: Node.js + Express
- Frontend: React + Tailwind CSS
- Radio: PiFmRds
- Gestion: PM2

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

