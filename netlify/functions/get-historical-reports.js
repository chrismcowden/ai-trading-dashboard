exports.handler = async (event, context) => {
  // Check authorization
  const { identity, user } = context.clientContext;
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  // Get dashboard data from environment or fetch from storage
  const dashboardData = process.env.DASHBOARD_DATA ? JSON.parse(process.env.DASHBOARD_DATA) : {};
  
  // Return historical reports
  const historicalReports = dashboardData.historical_reports || [];
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    body: JSON.stringify(historicalReports)
  };
};