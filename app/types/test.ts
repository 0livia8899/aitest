export enum MovieTimeType {
  morning = 'morning',
  afternoon = 'afternoon',
  evening = 'evening',
}

export enum StatusType {
  online = 'online',
  offline = 'offline',
}

export type UserType = {
  userId?: number;
  userName: string;
  status: StatusType;
  asset: number;
  isAdministrator: boolean;
}

export type MovieType = {
  movieId: number;
  movieName: string;
  playTime: MovieTimeType;
  price: number;
}

export type GetUserListResponse = {
  userList: UserType[];
};

export type GetMovieListRequestType = {
  playTime: MovieTimeType;
}

export type GetMovieListResponseType = {
  movieList: MovieType[];
}

export type MovieTicketType = {
  movieTicketId?: number;
  userName: string;
  movieName: string;
  seatRow: number;
  seatCol: number;
  price: number;
}

export type GetMovieTicketRequestType = {
  movieName: string;
}

export type GetMovieTicketResponseType = MovieTicketType[];

export type BookMovieTicketRequestType = {
  userName: string;
  movieName: string;
  seatRow: number;
  seatCol: number;
  price: number;
}
