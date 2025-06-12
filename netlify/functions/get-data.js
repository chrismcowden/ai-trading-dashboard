// netlify/functions/get-data.js
exports.handler = async (event, context) => {
    // Check authentication
    if (!context.clientContext?.user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Unauthorized' })
        };
    }
    
    // Return data from environment variable
    // This is set by your trading system via Netlify API
    const data = process.env.DASHBOARD_DATA || '{"balance": 10000, "positions": 0}';
    
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: data
    };
};