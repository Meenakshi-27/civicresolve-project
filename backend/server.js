const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { processComplaint } = require('./AI_Orchestrator');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(bodyParser.json());

// Broad CSP to ensure no assets are blocked in Dev
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: content:; connect-src * 'self';");
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
});

// Silence Chrome DevTools console noise
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(204).end();
});

// Initialize "Database"
let complaints = [];
if (fs.existsSync(DB_FILE)) {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const raw = JSON.parse(data);
        // Data Normalization (Schema Migration)
        complaints = raw.map(c => ({
            ...c,
            upvotes: c.upvotes || 0,
            timeline: c.timeline || [{ event: 'Historical Migration', time: new Date().toISOString(), detail: 'Record upgraded to Accountability v2.' }],
            impactScore: c.impactScore || 'Low',
            escalationLevel: c.escalationLevel || 0
        }));
    } catch (e) {
        console.error("Error reading database:", e);
    }
}

const saveDB = () => {
    fs.writeFileSync(DB_FILE, JSON.stringify(complaints, null, 2));
};

// API Endpoints
app.get('/api/complaints', (req, res) => {
    const enrichedComplaints = complaints.map(c => {
        const diffHours = (new Date() - new Date(c.timestamp)) / (1000 * 60 * 60);
        
        let escalationLevel = 0;
        let isOverdue = false;

        if (c.status !== 'Resolved') {
            if (diffHours > 48) {
                escalationLevel = 2; // Higher Authority
                isOverdue = true;
            } else if (diffHours > 24) {
                escalationLevel = 1; // Senior Officer
                isOverdue = true;
            }
        }

        return {
            ...c,
            escalationLevel,
            isOverdue,
            daysPending: Math.floor(diffHours / 24)
        };
    });
    res.json(enrichedComplaints);
});

app.post('/api/complaints', async (req, res) => {
    const { text, location, title } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    try {
        const result = await processComplaint(text, location || { lat: 10.8505, lng: 76.2711 });
        if (title) result.title = title;
        complaints.unshift(result);
        saveDB();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: "AI Processing Error" });
    }
});

app.get('/api/stats', (req, res) => {
    const stats = {
        total: complaints.length,
        categories: { 'Waste Management': 0, 'Water Authority': 0, 'Pollution Control': 0, 'Noise Control': 0 },
        priorities: { 'High': 0, 'Medium': 0, 'Low': 0 },
        avgResolutionTime: "3.5 Days",
        departmentPerformance: {}
    };
    
    complaints.forEach(c => {
        if (stats.categories[c.category] !== undefined) stats.categories[c.category]++;
        if (stats.priorities[c.priority] !== undefined) stats.priorities[c.priority]++;
        
        if (!stats.departmentPerformance[c.department]) {
            stats.departmentPerformance[c.department] = { resolved: 0, total: 0, name: c.department };
        }
        stats.departmentPerformance[c.department].total++;
        if (c.status === 'Resolved') stats.departmentPerformance[c.department].resolved++;
    });

    res.json(stats);
});

// API: Upvote Complaint (Community Support)
app.post('/api/complaints/:id/upvote', (req, res) => {
    const { id } = req.params;
    const index = complaints.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: "Complaint not found" });

    complaints[index].upvotes = (complaints[index].upvotes || 0) + 1;
    
    // Auto-Escalate Priority based on Community Support
    if (complaints[index].upvotes >= 10) {
        if (complaints[index].priority !== 'High') {
            complaints[index].priority = 'High';
            complaints[index].timeline.push({
                event: 'Priority Escalated',
                time: new Date().toISOString(),
                detail: 'Upgraded to High Priority due to 10+ community supports.'
            });
        }
    }

    saveDB();
    res.json(complaints[index]);
});

// API: Update Complaint (Authority Action)
app.patch('/api/complaints/:id', (req, res) => {
    const { id } = req.params;
    const { status, response, priority, department } = req.body;
    
    const index = complaints.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ error: "Complaint not found" });

    const timestamp = new Date().toISOString();

    // Log status changes
    if (status && status !== complaints[index].status) {
        complaints[index].timeline.push({
            event: 'Status Updated',
            time: timestamp,
            detail: `Case moved from ${complaints[index].status} to ${status}.`
        });
        complaints[index].status = status;
    }

    if (response) {
        complaints[index].timeline.push({
            event: 'Official Response',
            time: timestamp,
            detail: 'Authority provided an official progress update.'
        });
        complaints[index].response = response;
    }

    if (priority) complaints[index].priority = priority;
    if (department && department !== complaints[index].department) {
        complaints[index].timeline.push({
            event: 'Reassigned',
            time: timestamp,
            detail: `Case reassigned from old department to ${department}.`
        });
        complaints[index].department = department;
    }

    saveDB();
    res.json(complaints[index]);
});

// Serve static assets from the stitch directory
const STITCH_PATH = path.resolve(__dirname, '../frontend/stitch_main/stitch');
app.use(express.static(STITCH_PATH));

// Semantic Routes for Stitch Portals
const serveFile = (subPath) => (req, res) => {
    const fullPath = path.join(STITCH_PATH, subPath);
    if (fs.existsSync(fullPath)) {
        res.sendFile(fullPath);
    } else {
        res.status(404).send(`Portal not found: ${subPath}`);
    }
};

app.get('/', serveFile('home_dashboard/code.html'));
app.get('/submit', serveFile('submit_complaint/code.html'));
app.get('/admin', serveFile('admin_console/code.html'));
app.get('/tracking', serveFile('tracking_timeline/code.html'));
app.get('/insights', serveFile('ai_insight_panel/code.html'));

// Catch-All Middleware (Express 5 compatible SPA Fallback)
app.use((req, res) => {
    serveFile('home_dashboard/code.html')(req, res);
});

app.listen(PORT, () => {
    console.log(`\n🚀 EcoResolve Stitch Platform Finalized!`);
    console.log(`----------------------------------------`);
    console.log(`- Home Hub:      http://localhost:${PORT}`);
    console.log(`- Citizen Portal: http://localhost:${PORT}/submit`);
    console.log(`- Admin Console:  http://localhost:${PORT}/admin`);
    console.log(`- Global AI:     http://localhost:${PORT}/insights`);
    console.log(`----------------------------------------\n`);
});
