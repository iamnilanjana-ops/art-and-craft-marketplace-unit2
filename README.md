Art & Craft Marketplace

Art & Craft Marketplace is a full-stack web application that connects artists and craft creators with customers looking for handmade products. Artists can add, view, edit, and delete their product listings, including descriptions, prices, and images. Customers can browse available products and submit product reviews. The application uses a React frontend, a Java Spring Boot backend, and a MySQL database to store product information persistently.

Technologies

React 19

React Router

Java 21

Spring Boot 4.1.1

Spring Data JPA

MySQL

Maven

Jest and React Testing Library

Project Structure

java-spring-boot-back-end-app - Spring Boot backend and REST API

react-front-end-app - React frontend

Current Features

Add, view, edit, and delete products

Add product descriptions, prices, and images

Store product data persistently in MySQL

Validate product prices

Add and view product reviews

Installation

Prerequisites

Java 21

Node.js and npm

MySQL

Git

1. Clone the repository

git clone https://github.com/iamnilanjana-ops/art-and-craft-marketplace-unit2.git
cd art-and-craft-marketplace-unit2

2. Create the MySQL database

Open MySQL and run:

CREATE DATABASE art_craft_marketplace;

3. Configure and run the Spring Boot backend

The backend reads the database connection from the DB_URL, DB_USERNAME, and DB_PASSWORD environment variables.

On Windows PowerShell:

$env:DB_URL="jdbc:mysql://localhost:3306/art_craft_marketplace"
$env:DB_USERNAME="your_mysql_username"
$env:DB_PASSWORD="your_mysql_password"
cd java-spring-boot-back-end-app
.\mvnw.cmd spring-boot:run

On macOS or Linux:

export DB_URL="jdbc:mysql://localhost:3306/art_craft_marketplace"
export DB_USERNAME="your_mysql_username"
export DB_PASSWORD="your_mysql_password"
cd java-spring-boot-back-end-app
./mvnw spring-boot:run

The backend runs at http://localhost:8080.

4. Install and run the React frontend

Open a second terminal from the repository root and run:

cd react-front-end-app
npm install
npm start

The frontend opens at http://localhost:3000.

Wireframes

View the Art & Craft Marketplace ER diagram on [Canva](https://canva.link/r963cj9z8m0zk49).

ER Diagram

View the Art & Craft Marketplace ER diagram on Canva.

Future Features and Known Limitations

The current proof of concept focuses on persistent product CRUD operations and product reviews. The checkout page is currently a placeholder, and shopping cart, order processing, user authentication, artist and customer roles, favorites, and secure payment processing are not yet implemented. Future development will add these marketplace features, improve responsive design for different screen sizes, and expand automated test coverage.
