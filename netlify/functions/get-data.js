// netlify/functions/get-data.js
exports.handler = async (event, context) => {
    // Check authentication
    if (!context.clientContext?.user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' })
        };
    }
    
    // Get data from environment variable
    // This is set by your trading system via Netlify API
    let dashboardData;
    try {
        dashboardData = process.env.DASHBOARD_DATA ? 
            JSON.parse(process.env.DASHBOARD_DATA) : 
            { balance: 10000, positions: 0 };
    } catch (e) {
        console.error('Failed to parse dashboard data:', e);
        dashboardData = { balance: 10000, positions: 0 };
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