-- MySQL dump 10.13  Distrib 9.1.0, for macos14 (arm64)
--
-- Host: localhost    Database: animesh
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `budget_installments`
--

DROP TABLE IF EXISTS `budget_installments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budget_installments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `installment_amount` decimal(15,2) DEFAULT NULL,
  `installment_expenditure` decimal(15,2) DEFAULT NULL,
  `amount_received_date` date DEFAULT NULL,
  `utilization_certificate` varchar(255) DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `budget_installments_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget_installments`
--

LOCK TABLES `budget_installments` WRITE;
/*!40000 ALTER TABLE `budget_installments` DISABLE KEYS */;
/*!40000 ALTER TABLE `budget_installments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entity`
--

DROP TABLE IF EXISTS `entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_name` varchar(255) NOT NULL,
  `entity_type` tinyint(1) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entity`
--

LOCK TABLES `entity` WRITE;
/*!40000 ALTER TABLE `entity` DISABLE KEYS */;
INSERT INTO `entity` VALUES (1,'पशुधन विभाग',1,1),(2,'व्यवसायिक शिक्षा',1,1),(3,'स्वास्थ्य विभाग',1,1),(4,'प्राविधिक शिक्षा',1,1),(5,'पर्यटन विभाग',1,1),(6,'चिकित्सा स्वास्थ्य एवं परिवार कल्याण',1,1),(7,'स्वास्थ्य  विभाग अग्निशमन',1,1),(8,'न्याय विभाग',1,1),(9,'कृषि विभाग',1,1),(10,'नगर विकास तथा नगरीय रोजगार एवं गरीबी उन्मूलन',1,1),(11,'स्वास्थ्य  विभाग  IPHL',1,1),(12,'गृह एवं गोपन',1,1),(13,'स्वास्थ्य  विभाग  BPHU',1,1),(14,'सिंचाई, जल संसाधन (जल शक्ति विभाग)',1,1),(15,'शिक्षा विभाग',1,1),(16,'अल्पसंख्यक कल्याण एवं वक्फ',1,1),(17,'कारागार विभाग',1,1),(18,'लोक निर्माण विभाग',1,1),(19,'HITES',2,1),(20,'उ.प्र. राज्य निर्माण सहकारी संध लि. लखनऊ (यू.पी.आर.एन.एस.एस.)',2,1),(21,'उ0 प्र0 प्रोजेक्ट्स कारपोरेशन लि0-16',2,1),(22,'उ.प्र. राज्य सेतु निगम लि.',2,1),(23,'लोक निर्माण विभाग',2,1),(24,'उ0 प्र0 राजकीय निर्माण निगम लि0- भदोही',2,1),(25,'सिंचाई एवं जल संसाधन विभाग',2,1),(26,'उ0 प्र0 राजकीय निर्माण निगम लि0- सोनभद्र इकाई',2,1),(27,'उ0 प्र0 राज्य पर्यटन विकास निगम(( यू0 पी0 एस0 टी0 डी0 सी0)',2,1),(28,'नगर पंचायत - घोसियाबाजार',2,1),(29,'नगर पंचायत - ज्ञानपुर',2,1),(30,'उत्तर प्रदेश जल निगम (RURAL)',2,1),(31,'नगर पंचायत - नईबाजार',2,1),(32,'नगर पंचायत - सुरियावाँ',2,1),(33,'सी० एण्ड डी० एस०',2,1),(34,'उत्तर प्रदेश आवास विकास परिषद निर्माण इकाई',2,1),(35,'उत्तर प्रदेश जल निगम (URBAN)',2,1),(36,'उपायुक्त उद्योग',2,1),(37,' ग्रामीण अभियंत्रण विभाग',2,1),(38,'उत्तर प्रदेश राज्य निर्माण एवं श्रम विकास सहकारी संघ लिमिटेड',2,1);
/*!40000 ALTER TABLE `entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issues`
--

DROP TABLE IF EXISTS `issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `issue_name` varchar(255) DEFAULT NULL,
  `issue_description` text,
  `issue_raised_by` int DEFAULT NULL,
  `issue_raised_date` date DEFAULT NULL,
  `assigned_to` int DEFAULT NULL,
  `issue_reported_on` date DEFAULT NULL,
  `issue_status` varchar(255) DEFAULT NULL,
  `issue_closed_date` date DEFAULT NULL,
  `issue_closed_by` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `issues_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issues`
--

LOCK TABLES `issues` WRITE;
/*!40000 ALTER TABLE `issues` DISABLE KEYS */;
/*!40000 ALTER TABLE `issues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meeting_instructions`
--

DROP TABLE IF EXISTS `meeting_instructions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_instructions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text,
  `date` date DEFAULT NULL,
  `compliance` text,
  `project_id` int DEFAULT NULL,
  `feedback` text,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `meeting_instructions_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meeting_instructions`
--

LOCK TABLES `meeting_instructions` WRITE;
/*!40000 ALTER TABLE `meeting_instructions` DISABLE KEYS */;
INSERT INTO `meeting_instructions` VALUES (1,NULL,NULL,NULL,1,'this is meeting instruction'),(2,NULL,NULL,NULL,2,'अगस्त माह 2024 में धनराशि रू0 1.3611 प्राप्त। (जी-1) भू-तल एवं प्रथम तल का टाइल्स तथा फायर फायटिंग का कार्य प्रगति पर।'),(6,NULL,NULL,NULL,6,'अगस्त माह 2024 में धनराशि रू0 1.3611 प्राप्त। (जी-1) भू-तल एवं प्रथम तल का टाइल्स तथा फायर फायटिंग का कार्य प्रगति पर।');
/*!40000 ALTER TABLE `meeting_instructions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `milestones`
--

DROP TABLE IF EXISTS `milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `milestones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `milestone_name` varchar(255) DEFAULT NULL,
  `milestone_from_date` date DEFAULT NULL,
  `milestone_completion_date` date DEFAULT NULL,
  `milestone_actual_completion_date` date DEFAULT NULL,
  `milestone_status` varchar(255) DEFAULT NULL,
  `milestone_description` text,
  `milestone_progress` decimal(5,2) DEFAULT NULL,
  `delay_reason` varchar(255) DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `milestones_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `milestones`
--

LOCK TABLES `milestones` WRITE;
/*!40000 ALTER TABLE `milestones` DISABLE KEYS */;
INSERT INTO `milestones` VALUES (1,'Phase 1 - Infrastructure Setup',NULL,NULL,NULL,'In Progress','Setup of basic smart city infrastructure',35.50,NULL,6,1),(2,NULL,NULL,NULL,NULL,NULL,NULL,50.00,NULL,6,1);
/*!40000 ALTER TABLE `milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_essential_tests`
--

DROP TABLE IF EXISTS `project_essential_tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_essential_tests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `test_name` varchar(255) DEFAULT NULL,
  `date_of_sample_collection` date DEFAULT NULL,
  `sampling_authority` varchar(255) DEFAULT NULL,
  `sample_test_lab_name` varchar(255) DEFAULT NULL,
  `sample_test_report` varchar(255) DEFAULT NULL,
  `sample_collection_site_images` json DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_essential_tests_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_essential_tests`
--

LOCK TABLES `project_essential_tests` WRITE;
/*!40000 ALTER TABLE `project_essential_tests` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_essential_tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_gallery`
--

DROP TABLE IF EXISTS `project_gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) DEFAULT NULL,
  `image_description` text,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `elevation` decimal(8,2) DEFAULT NULL,
  `accuracy` decimal(8,2) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_gallery_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_gallery`
--

LOCK TABLES `project_gallery` WRITE;
/*!40000 ALTER TABLE `project_gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_inspections`
--

DROP TABLE IF EXISTS `project_inspections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_inspections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inspection_date` date DEFAULT NULL,
  `official_name` varchar(255) DEFAULT NULL,
  `official_email` varchar(255) DEFAULT NULL,
  `official_phone` varchar(15) DEFAULT NULL,
  `official_designation` varchar(255) DEFAULT NULL,
  `official_department` varchar(255) DEFAULT NULL,
  `inspection_type` varchar(255) DEFAULT NULL,
  `inspection_instruction` text,
  `inspection_status` varchar(255) DEFAULT NULL,
  `inspection_report` varchar(255) DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_inspections_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_inspections`
--

LOCK TABLES `project_inspections` WRITE;
/*!40000 ALTER TABLE `project_inspections` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_inspections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(255) NOT NULL,
  `project_status` varchar(50) DEFAULT NULL,
  `project_goal` text,
  `project_department` varchar(255) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `executing_agency` varchar(255) DEFAULT NULL,
  `executing_agency_id` int DEFAULT NULL,
  `scheme` varchar(255) DEFAULT NULL,
  `description` text,
  `fund_sanctioned_by` varchar(255) DEFAULT NULL,
  `concerned_official_name` text,
  `concerned_project_manager` text,
  `project_sanction_date` date DEFAULT NULL,
  `project_financial_approval_go_number` varchar(255) DEFAULT NULL,
  `project_financial_approval_date` date DEFAULT NULL,
  `actual_project_start_date` date DEFAULT NULL,
  `project_completion_date` date DEFAULT NULL,
  `revised_project_sanction_date` date DEFAULT NULL,
  `revised_project_completion_date` date DEFAULT NULL,
  `estimated_completion_date` date DEFAULT NULL,
  `actual_completion_date` date DEFAULT NULL,
  `work_order_formation_date` date DEFAULT NULL,
  `land_handover_date` date DEFAULT NULL,
  `contact_information` int DEFAULT NULL,
  `last_updated_date` datetime DEFAULT NULL,
  `last_updated_date_on_cmis` datetime DEFAULT NULL,
  `project_handover_date` date DEFAULT NULL,
  `project_handover_to` varchar(255) DEFAULT NULL,
  `parallel_requirements` text,
  `total_approved_budget` decimal(15,2) DEFAULT NULL,
  `revised_project_cost` decimal(15,2) DEFAULT NULL,
  `approved_project_cost` decimal(15,2) DEFAULT NULL,
  `contract_date` date DEFAULT NULL,
  `contract_cost` decimal(15,2) DEFAULT NULL,
  `total_released_funds` text,
  `total_expenditure` text,
  `delay_reason` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'District Drug ware house Santravidas Nagar (Bhadohi)','3','District Drug ware house Santravidas Nagar (Bhadohi)','व्यवसायिक शिक्षा',2,'लोक निर्माण विभाग',23,'Sansad Nidhi','District Drug ware house Santravidas Nagar (Bhadohi)','Central Government','District Drug ware house Santravidas Nagar (Bhadohi)','District Drug ware house Santravidas Nagar (Bhadohi)','2024-12-12','----------GO NUMBER --------','2024-12-11','2024-12-20','2024-12-21','2024-12-18','2024-12-14',NULL,'2024-12-26','2024-12-30','2025-01-02',1,NULL,NULL,NULL,NULL,NULL,10000.00,NULL,10000.00,'2024-12-12',10000.00,'10000','10000','this is the delay reason'),(2,'भदोही के सी0एच0सी0 भदोही में 50 शैय्या फील्ड हास्पीटल (ई0सी0आर0पी0-2)','2','भदोही के सी0एच0सी0 भदोही में 50 शैय्या फील्ड हास्पीटल (ई0सी0आर0पी0-2)','चिकित्सा स्वास्थ्य एवं परिवार कल्याण',6,'उ.प्र. राज्य निर्माण सहकारी संध लि. लखनऊ (यू.पी.आर.एन.एस.एस.)',20,'Others','भदोही के सी0एच0सी0 भदोही में 50 शैय्या फील्ड हास्पीटल (ई0सी0आर0पी0-2)','Both Central & State Government',NULL,NULL,'2024-12-19','----------GO NUMBER --------','2024-12-11','2024-12-12','2024-12-13','2024-12-18','2024-12-12',NULL,'2024-12-25','2024-12-24','2024-12-25',1,NULL,NULL,NULL,NULL,NULL,3.05,NULL,3.05,'2024-12-11',2.22,'2.88','2.16','this is the delay reason'),(6,'भदोही के सी0एच0सी0 भदोही में 50 शैय्या फील्ड हास्पीटल (ई0सी0आर0पी0-2)','2','भदोही के सी0एच0सी0 भदोही में 50 शैय्या फील्ड हास्पीटल (ई0सी0आर0पी0-2)','चिकित्सा स्वास्थ्य एवं परिवार कल्याण',6,'उ.प्र. राज्य निर्माण सहकारी संध लि. लखनऊ (यू.पी.आर.एन.एस.एस.)',20,'Others','भदोही के सी0एच0सी0 भदोही में 50 शैय्या फील्ड हास्पीटल (ई0सी0आर0पी0-2)','Both Central & State Government',NULL,NULL,'2024-12-19','----------GO NUMBER --------','2024-12-11','2024-12-12','2024-12-13','2024-12-18','2024-12-12',NULL,'2024-12-25','2024-12-24','2024-12-25',1,NULL,NULL,NULL,NULL,NULL,3.05,NULL,3.05,'2024-12-11',2.22,'2.88','2.16','this is the delay reason');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_phone` varchar(15) DEFAULT NULL,
  `user_designation` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_role` tinyint(1) DEFAULT NULL,
  `entity_id` int DEFAULT NULL,
  `entity_name` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-08 17:36:25
