# NodeJS REST API for e-commerce marketplace

## Before running the program
1. Create a mongodb cluster and get its Connection URI.<br>
The connection uri must be urlencoded, i.e. if the username or password or cluster name has special characters in it, then it must be encoded. For making lives easier a encoder.js file is provided just run it using the following command.
```
node encoder
```
Enter the string(username, password etc.) that needs to be urlencoded and then paste it to its respective position in the Connection URI.

2. Create a .env file in the root directory and add the following parameters<br>
```
PORT=<AnyPortNumberYouWant>
MONGO_URI=<ConnectionURIStringForMongoDB>
```
## To run the program
1. Clone this repostiory
```
git clone https://github.com/BiJu-02/UnityLabsInternAssignment.git
```
2. Run the following commands by opening the terminal in root directory of the project (make sure node and npm are installed)
```
npm i
node index
```

#### For a better understanding of how to use the APIs, please refer to the API_ref.txt document.
<br><br>
Please do provide feedback on the project.
