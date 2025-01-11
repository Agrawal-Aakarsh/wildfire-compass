// src/utils/mapHelpers.js
import * as turf from '@turf/turf';

export const CA_CENTER = [-119.417931, 36.778259];
export const DEFAULT_ZOOM = 6;

export function createFireFeature(fire) {
  return turf.point([fire.longitude, fire.latitude], {
    brightness: fire.brightness,
    confidence: fire.confidence,
    timestamp: fire.timestamp
  });
}

export function getConfidenceColor(confidence) {
  if (confidence >= 80) return '#FF0000'; // High confidence - red
  if (confidence >= 40) return '#FFA500'; // Medium confidence - orange
  return '#FFFF00'; // Low confidence - yellow
}