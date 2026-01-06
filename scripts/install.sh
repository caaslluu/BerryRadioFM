#!/bin/bash
set -e
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🍓 BerryRadio Installation${NC}\n"

if [ "$EUID" -eq 0 ]; then
   echo -e "${RED}Don't run as root${NC}"
   exit 1
fi

echo -e "${YELLOW}Step 1: System Updates${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${YELLOW}Step 2: Installing Dependencies${NC}"
sudo apt install -y nodejs npm git curl build-essential sox libsox-fmt-mp3 libsndfile1-dev

echo -e "${YELLOW}Step 3: Building PiFmRds${NC}"
cd /tmp
rm -rf PiFmRds
git clone https://github.com/ChristopheJacquet/PiFmRds.git
cd PiFmRds/src
make clean
make
sudo cp pi_fm_rds /opt/berryradio/fm_transmitter
sudo chmod +x /opt/berryradio/fm_transmitter
cd ~

echo -e "${YELLOW}Step 4: Creating Music Directory${NC}"
sudo mkdir -p /opt/berryradio/music
sudo chmod 777 /opt/berryradio/music

echo -e "${YELLOW}Step 5: Installing Project${NC}"
cd ~/berryradio
npm install
cd server && npm install && cd ..
cd client && npm install && npm run build && cd ..

echo -e "${YELLOW}Step 6: Setup PM2${NC}"
sudo npm install -g pm2
pm2 start server/server.js --name berryradio
pm2 save
pm2 startup

echo -e "${YELLOW}Step 7: Adding Sample Music${NC}"
sox -n -r 44100 -c 2 /opt/berryradio/music/test_880hz.wav synth 5 sine 880

echo -e "${GREEN}✅ Installation Complete!${NC}\n"
echo -e "${GREEN}Access: http://$(hostname -I | awk '{print $1}'):5000${NC}"
