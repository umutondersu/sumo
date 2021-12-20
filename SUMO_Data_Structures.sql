CREATE TABLE IF NOT EXISTS `Admin` (
  `admin_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `admin_username` VARCHAR(255) NOT NULL,
  `admin_password` VARCHAR(255) NOT NULL,
  `admin_name` VARCHAR(255),
  `admin_age` VARCHAR(255),
  `admin_location` VARCHAR(255),
  `admin_email` VARCHAR(255) NOT NULL,
  PRIMARY KEY(`admin_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Customer` (
  `user_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `age` INT(3),
  `location` VARCHAR(255),
  `income` INT(30),
  `expert_Id` INT(11),
  PRIMARY KEY(`user_Id`),
  FOREIGN KEY(`expert_Id`) REFERENCES expert(`expert_Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Income` (
  `income_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_Id` INT(11) NOT NULL,
  `income_value` VARCHAR(255) NOT NULL,
  `income_change` VARCHAR(255),
  `date` DATE,
  PRIMARY KEY(`income_Id`),
  FOREIGN KEY (`customer_Id`) REFERENCES customer(`user_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `SpendingHabits` (
  `habit_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_Id` INT(11) NOT NULL,
  `spending_Type` VARCHAR(255) NOT NULL,
  `spending_Value` VARCHAR(255) NOT NULL,
  PRIMARY KEY(`habit_Id`),
  FOREIGN KEY (`customer_Id`) REFERENCES Customer(`user_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Savings` (
  `saving_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_Id` VARCHAR(32) NOT NULL,
  `saving_value` VARCHAR(255) NOT NULL,
  `saving_currency` VARCHAR(255) NOT NULL,
  `saving_change` VARCHAR(255),
  PRIMARY KEY(`saving_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Expert` (
  `expert_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `expert_email` VARCHAR(255) NOT NULL,
  `expert_password` VARCHAR(255) NOT NULL,
  `expert_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY(`expert_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Stocks` (
  `stock_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `stock_name` VARCHAR(32) NOT NULL,
  `stock_value` VARCHAR(255) NOT NULL,
  `stock_change` VARCHAR(255) NOT NULL,
  PRIMARY KEY(`stock_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Conversation` (
  `conversation_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_Id` INT(11) NOT NULL,
  `expert_Id` INT(11) NOT NULL,
  `author` BOOLEAN NOT NULL,
  `message` LONGTEXT NOT NULL,
  `pinned` BOOLEAN,
  PRIMARY KEY(`conversation_Id`),
  FOREIGN KEY (`customer_Id`) REFERENCES Customer(`user_Id`) ON DELETE CASCADE, 
  FOREIGN KEY(`expert_Id`) REFERENCES expert(`expert_Id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
