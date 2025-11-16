import { useState, useEffect } from "react";
import { AlertCircle, Droplet, Thermometer, Sun, CheckCircle, X, Filter, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Alert {
  id: string;
  plantName: string;
  type: "moisture" | "temperature" | "light" | "general";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: Date;
  resolved: boolean;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  useEffect(() => {
    // Generate sample alerts
    const sampleAlerts: Alert[] = [
      {
        id: "1",
        plantName: "Fiddle Leaf Fig",
        type: "moisture",
        severity: "critical",
        message: "Soil moisture critically low (15%). Immediate watering required.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        resolved: false,
      },
      {
        id: "2",
        plantName: "Snake Plant",
        type: "temperature",
        severity: "medium",
        message: "Temperature too high (32°C). Consider moving to a cooler location.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        resolved: false,
      },
      {
        id: "3",
        plantName: "Monstera",
        type: "light",
        severity: "low",
        message: "Light levels below optimal range. Plant may need more sunlight.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        resolved: false,
      },
      {
        id: "4",
        plantName: "Peace Lily",
        type: "moisture",
        severity: "high",
        message: "Soil moisture low (25%). Watering recommended within 24 hours.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        resolved: false,
      },
      {
        id: "5",
        plantName: "Pothos",
        type: "general",
        severity: "low",
        message: "No sensor data received in the last 6 hours. Check connection.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        resolved: true,
      },
    ];
    setAlerts(sampleAlerts);
  }, []);

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "moisture":
        return <Droplet className="w-5 h-5" />;
      case "temperature":
        return <Thermometer className="w-5 h-5" />;
      case "light":
        return <Sun className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getSeverityBadge = (severity: Alert["severity"]) => {
    const variants: Record<Alert["severity"], "default" | "secondary" | "destructive" | "outline"> = {
      critical: "destructive",
      high: "destructive",
      medium: "default",
      low: "secondary",
    };
    return <Badge variant={variants[severity]}>{severity.toUpperCase()}</Badge>;
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
    toast.success("Alert marked as resolved");
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.info("Alert deleted");
  };

  const handleClearAll = (resolved: boolean) => {
    setAlerts(alerts.filter(alert => alert.resolved !== resolved));
    toast.success(`All ${resolved ? "resolved" : "active"} alerts cleared`);
  };

  const filteredAlerts = alerts.filter(alert => {
    const typeMatch = filterType === "all" || alert.type === filterType;
    const severityMatch = filterSeverity === "all" || alert.severity === filterSeverity;
    return typeMatch && severityMatch;
  });

  const activeAlerts = filteredAlerts.filter(a => !a.resolved);
  const resolvedAlerts = filteredAlerts.filter(a => a.resolved);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
            <p className="text-gray-600 mt-1">Monitor and manage plant care alerts</p>
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="moisture">Moisture</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{activeAlerts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {alerts.filter(a => a.severity === "critical" && !a.resolved).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active">Active ({activeAlerts.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => handleClearAll(false)} disabled={activeAlerts.length === 0}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Active
              </Button>
            </div>
            {activeAlerts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Clear!</h3>
                  <p className="text-gray-500">No active alerts at the moment</p>
                </CardContent>
              </Card>
            ) : (
              activeAlerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{alert.plantName}</CardTitle>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <CardDescription className="text-sm text-gray-600">
                            {alert.message}
                          </CardDescription>
                          <p className="text-xs text-gray-400 mt-2">{formatTimestamp(alert.timestamp)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleResolveAlert(alert.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteAlert(alert.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4 mt-6">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => handleClearAll(true)} disabled={resolvedAlerts.length === 0}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Resolved
              </Button>
            </div>
            {resolvedAlerts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Resolved Alerts</h3>
                  <p className="text-gray-500">Resolved alerts will appear here</p>
                </CardContent>
              </Card>
            ) : (
              resolvedAlerts.map((alert) => (
                <Card key={alert.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg text-gray-600">{alert.plantName}</CardTitle>
                            <Badge variant="outline">Resolved</Badge>
                          </div>
                          <CardDescription className="text-sm text-gray-500">
                            {alert.message}
                          </CardDescription>
                          <p className="text-xs text-gray-400 mt-2">{formatTimestamp(alert.timestamp)}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteAlert(alert.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Alerts;
