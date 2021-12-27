CREATE TABLE IF NOT EXISTS `admin` (
  `admin_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `admin_email` VARCHAR(255) NOT NULL,
  `admin_password` VARCHAR(255) NOT NULL,
  PRIMARY KEY(`admin_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `expert` (
  `expert_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `expert_email` VARCHAR(255) NOT NULL,
  `expert_password` VARCHAR(255) NOT NULL,
  `expert_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY(`expert_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `customer` (
  `user_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `age` INT(3),
  `location` VARCHAR(255),
  `income` INT(30),
  `expert_Id` INT(11),
  PRIMARY KEY(`user_Id`),
  FOREIGN KEY(`expert_Id`) REFERENCES expert(`expert_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `income` (
  `income_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_Id` INT(11) NOT NULL,
  `income_value` VARCHAR(255) NOT NULL,
  `income_change` VARCHAR(255),
  `date` DATE,
  PRIMARY KEY(`income_Id`),
  FOREIGN KEY (`customer_Id`) REFERENCES customer(`user_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `spendinghabits` (
  `habit_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_Id` INT(11) NOT NULL,
  `spending_Type` VARCHAR(255) NOT NULL,
  `spending_Value` VARCHAR(255) NOT NULL,
  PRIMARY KEY(`habit_Id`),
  FOREIGN KEY (`customer_Id`) REFERENCES customer(`user_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `savings` (
  `saving_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_Id` VARCHAR(32) NOT NULL,
  `saving_value` VARCHAR(255) NOT NULL,
  `saving_currency` VARCHAR(255) NOT NULL,
  `saving_change` VARCHAR(255),
  PRIMARY KEY(`saving_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `stocks` (
  `stock_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `stock_name` VARCHAR(32) NOT NULL,
  `stock_value` VARCHAR(255) NOT NULL,
  `stock_change` VARCHAR(255) NOT NULL,
  PRIMARY KEY(`stock_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `conversation` (
  `conversation_Id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_Id` INT(11) NOT NULL,
  `expert_Id` INT(11) NOT NULL,
  `author` BOOLEAN NOT NULL,
  `message` LONGTEXT NOT NULL,
  `pinned` BOOLEAN,
  PRIMARY KEY(`conversation_Id`),
  FOREIGN KEY (`customer_Id`) REFERENCES customer(`user_Id`) ON DELETE CASCADE, 
  FOREIGN KEY(`expert_Id`) REFERENCES expert(`expert_Id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;