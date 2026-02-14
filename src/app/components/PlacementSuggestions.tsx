import React from 'react';
import { PlacementSuggestion } from '../types/transport';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { MapPin, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from './ui/utils';

interface PlacementSuggestionsProps {
  suggestions: PlacementSuggestion[];
  onApplySuggestion?: (suggestion: PlacementSuggestion) => void;
}

export function PlacementSuggestions({ suggestions, onApplySuggestion }: PlacementSuggestionsProps) {
  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800 border-red-300';
    if (priority >= 5) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 8) return 'High';
    if (priority >= 5) return 'Medium';
    return 'Low';
  };

  // Sort by priority
  const sortedSuggestions = [...suggestions].sort((a, b) => b.priority - a.priority);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Placement Suggestions
          </CardTitle>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            {suggestions.length} Active
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          AI-powered recommendations for optimal equipment placement
        </p>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {sortedSuggestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No placement suggestions</p>
                <p className="text-xs mt-1">All equipment is optimally placed</p>
              </div>
            ) : (
              sortedSuggestions.map((suggestion, index) => (
                <Card
                  key={`${suggestion.equipmentId}-${index}`}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getPriorityColor(suggestion.priority)}
                        >
                          {getPriorityLabel(suggestion.priority)} Priority
                        </Badge>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Score: {suggestion.priority}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Equipment ID */}
                    <div className="mb-3">
                      <div className="font-semibold text-sm">{suggestion.equipmentId}</div>
                    </div>

                    {/* Suggestion */}
                    <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-blue-900">
                            Suggested Zone: {suggestion.suggestedZone}
                          </div>
                          <div className="text-xs text-blue-700 mt-1">
                            Floor {suggestion.suggestedLocation.floor} • Position (
                            {Math.round(suggestion.suggestedLocation.x)}, 
                            {Math.round(suggestion.suggestedLocation.y)})
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="text-xs text-muted-foreground mb-3 p-2 bg-gray-50 rounded border">
                      <div className="font-medium mb-1">Reason:</div>
                      <div>{suggestion.reason}</div>
                    </div>

                    {/* Action */}
                    {onApplySuggestion && (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => onApplySuggestion(suggestion)}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Apply Suggestion
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Generate mock placement suggestions based on equipment data
export function generatePlacementSuggestions(
  equipment: any[],
  requests: any[]
): PlacementSuggestion[] {
  const suggestions: PlacementSuggestion[] = [];

  // Analyze request patterns to suggest equipment placement
  const zoneDemand: Record<string, number> = {};
  
  requests.forEach(req => {
    if (req.status === 'pending' || req.status === 'assigned') {
      zoneDemand[req.origin.zone] = (zoneDemand[req.origin.zone] || 0) + 1;
      zoneDemand[req.destination.zone] = (zoneDemand[req.destination.zone] || 0) + 1;
    }
  });

  // Find high-demand zones
  const highDemandZones = Object.entries(zoneDemand)
    .filter(([_, demand]) => demand >= 2)
    .sort((a, b) => b[1] - a[1]);

  // Suggest moving available equipment to high-demand zones
  const availableEquipment = equipment.filter(eq => eq.status === 'available');
  
  highDemandZones.forEach(([zone, demand]) => {
    const equipmentInZone = availableEquipment.filter(eq => eq.location.zone === zone);
    
    if (equipmentInZone.length === 0 && availableEquipment.length > 0) {
      const closestEquipment = availableEquipment[0];
      
      // Generate suggested position in the high-demand zone
      const zonePositions: Record<string, { x: number; y: number; floor: number }> = {
        'Emergency': { x: 200, y: 200, floor: 1 },
        'Surgery': { x: 400, y: 350, floor: 2 },
        'ICU': { x: 650, y: 450, floor: 3 },
        'Radiology': { x: 550, y: 275, floor: 2 },
        'Outpatient': { x: 725, y: 250, floor: 1 },
        'Cardiology': { x: 800, y: 375, floor: 3 },
      };

      const suggestedPosition = zonePositions[zone] || { x: 400, y: 300, floor: 2 };

      suggestions.push({
        equipmentId: closestEquipment.id,
        suggestedZone: zone,
        suggestedLocation: suggestedPosition,
        reason: `High demand detected in ${zone} with ${demand} pending/active requests. Moving equipment here will reduce response time.`,
        priority: Math.min(demand * 2, 10),
      });
    }
  });

  // Suggest redistributing equipment from low-demand zones
  const lowDemandZones = Object.entries(zoneDemand)
    .filter(([_, demand]) => demand === 0);

  lowDemandZones.forEach(([zone]) => {
    const equipmentInZone = availableEquipment.filter(eq => eq.location.zone === zone);
    
    if (equipmentInZone.length > 1 && highDemandZones.length > 0) {
      const targetZone = highDemandZones[0][0];
      const zonePositions: Record<string, { x: number; y: number; floor: number }> = {
        'Emergency': { x: 200, y: 200, floor: 1 },
        'Surgery': { x: 400, y: 350, floor: 2 },
        'ICU': { x: 650, y: 450, floor: 3 },
        'Radiology': { x: 550, y: 275, floor: 2 },
        'Outpatient': { x: 725, y: 250, floor: 1 },
        'Cardiology': { x: 800, y: 375, floor: 3 },
      };

      const suggestedPosition = zonePositions[targetZone] || { x: 400, y: 300, floor: 2 };

      suggestions.push({
        equipmentId: equipmentInZone[0].id,
        suggestedZone: targetZone,
        suggestedLocation: suggestedPosition,
        reason: `Low utilization in ${zone}. Redistributing to ${targetZone} will balance coverage and improve efficiency.`,
        priority: 6,
      });
    }
  });

  return suggestions;
}
