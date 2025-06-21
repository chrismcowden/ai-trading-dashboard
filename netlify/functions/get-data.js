// netlify/functions/get-data.js

exports.handler = async (event, context) => {
    // Check authentication
    if (!context.clientContext?.user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' })
        };
    }
    
    // Load data from environment variable only
    let dashboardData = null;
    
    try {
        if (process.env.DASHBOARD_DATA) {
            dashboardData = JSON.parse(process.env.DASHBOARD_DATA);
            console.log('Loaded real-time data from DASHBOARD_DATA environment variable');
        } else {
            console.error('DASHBOARD_DATA environment variable not set');
            dashboardData = {
                error: 'No real-time data available',
                balance: 0,
                positions: 0
            };
        }
    } catch (e) {
        console.error('Failed to parse dashboard data from env:', e);
        dashboardData = {
            error: 'Failed to parse real-time data',
            balance: 0,
            positions: 0
        };
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