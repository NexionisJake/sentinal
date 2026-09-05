import type { RoadSegment } from "../types";

// SIMULATED / DEMONSTRATION DATA — simplified road corridors for map context only.
export const roads: RoadSegment[] = [
  {
    id: "nh-32",
    name: "NH-32 (Chennai - Nagapattinam Coastal Corridor)",
    coordinates: [
      [13.0827, 80.2707],
      [12.6, 80.1],
      [11.93, 79.83],
      [11.748, 79.7714],
      [11.0, 79.83],
      [10.7672, 79.8449],
    ],
  },
  {
    id: "nh-38",
    name: "NH-38 (Chennai - Coimbatore Trunk Road)",
    coordinates: [
      [13.0827, 80.2707],
      [12.5, 79.7],
      [11.66, 78.15],
      [11.341, 77.7172],
      [11.0168, 76.9558],
    ],
  },
  {
    id: "nh-44",
    name: "NH-44 (North-South Trunk Corridor)",
    coordinates: [
      [12.1211, 78.1582],
      [11.34, 78.15],
      [10.79, 78.7047],
      [10.36, 77.9695],
      [9.9252, 78.1198],
      [8.7139, 77.7567],
    ],
  },
];
