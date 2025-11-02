"use client";

import { 
  Users, 
  Calendar,
  CheckCircle2,
  FileText,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function AdminDashboard() {
  // Get current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric' 
  });
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

  // Metric cards data
  const metrics = [
    {
      title: "Total Students",
      value: "25",
      subtitle: "24 active",
      icon: Users,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Planned Events",
      value: "5",
      subtitle: "Upcoming",
      icon: Calendar,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Completed Events",
      value: "5",
      subtitle: "Finished",
      icon: CheckCircle2,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Live Articles",
      value: "4",
      subtitle: "2 drafts",
      icon: FileText,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
  ];

  // Chart data for Event Activity Trends (4 weeks)
  const chartData = [
    { week: "Week 1", planned: 4, completed: 6 },
    { week: "Week 2", planned: 5, completed: 5 },
    { week: "Week 3", planned: 5, completed: 6 },
    { week: "Week 4", planned: 6, completed: 4 },
  ];

  // Top performers data
  const topPerformers = [
    {
      rank: 1,
      name: "Sarah Anderson",
      planned: 8,
      done: 0,
    },
    {
      rank: 2,
      name: "Michael Chen",
      planned: 10,
      done: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome Back, Admin
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your events today
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{dayOfWeek}</p>
            <p className="text-2xl font-bold text-gray-900">{formattedDate}</p>
          </div>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        {metric.value}
                      </p>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {metric.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {metric.subtitle}
                      </p>
                    </div>
                    <div className={`${metric.iconBg} ${metric.borderColor} border p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

          {/* Charts and Top Performers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event Activity Trends Chart */}
          <Card className="lg:col-span-2 bg-white border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Event Activity Trends
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Performance over the last 4 weeks
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="week" 
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      domain={[0, 10]}
                      ticks={[4, 6, 8]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        padding: '8px',
                        color: '#111827'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="planned" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      name="Planned"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      dot={{ fill: '#6366f1', r: 4 }}
                      name="Completed"
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px', color: '#6B7280' }}
                      iconType="line"
                      formatter={(value) => (
                        <span style={{ fontSize: '14px', color: '#6B7280' }}>
                          {value}
                        </span>
                      )}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Chart Legend */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700">Planned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-sm text-gray-700">Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-xl font-bold text-gray-900">
                  Top Performers
                </CardTitle>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Most active students this month
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {performer.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {performer.name}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {performer.planned} planned
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">
                            {performer.done} done
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
