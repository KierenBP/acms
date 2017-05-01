# Users
CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `googleid` varchar(120) NOT NULL DEFAULT '',
  `firstname` varchar(80) NOT NULL DEFAULT '',
  `lastname` varchar(80) DEFAULT NULL,
  `email` varchar(120) NOT NULL DEFAULT '',
  `profilepicture` varchar(1200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `session` (
  `token` varchar(50) NOT NULL,
  `userid` int(11) unsigned NOT NULL,
  `expires` datetime NOT NULL,
  PRIMARY KEY (`token`),
  KEY `userid` (`userid`),
  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# Permissions
CREATE TABLE `group` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `area` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user_group` (
  `userid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `groupid` int(11) unsigned NOT NULL,
  PRIMARY KEY (`userid`, `groupid`),
  CONSTRAINT `user_group_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `user_group_ibfk_2` FOREIGN KEY (`groupid`) REFERENCES `group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `user_area` (
  `userid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `areaid` int(11) unsigned NOT NULL,
  `allow` int(2) NOT NULL,
  `deny` int(2) NOT NULL,
  PRIMARY KEY (`userid`, `areaid`),
  CONSTRAINT `user_area_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`id`),
  CONSTRAINT `user_area_ibfk_2` FOREIGN KEY (`areaid`) REFERENCES `area` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `group_area` (
  `groupid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `areaid` int(11) unsigned NOT NULL,
  `allow` int(2) NOT NULL,
  `deny` int(2) NOT NULL,
  PRIMARY KEY (`groupid`, `areaid`),
  CONSTRAINT `group_area_ibfk_1` FOREIGN KEY (`groupid`) REFERENCES `group` (`id`),
  CONSTRAINT `group_area_ibfk_2` FOREIGN KEY (`areaid`) REFERENCES `area` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Clients
CREATE TABLE `client` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(180) NOT NULL DEFAULT '',
  `phone` varchar(40) DEFAULT '',
  `fax` varchar(40) DEFAULT '',
  `mobile` varchar(40) DEFAULT '',
  `website` varchar(2083) DEFAULT NULL,
  `accountnumber` varchar(36) DEFAULT NULL,
  `xeroid` varchar(40) DEFAULT NULL,
  `lastmodify` datetime DEFAULT NULL,
  `xerodate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `address` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `street` varchar(100) NOT NULL DEFAULT '',
  `suburb` varchar(100) DEFAULT '',
  `town` varchar(100) DEFAULT '',
  `postcode` varchar(10) DEFAULT '',
  `country` varchar(32) DEFAULT '',
  `addresstype` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `contact` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `firstname` varchar(80) NOT NULL DEFAULT '',
  `lastname` varchar(80) DEFAULT '',
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `client_contact` (
  `clientid` int(11) unsigned NOT NULL,
  `contactid` int(11) unsigned NOT NULL,
  `sequence` int(11) DEFAULT NULL,
  `emailinclude` bit(1) DEFAULT b'1',
  PRIMARY KEY (`clientid`,`contactid`),
  CONSTRAINT `client_contact_ibfk_1` FOREIGN KEY (`clientid`) REFERENCES `client` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `client_contact_ibfk_2` FOREIGN KEY (`contactid`) REFERENCES `contact` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `client_address` (
  `clientid` int(11) unsigned  NOT NULL,
  `addressid` int(11) unsigned  NOT NULL,
  `sequence` int(11) DEFAULT NULL,
  PRIMARY KEY (`clientid`,`addressid`),
  CONSTRAINT `client_address_ibfk_1` FOREIGN KEY (`addressid`) REFERENCES `address` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `client_address_ibfk_2` FOREIGN KEY (`clientid`) REFERENCES `client` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE VIEW `contactview`
AS SELECT
   `client`.`id` AS `clientid`,
   `contact`.`id` AS `contactid`,
   `contact`.`firstname` AS `firstname`,
   `contact`.`email` AS `email`,
   `contact`.`lastname` AS `lastname`,
   `client_contact`.`sequence` AS `sequence`,
   `client_contact`.`emailinclude` AS `emailinclude`
FROM ((`client` join `client_contact` on((`client_contact`.`clientid` = `client`.`id`))) left join `contact` on((`client_contact`.`contactid` = `contact`.`id`)));

CREATE VIEW `addressview`
AS SELECT
   `client`.`id` AS `clientid`,
   `address`.`id` AS `addressid`,
   `address`.`street` AS `street`,
   `address`.`suburb` AS `suburb`,
   `address`.`town` AS `town`,
   `address`.`postcode` AS `postcode`,
   `address`.`country` AS `country`,
   `address`.`addresstype` AS `addresstype`,
   `client_address`.`sequence` AS `sequence`
FROM ((`client` join `client_address` on((`client`.`id` = `client_address`.`clientid`))) left join `address` on((`client_address`.`addressid` = `address`.`id`)));


# Jobs
CREATE TABLE `manufacturer` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `model` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `manufacturerid` int(11) unsigned NOT NULL,
  `name` varchar(40) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `manufacturerid` (`manufacturerid`),
  CONSTRAINT `model_ibfk_1` FOREIGN KEY (`manufacturerid`) REFERENCES `manufacturer` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `product` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `modelid` int(11) unsigned NOT NULL,
  `name` varchar(40) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `modelid` (`modelid`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`modelid`) REFERENCES `model` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `job_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  `colour` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `job_state` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  `colour` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `jobtype_jobstate` (
  `typeid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `stateid` int(11) unsigned NOT NULL,
  PRIMARY KEY (`typeid`, `stateid`),
  CONSTRAINT `jobtype_jobstate_ibfk_1` FOREIGN KEY (`typeid`) REFERENCES `job_type` (`id`),
  CONSTRAINT `jobtype_jobstate_ibfk_2` FOREIGN KEY (`stateid`) REFERENCES `job_state` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `job` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `clientid` int(11) unsigned NOT NULL,
  `jobtypeid` int(11) unsigned NOT NULL,
  `price` decimal(13,4) DEFAULT NULL,
  `gst` decimal(6,4) DEFAULT NULL,
  `productid` int(11) unsigned DEFAULT NULL,
  `productserialnumber` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clientid` (`clientid`),
  KEY `jobtypeid` (`jobtypeid`),
  KEY `productid` (`productid`),
  CONSTRAINT `job_ibfk_1` FOREIGN KEY (`clientid`) REFERENCES `client` (`id`),
  CONSTRAINT `job_ibfk_2` FOREIGN KEY (`jobtypeid`) REFERENCES `job_type` (`id`),
  CONSTRAINT `job_ibfk_3` FOREIGN KEY (`productid`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `task` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `jobid` int(11) unsigned NOT NULL,
  `description` varchar(240) NOT NULL DEFAULT '',
  `completed` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `job_detail` (
  `jobid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `loginusername` varchar(40) DEFAULT '',
  `loginpassword` varchar(50) DEFAULT NULL,
  `emailusername` varchar(50) DEFAULT NULL,
  `emailpassword` varchar(50) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`jobid`),
  CONSTRAINT `job_detail_ibfk_1` FOREIGN KEY (`jobid`) REFERENCES `job` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `job_status` (
  `jobid` int(11) unsigned NOT NULL,
  `actioned` datetime NOT NULL,
  `stateid` int(11) unsigned NOT NULL,
  `userid` int(11) DEFAULT NULL,
  PRIMARY KEY (`jobid`, `actioned`, `stateid`),
  CONSTRAINT `job_status_ibfk_1` FOREIGN KEY (`jobid`) REFERENCES `job` (`id`),
  CONSTRAINT `job_status_ibfk_2` FOREIGN KEY (`stateid`) REFERENCES `job_state` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `job_xeroinvoice` (
  `jobid` int(11) unsigned NOT NULL,
  `xeroid` binary(16) NOT NULL DEFAULT '',
  PRIMARY KEY (`jobid`, `xeroid`),
  CONSTRAINT `job_xeroinvoice_ibfk_1` FOREIGN KEY (`jobid`) REFERENCES `job` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Insurance
CREATE TABLE `insurance_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL DEFAULT '',
  `colour` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `insurance` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `jobid` int(11) unsigned DEFAULT NULL,
  `typeid` int(11) unsigned DEFAULT NULL,
  `typecontactid` int(11) unsigned DEFAULT NULL,
  `othercontactid` int(11) unsigned DEFAULT NULL,
  `excess` decimal(13,4) DEFAULT NULL,
  `excesspayerid` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `jobid` (`jobid`),
  KEY `typecontactid` (`typecontactid`),
  KEY `othercontactid` (`othercontactid`),
  KEY `excesspayerid` (`excesspayerid`),
  KEY `typeid` (`typeid`),
  CONSTRAINT `insurance_ibfk_1` FOREIGN KEY (`jobid`) REFERENCES `job` (`id`),
  CONSTRAINT `insurance_ibfk_2` FOREIGN KEY (`typecontactid`) REFERENCES `contact` (`id`),
  CONSTRAINT `insurance_ibfk_3` FOREIGN KEY (`othercontactid`) REFERENCES `contact` (`id`),
  CONSTRAINT `insurance_ibfk_4` FOREIGN KEY (`excesspayerid`) REFERENCES `client` (`id`),
  CONSTRAINT `insurance_ibfk_5` FOREIGN KEY (`typeid`) REFERENCES `insurance_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# Orders
CREATE TABLE `order` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `gst` decimal(6,4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `supplier` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL DEFAULT '',
  `website` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `supplier_contact` (
  `supplierid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `contactid` int(11) unsigned NOT NULL,
  PRIMARY KEY (`supplierid`, `contactid`),
  CONSTRAINT `supplier_contact_ibfk_1` FOREIGN KEY (`supplierid`) REFERENCES `supplier` (`id`),
  CONSTRAINT `supplier_contact_ibfk_2` FOREIGN KEY (`contactid`) REFERENCES `contact` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `item` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(160) NOT NULL DEFAULT '',
  `code` varchar(36) DEFAULT NULL,
  `supplierid` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplierid` (`supplierid`),
  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`supplierid`) REFERENCES `supplier` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `order_item` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(240) DEFAULT NULL,
  `orderid` int(11) unsigned NOT NULL,
  `itemid` int(11) unsigned NOT NULL,
  `quantity` int(11) NOT NULL,
  `cost` decimal(13,4) DEFAULT NULL,
  `unit` decimal(13,4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orderid` (`orderid`),
  KEY `itemid` (`itemid`),
  CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`orderid`) REFERENCES `order` (`id`),
  CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`itemid`) REFERENCES `item` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `order_item_state` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '',
  `colour` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `order_item_status` (
  `orderitemid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `actioned` datetime NOT NULL,
  `orderstateid` int(11) unsigned NOT NULL,
  `userid` int(11) unsigned NOT NULL,
  PRIMARY KEY (`orderitemid`, `actioned`, `orderstateid`),
  KEY `userid` (`userid`),
  CONSTRAINT `order_item_status_ibfk_1` FOREIGN KEY (`orderitemid`) REFERENCES `order` (`id`),
  CONSTRAINT `order_item_status_ibfk_2` FOREIGN KEY (`orderstateid`) REFERENCES `order_item_state` (`id`),
  CONSTRAINT `order_item_status_ibfk_3` FOREIGN KEY (`userid`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `job_order` (
  `jobid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `orderid` int(11) unsigned NOT NULL,
  PRIMARY KEY (`jobid`, `orderid`),
  CONSTRAINT `job_order_ibfk_1` FOREIGN KEY (`jobid`) REFERENCES `job` (`id`),
  CONSTRAINT `job_order_ibfk_2` FOREIGN KEY (`orderid`) REFERENCES `order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


