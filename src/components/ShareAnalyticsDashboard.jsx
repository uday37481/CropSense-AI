import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { getShareAnalytics } from "@/services/socialMediaService";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2, TrendingUp } from "lucide-react";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export const ShareAnalyticsDashboard = () => {

  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const fetchAnalytics = async () => {

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const data = await getShareAnalytics(user.id);

      setAnalytics(data);
      setIsLoading(false);
    };

    fetchAnalytics();

  }, []);

  if (isLoading) {

    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );

  }

  // Platform chart data

  const platformData = analytics.reduce((acc, item) => {

    const platform = item.platform || "other";

    acc[platform] = (acc[platform] || 0) + 1;

    return acc;

  }, {});

  const platformChartData = Object.entries(platformData).map(([name, value]) => ({
    name,
    value
  }));


  // Share type chart data

  const shareTypeData = analytics.reduce((acc, item) => {

    acc[item.share_type] = (acc[item.share_type] || 0) + 1;

    return acc;

  }, {});

  const shareTypeChartData = Object.entries(shareTypeData).map(([name, count]) => ({
    name,
    count
  }));


  const totalShares = analytics.length;

  const mostUsedPlatform = Object.entries(platformData)
    .sort((a, b) => b[1] - a[1])[0];


  return (

    <div className="space-y-6">

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium">
              Total Shares
            </CardTitle>

            <Share2 className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">
              {totalShares}
            </div>

            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium">
              Most Used Platform
            </CardTitle>

            <TrendingUp className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold capitalize">
              {mostUsedPlatform?.[0] || "N/A"}
            </div>

            <p className="text-xs text-muted-foreground">
              {mostUsedPlatform?.[1] || 0} shares
            </p>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="flex flex-row items-center justify-between pb-2">

            <CardTitle className="text-sm font-medium">
              Share Types
            </CardTitle>

            <Share2 className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">
              {Object.keys(shareTypeData).length}
            </div>

            <p className="text-xs text-muted-foreground">
              Different share formats
            </p>

          </CardContent>

        </Card>

      </div>


      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


        <Card>

          <CardHeader>

            <CardTitle>
              Shares by Platform
            </CardTitle>

            <CardDescription>
              Distribution of shares across platforms
            </CardDescription>

          </CardHeader>

          <CardContent>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={platformChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >

                  {platformChartData.map((entry, index) => (

                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />

                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>


        <Card>

          <CardHeader>

            <CardTitle>
              Shares by Type
            </CardTitle>

            <CardDescription>
              Different formats used for sharing
            </CardDescription>

          </CardHeader>

          <CardContent>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={shareTypeChartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar dataKey="count" fill="#10b981" />

              </BarChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

      </div>

    </div>

  );

};
