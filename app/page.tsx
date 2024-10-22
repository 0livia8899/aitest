"use client"

import { Select, SelectItem } from '@nextui-org/react';
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect, useCallback } from "react";
import { UserType } from "./types/test";
import { getUserList, getMovieList, getMovieTicketList, bookMovieTicket, modifyUserAssets } from "./api/request";
import { MovieTimeType, MovieType, MovieTicketType } from "./types/test";
import { seatsWithAisles, HighMovieTicket } from "./constant";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserType | undefined>();
  const [userList, setUserList] = useState<UserType[]>([]);
  const [playTime, setPlayTime] = useState<MovieTimeType>(MovieTimeType.morning);
  const [movieList, setMovieList] = useState<MovieType[]>([]);
  const [currentMovie, setCurrentMovie] = useState<MovieType | undefined>();
  const [currentMovieTicketList, setCurrentMovieTicketList] = useState<MovieTicketType[]>([]);
  const [haveTickets, setHaveTickets] = useState(0);
  const [havePrices, setHavePrices] = useState(0);

  const requestUserList = useCallback(async () => {
    const { userList } = await getUserList();
    setUserList(userList);
  }, []);

  const requestMovieList = useCallback(async () => {
    const { movieList } = await getMovieList({ playTime });
    setMovieList(movieList);
  }, [playTime]);
  
  const requestMovieTicket = useCallback(async () => {
    if (!currentMovie?.movieName) {
      return;
    }
    const movieTicketList = await getMovieTicketList({movieName: currentMovie?.movieName});
    setCurrentMovieTicketList(movieTicketList);
  }, [currentMovie?.movieName]);
  
  useEffect(() => {
    requestUserList();
  }, [requestUserList]);

  useEffect(() => {
    requestMovieList();
  }, [playTime, requestMovieList]);

  useEffect(() => {
    requestMovieTicket();
  }, [currentUser, currentMovie, requestMovieTicket]);
  
  const handleUserChange = useCallback((event : React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserName = event.target.value;
    const selectedUser = userList.find(user => user.userName === selectedUserName);
    setCurrentUser(selectedUser);
  }, [userList]);

  const handlePlayTimeChange = useCallback((event : React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlayTime = event.target.value;
    setPlayTime(selectedPlayTime as MovieTimeType);
    setCurrentMovie(undefined);
  }, []);
  
  const handleMovieChange = useCallback((event : React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMovieName = event.target.value;
    const selectedMovie = movieList.find(movie => movie.movieName === selectedMovieName);
    setCurrentMovie(selectedMovie);
  }, [movieList]);
  
  useEffect(() => {
    if (!currentUser || !currentMovie || !currentMovieTicketList) {
      return;
    }
    const haveTicketsList = currentMovieTicketList?.filter(
      (movieTicketItem) =>
        movieTicketItem.userName === currentUser?.userName
        && movieTicketItem.movieName === currentMovie?.movieName
    );
    let havePrices = 0;
    haveTicketsList?.map((movieTicketItem) => {
        havePrices += movieTicketItem.price
      });
    setHaveTickets(haveTicketsList.length);
    setHavePrices(havePrices);
  }, [currentUser, currentMovie, currentMovieTicketList]);
  
  const handleBgColor = useCallback((seat: boolean | null, rowIndex: number, seatIndex: number) => {
    if (seat === null) {
      return 'transparent';
    }
    let result = 'gray';
    currentMovieTicketList?.map((movieTicketItem) => {
      const { userName, movieName, seatRow, seatCol } = movieTicketItem;
      if (userName === currentUser?.userName
        && movieName === currentMovie?.movieName
        && seatRow === rowIndex
        && seatCol === seatIndex
        && HighMovieTicket.includes(`${seatRow}${seatCol}`)
      ) {
        result = 'yellow';
      }
      if (userName === currentUser?.userName
        && movieName === currentMovie?.movieName
        && seatRow === rowIndex
        && seatCol === seatIndex
        && !HighMovieTicket.includes(`${seatRow}${seatCol}`)
      ) {
        result = 'cyan';
      }
      if (userName !== currentUser?.userName
        && movieName === currentMovie?.movieName
        && seatRow === rowIndex
        && seatCol === seatIndex
      ) {
        result = 'white';
      }
    });
    return result;
  }, [currentUser, currentMovie, currentMovieTicketList]);

  const handleBookMovieTicket = useCallback(async ({
    userName,
    movieName,
    seatRow,
    seatCol,
    bookType,
    price,
    asset,
  }: MovieTicketType & {bookType: string, price: number, asset: number}) => {
    if (!currentUser) {
      return 
    }
    const isHighMovieTicket = HighMovieTicket.includes(`${seatRow}${seatCol}`);
    const highPrice = isHighMovieTicket ? price * 1.5 : price;
    const isBookChanged = await bookMovieTicket({
      userName,
      movieName,
      seatRow,
      seatCol,
      price: highPrice,
    });
    if (isBookChanged) {
      // change user asset
      if (bookType === 'add') {
        
        const newAsset = asset - highPrice;
        if (newAsset < 0) {
          return;
        }
        await modifyUserAssets({userName, asset: newAsset});
        toast.success('Book ticket successfully');
      }
      if (bookType === 'delete') {
        await modifyUserAssets({userName, asset: asset + highPrice});
        toast.success('Delete ticket successfully');
      }
      requestMovieTicket();
    }
  }, [currentUser, requestMovieTicket]);
  
  const handleSeatClick = useCallback(async (seat: boolean | null, rowIndex: number, seatIndex: number) => {
    // section 1 seat === null => null
    if (seat === null || currentMovie === undefined || currentUser === undefined) {
      toast.warning('You can not book this seat before selecting User and Movie');
      return;
    }
    console.log('handleSeatClick start');
    // step 0 check user if admin => all seat can be booked
    // step 1 if seat have been booked => delete ticket 
    // step 2 if seat have not been booked => book ticket
    const seatBooked = currentMovieTicketList?.find(
      (movieTicketItem) =>
        movieTicketItem.movieName === currentMovie?.movieName
        && movieTicketItem.seatRow === rowIndex
        && movieTicketItem.seatCol === seatIndex
    );
    console.log('seatBooked', seatBooked);
    // section 1 delete
    if (currentUser?.isAdministrator || seatBooked?.userName === currentUser?.userName) {
      handleBookMovieTicket({
        userName: currentUser?.userName || "",
        movieName: currentMovie?.movieName || "",
        seatRow: rowIndex,
        seatCol: seatIndex,
        bookType: 'delete',
        price: currentMovie?.price || 0,
        asset: currentUser?.asset || 0,
      });
    }
    // section 2 add
    if (!seatBooked && currentUser?.asset >= currentMovie?.price) {
      handleBookMovieTicket({
        userName: currentUser?.userName || "",
        movieName: currentMovie?.movieName || "",
        seatRow: rowIndex,
        seatCol: seatIndex,
        bookType: 'add',
        price: currentMovie?.price || 0,
        asset: currentUser?.asset || 0,
      });
    }
  }, [currentUser, currentMovie, currentMovieTicketList, handleBookMovieTicket]);
  
  return (
    <div className='w-full h-full flex flex-col items-center align-middle pt-[60] overflow-hidden bg-black text-white'>
      <ToastContainer />
      <div className='w-[600px] h-full flex flex-col items-left align-middle p-[20]'>
        <Select
          label="User: "
          className="w-[150px] my-[20px]"
          value={currentUser?.userName || ""}
          onChange={event => handleUserChange(event)}
          color='primary'
        >
          {userList.map((user) => (
            <SelectItem key={user.userName}>
              {user.userName}
            </SelectItem>
          ))}
        </Select>
        <div className='w-full flex justify-left items-center'>
          <Select
            label="Pick a Play Time: "
            className="w-[200px] my-[20px] mr-[20px]"
            value={playTime || ""}
            onChange={event => handlePlayTimeChange(event)}
            color='success'
          >
            <SelectItem key={MovieTimeType.morning}>{MovieTimeType.morning}</SelectItem>
            <SelectItem key={MovieTimeType.afternoon}>{MovieTimeType.afternoon}</SelectItem>
            <SelectItem key={MovieTimeType.evening}>{MovieTimeType.evening}</SelectItem>
          </Select>
          <Select
            label="Pick a movie: "
            className="w-[200px] my-[20px]"
            value={currentMovie?.movieName || ""}
            onChange={event => handleMovieChange(event)}
            color='success'
          >
            {
              movieList.map((movie) => (
                <SelectItem key={movie.movieName}>
                  {movie.movieName}
                </SelectItem>
              ))
            }
          </Select>
        </div>
        <main className="flex flex-col gap-8 row-start-2 my-[20px] items-center sm:items-start">
          <div className='flex items-center gap-4'>
            <div className='flex items-center'>
              <div>
                <div
                  className='w-[20px] h-[20px] rounded-t-3xl mr-[5px] inline-block'
                  style={{
                    backgroundColor: 'gray',
                  }}
                >
                </div>
              </div>
              <div className='mr-[10px] align-top inline-block text-lg'>N/A</div>
            </div>
            <div className='flex items-center'>
              <div>
                <div
                  className='w-[20px] h-[20px] rounded-t-3xl mr-[5px] inline-block'
                  style={{
                    backgroundColor: 'cyan',
                  }}
                >
                </div>
              </div>
              <div className='mr-[10px] align-top inline-block text-lg'>Selected</div>
            </div>
            <div className='flex items-center'>
              <div>
                <div
                  className='w-[20px] h-[20px] rounded-t-3xl mr-[5px] inline-block'
                  style={{
                    backgroundColor: 'white',
                  }}
                >
                </div>
              </div>
              <div className='mr-[10px] align-top inline-block text-lg'>Occupied</div>
            </div>
          </div>
          
          
          <div>
            {seatsWithAisles.map((row, rowIndex) => (
              <div key={rowIndex} style={{ display: 'flex' }}>
                {row.map((seat, seatIndex) => (
                  <div
                    className='w-[25px] h-[25px] rounded-t-3xl mb-[10px] flex items-center justify-center'
                    key={seatIndex}
                    style={{
                      marginRight: seat === null ? 20 : 5,
                      backgroundColor: handleBgColor(seat, rowIndex, seatIndex),
                      cursor: seat === null ? 'default' : 'pointer',
                    }}
                    onClick={() => handleSeatClick(seat, rowIndex, seatIndex)}
                  >
                    {seat === null ? "" : rowIndex + '' + seatIndex}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <div>remaining seats in the cinema {48 - currentMovieTicketList?.length}</div>
          <div>{currentUser?.userName} have selected {haveTickets} seats for a price of ${havePrices}</div>
        </footer>
      </div>
    </div>
  );
}
