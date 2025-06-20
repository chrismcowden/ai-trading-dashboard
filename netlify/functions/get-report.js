exports.handler = async (event, context) => {
  // Check authorization
  const { identity, user } = context.clientContext;
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  // Get date from query parameters
  const date = event.queryStringParameters.date;
  if (!date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Date parameter required' })
    };
  }

  // Get dashboard data from environment
  const dashboardData = process.env.DASHBOARD_DATA ? JSON.parse(process.env.DASHBOARD_DATA) : {};
  
  // Find the report for the requested date
  const historicalReports = dashboardData.historical_reports || [];
  const report = historicalReports.find(r => r.date === date);
  
  if (!report) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Report not found' })
    };
  }
  
  // In a real implementation, you would fetch the full report from storage
  // For now, return the summary with a note
  const fullReport = {
    ...report,
    note: 'Full report details would be loaded from storage',
    executive_summary: dashboardData.executive_summary || null,
    morning_memo: dashboardData.morning_memo || null
  };
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(fullReport)
  };
};