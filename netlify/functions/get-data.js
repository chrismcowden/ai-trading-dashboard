// netlify/functions/get-data.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
    // Check authentication
    if (!context.clientContext?.user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' })
        };
    }
    
    let dashboardData = { balance: 10000, positions: 0 };
    
    // Try to read from static dashboard_data.json file first
    try {
        // In Netlify, static files are in the publish directory
        const staticDataPath = path.join(__dirname, '../../dashboard_data.json');
        const rootDataPath = path.join(process.cwd(), 'dashboard_data.json');
        
        let dataPath = staticDataPath;
        if (!fs.existsSync(staticDataPath) && fs.existsSync(rootDataPath)) {
            dataPath = rootDataPath;
        }
        
        if (fs.existsSync(dataPath)) {
            const fileData = fs.readFileSync(dataPath, 'utf8');
            dashboardData = JSON.parse(fileData);
            console.log(`Loaded data from dashboard_data.json at ${dataPath}`);
        }
    } catch (e) {
        console.log('Could not read dashboard_data.json, trying environment variable:', e.message);
    }
    
    // Always try environment variable as backup
    if (!dashboardData.liveStrategies || dashboardData.liveStrategies.length === 0) {
        try {
            const envData = process.env.DASHBOARD_DATA ? 
                JSON.parse(process.env.DASHBOARD_DATA) : null;
            
            if (envData && envData.liveStrategies && envData.liveStrategies.length > 0) {
                dashboardData = envData;
                console.log('Loaded comprehensive data from environment variable');
            } else {
                console.log('Environment variable has no live strategies, using file data or defaults');
            }
        } catch (e) {
            console.error('Failed to parse dashboard data from env:', e);
        }
    }
    
    // Ensure all required fields exist
    const completeData = {
        balance: 10000,
        totalReturn: 0,
        positions: 0,
        openPnL: 0,
        totalTrades: 0,
        winRate: 0,
        activeStrategies: 0,
        lastUpdate: new Date().toISOString(),
        alerts: [],
        tradeIdeas: [],
        activeTrades: [],
        liveStrategies: [],
        executive_summary: null,
        morning_memo: null,
        ...dashboardData
    };
    
    return {
        statusCode: 200,
        headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(completeData)
    };
};