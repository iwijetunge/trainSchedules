// Initialize Firebase

var firebaseConfig = {
  apiKey: "AIzaSyBRERVVxmb7bCbF_vawrPvn2imrNaWIWPQ",
  authDomain: "train-ea917.firebaseapp.com",
  databaseURL: "https://train-ea917.firebaseio.com",
  projectId: "train-ea917",
  storageBucket: "train-ea917.appspot.com",
  messagingSenderId: "320280515706",
  appId: "1:320280515706:web:551d08afd169cd28"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

database.ref().on("child_added", function (snapshot, prevChildKey) {
  const trainName = snapshot.val().trainName;
  const trainDestination = snapshot.val().destination;
  const trainFrequency = snapshot.val().frequency;
  const trainFirstTrainTime = snapshot.val().firstTrainTime

  let timeArray = trainFirstTrainTime.split(":");
  let trainTime = moment().hours(timeArray[0]).minutes(timeArray[1]);
  let maxMoment = moment.max(moment(), trainTime);
  let trainMinutes;
  let trainArrival;

  if (maxMoment === trainTime) {
    trainArrival = trainTime.format("hh:mm A");
    trainMinutes = trainTime.diff(moment(), "minutes");
  } else {
    let timeDifference = moment().diff(trainTime, "minutes");
    let timeRemainder = timeDifference % trainFrequency;

    trainMinutes = trainFrequency - timeRemainder;
    trainArrival = moment().add(trainMinutes, "m").format("hh:mm A");
  }

  $("#train-table").last().append($("<tr>" + "<td>" + trainName + "</td>"
    + "<td>" + trainDestination + "</td>"
    + "<td>" + trainFrequency + "</td>"
    + "<td>" + trainArrival + "</td>"
    + "<td>" + trainMinutes + "</td>"
    + "</tr>"))
})

$("#submit-bid").on("click", function (event) {
  // Prevent form from submitting
  event.preventDefault();
  let validData = false;

  const trainName = $("#train-name").val().trim();
  const destination = $("#destination").val().trim();
  const firstTrainTime = $("#first-train-time").val().trim();
  const frequency = $("#frequency").val().trim();

  if (validateFrequency(frequency) && validateNameAndDestination(trainName, destination) && validateFirstTrainTime(firstTrainTime)) {
    validData = true;
  }
  // Verify that the frequncy is an integer
  function validateFrequency(formFrequency) {
    if (Number.isInteger(Number.parseInt(frequency))) {
      return true;
    }
    return false;
  }
  // Verify thet athe train name and destination are not empty strings
  function validateNameAndDestination(name, dest) {
    if (name !== "" && dest !== "") {
      return true;
    }
    return false;
  }
  //verify that train time is not a string
  function validateFirstTrainTime(time) {
    if (typeof time !== "string") {
      return false;
    }
    // split time by ":"
    let timeArray = time.split(":");
    // if the result is not 2 we have an error condition
    if (timeArray.length !== 2) {
      return false;
    }
    let hours = timeArray[0];
    let minutes = timeArray[1];
    if (!Number.isInteger(Number.parseInt(hours)) && !Number.isInteger(Number.parseInt(minutes))) {
      return false;
    }
    if (hours < 0 || hours > 24) {
      return false;
    }
    if (minutes < 0 || minutes > 60) {
      return false;
    }
    return true;
  }
  if (validData) {
    database.ref().push({
      trainName,
      destination,
      firstTrainTime,
      frequency
    });
  } else {
      $('#alertModal').find('.modal-body p').text('Please entre valid data');
      $('#alertModal').modal('show')
  }

  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train-time").val("");
  $("#frequency").val("");
});
