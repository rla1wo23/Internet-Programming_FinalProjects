-- MySQL dump 10.13  Distrib 8.0.33, for macos11.7 (arm64)
--
-- Host: localhost    Database: project
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `project`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `project`;

--
-- Table structure for table `concert_info`
--

DROP TABLE IF EXISTS `concert_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `concert_info` (
  `concert_id` int NOT NULL AUTO_INCREMENT,
  `artist_id` int DEFAULT NULL,
  `venue_id` int DEFAULT NULL,
  `ticket_id` int DEFAULT NULL,
  `concert_name` varchar(255) DEFAULT NULL,
  `concert_img` varchar(255) DEFAULT NULL,
  `concert_date` date DEFAULT NULL,
  `concert_time` time DEFAULT NULL,
  PRIMARY KEY (`concert_id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `venue_id_idx` (`venue_id`),
  KEY `artist_id_idx` (`artist_id`),
  CONSTRAINT `artist_id` FOREIGN KEY (`artist_id`) REFERENCES `musicians` (`artist_id`),
  CONSTRAINT `ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `ticket_info` (`ticket_id`),
  CONSTRAINT `venue_id` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`venue_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concert_info`
--

LOCK TABLES `concert_info` WRITE;
/*!40000 ALTER TABLE `concert_info` DISABLE KEYS */;
INSERT INTO `concert_info` VALUES (4,5,21000,5,'내한공연',NULL,'2022-04-22','17:43:00'),(5,6,243,6,'단독콘서트',NULL,'2023-06-22','18:20:00'),(6,5,243,5,'Arctic내한',NULL,'2023-06-22','22:35:00'),(7,5,328602234,8,'내한',NULL,'2023-07-08','20:40:00');
/*!40000 ALTER TABLE `concert_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `musicians`
--

DROP TABLE IF EXISTS `musicians`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `musicians` (
  `artist_id` int NOT NULL AUTO_INCREMENT,
  `artist_name` varchar(255) DEFAULT NULL,
  `artist_img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`artist_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `musicians`
--

LOCK TABLES `musicians` WRITE;
/*!40000 ALTER TABLE `musicians` DISABLE KEYS */;
INSERT INTO `musicians` VALUES (5,'ArcticMonkeys',NULL),(6,'김재현',NULL),(7,'김재현',NULL),(8,'인터넷프로그래밍',NULL),(10,'인프',NULL);
/*!40000 ALTER TABLE `musicians` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `note`
--

DROP TABLE IF EXISTS `note`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `note` (
  `note_id` int NOT NULL AUTO_INCREMENT,
  `note_title` varchar(45) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `note_content` longtext,
  `note_upload` datetime DEFAULT NULL,
  PRIMARY KEY (`note_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `note`
--

LOCK TABLES `note` WRITE;
/*!40000 ALTER TABLE `note` DISABLE KEYS */;
INSERT INTO `note` VALUES (23,'크라잉넛 공연 추가해주세요','1','ㅁㅇㄹㄴㄹㅁㄴㅇㅁㄹㅇㄴ','2023-06-15 18:28:13'),(26,'하이테크에서 공연합니다','user4','7월 30일','2023-06-15 18:38:51');
/*!40000 ALTER TABLE `note` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_info`
--

DROP TABLE IF EXISTS `ticket_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_info` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `ticket_price` decimal(10,2) DEFAULT NULL,
  `ticket_corp` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ticket_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_info`
--

LOCK TABLES `ticket_info` WRITE;
/*!40000 ALTER TABLE `ticket_info` DISABLE KEYS */;
INSERT INTO `ticket_info` VALUES (5,80000.00,'Melon'),(6,50000.00,'melon'),(7,80000.00,'Tmon'),(8,120000.00,'melon');
/*!40000 ALTER TABLE `ticket_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `user_id` varchar(255) NOT NULL,
  `user_pw` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `user_birthday` date DEFAULT NULL,
  `user_mail` varchar(255) DEFAULT NULL,
  `user_permission` varchar(255) DEFAULT NULL,
  `user_gender` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES ('1','1234','jaehyun','1998-06-22','rla1wo23@gmail.com','admin','male'),('rla1wo23','Wogusdla1!','r','1998-06-22','asfd','user',NULL),('user1','user1','김하텍','1998-03-03','asdfasdf','user',NULL),('user2','user2','user2','1998-06-22','user2@inha.edu','user',NULL),('user3','user3','user3','1999-09-09','user3@gmail.com','user',NULL),('user4','user4','user4','1998-06-22','user4@inha.edu','user',NULL);
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `venue_id` int NOT NULL AUTO_INCREMENT,
  `venue_name` varchar(255) DEFAULT NULL,
  `venue_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`venue_id`)
) ENGINE=InnoDB AUTO_INCREMENT=328602235 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (243,'clubFF','홍대입구'),(21000,'올림픽홀','관악구'),(32060,'하이테크','인하대학교'),(328602234,'5호관','인하대학교');
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-15 19:11:48
