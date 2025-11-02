# Gemini Nano Banana Setup Instructions

## Step 1: Get API Keys
1. Go to https://banana.dev
2. Sign up for an account
3. Navigate to your dashboard
4. Copy your API key and model key

## Step 2: Update Environment Variables
Open `backend/.env` and replace:
```
BANANA_API_KEY=your_banana_api_key_here
BANANA_MODEL_KEY=your_gemini_model_key_here
```

With your actual keys:
```
BANANA_API_KEY=your_actual_api_key_from_banana
BANANA_MODEL_KEY=your_actual_model_key_from_banana
```

## Step 3: Restart Backend
```bash
cd backend
npm start
```

## Step 4: Test
Click on any exercise or meal in your fitness plan to generate AI images.

## Fallback
If API keys are not set, the app will use Unsplash images instead.