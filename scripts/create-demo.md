# Creating a Demo GIF/Video for NeoCore

## Option 1: Screen Recording with OBS/QuickTime
1. Open your NeoCore app at `http://localhost:5000`
2. Record a 30-second demo showing:
   - Dashboard with metrics
   - Navigate to AI Assistant
   - Type a question and show AI response
   - Show Database page
   - Navigate through different sections

## Option 2: Automated Screenshot Tool
Use Puppeteer to create screenshots:

```bash
npm install puppeteer
```

```javascript
const puppeteer = require('puppeteer');

async function createDemo() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for consistent screenshots
  await page.setViewport({ width: 1200, height: 800 });
  
  // Take screenshots of different pages
  await page.goto('http://localhost:5000');
  await page.screenshot({ path: 'demo-dashboard.png' });
  
  await page.goto('http://localhost:5000/ai');
  await page.screenshot({ path: 'demo-ai.png' });
  
  await page.goto('http://localhost:5000/database');
  await page.screenshot({ path: 'demo-database.png' });
  
  await browser.close();
}
```

## Option 3: Use Online Tools
1. **LiceCap**: Free tool to create GIFs from screen recording
2. **CloudApp**: Easy screen recording with auto-upload
3. **Kap**: Lightweight screen recorder for Mac

## Option 4: GitHub Actions for Auto-Demo
Create automated screenshots on deployment using GitHub Actions.

## Recommended Demo Flow (30 seconds)
1. **Dashboard** (5s): Show metrics and overview
2. **AI Assistant** (10s): Type question, show response
3. **Database** (5s): Show table/query interface  
4. **API Playground** (5s): Show HTTP client
5. **Functions** (5s): Show serverless functions

## Tips for Great Demo
- Use consistent browser size (1200x800)
- Clear browser cache for clean UI
- Prepare demo data/questions
- Keep mouse movements smooth
- Show key features that differentiate NeoCore