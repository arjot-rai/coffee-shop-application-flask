# coffee-shop-application-flask
Coffee shop application with Flask library used to make the server and SQLite used for databases.

To intstall all the packages run `npm install`, in the directory which contains the package.json file is located.

For the server-side NodeJS is used, for the
client-side of the project HTML and Vanilla JavaScript is used and for the database MySQL is
used. While making this coffee shop application, it was made sure that the different tiers are kept
separate to ensure scalability. It is easy to add new features in the application, this can be done
simply by creating an html file which can be served using the server. The JavaScript files and the
CSS files are treated as static files for the purposes of this application.

It is also important to discus the database design since it plays such an important role in this
application. Two tables are created in the database: one to store menu items and one for the
orders. The “menu” table has just three fields: id, name of the item and the price of the item. The
“orders” table stores information such as the order number, total price, order details, time the
order was made and whether it is completed or not.

The working for this application is simple. On loading the home page, users are asked to login as
customer or employee and depending on their response a new page is shown. NodeJS server
serves html files on request. Other than serving files, the server is used to query the database. To
pass parameters to the server, the body of the request is used, this way the parameters are not
shown in the URL. Most of the functionalities of the application occur through button clicks
which help navigate the user from one page to another. The MySQL server is run using the
xampp control panel, which makes running the server so much easier than running it manually.

Now coming to the testing of this application. While testing it, it was made sure that all the
functionalities worked as expected, it was specially made sure that the server interacts with the
database correctly. Such as the orders being stored successfully when the customer submits an
order. Also a cancelled order should not be displayed to the employees as a pending order.
Moreover once the employee modifies a menu, customers should be able to see the updated
menu with which they can place an order. These were tested thoroughly by constantly checking
the database state and everything is working fine.
