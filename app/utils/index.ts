export function generateSeatingWithAisles(rows: number, cols: number) {
  const seating = [];
  
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      if (j === 2 || j === 7) {
        row.push(null); // null indicates a non-selectable aisle
      } else {
        row.push(false); // false indicates the seat is available
      }
    }
    seating.push(row);
  }
  
  return seating;
}
