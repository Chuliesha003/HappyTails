import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { symptomsService } from "@/services/symptoms";
import { toast } from "@/hooks/use-toast";
import { History, AlertTriangle, Clock, Eye, Calendar } from "lucide-react";
import type { SymptomCheck } from "@/types/api";

export default function SymptomCheckHistory({ refreshKey }: { refreshKey?: number }) {
  const { isRegistered } = useAuth();
  const [history, setHistory] = useState<SymptomCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isRegistered()) {
      loadHistory();
    }
  }, [isRegistered]);

  // Reload when refreshKey changes (triggered after new analysis saved)
  useEffect(() => {
    if (isRegistered() && typeof refreshKey !== 'undefined') {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {history.map((check) => (
              <div key={check._id} className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <History className="h-4 w-4" />
                    <div className="text-sm font-semibold">AI Analysis</div>
                  </div>
                  <div className="text-xs font-semibold">
                    <span className={`px-2 py-1 rounded-full ${getUrgencyColor(check.aiResponse.urgencyLevel)}`}>{check.aiResponse.urgencyLevel}</span>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-muted-foreground">{formatDate(check.createdAt)}</div>
                    {check.pet && (
                      <Badge variant="outline" className="text-xs">
                        {check.pet.name}
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm text-gray-700 line-clamp-3 mb-3">{check.symptoms}</div>

                  {check.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={check.imageUrl} 
                        alt="Symptom check photo" 
                        className="w-full h-32 object-cover rounded-md border border-gray-200"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button onClick={() => toggleExpanded(check._id)} className="text-xs text-primary underline">View</button>
                    <div className="text-xs text-muted-foreground">{check.aiResponse.possibleConditions?.length || 0} conditions</div>
                  </div>

                  {expandedItems.has(check._id) && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-700 space-y-2">
                      {check.aiResponse.possibleConditions.slice(0, 3).map((c, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>{c.name}</div>
                          <div className={`text-xs ${getUrgencyColor(c.severity)}`}>{c.severity || 'unknown'}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}