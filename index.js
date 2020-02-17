var tweetDatabase = []
var pauseStatus = false
var tweetArray = document.querySelector('.statuses')

//stops tweet stream
function stopSteam(){

}
console.log("SIZE OF INITIAL TWEET DATABASE" + tweetDatabase.length)

//gets and appends tweets to doc
function getTweets(){
  console.log("Making get request...")
  const url = "http://ec2-54-172-96-100.compute-1.amazonaws.com/feed/random?q=noodle"

  fetch(url)
  .then(res => res.json())
  .then(data => {
    let rawOutput = data.statuses
    console.log(rawOutput);
    let refinedOutput = rawOutput.map(x => (
      {
        user: x.user.screen_name,
        username: x.name,
        profilePic: x.user.profile_image_url ,
        time: timeAdjust(x.created_at),
        text: x.text,
        id: x.id}));

    console.log("NEW TWEETS")


  //adjusting time with moments.js
    function timeAdjust(time){
      // let sortTime = rawOutput.map(x => ({time: x.created_at}));
      // let newDate = moment(sortTime).format('LLL');
      return moment(time).format('LLL');
    }
    // console.log(timeAdjust())

  //chronological sorting attempt
    function chronTweets() {
      sortTime.sort(function(recent,oldest) {
       recent = new Date(a.date).sortTime;
       oldest = new Date(b.date).sortTime;
       return recent>oldest ? 1 : -1;
       console.log(chronTweets())
      })
}
    //push each element of new array into tweet database
    for (i = 0; i < refinedOutput.length ; i++){
      // console.log("Current item")
      // console.log(refinedOutput[i])
      // console.log(refinedOutput[i]);
      tweetDatabase.push(refinedOutput[i])
      // console.log("CURRENT SIZE OF TWEET DATABASE:" + tweetDatabase.length)
    }
    // document.getElementById("response").innerHTML =   JSON.stringify(tweetDatabase);
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

// No duplicate tweets



//Search bar
let searchInputBar = document.getElementById('searchBar')
var searchString = ""

searchInputBar.addEventListener('keyup', function(input){
  var filter = searchInputBar.value
  const term = input.target.value.toLowerCase()

   console.log(input)
})

function createContainer(tweetDatabase) {
  let contain = "<div class=\"maincontainer\">";
  for (let i = 0; i < tweetDatabase.length; i += 1) {
    let curr_tweet = tweetDatabase[i];
    contain += createTweet(curr_tweet);
  }
  contain += "</div>";
  return contain;
}
function createTweet(tweet) {
  console.log(tweet);

  return "<div class=\"tweet\">" +
      "<div class=\"tweet-image\">" +
      "<picture>" + "<source srcset\"tweet.profilePic\" type=\"image/svg+xml\">" +
      "<img class=\"tweetimg\" src=\"" +
       tweet.profilePic +
      "\" alt=\"image not found\">"
      + "</picture>" +"</div>" +
  "<div class=\"tweet-user\">" +
      tweet.user +"</div>" +
      "<div class=\"tweet-time\">" +
      tweet.time +
      "</div>" +
      "<div class=\"tweet-text\">" +
      tweet.text +
      "</div>" +
  "</div>";
}
