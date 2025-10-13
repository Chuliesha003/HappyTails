# AI Symptom Analyzer API

## Overview
The AI Symptom Analyzer uses Google's Gemini 1.5 Flash model to analyze pet symptoms and provide veterinary triage recommendations.

## Endpoints

### GET /api/ai/ping
Quick sanity check endpoint.

**Response:**
```json
{
  "ok": true,
  "where": "/api/ai/ping"
}
```

### POST /api/ai/symptoms
Analyze pet symptoms using AI.

**Content-Type:** `multipart/form-data`

**Fields:**
- `symptoms` (string) - Description of pet symptoms
- `petType` (string) - Type of pet (e.g., "Dog", "Cat")
- `age` (string/number) - Age of pet
- `photo` (file, optional) - Photo of pet/symptoms (max 8MB)

**Response:**
```json
{
  "ok": true,
  "model": "gemini-1.5-flash",
  "data": {
    "conditions": [
      {
        "name": "Condition name",
        "rationale": "Explanation"
      }
    ],
    "overallUrgency": "low" | "moderate" | "high",
    "careTips": ["Tip 1", "Tip 2"],
    "disclaimer": "Disclaimer text"
  }
}
```

## Testing with Postman

### Test 1: Text-only Analysis
1. Method: **POST**
2. URL: `http://localhost:5000/api/ai/symptoms`
3. Body → form-data:
   - `symptoms`: "dog vomiting and weak"
   - `petType`: "Dog"
   - `age`: "5"

### Test 2: Analysis with Image
1. Method: **POST**
2. URL: `http://localhost:5000/api/ai/symptoms`
3. Body → form-data:
   - `symptoms`: "skin rash and scratching"
   - `petType`: "Dog"
   - `age`: "3"
   - `photo`: [Select image file]

## Testing with PowerShell

### Text only:
```powershell
$Form = @{ symptoms = "dog vomiting and weak"; petType = "Dog"; age = "5" }
Invoke-WebRequest -Uri "http://localhost:5000/api/ai/symptoms" -Method POST -Form $Form | Select-Object -ExpandProperty Content
```

### With image:
```powershell
$Form = @{
  symptoms = "skin rash and scratching"
  petType  = "Dog"
  age      = "3"
  photo    = Get-Item "C:\path\to\photo.jpg"
}
Invoke-WebRequest -Uri "http://localhost:5000/api/ai/symptoms" -Method POST -Form $Form | Select-Object -ExpandProperty Content
```

## Environment Variables
Required in `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

## Troubleshooting

### MulterError: LIMIT_UNEXPECTED_FILE
- Ensure the file field name is exactly `photo`, not `file` or anything else.

### "AI analysis failed" error
- Check backend console for `[AI_SYMPTOMS_ERROR]` log with detailed error info
- Verify GEMINI_API_KEY is set correctly in .env
- Ensure the API key has access to Gemini 1.5 Flash model

### 404 Not Found
- Verify server started successfully
- Check that `/api/ai` routes are mounted before 404 handler in server.js
- Test the `/api/ai/ping` endpoint first

## Model Information
- **Model:** gemini-1.5-flash (multimodal - supports text + images)
- **Temperature:** 0.4
- **Max Output Tokens:** 1024
- **Response Format:** JSON

## Notes
- File size limit: 8MB
- Supported image formats: JPEG, PNG
- The route uses `gemini-1.5-flash` specifically, not `gemini-pro`
- CORS is configured for `http://localhost:8080`
