import Dexie from 'dexie';

const db = new Dexie('TestDB');
db.version(1).stores({
  users: '++userId, &userName, status, asset, isAdministrator',
  movies: '++movieId, &movieName, playTime, price',
  movieTickets: '++movieTicketId, userName, movieName, seatRow, seatCol, price',
});

export default db;