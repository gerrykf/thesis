# ************************************************************
# Sequel Ace SQL dump
# 版本号： 20095
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主机: localhost (MySQL 9.4.0)
# 数据库: health_management
# 生成时间: 2025-10-20 08:25:20 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# 转储表 role_menus
# ------------------------------------------------------------

DROP TABLE IF EXISTS `role_menus`;

CREATE TABLE `role_menus` (
  `role_id` int NOT NULL COMMENT '角色ID',
  `menu_id` int NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`,`menu_id`),
  KEY `fk_role_menus_menu` (`menu_id`),
  CONSTRAINT `role_menus_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `role_menus_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';

LOCK TABLES `role_menus` WRITE;
/*!40000 ALTER TABLE `role_menus` DISABLE KEYS */;

INSERT INTO `role_menus` (`role_id`, `menu_id`)
VALUES
	(3,10),
	(3,14),
	(2,16),
	(3,16),
	(2,30),
	(3,30),
	(2,31),
	(3,31),
	(2,32),
	(3,32),
	(2,33),
	(3,33),
	(1,39),
	(2,39),
	(3,39),
	(1,40),
	(2,40),
	(3,40),
	(2,41),
	(3,41),
	(2,42),
	(3,42),
	(2,43),
	(3,43),
	(2,44),
	(3,44),
	(2,45),
	(3,45),
	(2,46),
	(3,46),
	(2,47),
	(3,47),
	(2,48),
	(3,48),
	(2,50),
	(3,50),
	(1,51),
	(2,51),
	(3,51),
	(2,52),
	(3,52),
	(2,53),
	(3,53),
	(2,54),
	(3,54),
	(3,71),
	(3,73),
	(3,74),
	(2,75),
	(3,75),
	(2,76),
	(3,76),
	(2,77),
	(3,77),
	(2,78),
	(3,78),
	(2,79),
	(3,79),
	(2,80),
	(3,80);

/*!40000 ALTER TABLE `role_menus` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
