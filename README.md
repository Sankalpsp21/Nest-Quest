# NestQuest

## Table of Contents
- [Overview](#overview)
- [Database Outline](#database-outline)
- [Technologies Used](#technologies-used)
- [Team Members](#team-members)

## Overview
NestQuest is a web application designed to help students at Oregon State University find roommates and places to live. It also provides a platform for landlords to post information about their properties to attract tenants. The application utilizes a relational database to store and list information about vacant rooms in Corvallis, Oregon. It caters specifically to the student community at Oregon State University, which consists of approximately 40,000 students, most of whom live off campus in apartments or townhomes. With over 400 properties available for student housing, the database needs to accommodate a wide range of living situations and provide the flexibility to handle various user preferences and requirements. The application allows users to insert, delete, and modify relevant information based on their current living situation and goals.

## Database Outline
The database design includes the following tables and relationships:

- Users: Stores information about users of the application, such as their names, contact details, and preferences. Users can be associated with reviews and can either be tenants or seekers.

- Tenants: Holds data about people residing in a property who are looking for roommates. It includes the user ID and role information.

- Seekers: Stores data about people currently seeking roommates and a place to live. It includes the user ID, price range, and other relevant information.

- Information Requests: Contains information about requests for property information sent by seekers. It includes the user ID, date of contact, and property address.

- Properties: Stores details about the properties available for rent, including the address, number of rooms, bathrooms, square footage, rent, utilities, and a description.

- Reviews: Stores reviews written by users about properties. It includes the review ID, user ID, property address, star rating, and description.

- Tenants_Properties: Serves as an intersection table between tenants and properties, linking the two entities.

## Technologies Used
The NestQuest project utilizes the following technologies:

- Handlebars: Templating engine for rendering dynamic HTML pages.
- MariaDB: Relational database management system used to store and retrieve data.

## Team Members
- Sankalp Patil
- Michael Molineaux
