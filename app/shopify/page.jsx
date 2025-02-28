import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ShopifyDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);

  // Replace these with your actual Shopify app credentials
  const SHOPIFY_CLIENT_ID = 'your_client_id';
  const SHOPIFY_REDIRECT_URI = 'your_redirect_uri';
  const SHOPIFY_SCOPE = 'read_analytics'; // Add other required scopes

  const handleLogin = () => {
    // Construct Shopify OAuth URL
    const shopifyAuthUrl = `https://shopify.com/admin/oauth/authorize?client_id=${SHOPIFY_CLIENT_ID}&scope=${SHOPIFY_SCOPE}&redirect_uri=${SHOPIFY_REDIRECT_URI}`;
    
    // Redirect to Shopify login
    window.location.href = shopifyAuthUrl;
  };

  // Function to fetch analytics data once authenticated
  const fetchAnalytics = async (accessToken) => {
    try {
      const response = await fetch('/api/shopify/analytics', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    }
  };

  // Example analytics display component
  const AnalyticsDisplay = ({ data }) => {
    if (!data) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${data.totalSales}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.orderCount}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.conversionRate}%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Shopify Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {!isAuthenticated ? (
            <Button onClick={handleLogin} className="w-full">
              Login with Shopify
            </Button>
          ) : (
            <>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <AnalyticsDisplay data={analyticsData} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopifyDashboard;