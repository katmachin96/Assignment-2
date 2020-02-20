//master set of tweets
var tweetDatabase = []
let tweetsIdSet = new Set()

var pauseStatus = false
//var tweetArray = document.querySelector('.statuses')

//used to filter tweets
let searchInputBar = document.getElementById('searchBar')
let searchButton = document.getElementById('searchButton')
var searchString = ""
var searchResult = []

//triggered when Search button is pressed
searchButton.addEventListener('click', function(input){

  searchString = searchInputBar.value

  if(searchString == ""){
    document.getElementById("response").innerHTML =
    createContainer(tweetDatabase);
  }else{
    searchTweets(searchString.toLowerCase())
  }
})

//gets and appends tweets to doc
function getTweets(){
  console.log("Making get request...")
  const url = "http://ec2-54-172-96-100.compute-1.amazonaws.com/feed/random?q=noodle"

  fetch(url)
  .then(res => res.json())
  .then(data => {
    let rawOutput = data.statuses
    console.log(rawOutput);
    /*
    **NOTE**
    Since we are filtering duplicates tweets we don't have to worry about 'removing them'
    ;however, to test that the filtering works just uncomment line 53, and comment outline 52
    If all the tweets have the same id then they are "duplicates", so only one should show up
    in the container.
    */
    let refinedOutput = rawOutput.map(x => (
      {
        user: x.user.screen_name,
        username: x.user.name,
        profilePic: x.user.profile_image_url ,
        time: formatDate(x.created_at),
        // time: timeAdjust(x.created_at),
        text: x.text,
        id: x.id
        // id: 4
      }));


  //adjusting time with moments.js
    function timeAdjust(time){
      // let sortTime = rawOutput.map(x => ({time: x.created_at}));
      // let newDate = moment(sortTime).format('LLL');
      return moment(time).format('LLL');
    }
    //push each element of new array into tweet database
    for (i = 0; i < refinedOutput.length ; i++){

      // uncomment the line below if you wish to see the object before getting filtered
      // console.log(refinedOutput[i])

      //tweets with different ids get added - no duplicates
      if(!(tweetsIdSet.has(refinedOutput[i].id))){
        tweetsIdSet.add(refinedOutput[i].id)
        tweetDatabase.push(refinedOutput[i])
      }
    }
    //sort tweets before displaying them
    sortTweets(tweetDatabase)


    document.getElementById("response").innerHTML =
    createContainer(tweetDatabase);
  })
  .catch(err => {
    // error catching
    console.log(err)
  });
}

//makes call to refresh tweets
var mytweet = setInterval(myTimer, 8000);

function myTimer() {

  if(pauseStatus == false){
    console.log("UNPAUSED - Streaming tweets...")
    getTweets()
    }
  }

console.log(pauseStatus);
document.getElementById("pause-bttn").addEventListener("click", function(){
  pauseStatus = !pauseStatus
  console.log(pauseStatus);
})


//sorts tweets based on their date values, most recent to least recent
function sortTweets(tweets){
  tweets.sort((a,b) => b.time - a.time)
}

//gets a json time string and turns it into a date object
function formatDate(time){
  var date = new Date(time)
  return date
}

//searches the tweets gathered so far based on a given substring
function searchTweets(searchInput){
  console.log("searching tweets with", searchInput);
  //resets search results
  searchResult = []

  //detects tweets with wanted string
  for(i = 0; i < tweetDatabase.length; i++){
    var tweetText = tweetDatabase[i].text
    console.log(tweetText.toLowerCase().includes(searchInput), searchInput, tweetText);
    if(tweetText.toLowerCase().includes(searchInput)){
      searchResult.push(tweetDatabase[i])
    }
  }

  //changes view to only filtered tweets
  document.getElementById("response").innerHTML =
    createContainer(searchResult);

}
//create the boundaries for multiple tweets to display
function createContainer(tweetDatabase) {
  let contain = "<div class=\"maincontainer\">";
  for (let i = 0; i < tweetDatabase.length; i += 1) {
    let curr_tweet = tweetDatabase[i];
    contain += createTweet(curr_tweet);
  }
  contain += "</div>";
  return contain;
}
//makes date object into a presentable format (Mon, Day, Year, Time)
function makeReadableDate(time){
  var options = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }
  var timeString = time.toLocaleString('en-US', options);
  return timeString
}
//defines the display parameters for an individual tweet
function createTweet(tweet) {
  console.log(tweet);

  return "<div class=\"tweet\">" +
      "<div class=\"tweet-image\">" +
      "<picture>" + "<source srcset\"tweet.profilePic\" type=\"image/svg+xml\">" +
      "<img class=\"tweetimg\" src=\"" +
       tweet.profilePic +
      "\" onerror= this.src=\"img/no_photo.jpg\" alt=\"image not found\">"
      + "</picture>" +"</div>" +
  "<div class=\"tweet-user\">" +
      tweet.user +"</div>" +
      "<div class=\"tweet-time\">" +
       makeReadableDate(tweet.time) +
      "</div>" +
      "<div class=\"tweet-text\">" +
      tweet.text +
      "</div>" +
  "</div>";


}
