# MSC-PROJECT-ARUN
MSC-PROJECT-ARUN-UWS

PLEASE REFER TO THE BELOW INSTRUCTIONS TO LAUNCH THE WEB APPLICATIONS ON YOUR LOCAL MACHINE


Both Cassandra and MongoDB databases must be installed on the machine before the applications can be run. The installation and configuration process may vary by system. After installing the databases, I performed the following steps on my MacBook Pro (Retina, 13-inch, Mid 2014) machine.


1.) Create a folder on your local machine.

2.) Open the terminal and change directory to the created folder using cd command

3.) give the command - git clone "https://github.com/Arun-UWS/MSC-PROJECT-ARUN.git"

4.) Now, cd to the folder 'MSC-PROJECT-ARUN'



To start the MongoDB web application, 

1.) cd to 'mongo-movie' folder

2.) give the command - npm i (to install all the dependencies of the project)

3.) Now, to start the application, give the command -  node server.js

4.) go to the browser and open http://localhost:7500 (the port 7500 runs the mongoDB web application)



Similarly, to start the Cassandra web application,

1.) cd to 'cassandra-movie' folder

2.) give the command - npm i (to install all the dependencies of the project)

3.) Open another terminal and give the command - cassandra

If there are any connectivity errors, use the following commands to kill the process

        a.) PID can be found using the following command -
        ps -ax|grep cassandra

        b.) To kill the process, use the following command by replacing PID with the id obtained from the previous command result -
        kill -9 PID
 
4.) To create Keyspace and the table for Cassandra, Open a new terminal 

a.) give the command - cqlsh  (this opens the Cassandra command line interface)

b.) To create keyspace, give the following command

          CREATE KEYSPACE movies with replication ={'class':'SimpleStrategy','replication_factor':'1'};

c.) To create the table, give the command

          CREATE TABLE movies.movielist ( id UUID PRIMARY KEY, comment text, genre text, movie text, rating text, year text );

4.) Now, to start the application, give the command - node app.js

5.) Go to the browser and open http://localhost:3000 (the port 3000 runs the Cassandra web application)

