import type { SOSAlert, SOSStatus } from "../types";

const STORAGE_KEY = "sentinel_sos_alerts";

const MOCK_INITIAL_ALERTS: SOSAlert[] = [
  {
    id: "sos-101",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    senderName: "Karthik Raja",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    messageType: "TRAPPED_FLOOD",
    messageText: "Immediate rescue required – Water levels rising above 4 feet in Velachery, Chennai.",
    status: "PENDING",
    priority: "CRITICAL",
    district: "Chennai",
  },
  {
    id: "sos-102",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    senderName: "Meenakshi Sundaram",
    coordinates: { lat: 11.748, lng: 79.7714 },
    messageType: "MEDICAL_EMERGENCY",
    messageText: "Medical assistance needed urgently for elderly cardiac patient near Cuddalore Port.",
    status: "ACKNOWLEDGED",
    priority: "CRITICAL",
    district: "Cuddalore",
  },
  {
    id: "sos-103",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    senderName: "Anonymous",
    coordinates: { lat: 10.7656, lng: 79.8424 },
    messageType: "FIRE_HAZARD",
    messageText: "Fire hazard spreading rapidly in commercial godown near Nagapattinam bus stand.",
    status: "DISPATCHED",
    priority: "HIGH",
    district: "Nagapattinam",
  },
  {
    id: "sos-104",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    senderName: "Senthil Kumar",
    coordinates: { lat: 11.0168, lng: 76.9558 },
    messageType: "STRUCTURAL_COLLAPSE",
    messageText: "Elderly/children trapped – unable to evacuate after landslide wall collapse in Mettupalayam.",
    status: "RESOLVED",
    priority: "MEDIUM",
    district: "Coimbatore",
  },
];

export function getSOSAlerts(): SOSAlert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INITIAL_ALERTS));
      return MOCK_INITIAL_ALERTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load SOS alerts from localStorage", e);
    return MOCK_INITIAL_ALERTS;
  }
}

export function saveSOSAlerts(alerts: SOSAlert[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error("Failed to save SOS alerts to localStorage", e);
  }
}

export function createSOSAlert(
  data: Omit<SOSAlert, "id" | "timestamp" | "status">
): SOSAlert {
  const alerts = getSOSAlerts();
  const newAlert: SOSAlert = {
    ...data,
    id: `sos-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    status: "PENDING",
    senderName: data.senderName?.trim() || "Anonymous",
  };

  const updated = [newAlert, ...alerts];
  saveSOSAlerts(updated);
  return newAlert;
}

export function updateSOSAlertStatus(
  id: string,
  status: SOSStatus
): SOSAlert[] {
  const alerts = getSOSAlerts();
  const updated = alerts.map((item) =>
    item.id === id ? { ...item, status } : item
  );
  saveSOSAlerts(updated);
  return updated;
}
