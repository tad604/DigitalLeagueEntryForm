GOOGLE_SHEET_FETCH_LEADER_BOARDS = "https://script.google.com/macros/s/AKfycbw8Q37q0nvlVDjcT0lEHrDTfib65HsihZn7PriBO7q-Pw-mN3MNw86CG1wCw0b54TB0/exec";
fetch(GOOGLE_SHEET_FETCH_LEADER_BOARDS).then((response)=> response.json()).then((data)=> {
  console.log(data);
  //update dom with info.
});
