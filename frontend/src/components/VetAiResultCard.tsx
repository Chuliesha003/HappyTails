import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Activity } from "lucide-react";

type Condition = {
  name?: string;
  confidence?: number | string;
  severity?: string;
  details?: string;
};

type VetAiResult = {
  // flexible shape: the backend might return different keys
  conditions?: Condition[];
  possibleConditions?: Condition[];
  overallUrgency?: string;
  urgencyLevel?: string;
  careTips?: string[];
  recommendations?: string[];
  disclaimer?: string;
  note?: string;
  raw?: Record<string, unknown>;
};

export default function VetAiResultCard({ aiResponse }: { aiResponse?: VetAiResult | Record<string, unknown> }) {
  const response = (aiResponse || {}) as Record<string, unknown>;
  const r = response as Record<string, unknown>;

  const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
  const asString = (v: unknown, fallback = ""): string =>
    typeof v === "string" ? v : typeof v === "number" ? String(v) : fallback;

  const conditionsRaw = r["conditions"] ?? r["possibleConditions"] ?? [];
  const conditions: Condition[] = asArray(conditionsRaw).map((x) => {
    if (typeof x === "object" && x !== null) {
      const obj = x as Record<string, unknown>;
      return {
        name: asString(obj["name"]),
        confidence: obj["confidence"] ?? obj["probability"],
        severity: asString(obj["severity"] ?? obj["severityLevel"] ?? obj["severity_level"]),
        details: asString(obj["details"] ?? obj["description"] ?? obj["explanation"]),
      } as Condition;
    }
    return { name: asString(x) } as Condition;
  });

  const urgency: string = asString(
    r["overallUrgency"] ?? r["urgencyLevel"] ?? r["urgency"] ?? r["overall_urgency"] ?? "unknown"
  ).toLowerCase();

  const recommendations: string[] = asArray(r["careTips"] ?? r["recommendations"] ?? r["recommendation"] ?? []).map((x) =>
    typeof x === "string" ? x : JSON.stringify(x)
  );

  const disclaimer: string = asString(r["disclaimer"] ?? r["note"] ?? r["warning"] ?? "");

  const urgencyVariant = (): "default" | "destructive" => {
    if (!urgency || urgency === "unknown") return "default";
    if (urgency.includes("high") || urgency.includes("emergency") || urgency.includes("urgent")) return "destructive";
    return "default";
  };

  const getSeverityColor = (sev?: string) => {
    if (!sev) return "bg-gray-100 text-gray-800 border-gray-200";
    const s = sev.toLowerCase();
    if (s.includes("high") || s.includes("severe") || s.includes("critical")) return "bg-red-100 text-red-800 border-red-200";
    if (s.includes("moderate") || s.includes("medium")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-gray-600" />
            <CardTitle>AI Symptom Analysis</CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${urgency === "unknown" ? "bg-gray-100 text-gray-800" : urgency === "high" || urgency.includes("emergency") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
              {String(urgency).toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {conditions.length === 0 ? (
          <div className="text-sm text-gray-600">No conditions were identified by the AI.</div>
        ) : (
          <div className="space-y-3">
            {conditions.slice(0, 5).map((c, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3 p-3 rounded bg-gray-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{c.name || "Unknown condition"}</h4>
                    {c.confidence !== undefined && (
                      <span className="text-xs text-gray-500">{typeof c.confidence === "number" ? `${Math.round(Number(c.confidence) * 100)}%` : c.confidence}</span>
                    )}
                  </div>
                  {c.details && <p className="text-xs text-gray-600 mt-1 line-clamp-3">{c.details}</p>}
                </div>

                <div className="flex-shrink-0">
                  <div className={`text-xs px-2 py-1 rounded border ${getSeverityColor(c.severity)}`}>
                    {c.severity || "unknown"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Care Tips</h5>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              {recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="w-full">
          <Alert className="w-full" variant={urgencyVariant()}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            <div>
              <AlertTitle className="text-sm">Important</AlertTitle>
              <AlertDescription className="text-xs">{disclaimer || "This AI result is informational and not a substitute for professional veterinary care."}</AlertDescription>
            </div>
          </Alert>

          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm">Save Result</Button>
            <Button className="ml-2" size="sm">Discuss with Vet</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
