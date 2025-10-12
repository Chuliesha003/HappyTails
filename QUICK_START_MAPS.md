# 🎯 Quick Start - Get Your API Key and Test

## ⚡ Super Fast Setup (2 Minutes)

### 1️⃣ Get Google Maps API Key
```
🌐 Visit: https://console.cloud.google.com/
   → Create project: "HappyTails"
   → Enable: "Maps JavaScript API"
   → Create API Key
   → Copy the key (starts with AIzaSy...)
```

### 2️⃣ Add Key to Project
```
📁 Open: frontend/.env
🔑 Replace: VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   With your actual key: VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

### 3️⃣ Restart & Test
```powershell
cd frontend
npm run dev
```

Open: http://localhost:8080/vets
- Allow location when prompted ✅
- See blue marker (you) + red markers (vets) 🗺️
- Map centers on your location automatically 📍

## ✨ What You Get

✅ **Automatic Location** - No manual input needed
✅ **Google Maps** - Professional interactive map
✅ **Smart Search** - City → 50km → 75km → All vets
✅ **Visual Markers** - Blue (you) + Red (vets)
✅ **Click to Details** - Click any vet marker for info

## 🐛 Issues?

**Can't see map?**
- Paste your API key in chat and I'll verify format
- Check browser console (F12) for errors

**No vets showing?**
- Database might be empty for your area
- Tell me your city and I'll check backend

**Location not working?**
- Click "Allow" when browser asks for location
- Works best on HTTPS in production

## 📋 Paste This When Ready:
```
My API key: AIzaSy...
Issue (if any): [describe what you see]
```
