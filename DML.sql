-- Questions to ask: Does the DML have to handle CASCADING deletes or should that be done in the DDL? How does the text within the DML file interact with the javascript? Do we call it somehow or do we just copy paste from the DML to the JS?
-- For this part write the commands for Creating, Reading, Updating and Deleting as per the discussion with Sandy
-- Use :fname syntax for dynamic inputs

--USERS---------------------------------------------------------------------------------------------------------------------------

--Add a new user(note that any of these the user doesn't provide should be set to NULL)
INSERT INTO Users(fname, lname, email, phone, smoking, pets, gender, age)
    VALUES (:fname_input, :lname_input, :email_input, :phone_input, :smoking_input, :pets_input, :gender_input, :age_input);

--show


--Select a specific user
SELECT * FROM Users WHERE fname = :fname_input

--Update an user entry
UPDATE Users SET 
        fname = fname_input,
        lname = :lname_input,
        email = :email_input, 
        phone = :phone_input, 
        smoking = :smoking_input, 
        pets = :pets_input, 
        gender = :gender_input, 
        age = :age_input
    WHERE user_id = :user_id_input; 


--Delete an User
DELETE FROM Users WHERE user_id = :user_id_input;
--Need to set up the CASCADE functions to delete the User from Tenants and Seekers



--TENANTSandDIRECTORIES----------------------------------------------------------------------------------------------------------------------------

--Create a tenant entry and associate it with an address
INSERT INTO Tenants(user_id, role) VALUES (:user_id_input, :role_input);
INSERT INTO TenantDirectory(user_id, property_id) VALUES (:user_id_input, :property_id_input);

--Read the table
SELECT * FROM Tenants;

--Update a tenant role
UPDATE Tenants SET role = :role_input WHERE user_id = :user_id_input;

--Remove a tenant entry
DELETE FROM Tenants WHERE user_id = :user_id_input;
--Need to implement the CASCADE function to delete from directory



--SEEKERS----------------------------------------
--Create a seeker entry
INSERT INTO Seekers(user_id, role) VALUES (:user_id_input, :role_input);

--Read the table
SELECT * FROM Seekers;

--Update a seeker role
UPDATE Seekers SET price_upper = :price_upper_input, price_lower = :price_lower_input WHERE user_id = :user_id_input;

--Remove a seeker entry
DELETE FROM Seekers WHERE user_id = :user_id_input;




--INFORMATIONREQUESTS-----------------------------
--Create an information request
INSERT INTO InformationRequests(user_id, date_contacted, address);

--Read table
SELECT * FROM InformationRequests;





--PROPERTIES------------------------------
--Create a property
INSERT INTO Properties(address, rooms, bathrooms, sq_ft, rent, utilities, description)
    VALUES(:address_input, :rooms_input, :bathrooms_input, :sq_ft_input, :rent_input, :utilities_input, :description_input);

--Read the table
SELECT * FROM Properties;

--Select a specific Property
SELECT * FROM Properties WHERE address = :address_input;

--Update a property
UPDATE SET 
        rooms = :rooms_input, 
        bathrooms = :bathroom_input, 
        sq_ft = :sq_ft_input, 
        rent = :rent_input, 
        utilities = :utilities_input, 
        description = :description_input 
    WHERE address = :address_input;

--Delete the property
DELETE FROM Properties WHERE address = :address_input;
--Need to cascade so that it deletes entries in tenant directory and reviews



--Reviews-----------------------------------
--Create a review
INSERT INTO Reviews(user_id, address, stars, description)
    VALUES (:user_id_input, :address_input, :stars_input, :description_input);

--Show all reviews
SELECT * FROM Reviews;

--show reviews made on a property
SELECT * FROM Reviews WHERE address = :address_input;

--Delete a review
DELETE FROM Reviews WHERE review_id = :review_id_input;