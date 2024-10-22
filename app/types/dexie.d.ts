import 'dexie';

import { MovieTimeType, StatusType } from './test';

declare module 'dexie' {
  interface Dexie {
    users: Dexie.Table<usersTable, number>;
    movies: Dexie.Table<moviesTable, number>;
    movieTickets: Dexie.Table<movieTicketTable, number>;
  }

  interface usersTable {
    userId?: number;
    userName: string;
    status: StatusType;
    asset: number;
    isAdministrator: boolean;
  }

  interface moviesTable {
    movieId?: number;
    movieName: string;
    playTime: MovieTimeType;
    price: number;
  }

  interface movieTicketTable {
    movieTicketId?: number;
    userName: string;
    movieName: string;
    seatRow: number;
    seatCol: number;
    price: number;
  }
}
