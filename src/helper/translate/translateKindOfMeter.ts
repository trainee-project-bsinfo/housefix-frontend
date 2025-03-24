import { KindOfMeter } from "../../interfaces/KindOfMeter";

export function translateKindOfMeter(kindOfMeter: KindOfMeter) {
  switch (kindOfMeter) {
    case KindOfMeter.WATER:
      return "Wasser";
    case KindOfMeter.HEATER:
      return "Heizung";
    case KindOfMeter.ELECTRICITY:
      return "Strom";
    case KindOfMeter.UNKNOWN:
      return "Unbekannt";
  }
}
