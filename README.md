# On-Ground.ai · Call Centre App & Calling Engine

A high-density, production-ready Call Centre Portal built for **On-Ground.ai** (for retail client *The Sleep Company*). This application rebuilds the agent interface used throughout a shift to follow up on store walk-outs, execute planned callbacks, review analytics, coordinate with AI agents in Pulse, and place real human-to-human and AI-to-human phone calls.

---

## 1. Quick Start: How to Run

### Prerequisites
- **Node.js**: v18+ (tested on Node v24.19)
- **Python**: v3.10+ (tested on Python 3.12)
- Existing `.env` file in the root directory (see `.env.example`)

---

### Step 1: Start the Calling Backend (Node.js + Express)
The backend manages the Twilio telephony bridge and serves the standalone testing page.

```bash
cd calling-backend
npm install
npm start
```
* Backend runs at: `http://localhost:5000`
* Standalone Twilio test page: `http://localhost:5000/test`
* Health check: `http://localhost:5000/api/health`

---

### Step 2: Start the AI Voice Agent (Python + LiveKit)
The AI agent runs as a real-time voice worker connected to LiveKit Cloud.

```bash
cd calling-backend
pip install -r requirements.txt
python agent.py dev
```
* **Testing in Browser**: Open the [LiveKit Agents Playground](https://agents-playground.livekit.io/) and connect to your project: `wss://onground-calling-piksxt51.livekit.cloud`.

---

### Step 3: Start the React Frontend (Vite)
The agent dashboard with all 8 screens and interactive calling controls.

```bash
cd frontend
npm install
npm run dev
```
* Access the app in your browser at: `http://localhost:3000`

---

## 2. Tech Stack & Architectural Decisions

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | **React 18 + Vite** | Instant hot-module reloading, strict modularity, and lightning-fast developer experience. Matches reviewer preference for React. |
| **Styling & Design System** | **Custom Vanilla CSS** | Restrained typography, high-density layout, exact color matching to mock screenshots (`#0a1714` dark green shell, `#10b981` emerald accents, `#f59e0b` amber alerts). Zero unnecessary utility bloat. |
| **Icons** | **Lucide React** | Clean, modern feather-based icon set matching enterprise call center tools. |
| **Charts** | **Recharts** | Interactive SVG-rendered 7-day activity bar charts and CSAT trend lines with responsive containers. |
| **Telephony Server** | **Node.js + Express + Twilio SDK** | Lightweight proxy handling CORS, API validation, and agent-first PSTN call bridging. |
| **Voice AI Agent** | **Python + livekit-agents** | Official LiveKit Agents framework leveraging LiveKit Cloud Hosted Inference (no third-party vendor keys required). |

---

## 3. How Calling Works (Plain-English Explanation)

### Part A: Human-to-Human Calling (Twilio Bridge)
In an enterprise call centre, outbound calls should connect the agent first so the customer never hears ringing or waiting music.

1. **Trigger**: The agent clicks **"Call back"** on any missed call or hot lead in the UI.
2. **API Request**: The frontend issues a `POST /api/call` with payload `{"to": "+91..."}` to the local Node.js server.
3. **Agent-First Dispatch**: The server uses Twilio's REST API (`twilioClient.calls.create`) to dial `AGENT_PHONE` (`+91 9113027924`) first.
4. **TwiML Bridge**: When the agent picks up their mobile phone, Twilio executes inline TwiML instructions:
   - Announces: *"Connecting you to the customer now."*
   - Immediately executes `<Dial callerId="...">` to bridge the destination customer's number into the call.
5. **No ngrok Required**: By passing TwiML directly into the `calls.create` API call, Twilio executes call routing in the cloud without requiring a public webhook URL or tunnel.

---

### Part B: AI-to-Human Calling (LiveKit Cloud Voice Agent)
The AI agent acts as an autonomous callback representative for *The Sleep Company* to qualify missed store walk-outs.

1. **Architecture**: Implemented in [`calling-backend/agent.py`](calling-backend/agent.py) using the official `livekit-agents` library.
2. **Unified Inference Pipeline**: Uses LiveKit Cloud Inference so zero external API keys (OpenAI/Deepgram/Cartesia) are needed:
   - **Voice Activity Detection (VAD)**: Built-in Silero VAD to detect user speech pauses.
   - **Speech-to-Text (STT)**: `deepgram/nova-3` for multi-lingual Indian English transcription.
   - **LLM**: `google/gemma-4-31b-it` voice-optimized lightweight model.
   - **Text-to-Speech (TTS)**: `cartesia/sonic-3` for natural, low-latency vocal response.
3. **Agent Persona**:
   > *"You are a friendly call centre agent for The Sleep Company. You are calling back a customer who missed our call. Greet them, ask how you can help, and ask when they are free for a follow-up. Keep replies short."*
4. **Outbound PSTN Integration (SIP)**:
   - To have this AI agent dial physical phone numbers directly, Twilio's Elastic SIP Trunk is registered in LiveKit Cloud under **SIP Outbound Trunks**.
   - LiveKit Cloud SIP Dispatch rules route the call into the room where `agent.py` joins and converses.

---

## 4. What is Done vs What is Skipped

### Done (100% of Must-Build Requirements)
- [x] **App Shell**: Dark green sidebar and top bar with "On-Ground.ai" branding, QA score badge (`94%`), shift availability indicator, and agent profile (`Arvind Rajan`).
- [x] **Dashboard**:
  - Greeting header with live shift targets.
  - 4 KPI cards: QA score, Average handle time (`4m 12s`), Conversion rate (`34%`), In queue (`2`).
  - "My progress - today" card with closed and called counters.
  - "Who is waiting" queue (Priya Iyer, Suresh Nair) with wait times and quick call buttons.
  - "My earnings this month" (`₹5,200`) with progress bar towards target.
  - "My tasks" list (callbacks, hot leads, outcome logging). Clicking any hot lead opens the full Leads Modal.
  - Two 7-day charts using Recharts: "Calls handled - last 7 days" (bars) and "CSAT trend - last 7 days" (line).
- [x] **Plan - Calls to Make**:
  - "Today's calling plan" with leads ranked by ICP fit and intent scores.
  - Expandable detail drawers showing store visited, notes, and quotation data.
  - Pagination ("Page 1 of 2") and instant Call triggers.
- [x] **Plan - Incoming**:
  - Missed calls table with "missed today" count.
  - Expected value at stake badge (`₹81,860`).
  - Rows for Faizan A., Kavitha R., Divya P., Ritu S., Unknown with expected value and a **"Call back"** button on every row.
- [x] **Plan - Recent**:
  - Comprehensive call logs by type (incoming, outgoing, missed), duration, and timestamps.
  - Tapping any call opens the **Call Review Panel** with AI sentiment analysis, executive summary, and conversation transcript snippet.
- [x] **Calendar**:
  - Full **October 2026** calendar grid with event indicator dots.
  - "Today" button and month navigation.
  - Sync banner explaining integration with coaching, calls, and meetings.
  - Interactive day schedule drawer displaying scheduled appointments for the selected date.
- [x] **Pulse Home**:
  - Header: `Pulse - The Sleep Company`.
  - **AvaniBot 2.0** card with "Daily Brief" and "Ask a question" modal responses.
  - Role Agents list (`#walkout-recovery-agent`, `#pitch-coach`, `#asm-agent`, `#callcentre-agent`, `#followup-agent`).
  - Task Agents with live progress percentages (`#cross-sell-agent`, `#sop-agent`, `#lead-conversion-agent`, `#capture-agent`).
  - Channels directory and Kudos feed.
- [x] **Pulse Channel (`#callcentre-team`)**:
  - Channel header with back button to Pulse home.
  - **Pinned "Needs your input" Card**: "Confirm the 4:30pm callback" with interactive `[✓ Confirmed]` and `[Reschedule]` buttons.
  - Real-time conversation thread with left/right message alignment and timestamps.
  - Working message input box allowing the agent to type and post new messages into the thread.
- [x] **Leads Modal**:
  - Opens directly from Dashboard task list or lead tables.
  - Lead navigation with `[Prev]` and `[Next]` paging ("Lead 1 of 5").
  - Deal price, status badge, and time left.
  - Dual progress bars for **ICP Fit Score** (`87%`) and **Lead Intent Score** (`92%`).
  - Collapsible accordion sections: *ICP Fit Breakdown*, *How We Got Here*, and *Where We Picked Up Signals* (Financing, Quotation, Warranty).
  - Cumulative missed touchpoint footer.
  - Action buttons for **"⚡ In-app call"** and **"📞 Phone call"**.

### Bonus Features Included
- [x] **Bonus 1**: Send a message in a channel (persisted in local state).
- [x] **Bonus 2**: Interactive "Needs your input" decision workflow.
- [x] **Bonus 3**: "Practice a Call" roleplay simulator with real-time AI coaching scores.
- [x] **Bonus 4**: Mobile-responsive drawer navigation for phone-width viewports.
- [x] **Bonus 5**: Interactive SVG chart library (`Recharts`).
- [x] **Bonus 6**: Floating demo action strip (`⚡ In-app call | 📞 Phone call`).

### Skipped
- No database backend (per ground rules: all UI screens use local mock data modules; the only server is the calling engine).

---

## 5. AI Tools Used

In accordance with the assignment ground rules:
- **Google Antigravity IDE**: Used for project scaffolding, UI styling matching the PDF screenshots, component decomposition, and Twilio/LiveKit integration.
- **Gemini 3.8 Flash (High)**: System design and code implementation.
