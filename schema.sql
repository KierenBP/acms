# CREATE `user` table with google account infomation
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
  `token` int(50) unsigned NOT NULL,
  `userid` int(11) unsigned NOT NULL,
  PRIMARY KEY (`token`),
  KEY `userid` (`userid`),
  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  KEY `clientid` (`clientid`),
  KEY `contactid` (`contactid`),
  CONSTRAINT `client_contact_ibfk_1` FOREIGN KEY (`clientid`) REFERENCES `client` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `client_contact_ibfk_2` FOREIGN KEY (`contactid`) REFERENCES `contact` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `client_address` (
  `clientid` int(11) unsigned DEFAULT NULL,
  `addressid` int(11) unsigned DEFAULT NULL,
  `sequence` int(11) DEFAULT NULL,
  KEY `addressid` (`addressid`),
  KEY `clientid` (`clientid`),
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

