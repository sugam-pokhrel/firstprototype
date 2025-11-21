# How to Restart the Backend Server

The 404 error is happening because the server needs to be restarted to pick up the route changes.

## Steps to Restart:

1. **Find the server terminal** - Look for the terminal window running `npm run server` or `npm start` in the server directory

2. **Stop the server**:
   - Press `Ctrl + C` in that terminal

3. **Restart the server**:
   ```bash
   cd server
   npm start
   ```
   
   Or from the root directory:
   ```bash
   npm run server
   ```

4. **Verify it's running**:
   - You should see: `Server running on port 3000`
   - You should see: `MongoDB Connected: ...`

5. **Test the endpoint** (optional):
   ```bash
   curl "http://192.168.137.1:3000/api/machines/nearby?latitude=37.7749&longitude=-122.4194&radius=10"
   ```

## Alternative: Kill all Node processes and restart

If you're not sure which process is the server:

1. **Kill all node processes**:
   ```powershell
   Get-Process -Name node | Stop-Process -Force
   ```

2. **Start the server fresh**:
   ```bash
   cd server
   npm start
   ```

## After Restart

The `/api/machines/nearby` endpoint should work correctly. The app will:
- Try to fetch machines from the database
- If no machines exist, it will return an empty array
- The app will fallback to JSON data if API fails

