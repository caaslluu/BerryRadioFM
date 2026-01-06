# Troubleshooting

## Port already in use
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

## FM Transmitter not found
Make sure PiFmRds is compiled:
```bash
/opt/berryradio/fm_transmitter --help
```

## PM2 status
```bash
pm2 status
pm2 logs berryradio
```
