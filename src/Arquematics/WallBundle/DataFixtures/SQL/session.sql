CREATE TABLE IF NOT EXISTS `sessions` (
    `sess_id` varchar(255) NOT NULL,
    `sess_data` text NOT NULL,
    `sess_time` int(11) NOT NULL,
    `sess_lifetime` int(11) NOT NULL,
    PRIMARY KEY (`sess_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
