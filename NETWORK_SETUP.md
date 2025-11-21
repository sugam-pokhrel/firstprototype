# Network Setup for Expo Go on Physical Device

When using Expo Go on a physical device connected via hotspot, you need to configure the API URL to use your computer's IP address instead of `localhost`.

## Step 1: Find Your Computer's IP Address

### Windows:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (Wi-Fi or Ethernet).

### Mac/Linux:
```bash
ifconfig
# or
ip addr show
```

## Step 2: Update API Configuration

1. Open `src/config/api.js`
2. Replace `192.168.137.1` with your actual IP address
3. Common hotspot IPs:
   - Windows Mobile Hotspot: Usually `192.168.137.1`
   - Mac Personal Hotspot: Usually `172.20.10.1`
   - Other routers: Check with `ipconfig` or `ifconfig`

## Step 3: Make Sure Backend is Running

1. Start the backend server:
```bash
npm run server
```

2. The server should be accessible at `http://YOUR_IP:3000`

## Step 4: Test Connection

1. On your phone, open a browser and go to: `http://YOUR_IP:3000/api/health`
2. You should see: `{"success":true,"message":"Server is running"}`
3. If it doesn't work, check:
   - Firewall settings (allow port 3000)
   - Both devices are on the same network
   - IP address is correct

## Step 5: Update Expo App

After updating the IP in `src/config/api.js`, restart your Expo app:
```bash
npm start
# Then press 'r' to reload
```

## Troubleshooting

### Can't connect from phone:
1. **Check firewall**: Windows Firewall might be blocking port 3000
   - Go to Windows Defender Firewall > Advanced Settings
   - Add an inbound rule for port 3000

2. **Verify IP address**: Make sure you're using the IP of the network adapter that's sharing internet (hotspot)

3. **Test with browser**: Try accessing `http://YOUR_IP:3000/api/health` from your phone's browser first

4. **Check CORS**: The backend already has CORS enabled, but if issues persist, check `server/src/index.js`

### Still having issues?
- Make sure both devices are on the same network
- Try disabling VPN if active
- Check if your hotspot is actually sharing internet (not just creating a network)

