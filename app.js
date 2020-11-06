const got = require(`got`);
const jsdom = require(`jsdom`);
const fs = require('fs');
const { JSDOM } = jsdom;
const keywordJson = JSON.parse(fs.readFileSync('keywords.json'));
const starRatingNames =["Customer Service","Quality Of Work","Friendliness","Pricing","Overall Experience"]
const priorityCount = 3; /*Number of major threats displayed*/
/*Function used to format the .review-entry html, turn it into an easily redable json object*/
function formatEntry(reviewEntry){
  /*Get written review based on the class tag review-content*/
  let writtenReview = reviewEntry.querySelector(".review-content").innerHTML;
  let user = reviewEntry.getElementsByTagName("span")[0].innerHTML;
  /*Get star rating based on the class tag .rating-static-indv*/
  let starRatings = reviewEntry.querySelectorAll('.rating-static-indv');
  let stars = {};
  /*Iterate through each div with star rating, and test to see if it's a 5 star*/
  /* **NOTE rating-50 is the class used to identify a 5 star review */
  for(let i=0;i<starRatings.length;i++){
    let isFiveStar = starRatings[0].classList.contains("rating-50");
    /*Assign a rating to the star to the form: {'Rating Specification':isFiveStar}*/
    stars[starRatingNames[i]] = isFiveStar;
  }
  return {user,writtenReview:writtenReview,starRating:stars}
}
/*Function used to judge the positivity level based on the following criteria:
* Each 5 star earns them 5 points
* Each keyword earns it points dependant on the keyword (Words & points defined in keyword.json)
*/
function positivityJudge(entry){
  let entryPoints = 0;
  /*See if each keyword is in the review and assign it points based on the keyword (see keyword.json for points)*/
  for(let keyword in keywordJson){
    if(entry.writtenReview.includes(keyword)){
      entryPoints+= parseInt(keywordJson[keyword]);
    }
  }
  /*Assign 5 points for each 5 star rating given*/
  for(let ratedFiveStar in entry.starRating){
    entryPoints+= entry.starRating[ratedFiveStar]? 5:0;
  }
  return entryPoints
}

/*Function used to get the page reviews on a particular page and judge their positivity defined in the positivityJudge() function*/
async function getPageReviews(url){
    let pageEntries = [];
    const response = await got(url);
    const dom = new JSDOM(response.body);
    const doc = dom.window.document;
    const reviewEntries = doc.getElementById("reviews").querySelectorAll(".review-entry");
    /*Iterate through each entry and translate them to an easier to read json format*/
    for(let entry=0;entry<reviewEntries.length;entry++){
      /*Format into a more readable form (json)*/
      let formattedEntry = formatEntry(reviewEntries[entry]);
      /*Add the review to the total reviews on the page*/
      pageEntries.push({review:formattedEntry,points:positivityJudge(formattedEntry)});
    }
  return pageEntries;
}
/*Function to get X pages of reviews */
async function judgeEntries(endPage){
  /*Iterate through each page*/
  let judgedEntries = [];
  for(let pageCount=1;pageCount<=endPage;pageCount++){
    console.log(`Scanning page ${pageCount} for threats`);
    /*Reassign url based on current page count*/
    let url = `https://www.dealerrater.com/dealer/McKaig-Chevrolet-Buick-A-Dealer-For-The-People-dealer-reviews-23685/page${pageCount}/?filter=ONLY_POSITIVE&__optvLead=1#link`;
    let pageReviews = await getPageReviews(url);
    /*Add the pageReviews to the total reviews*/
    for(let i=0;i<pageReviews.length;i++){
        judgedEntries.push(pageReviews[i]);
    }
  }
  return judgedEntries;
}
/*Compare function used by the sort property of arrays*/
function comparePoints(prop) {
    return function(a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}
/*Run the async function judge entries and then display threat levels*/
judgeEntries(5).then(function(entries){
  entries.sort(comparePoints("points"));
  console.log("Threats by priority: \n ");
  let threatCount = priorityCount>(entries.length-1)? entries.length-1:priorityCount;
  /*Iterate through the number of threats we want to reveal and displays the threat level, as well as the review, and the user*/
  for(let i =1;i<=priorityCount;i++){
      let selectedEntry = entries[entries.length-i];
      console.log(`Threat Level: ${selectedEntry.points}`);
      console.log(`Review: ${selectedEntry.review.writtenReview}`);
      console.log(`${(selectedEntry.review.user)} \n`);
  }
});
/*Written by Elijah Parker(Dunemask)*/
