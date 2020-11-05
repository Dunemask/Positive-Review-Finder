# Summary
 Simple Project to scrape DealerRater.com and find positive reviews

## Prompt

"The KGB has noticed a resurgence of overly excited reviews for a McKaig Chevrolet Buick, a dealership they have planted in the United States. In order to avoid attracting unwanted attention, you’ve been enlisted to scrape reviews for this dealership from DealerRater.com and uncover the top three worst offenders of these overly positive endorsements."

## Project Details

* 1 Scrape the first 5 pages of reviews to gather data.
* 2 Assign ratings of positivity to each review according to judging criteria(See Below).
* 3 Identify the top 3 most postive reviews and print them to the console.

## Judging Criteria

    1 Must come from the only positive reviews list
    Each 5 star earns them 5 points
    Each keyword earns it points dependant on the keyword (Words & points defined in keyword.json)

## Resources
Link for reviews:

https://www.dealerrater.com/dealer/McKaig-Chevrolet-Buick-A-Dealer-For-The-People-dealer-reviews-23685/page***x***/?filter=ONLY_POSITIVE&__optvLead=1#link

* Pagex where x is the page number for the review

## How to run

This project is built using nodejs version 15.1.0
(How to [Install Node](https://nodejs.org/en/download/))

* Open a terminal or command prompt after installing nodejs 
* Ensure you are on version 15.1.0 using the command "node --version"
* Type the command "npm install" to install dependencies
* Type the command "npm start" to run the program


