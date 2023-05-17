
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Users;
CREATE TABLE Users(
  user_id int NOT NULL AUTO_INCREMENT,
  fname varchar(45),
  lname varchar(45),
  email varchar(45),
  phone varchar(45),
  smoking varchar(45),
  pets varchar(45),
  gender varchar(45),
  age varchar(45),
  
  PRIMARY KEY (user_id),
  CONSTRAINT user_id UNIQUE (user_id)
);

DROP TABLE IF EXISTS Properties;
CREATE TABLE Properties(
  address varchar(45) NOT NULL,
  rooms int NOT NULL,
  bathrooms int NOT NULL,
  sqft varchar(45) NOT NULL,
  rent varchar(45) NOT NULL,
  utilities varchar(45) NOT NULL,
  description varchar(45) NOT NULL,
  pictures BLOB,
  
  PRIMARY KEY (address),
  CONSTRAINT address UNIQUE (address)
);


DROP TABLE IF EXISTS Tenants;
CREATE TABLE Tenants(
  user_id int NOT NULL,
  role varchar(45),
  

  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS Seekers;
CREATE TABLE Seekers(
  user_id int NOT NULL,
  price_upper int,
  price_lower int,

  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);




DROP TABLE IF EXISTS InformationRequests;
CREATE TABLE InformationRequests(
  user_id int NOT NULL,
  date_contacted DATE NOT NULL,
  address varchar(45),

  PRIMARY KEY (user_id,address),
  FOREIGN KEY (user_id) REFERENCES Seekers(user_id) ON DELETE CASCADE,
  FOREIGN KEY (address) REFERENCES Properties(address) ON DELETE CASCADE
);



DROP TABLE IF EXISTS Reviews;
CREATE TABLE Reviews(
  review_id int AUTO_INCREMENT NOT NULL,
  user_id int,
  address varchar(45) NOT NULL,
  stars int NOT NULL,
  description varchar(45),
  pictures BLOB,

  PRIMARY KEY (review_id),
  CONSTRAINT review_id UNIQUE (review_id),

  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (address) REFERENCES Properties(address) ON DELETE CASCADE
);



DROP TABLE IF EXISTS TenantDirectory;
CREATE TABLE TenantDirectory(
  user_id int NOT NULL,
  address varchar(45),

  FOREIGN KEY (user_id) REFERENCES Tenants(user_id) ON DELETE CASCADE,
  FOREIGN KEY (address) REFERENCES Properties(address) ON DELETE CASCADE,
  PRIMARY KEY (user_id, address)
);


INSERT INTO Users(fname, lname, email, phone, smoking, pets, gender, age) VALUES 
	('Rob', 'Michaels', 'rob@gmail.com', 1234567890, 'yes', 'no', 'male', 22),
	('Amy', 'Stevenson', 'amy@outlook.com', 987654321, 'no', 'no', 'female', 20),
	('Jim', 'Davis', 'jim@oregonstate.edu', 5413214567, 'no', 'yes', 'male', 25),
	('Jordan', 'Brooks', 'jordan@gmail.com', 3219876540, 'yes', 'yes', 'female', 20),
	('Bill', 'Bobert', 'bill@oregonstate.edu', 4436758766, 'no', 'no', 'male', 24),
	('Jace', 'Smith', 'jace@yahoo.com', 4336751369, 'no', 'yes', 'male', 21);

INSERT INTO Tenants(user_id, role) VALUES 
	(4, 'owner'),
	(5, 'tenant'),
	(6, 'tenant');


INSERT INTO Seekers(user_id, price_upper, price_lower) VALUES
	(1, 750, 0),
	(2, 950, 300),
	(3, 600, 0);


INSERT INTO Properties(address, rooms, bathrooms, sqft, rent, utilities, description) VALUES 
	('12345 Berry St.', 3, 3, '1550', '750', 'water, sewage, garbge, washer/dryer', 'Townhome 2.2 miles from campus'),
	('23465 West Ave.', 2, 2, '1450', '850', 'water, sewage, garbage, washer/dryer', 'Apartment room located 5 minutes from campus'),
	('876 Robin BLVD.', 4, 3, '1650', '600', 'electricity , water, sewage, garbage, washer/dryer', 'nice place'),
	('23819 Bald Mtn Rd.', 4, 4, '1800', '650', 'electricity, water, sewage, garade, washer/dryer', 'House from the 80s but in great condition');



INSERT INTO InformationRequests(date_contacted, user_id, address) VALUES
	('2022-12-11', 1, '12345 Berry St.'),
	('2022-09-28', 2, '12345 Berry St.'),
	('2023-02-24', 3, '23819 Bald Mtn Rd.');

INSERT INTO TenantDirectory(user_id, address) VALUES 
	(4, '12345 Berry St.'),
	(4, '23465 West Ave.'),
	(5, '876 Robin BLVD.'),
	(6, '23819 Bald Mtn Rd.');

INSERT INTO Reviews(stars, description, address, user_id) VALUES 
	(4, 'great place! the location is nice', '23819 Bald Mtn Rd.', 2),
	(4, 'Included electricity is a huge plus', '876 Robin BLVD.', 2),
	(3, 'The rooms have a weird smell and the carpets are discolored', '23465 West Ave.', 2);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;
