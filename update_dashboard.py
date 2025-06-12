#!/usr/bin/env python3
"""
Update dashboard via Netlify API - NO public data
"""

import os
import json
import requests
from datetime import datetime

NETLIFY_SITE_ID = "your-site-id"  # From Netlify dashboard
NETLIFY_TOKEN = os.getenv("NETLIFY_TOKEN")  # Personal access token

def update_dashboard_privately(trading_state):
    """Update dashboard data via Netlify environment variable"""
    
    # Prepare data
    data = {
        "lastUpdate": datetime.now().isoformat(),
        "balance": trading_state.get('balance', 10000),
        "totalReturn": calculate_return(trading_state),
        "positions": len(trading_state.get('positions', {})),
        "openPnL": sum(p.get('current_pnl', 0) for p in trading_state.get('positions', {}).values()),
        "alerts": trading_state.get('alerts', [])[-3:]  # Last 3 alerts only
    }
    
    # Update Netlify environment variable
    response = requests.put(
        f"https://api.netlify.com/api/v1/sites/{NETLIFY_SITE_ID}",
        headers={
            "Authorization": f"Bearer {NETLIFY_TOKEN}",
            "Content-Type": "application/json"
        },
        json={
            "build_settings": {
                "env": {
                    "DASHBOARD_DATA": json.dumps(data)
                }
            }
        }
    )
    
    if response.ok:
        print(f"✅ Dashboard updated privately at {datetime.now()}")
    else:
        print(f"❌ Update failed: {response.text}")

def calculate_return(state):
    initial = 10000
    current = state.get('balance', initial)
    return round(((current - initial) / initial) * 100, 2)
