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