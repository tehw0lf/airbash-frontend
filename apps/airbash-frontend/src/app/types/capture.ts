export interface Capture {
  [index: string]: string | number;
  id: number;
  latitude: string;
  longitude: string;
  bssid: string;
  essid: string;
  pmkid: string;
  psk: string;
  processed: number;
}
