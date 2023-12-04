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
  date: {
    seconds: number;
    nanoseconds: number;
  };
}
