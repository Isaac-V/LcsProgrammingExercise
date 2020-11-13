# Getting Started with the LCS App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Installation Steps
1. Install npm, the download can be found [here](https://nodejs.org/en/).
2. Execute `npm install` from within the LSC App directory.

## Running the LCS App
1. Execute `npm start` from within the LCS App directory.
2. Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Using the LCS App
### Members View
The members view is the first page you will see after running the LCS App. It lists useful information about each member of the House of Representatives of the 116th U.S. Congress. The list will only display 10 members at a time, but can be paged through using the paging buttons at the bottom of the member list. The list can also be sorted by the member's last names or filtered by the member's status (active members are displayed by default). The member's are also highlighted in red if they are affiliated with the Republican party or blue if they are affiliated with the Democratic party. 

### Votes View
The votes view is available by selecting the `Votes` navigation button in the upper-left area of the page. It lists useful information about the voting events of the House of Representatives of the 116th U.S. Congress. The list will only display 10 voting events at a time, but can be paged through using the paging buttons at the bottom of the voting event list. You can see additional vote count information by clicking the icon-button in the `More Info` column of the list. The vote count information can be closed by clicking the icon-button again or by progressing to a different page of voting events. Vote count information is also highlighted to identify vote counts affiliated with the Democratic party (blue) or the Republican party (red). 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
