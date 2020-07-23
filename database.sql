-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: tonymall
-- ------------------------------------------------------
-- Server version	5.7.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `po_details`
--

DROP TABLE IF EXISTS `po_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `po_details` (
  `sp_id` int(10) NOT NULL,
  `po_no` int(10) NOT NULL,
  `po_quantity` int(10) NOT NULL,
  `po_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`sp_id`,`po_no`),
  KEY `fk_po_no_idx` (`po_no`),
  CONSTRAINT `detail_fk_po_no` FOREIGN KEY (`po_no`) REFERENCES `purchaseorder` (`po_no`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `detail_fk_sp_id` FOREIGN KEY (`sp_id`) REFERENCES `smartphone` (`sp_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `po_details`
--

LOCK TABLES `po_details` WRITE;
/*!40000 ALTER TABLE `po_details` DISABLE KEYS */;
INSERT INTO `po_details` VALUES (1,1,1,9688.00,9688.00),(1,8,1,9688.00,9688.00),(1,27,4,9688.00,38752.00),(1,28,2,9688.00,19376.00),(1,29,11,9688.00,106568.00),(1,34,1,9688.00,9688.00),(1,36,1,9688.00,9688.00),(1,37,1,9688.00,9688.00),(1,38,1,9688.00,9688.00),(1,39,1,9688.00,9688.00),(1,40,1,9688.00,9688.00),(1,44,1,9688.00,9688.00),(1,45,1,9688.00,7688.00),(1,47,1,9688.00,7688.00),(2,1,1,7188.00,7188.00),(2,8,1,7188.00,7188.00),(2,28,1,7188.00,7188.00),(2,33,2,7188.00,14376.00),(2,34,1,7188.00,7188.00),(2,41,1,7188.00,7188.00),(2,42,1,7188.00,7188.00),(2,46,1,7188.00,7188.00),(2,47,1,7188.00,7188.00),(3,27,4,7988.00,31952.00),(3,28,1,7988.00,7988.00),(3,30,3,7988.00,23964.00),(3,31,8,7988.00,63904.00),(3,34,1,7988.00,7988.00),(3,48,1,7988.00,7988.00),(4,27,3,6488.00,19464.00),(4,32,5,6488.00,32440.00),(4,33,1,6488.00,6488.00),(5,27,1,4499.00,4499.00),(5,49,1,4499.00,4499.00);
/*!40000 ALTER TABLE `po_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchaseorder`
--

DROP TABLE IF EXISTS `purchaseorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchaseorder` (
  `po_no` int(10) NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `po_amount` decimal(10,2) unsigned NOT NULL,
  `status` varchar(45) NOT NULL,
  `status_date` datetime DEFAULT NULL,
  `user_id` varchar(45) NOT NULL,
  `cancelled_by` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`po_no`),
  KEY `po_fk_user_id_idx` (`user_id`),
  CONSTRAINT `po_fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorder`
--

LOCK TABLES `purchaseorder` WRITE;
/*!40000 ALTER TABLE `purchaseorder` DISABLE KEYS */;
INSERT INTO `purchaseorder` VALUES (1,'2018-03-13 20:21:58',16876.00,'shipped','2018-03-13 20:22:58','Tony',NULL),(8,'2018-02-16 11:59:06',16876.00,'hold',NULL,'Tony',NULL),(27,'2018-03-10 15:50:06',94667.00,'shipped','2018-03-10 15:50:26','tony',NULL),(28,'2018-03-10 15:50:11',34552.00,'shipped','2018-03-10 15:50:22','tony',NULL),(29,'2018-03-10 15:49:57',106568.00,'shipped','2018-03-10 15:50:57','tony',NULL),(30,'2018-03-10 15:49:51',23964.00,'shipped','2018-03-10 15:51:51','tony',NULL),(31,'2018-03-10 15:49:46',63904.00,'shipped','2018-03-10 15:52:46','tony',NULL),(32,'2018-03-10 15:49:33',32440.00,'shipped','2018-03-10 15:52:33','tony',NULL),(33,'2018-03-13 12:24:23',20864.00,'cancelled','2018-03-13 12:26:23','tony','tony'),(34,'2018-03-13 20:32:07',24864.00,'cancelled','2018-03-13 20:32:12','tony','tony'),(36,'2018-04-03 22:24:45',9688.00,'shipped','2018-04-03 22:25:51','tony',NULL),(37,'2018-04-03 22:24:59',9688.00,'shipped','2018-04-03 22:25:42','tony',NULL),(38,'2018-04-03 22:25:08',9688.00,'shipped','2018-04-03 22:25:36','tony',NULL),(39,'2018-04-03 22:43:00',9688.00,'shipped','2018-04-03 22:45:23','Chris',NULL),(40,'2018-04-03 22:43:38',9688.00,'shipped','2018-04-03 22:45:18','Giulio',NULL),(41,'2018-04-03 22:43:48',7188.00,'shipped','2018-04-03 22:45:12','Giulio',NULL),(42,'2018-04-03 22:44:38',7188.00,'shipped','2018-04-03 22:45:08','Chris',NULL),(44,'2018-04-10 12:47:12',9688.00,'shipped','2018-04-10 12:47:35','Giulio',NULL),(45,'2018-04-19 16:27:46',9688.00,'shipped','2018-04-19 16:29:19','Giulio',NULL),(46,'2018-04-19 16:27:58',7188.00,'shipped','2018-04-19 16:29:10','Giulio',NULL),(47,'2018-04-19 16:28:16',16876.00,'shipped','2018-04-19 16:28:57','Chris',NULL),(48,'2018-04-19 19:27:19',7988.00,'pending',NULL,'tony',NULL),(49,'2018-04-19 19:27:43',4499.00,'pending',NULL,'Giulio',NULL);
/*!40000 ALTER TABLE `purchaseorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rating` (
  `sp_id` int(10) NOT NULL,
  `po_no` int(10) NOT NULL,
  `rates` decimal(2,1) DEFAULT NULL,
  `reviews` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`sp_id`,`po_no`),
  KEY `rating_fk_po_no_idx` (`po_no`),
  KEY `rating_fk_sp_id_idx` (`sp_id`),
  CONSTRAINT `rating_fk_po_no` FOREIGN KEY (`po_no`) REFERENCES `po_details` (`po_no`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `rating_fk_sp_id` FOREIGN KEY (`sp_id`) REFERENCES `po_details` (`sp_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
INSERT INTO `rating` VALUES (1,36,3.0,'Great!!!!'),(1,38,4.0,'xz'),(1,39,5.0,'best smarphone'),(1,40,5.0,'what???'),(1,44,3.0,'bad'),(2,41,5.0,'666'),(2,42,2.0,'aweful');
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shoppingcart`
--

DROP TABLE IF EXISTS `shoppingcart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shoppingcart` (
  `user_id` varchar(45) NOT NULL,
  `sp_id` int(10) NOT NULL,
  `currentQuantity` int(10) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`user_id`,`sp_id`),
  KEY `cart_fk_sp_id_idx` (`sp_id`),
  CONSTRAINT `cart_fk_sp_id` FOREIGN KEY (`sp_id`) REFERENCES `smartphone` (`sp_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `cart_fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shoppingcart`
--

LOCK TABLES `shoppingcart` WRITE;
/*!40000 ALTER TABLE `shoppingcart` DISABLE KEYS */;
/*!40000 ALTER TABLE `shoppingcart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smartphone`
--

DROP TABLE IF EXISTS `smartphone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smartphone` (
  `sp_id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `brand` varchar(45) NOT NULL,
  `currentPrice` decimal(10,2) unsigned NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `detail_image_1` varchar(100) DEFAULT NULL,
  `detail_image_2` varchar(100) DEFAULT NULL,
  `processor` varchar(45) NOT NULL,
  `RAM` varchar(45) NOT NULL,
  `starRating` varchar(45) DEFAULT '0',
  PRIMARY KEY (`sp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smartphone`
--

LOCK TABLES `smartphone` WRITE;
/*!40000 ALTER TABLE `smartphone` DISABLE KEYS */;
INSERT INTO `smartphone` VALUES (1,'iPhone X 256GB','Apple',9688.00,'/images/thumbnail/iphonex.jpg','/images/detail/iphonex_1.jpg','/images/detail/iphonex_2.jpg','A11','3GB','4.0'),(2,'iPhone 8 256GB','Apple',7188.00,'/images/thumbnail/iphone8.jpg','/images/detail/iphone8_1.jpg','/images/detail/iphone8_2.jpg','A11','2GB','3.5'),(3,'iPhone 8 Plus 256GB','Apple',7988.00,'/images/thumbnail/iphone8plus.jpg','/images/detail/iphone8plus_1.jpg','/images/detail/iphone8plus_2.jpg','A11','3GB','0'),(4,'Galaxy Note8 64GB','Samsung',6488.00,'/images/thumbnail/note8.jpg','/images/detail/note8_1.jpg','/images/detail/note8_2.jpg','Snapdragon 835','6GB','0'),(5,'Mate 10 128GB','Huawei',4499.00,'/images/thumbnail/mate10.jpg','/images/detail/mate10_1.jpg','/images/detail/mate10_2.jpg','Kirin 970','6GB','0'),(6,'iPhone X 256GB test','Apple',111.00,'/images/thumbnail/iphonex.jpg','/images/detail/iphonex_1.jpg','/images/detail/iphonex_2.jpg','A11','3GB','0');
/*!40000 ALTER TABLE `smartphone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` varchar(45) NOT NULL,
  `fullname` varchar(45) NOT NULL,
  `email_address` varchar(45) NOT NULL,
  `shipping_address` varchar(100) NOT NULL,
  `password` varchar(45) NOT NULL,
  `type` varchar(45) NOT NULL DEFAULT 'customer',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('afsfdfd','Aasdf','asdf@asdf','asdfasdf','asdfasdf','customer'),('Chris','Chris Zhou','123@123','Room M1223','1234','customer'),('Demi','Demi Hou','p1507862@ipm.edu.mo','Room M1313','abcd','vendor'),('Giulio','Giulio Li','123@123','Room G104','1234','customer'),('hhh','Hhh','hh@hh','hh','111111','customer'),('Tony','Tony Lin','p1507921@ipm.edu.mo','Room G128','1234','customer');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-23 20:06:45
