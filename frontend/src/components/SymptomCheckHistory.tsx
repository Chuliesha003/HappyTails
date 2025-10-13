import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { symptomsService } from "@/services/symptoms";
import { toast } from "@/hooks/use-toast";
import { History, AlertTriangle, Clock, Eye, Calendar } from "lucide-react";
import type { SymptomCheck } from "@/types/api";

export default function SymptomCheckHistory() {
  const { isRegistered } = useAuth();
  const [history, setHistory] = useState<SymptomCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isRegistered()) {
      loadHistory();
    }
  }, [isRegistered]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await symptomsService.getSymptomCheckHistory(20);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
      toast({
        title: "Error",
        description: "Failed to load symptom check history.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isRegistered()) {
    return (
      <Card className="shadow-lg border-pink-100">
        <CardContent className="p-8 text-center">
          <History className="h-12 w-12 mx-auto text-pink-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Symptom Check History</h3>
          <p className="text-gray-600 mb-4">
            Sign in to view your AI analysis history and track your pet's health over time.
          </p>
          <Button asChild style={{ background: 'linear-gradient(135deg, hsl(297 64% 28%), hsl(327 100% 47%))', color: 'white' }}>
            <a href="/login">Sign In to View History</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-pink-100">
      <CardHeader style={{ background: 'linear-gradient(135deg, hsl(297 64% 28%), hsl(327 100% 47%))', color: 'white' }}>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          AI Analysis History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your analysis history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 mx-auto text-pink-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analysis History</h3>
            <p className="text-gray-600 mb-4">
              You haven't performed any symptom checks yet. Use the AI Symptom Checker above to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((check) => (
              <div key={check._id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(check.createdAt)}
                      </span>
                      {check.pet && (
                        <Badge variant="outline" className="text-xs">
                          {check.pet.name} ({check.pet.species})
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs border ${getUrgencyColor(check.aiResponse.urgencyLevel)}`}>
                        {check.aiResponse.urgencyLevel.toUpperCase()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(check._id)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {check.symptoms}
                      </p>
                    </div>
                  </div>

                  {expandedItems.has(check._id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">AI Analysis Summary</h4>
                        <div className="space-y-2">
                          {check.aiResponse.possibleConditions.slice(0, 3).map((condition, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                              <span className="text-sm font-medium text-gray-900">{condition.name}</span>
                              <Badge className={`text-xs ${getUrgencyColor(condition.severity)}`}>
                                {condition.severity}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {check.aiResponse.recommendations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h4>
                          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                            {check.aiResponse.recommendations.slice(0, 3).map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                        Follow-up action: {check.followUpAction}
                        {check.appointmentBooked && " • Appointment booked"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {history.length >= 20 && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={loadHistory}
                  disabled={loading}
                  className="border-pink-300 text-pink-600 hover:bg-pink-50"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Load More History
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}