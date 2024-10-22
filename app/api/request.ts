import db from './testDB';
import {
  GetUserListResponse,
  GetMovieListRequestType,
  GetMovieListResponseType,
  GetMovieTicketRequestType,
  GetMovieTicketResponseType,
  BookMovieTicketRequestType,
} from '../types/test';
import { UsersListInit, MovieListInit } from '../constant/index';
export const getUserList = async (): Promise<GetUserListResponse> => {
  try {
    let userList = await db.users.toArray();
    // step 1 check db users
    if (!userList || userList.length === 0) {
      await db.users.bulkAdd(UsersListInit);
      // step 2 get userList from db again
      userList = await db.users.toArray();
    }
    return { userList } as GetUserListResponse;
  } catch (error) {
    // if error update error log
    console.log(error);
    // if error return empty userList
    return { userList: [] };
  }
};

export const modifyUserAssets = async ({userName, asset}: {userName: string, asset: number}) => {
  try {
    const user = await db.users.filter((user) => user.userName === userName).modify({ asset });
    return user;
  } catch (error) {
    // if error update error log
    console.log(error);
    // if error return empty user
    return null;
  }
};

export const getMovieList = async (
  params: GetMovieListRequestType
): Promise<GetMovieListResponseType> => {
  try {
    let movieList = await db.movies.toArray();
    if (!movieList || movieList.length === 0) {
      await db.movies.bulkAdd(MovieListInit);
      movieList = await db.movies.toArray();
    }
    movieList = movieList.filter(
      (movie) => movie.playTime === params.playTime
    );
    return { movieList } as GetMovieListResponseType;
  } catch (error) {
    // if error update error log
    console.log(error);
    // if error return empty movieList
    return { movieList: [] };
  }
};

export const getMovieTicketList = async (
  params: GetMovieTicketRequestType
): Promise<GetMovieTicketResponseType> => {
  try {
    const { movieName } = params;
    let movieTickets = await db.movieTickets.toArray();
    if (!movieTickets || movieTickets.length === 0) {
      movieTickets = [];
    }
    movieTickets = movieTickets.filter(
      (movieTicket) => movieTicket.movieName === movieName
    );
    return movieTickets as GetMovieTicketResponseType;
  } catch (error) {
    // if error update error log
    console.log(error);
    // if error return empty movieList
    return [];
  }
}

export const bookMovieTicket = async (
  params: BookMovieTicketRequestType
): Promise<boolean> => {
  try {
    const { userName, movieName, seatRow, seatCol, price } = params;
    // step 1 checkout movie seat have been booked or not
    const movieTickets = await db.movieTickets.toArray();
    const seatBooked = movieTickets.find(
      (movieTicket) =>
        movieTicket.movieName === movieName &&
        movieTicket.seatRow === seatRow &&
        movieTicket.seatCol === seatCol
    );
    if (seatBooked && seatBooked.movieTicketId !== undefined) {
      await db.movieTickets.delete(seatBooked.movieTicketId);
      return true;
    } else {
      // step 2 add movieTicket to db
      const movieTicketId = await db.movieTickets.bulkAdd([{
        movieTicketId: Date.now(),
        userName,
        movieName,
        seatRow,
        seatCol,
        price, 
      }]);
      console.log(movieTicketId);
      return movieTicketId !== null;
    }
  } catch (error) {
    // if error update error log
    console.log(error);
    // if error return empty movieList
    return false;
  }
}
