import { MovieTimeType, StatusType } from '../types/test';
import { generateSeatingWithAisles } from '../utils/index';

export const UsersListInit = [
  {
    userId: 1,
    userName: 'Jack',
    status: StatusType.offline,
    asset: 100,
    isAdministrator: false
  },
  {
    userId: 2,
    userName: 'Lucia',
    status: StatusType.offline,
    asset: 100,
    isAdministrator: false
  },
  {
    userId: 3,
    userName: 'Tom',
    status: StatusType.offline,
    asset: 100,
    isAdministrator: false
  },
  {
    userId: 4,
    userName: 'Administrator',
    status: StatusType.offline,
    asset: 10000,
    isAdministrator: true
  }
];

export const MovieListInit = [
  {
    movieId: 1,
    movieName: 'The Matrix Reloaded',
    playTime: MovieTimeType.morning,
    price: 13,
  },
  {
    movieId: 2,
    movieName: 'Avengers: Endgame',
    playTime: MovieTimeType.morning,
    price: 10,
  },
  {
    movieId: 3,
    movieName: 'Stellar Exploration',
    playTime: MovieTimeType.morning,
    price: 12,
  },
  {
    movieId: 4,
    movieName: 'Future Warrior',
    playTime: MovieTimeType.afternoon,
    price: 10,
  },
  {
    movieId: 5,
    movieName: 'Mystic Frontier',
    playTime: MovieTimeType.afternoon,
    price: 11,
  },
  {
    movieId: 6,
    movieName: 'Enchanted Forest',
    playTime: MovieTimeType.afternoon,
    price: 9,
  },
  {
    movieId: 7,
    movieName: 'Dream Flight',
    playTime: MovieTimeType.evening,
    price: 13,
  },
  {
    movieId: 8,
    movieName: 'Galaxy Guardians',
    playTime: MovieTimeType.evening,
    price: 14,
  },
  {
    movieId: 9,
    movieName: 'Time Traveler',
    playTime: MovieTimeType.evening,
    price: 10,
  },
];

export const seatsWithAisles = generateSeatingWithAisles(6, 10);

export const HighMovieTicket = ['23', '24', '25', '26', '33', '34', '35', '36'];
