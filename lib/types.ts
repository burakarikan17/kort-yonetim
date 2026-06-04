export type Reservation = {
  id: string;
  customer_name: string | null;
  phone: string | null;
  reservation_date: string;
  start_time: string;
  end_time: string;
  price: number;
  notes: string | null;
  created_at: string;
};

export type ReservationInput = {
  customer_name: string | null;
  phone: string | null;
  reservation_date: string;
  start_time: string;
  end_time: string;
  price: number;
  notes?: string | null;
};

export type Settings = {
  id: number;
  hourly_price: number;
  school_block_enabled: boolean;
  school_block_days: number[];
  school_block_start_time: string;
  school_block_end_time: string;
};
