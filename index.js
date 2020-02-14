// fetched data
const url = "http://ec2-54-172-96-100.compute-1.amazonaws.com/feed/random?q=noodle"
//
  // the following takes the raw data from the array of object statuses


  fetch(url)
  .then(res => res.json())
  .then(data => {

    let rawOutput = data.statuses
    let refinedOutput = rawOutput.map(x => ({user: x.user.screen_name,profilePic: x.user.profile_image_url ,time: x.created_at, text: x.text, id: x.id}));

// interval for multiple tweets
    var mytweet = setInterval(myTimer, 5000);
      function myTimer() {
        var multiTweets = refinedOutput
        console.log(multiTweets)
      //  document.getElementById('response').innerHTML = multiTweets
      }

  console.log(refinedOutput);
      document.getElementById("response").innerHTML =  JSON.stringify(refinedOutput);






  })
  .catch(err => {
    // error catching
    console.log(err)
  });
