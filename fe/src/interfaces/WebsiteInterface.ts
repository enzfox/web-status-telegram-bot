import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export interface WebsiteInterface {
  id: string;
  name: string;
  website: string;
  status: boolean;
  isUp: boolean;
  totalDownTime: string;
  history: HistoryInterface[];
}

export interface HistoryInterface {
  downTime: number;
  date: firebase.firestore.Timestamp;
}
