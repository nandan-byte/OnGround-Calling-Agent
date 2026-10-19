// Agent profile details for Arvind Rajan at The Sleep Company
export const agentProfile = {
  // Agent full name
  name: "Arvind Rajan",
  // Department and team
  team: "The Sleep Company - Call Centre",
  // Current agent status
  status: "Available",
  // QA evaluation score
  qaScore: "94%",
  // Average handle time across shift
  avgHandleTime: "4m 12s",
  // Lead conversion percentage
  conversionRate: "34%",
  // Number of shoppers waiting in queue
  inQueue: 2,
  // Current month accumulated earnings
  monthlyEarnings: 5200,
  // Target earnings goal for the month
  earningsTarget: 8000,
  // Today's closed leads count
  leadsClosedToday: 6,
  // Today's closed leads target
  leadsClosedTarget: 10,
  // Today's total calls placed
  leadsCalledToday: 18,
  // Today's target calls
  leadsCalledTarget: 25,
};

// Queue of shoppers actively waiting for assistance
export const whoIsWaiting = [
  {
    // Unique identifier
    id: "w1",
    // Shopper name
    name: "Priya Iyer",
    // Time waiting in queue
    waitTime: "12m wait",
    // Product of interest
    product: "SmartGRID Luxe Mattress",
    // Intent category badge
    intent: "Price Inquiry",
    // Verified phone number
    phone: "+919113027924",
    // Urgency level
    urgency: "high",
  },
  {
    // Unique identifier
    id: "w2",
    // Shopper name
    name: "Suresh Nair",
    // Time waiting in queue
    waitTime: "24m wait",
    // Product of interest
    product: "Elev8 Smart Recliner Bed",
    // Intent category badge
    intent: "Store Visit Follow-up",
    // Verified phone number
    phone: "+919113027924",
    // Urgency level
    urgency: "medium",
  },
];

// Agent shift tasks displayed on the dashboard
export const initialTasks = [
  {
    // Task unique id
    id: "t1",
    // Task category
    category: "hot_lead",
    // Title of the task
    title: "Follow up with Mukunda (Ortho GRID Mattress)",
    // Associated lead identifier
    leadId: "lead-1",
    // Priority badge
    priority: "High Priority",
    // Scheduled time or due badge
    due: "Due in 15 mins",
    // Value of the deal
    value: "₹9,490",
  },
  {
    // Task unique id
    id: "t2",
    // Task category
    category: "hot_lead",
    // Title of the task
    title: "Review quote with Kavitha R. (King Size Ergonomic)",
    // Associated lead identifier
    leadId: "lead-2",
    // Priority badge
    priority: "High Priority",
    // Scheduled time or due badge
    due: "Due in 40 mins",
    // Value of the deal
    value: "₹24,999",
  },
  {
    // Task unique id
    id: "t3",
    // Task category
    category: "callback",
    // Title of the task
    title: "Callback Faizan A. - Missed call at 10:15 AM",
    // Associated lead identifier
    leadId: "lead-3",
    // Priority badge
    priority: "Urgent Callback",
    // Scheduled time or due badge
    due: "Overdue by 10m",
    // Value of the deal
    value: "₹18,500",
  },
  {
    // Task unique id
    id: "t4",
    // Task category
    category: "callback",
    // Title of the task
    title: "Confirm callback time for Divya P.",
    // Associated lead identifier
    leadId: "lead-4",
    // Priority badge
    priority: "Callback",
    // Scheduled time or due badge
    due: "Scheduled 2:30 PM",
    // Value of the deal
    value: "₹14,200",
  },
  {
    // Task unique id
    id: "t5",
    // Task category
    category: "outcome",
    // Title of the task
    title: "Log disposition for Indiranagar Walk-in #402",
    // Associated lead identifier
    leadId: "lead-5",
    // Priority badge
    priority: "Pending Outcome",
    // Scheduled time or due badge
    due: "End of shift",
    // Value of the deal
    value: "₹8,900",
  },
];

// 7-day activity metrics for dashboard charts
export const weeklyCallData = [
  // Monday data point
  { day: "Mon", calls: 24, connected: 19, converted: 7, csat: 91 },
  // Tuesday data point
  { day: "Tue", calls: 28, connected: 22, converted: 9, csat: 93 },
  // Wednesday data point
  { day: "Wed", calls: 31, connected: 26, converted: 11, csat: 95 },
  // Thursday data point
  { day: "Thu", calls: 22, connected: 18, converted: 6, csat: 90 },
  // Friday data point
  { day: "Fri", calls: 35, connected: 29, converted: 12, csat: 96 },
  // Saturday data point
  { day: "Sat", calls: 42, connected: 36, converted: 15, csat: 94 },
  // Sunday data point
  { day: "Sun", calls: 18, connected: 15, converted: 6, csat: 94 },
];

// Leads data for "Calls to make" and Leads Modal
export const mockLeads = [
  {
    // Lead identifier
    id: "lead-1",
    // Customer name
    name: "Mukunda",
    // Phone number
    phone: "+919113027924",
    // Product interest
    product: "Ortho GRID Mattress (King Size)",
    // Deal price
    price: "₹9,490",
    // Lead status tag
    status: "Hot Lead",
    // Time left before next escalation
    timeLeft: "45m left",
    // ICP fit score percentage
    icpScore: 87,
    // Intent score percentage
    intentScore: 92,
    // Store where customer walked in
    store: "Indiranagar Store, Bangalore",
    // Walk-in visit date
    lastVisited: "Yesterday, 4:15 PM",
    // ICP fit breakdown criteria
    icpBreakdown: [
      { label: "Budget Alignment", detail: "Matches ₹10k - ₹15k bracket", status: "pass" },
      { label: "Decision Timeline", detail: "Moving into new flat this weekend", status: "pass" },
      { label: "Product Fit", detail: "Chronic lower-back pain needs orthopedic support", status: "pass" },
    ],
    // How the lead was generated
    howWeGotHere: "Shopper walked into the store, tested the Ortho Pro and Luxe mattresses for 18 minutes. Sales staff logged initial notes on On-Ground app before shopper had to leave for an appointment.",
    // Concrete buying signals picked up by AI
    buyingSignals: [
      {
        title: "Financing Related",
        description: "Specifically inquired about zero-cost 6-month EMI via Bajaj Finserv / HDFC cardless EMI.",
      },
      {
        title: "Quotation Demanded",
        description: "Asked for an official quotation sent to WhatsApp to compare against Wakefit and Sleepyhead.",
      },
      {
        title: "Warranty Related",
        description: "Asked for clarity on the 10-year warranty coverage and home trial return terms.",
      },
    ],
    // Missed touchpoint count
    cumulativeMissed: "1 call, 2 SMS",
  },
  {
    // Lead identifier
    id: "lead-2",
    // Customer name
    name: "Kavitha R.",
    // Phone number
    phone: "+919113027924",
    // Product interest
    product: "SmartGRID Luxe Ergonomic Mattress",
    // Deal price
    price: "₹24,999",
    // Lead status tag
    status: "Warm Lead",
    // Time left before next escalation
    timeLeft: "2h left",
    // ICP fit score percentage
    icpScore: 82,
    // Intent score percentage
    intentScore: 85,
    // Store where customer walked in
    store: "Koramangala Experience Centre",
    // Walk-in visit date
    lastVisited: "2 days ago",
    // ICP fit breakdown criteria
    icpBreakdown: [
      { label: "Premium Comfort Demand", detail: "Seeking luxury hotel feel at home", status: "pass" },
      { label: "Size Requirement", detail: "Custom 78x72 King dimensions", status: "pass" },
    ],
    // How the lead was generated
    howWeGotHere: "Inquired online via website live chat, visited Koramangala store for physical trial.",
    // Buying signals
    buyingSignals: [
      {
        title: "Quotation Demanded",
        description: "Requested combo quote including 2 patented SmartGRID pillows and waterproof protector.",
      },
      {
        title: "Delivery Timeline",
        description: "Needs guaranteed delivery within 48 hours for visiting family.",
      },
    ],
    // Missed touchpoint count
    cumulativeMissed: "0 calls, 1 WhatsApp",
  },
  {
    // Lead identifier
    id: "lead-3",
    // Customer name
    name: "Faizan A.",
    // Phone number
    phone: "+919113027924",
    // Product interest
    product: "Elev8 Smart Recliner Bed Frame",
    // Deal price
    price: "₹38,500",
    // Lead status tag
    status: "Urgent Callback",
    // Time left before next escalation
    timeLeft: "15m left",
    // ICP fit score percentage
    icpScore: 91,
    // Intent score percentage
    intentScore: 88,
    // Store where customer walked in
    store: "Whitefield Flagship Store",
    // Walk-in visit date
    lastVisited: "Today, 10:15 AM",
    // ICP fit breakdown criteria
    icpBreakdown: [
      { label: "High Value Lead", detail: "Interested in motorised recliner bed", status: "pass" },
      { label: "Ready to Purchase", detail: "Comparing with Wakefit motorized base", status: "pass" },
    ],
    // How the lead was generated
    howWeGotHere: "Left a missed call after looking at the store brochure.",
    // Buying signals
    buyingSignals: [
      {
        title: "Financing Related",
        description: "Wants to split payment across credit card and debit card EMI.",
      },
      {
        title: "Installation Support",
        description: "Asked whether technician helps with bedroom assembly.",
      },
    ],
    // Missed touchpoint count
    cumulativeMissed: "2 calls missed today",
  },
  {
    // Lead identifier
    id: "lead-4",
    // Customer name
    name: "Divya P.",
    // Phone number
    phone: "+919113027924",
    // Product interest
    product: "Stylux Memory Foam Mattress",
    // Deal price
    price: "₹14,200",
    // Lead status tag
    status: "Callback Scheduled",
    // Time left before next escalation
    timeLeft: "1h left",
    // ICP fit score percentage
    icpScore: 78,
    // Intent score percentage
    intentScore: 74,
    // Store where customer walked in
    store: "Jayanagar Store",
    // Walk-in visit date
    lastVisited: "Yesterday, 6:00 PM",
    // ICP fit breakdown criteria
    icpBreakdown: [
      { label: "Guest Bedroom Fit", detail: "Standard queen size needed", status: "pass" },
    ],
    // How the lead was generated
    howWeGotHere: "Walk-out recovery lead captured by QR code scan at store entrance.",
    // Buying signals
    buyingSignals: [
      {
        title: "Discount Expected",
        description: "Asked if corporate discount applies for TCS employees.",
      },
    ],
    // Missed touchpoint count
    cumulativeMissed: "1 call missed",
  },
  {
    // Lead identifier
    id: "lead-5",
    // Customer name
    name: "Ritu S.",
    // Phone number
    phone: "+919113027924",
    // Product interest
    product: "Ortho Pro Mattress (Single)",
    // Deal price
    price: "₹8,900",
    // Lead status tag
    status: "Follow-up",
    // Time left before next escalation
    timeLeft: "3h left",
    // ICP fit score percentage
    icpScore: 75,
    // Intent score percentage
    intentScore: 70,
    // Store where customer walked in
    store: "HSR Layout Store",
    // Walk-in visit date
    lastVisited: "3 days ago",
    // ICP fit breakdown criteria
    icpBreakdown: [
      { label: "Kid's Room Mattress", detail: "Needs firm spine support for growing child", status: "pass" },
    ],
    // How the lead was generated
    howWeGotHere: "Store staff entered contact info after in-store demo.",
    // Buying signals
    buyingSignals: [
      {
        title: "Warranty Related",
        description: "Checking water-resistance warranty for kids mattress.",
      },
    ],
    // Missed touchpoint count
    cumulativeMissed: "0 missed",
  },
];

// Incoming missed calls list with value at stake
export const incomingCalls = [
  {
    id: "inc-1",
    name: "Faizan A.",
    phone: "+919113027924",
    time: "10:15 AM (15m ago)",
    expectedValue: 38500,
    product: "Elev8 Smart Recliner Bed",
    status: "Missed",
  },
  {
    id: "inc-2",
    name: "Kavitha R.",
    phone: "+919113027924",
    time: "09:45 AM (45m ago)",
    expectedValue: 24999,
    product: "SmartGRID Luxe Mattress",
    status: "Missed",
  },
  {
    id: "inc-3",
    name: "Divya P.",
    phone: "+919113027924",
    time: "09:12 AM (1h 18m ago)",
    expectedValue: 14200,
    product: "Stylux Memory Foam Mattress",
    status: "Missed",
  },
  {
    id: "inc-4",
    name: "Ritu S.",
    phone: "+919113027924",
    time: "08:50 AM (1h 40m ago)",
    expectedValue: 8900,
    product: "Ortho Pro Mattress",
    status: "Missed",
  },
  {
    id: "inc-5",
    name: "Unknown Caller",
    phone: "+919113027924",
    time: "08:20 AM (2h 10m ago)",
    expectedValue: 15261,
    product: "Direct Inbound Enquiry",
    status: "Missed",
  },
];

// Recent call logs with review details
export const recentCalls = [
  {
    id: "rec-1",
    name: "Mukunda R.",
    phone: "+919113027924",
    type: "Outgoing",
    time: "Today, 11:15 AM",
    duration: "4m 22s",
    outcome: "Interested - Sent Quotation",
    sentiment: "Positive (88%)",
    summary: "Customer was very receptive to the Ortho Pro benefits. Agreed to receive formal quotation on WhatsApp.",
    transcript: "Agent: Hello Mukunda, calling back from The Sleep Company Indiranagar store regarding your visit yesterday! \nCustomer: Hi Arvind, yes! I was looking for the 10-year warranty details.\nAgent: The 10-year warranty covers any sagging beyond 1 inch with doorstep replacement.\nCustomer: Perfect, send me the EMI quote on WhatsApp.",
  },
  {
    id: "rec-2",
    name: "Kavitha R.",
    phone: "+919113027924",
    type: "Incoming",
    time: "Today, 10:40 AM",
    duration: "2m 15s",
    outcome: "Callback Requested",
    sentiment: "Neutral (65%)",
    summary: "Customer was driving, asked to call back around 12:30 PM with the mattress bundle pricing.",
    transcript: "Agent: Hello Kavitha, thank you for calling The Sleep Company.\nCustomer: Hi, I'm currently driving. Can you call me back at 12:30 PM?\nAgent: Absolutely, I have scheduled the callback for 12:30 PM sharp.",
  },
  {
    id: "rec-3",
    name: "Unknown Caller",
    phone: "+919113027924",
    type: "Missed",
    time: "Today, 09:55 AM",
    duration: "0s",
    outcome: "No Answer",
    sentiment: "N/A",
    summary: "Inbound call rang for 25 seconds before disconnect.",
    transcript: "Call unanswered.",
  },
  {
    id: "rec-4",
    name: "Ritu S.",
    phone: "+919113027924",
    type: "Outgoing",
    time: "Yesterday, 5:10 PM",
    duration: "5m 40s",
    outcome: "Warm Lead",
    sentiment: "Positive (80%)",
    summary: "Explained SmartGRID technology for spinal alignment. Customer requested store visit appointment for husband.",
    transcript: "Agent: Good evening Ritu, following up on your inquiry for single bed mattress.\nCustomer: Yes, does it help with back posture?\nAgent: Yes, the grid dynamically adapts to pressure points.",
  },
  {
    id: "rec-5",
    name: "Faizan A.",
    phone: "+919113027924",
    type: "Incoming",
    time: "Yesterday, 3:20 PM",
    duration: "3m 12s",
    outcome: "Negotiating Discount",
    sentiment: "Cautious (55%)",
    summary: "Inquired about festive exchange discount on old spring mattress.",
    transcript: "Customer: Do you offer exchange value on old coir mattresses?\nAgent: Yes, we provide up to ₹3,000 instant exchange bonus.",
  },
  {
    id: "rec-6",
    name: "Divya P.",
    phone: "+919113027924",
    type: "Outgoing",
    time: "Yesterday, 1:45 PM",
    duration: "1m 50s",
    outcome: "Rescheduled",
    sentiment: "Neutral (60%)",
    summary: "Customer was in a meeting, agreed to talk later.",
    transcript: "Agent: Hi Divya, is this a good time to speak?\nCustomer: In a meeting, please call tomorrow morning.",
  },
];

// October 2026 calendar events
export const calendarEvents = {
  // October 6
  6: [{ title: "Coaching: Objection Handling", time: "11:00 AM", type: "coaching" }],
  // October 9
  9: [{ title: "Follow-up Call with Mukunda", time: "02:30 PM", type: "call" }],
  // October 12
  12: [{ title: "Store Sync: Indiranagar Team", time: "10:00 AM", type: "meeting" }],
  // October 15
  15: [{ title: "Weekly Target Review with ASM", time: "04:00 PM", type: "meeting" }],
  // October 19 (Today)
  19: [
    { title: "Callback: Mukunda (Ortho GRID)", time: "11:30 AM", type: "call" },
    { title: "Pitch Coaching with AvaniBot", time: "02:00 PM", type: "coaching" },
    { title: "Call Faizan A. (Recliner Bed)", time: "03:15 PM", type: "call" },
    { title: "Confirm 4:30 PM Callback", time: "04:30 PM", type: "call" },
  ],
  // October 20 (Assignment Deadline Day)
  20: [
    { title: "Submission Deadline: Mukunda Dwarkanath", time: "10:00 AM", type: "urgent" },
    { title: "Floor Walk-out Debrief", time: "03:00 PM", type: "meeting" },
  ],
  // October 24
  24: [{ title: "Product Launch: Elev8 2.0 Training", time: "01:00 PM", type: "coaching" }],
  // October 28
  28: [{ title: "Month-End Conversion Push", time: "09:30 AM", type: "meeting" }],
};

// Pulse channels and discussions
export const pulseChannels = [
  { id: "callcentre-team", name: "callcentre-team", description: "Daily updates, escalations and customer callbacks" },
  { id: "customer-discussions", name: "customer-discussions", description: "Store floor customer inquiries and feedback" },
  { id: "bangalore-stores", name: "bangalore-stores", description: "Live updates from Indiranagar and Koramangala" },
  { id: "product-updates", name: "product-updates", description: "SmartGRID specifications and warranty guidelines" },
];

// Pulse role and task agents
export const pulseAgents = {
  roleAgents: [
    { id: "walkout-recovery", name: "# walkout-recovery-agent", description: "Auto-re-engages store walk-outs via WhatsApp & SMS", badge: "Role" },
    { id: "pitch-coach", name: "# pitch-coach", description: "Real-time speech coaching and script guidance", badge: "Role" },
    { id: "asm-agent", name: "# asm-agent", description: "Area Sales Manager daily targets & metrics bot", badge: "Role" },
    { id: "callcentre-agent", name: "# callcentre-agent", description: "Shift assistant for tele-callers and callbacks", badge: "Active Role" },
    { id: "followup-agent", name: "# followup-agent", description: "Automated follow-up cadence scheduler", badge: "Role" },
  ],
  taskAgents: [
    { id: "cross-sell", name: "# cross-sell-agent", progress: 78, detail: "Pillow & Protector attachment rate" },
    { id: "sop-agent", name: "# sop-agent", progress: 92, detail: "Call opening & closing compliance" },
    { id: "lead-conversion", name: "# lead-conversion-agent", progress: 64, detail: "Hot lead to store purchase conversion" },
    { id: "capture-agent", name: "# capture-agent", progress: 85, detail: "Store walk-in phone capture rate" },
  ],
};

// Chat messages for #callcentre-team channel
export const initialChannelMessages = [
  {
    id: "m1",
    sender: "Sunita Rao (Store Manager)",
    isAgent: false,
    time: "10:05 AM",
    text: "Team, we have 4 high-intent shoppers from yesterday's Indiranagar floor who wanted customized quote summaries. Please prioritize these callbacks before lunch.",
  },
  {
    id: "m2",
    sender: "Sunita Rao (Store Manager)",
    isAgent: false,
    time: "10:08 AM",
    text: "Stakeholders: Indiranagar Store Team, Call Centre Agents. \nIssue Definition: Customers requesting 0% EMI clarification before making decision. \nSuggested Resolution: Emphasize our 6-month no-cost EMI on Bajaj Finserv.",
  },
  {
    id: "m3",
    sender: "Arvind Rajan",
    isAgent: true,
    time: "10:12 AM",
    text: "On it! Will make sure I open every call with the greeting script and address the EMI questions upfront.",
  },
];
