-- MySQL dump 10.13  Distrib 8.0.35, for Win64 (x86_64)
--
-- Host: localhost    Database: hospitaldb
-- ------------------------------------------------------
-- Server version	8.0.35

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
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospitals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitals`
--

LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
INSERT INTO `hospitals` VALUES (1,'Apollo Hospitals','2024-05-22 20:58:04',NULL),(2,'Jawaharlal Nehru Medical College and Hospital','2024-05-22 20:58:04',NULL),(3,'Indira Gandhi Institute of Medical Sciences (IGIMS)','2024-05-22 20:58:04',NULL),(4,'AIIMS - All India Institute Of Medical Science','2024-05-22 20:58:04',NULL);
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `psychiatristId` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `psychiatristId` (`psychiatristId`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`psychiatristId`) REFERENCES `psychiatrists` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,'Jared Ondricka','4451 Rosalia Prairie','Nona.Reinger7@yahoo.com','0666311406','1K9mKwqHkMTUx7R','photo.jpg',1,'2024-05-22 20:58:04',NULL),(2,'Brooke Schamberger','9344 Schoen Prairie','Gladyce.Brekke28@gmail.com','4789604373','9XQSGekcGq2LDEa','photo.jpg',1,'2024-05-22 20:58:04',NULL),(3,'Casey Champlin III','3908 Stephon Drive','Jacynthe6@gmail.com','9286067489','bClmeIxQo7ESbHT','photo.jpg',1,'2024-05-22 20:58:04',NULL),(4,'Winifred Moen I','695 Gavin Lake','Abbey.Hamill13@hotmail.com','5882528521','OSt4zWfPG_8KeWT','photo.jpg',1,'2024-05-22 20:58:04',NULL),(5,'Derek Collins','99136 Ewell Union','Caroline.Reinger88@gmail.com','4035990840','j3AHOgvvjhJPRCa','photo.jpg',1,'2024-05-22 20:58:04',NULL),(6,'Carlos Bogan','6090 Cheyenne Creek','Wilmer67@yahoo.com','6734054732','bOdYOwto8pEESGv','photo.jpg',2,'2024-05-22 20:58:04',NULL),(7,'Ryan Waters','289 Tillman Terrace','Dante.Schoen52@gmail.com','0153375068','9P5zR5fV8SITFza','photo.jpg',2,'2024-05-22 20:58:04',NULL),(8,'Mae Runolfsdottir','44755 Geraldine Drive','Ezekiel64@hotmail.com','1434349472','PFdVXYQ1j4rSUhA','photo.jpg',2,'2024-05-22 20:58:04',NULL),(9,'Larry Lubowitz','6761 Halvorson Route','Caterina_West27@gmail.com','4696776932','w8BcSpFNkAoTJcX','photo.jpg',2,'2024-05-22 20:58:04',NULL),(10,'Ginger Gulgowski','3744 Vivienne Glens','Carley.Bailey@yahoo.com','6815523760','q3Xl_gcnq_QmNPS','photo.jpg',2,'2024-05-22 20:58:04',NULL),(11,'Gregory Gaylord','7695 Dickens Shoals','Kirk83@gmail.com','9870854459','dvFJ5J8pzvWM7CP','photo.jpg',3,'2024-05-22 20:58:04',NULL),(12,'Maurice Kling V','41908 Howell Islands','Nyah_Huel@gmail.com','7406233588','5VsusPi3zFVkjTy','photo.jpg',3,'2024-05-22 20:58:04',NULL),(13,'Joey Simonis','32788 West Union','Tom.Moore@gmail.com','2987964474','6MUpc0sqd45QJfZ','photo.jpg',3,'2024-05-22 20:58:04',NULL),(14,'Marguerite Jenkins','41033 Flatley Brooks','Everette_Skiles70@hotmail.com','9150476292','ibkyAoeU2CRPFn1','photo.jpg',3,'2024-05-22 20:58:04',NULL),(15,'Leonard Swaniawski IV','3939 Rohan Junction','Maurice.Borer@gmail.com','1487033803','Dc1R4ZGp0dKtLS0','photo.jpg',3,'2024-05-22 20:58:04',NULL),(16,'Tommy Cormier','077 Johnson Way','Zoe_Morissette@yahoo.com','9522225853','kvJycvhcFslD0xT','photo.jpg',4,'2024-05-22 20:58:04',NULL),(17,'Dennis Brown','293 Dustin Circle','Orlo77@hotmail.com','1785270556','31_rnqhCZUOHf0T','photo.jpg',4,'2024-05-22 20:58:04',NULL),(18,'Emma Bins','227 Jairo Road','Jailyn89@yahoo.com','0777013862','RrVcyzzOOHn4Bve','photo.jpg',4,'2024-05-22 20:58:04',NULL),(19,'Cory Cremin','905 Johns Overpass','Felipa.Bahringer@hotmail.com','9991362501','dA7oOcC5Z_A5G8J','photo.jpg',4,'2024-05-22 20:58:04',NULL),(20,'Dr. Gilberto Morissette','806 Gilberto Prairie','Kaia_Bosco@hotmail.com','6404500016','Yto9uycnhA7bJvZ','photo.jpg',4,'2024-05-22 20:58:04',NULL),(21,'Dianna Kirlin','38210 Luna Light','Benton_Huel@gmail.com','4373879200','MhXfXPUzMCvY_mH','photo.jpg',4,'2024-05-22 20:58:04','2024-05-22 21:07:10'),(22,'Gary Gusikowski','2626 Gerry Extensions','Dena33@hotmail.com','4590810402','gFs9_k2dKVO52bi','photo.jpg',5,'2024-05-22 20:58:04',NULL),(23,'Seth Jacobson','7368 Howe Rue','Christopher41@gmail.com','9038426542','kWXj5EIcN9KmoaI','photo.jpg',5,'2024-05-22 20:58:04',NULL),(24,'John Haag','007 Schumm Knolls','Edwina.Rowe@yahoo.com','8946489377','0mrJZ8J_oRoQZGn','photo.jpg',5,'2024-05-22 20:58:04',NULL),(25,'Lionel Bosco','95783 Reynolds Lane','Nicola.Nicolas8@hotmail.com','7600705025','WBnRAhf8nkaKN8k','photo.jpg',5,'2024-05-22 20:58:04',NULL),(26,'Jodi Hagenes','890 White Corner','Wilfrid_Jacobson98@yahoo.com','5898968140','M9cp5FAmHJ5Qmaw','photo.jpg',6,'2024-05-22 20:58:04',NULL),(27,'Aubrey Crooks','343 Martin Key','Dee_Weissnat19@gmail.com','7981864051','kepgDFsXAcuaNcQ','photo.jpg',6,'2024-05-22 20:58:04',NULL),(28,'Marsha Lynch','08950 Gloria Fields','Halle_Lakin30@yahoo.com','7038242832','LQ7nB8xt6MTvkBR','photo.jpg',6,'2024-05-22 20:58:04',NULL),(29,'Jenna Goldner','65064 Ubaldo Shore','Candace.Erdman@yahoo.com','6623186351','2HW4tjNOB9xTTwz','photo.jpg',6,'2024-05-22 20:58:04',NULL),(30,'Miss Troy Corkery','637 Margaretta Place','Cierra_Gerlach1@yahoo.com','4972478524','HjDZuARL3M0EqV3','photo.jpg',6,'2024-05-22 20:58:04',NULL),(31,'Garry Pfeffer','94899 Irma Common','Adrianna.Anderson21@yahoo.com','5708980397','6sDe0oWnlA_D7mP','photo.jpg',7,'2024-05-22 20:58:04',NULL),(32,'Joshua Mitchell','76317 Adelia Mountain','Talia_Goldner@gmail.com','2302034038','PaDgFJPSgw9D287','photo.jpg',7,'2024-05-22 20:58:04',NULL),(33,'Heidi Legros','04588 Flatley Islands','Kelsi.Robel57@gmail.com','7311256047','SmLqdhi5Uc8hNw5','photo.jpg',7,'2024-05-22 20:58:04',NULL),(34,'Jasmine Altenwerth MD','30255 Conn Roads','Darion.Runte@yahoo.com','3158201468','YgEKBCtH0iIgOaS','photo.jpg',7,'2024-05-22 20:58:04',NULL),(35,'Sue Upton MD','74107 Brakus Rest','Jacey_Marvin@hotmail.com','4807542187','UTtntBA0cBibFZ6','photo.jpg',7,'2024-05-22 20:58:04',NULL),(36,'Flora Huels','0630 Nicklaus Mountain','Santa_Bashirian@hotmail.com','9571209865','OjSNqPXd_jGaE_P','photo.jpg',8,'2024-05-22 20:58:04',NULL),(37,'Tim O\'Reilly','520 Noemie Hill','Howard72@yahoo.com','6159971232','kf6ZiFfzffFnKgo','photo.jpg',8,'2024-05-22 20:58:05',NULL),(38,'Eugene Adams','809 Nicolas Ridge','Enid78@yahoo.com','3133608541','xOi9WIut37not1m','photo.jpg',8,'2024-05-22 20:58:05',NULL),(39,'Faith Graham','443 Kunde Harbor','Immanuel.Stracke@yahoo.com','8294459632','qikVkcJFq1WoFAQ','photo.jpg',8,'2024-05-22 20:58:05',NULL),(40,'Judith Crooks DVM','538 Crooks Neck','Sigmund_Berge@gmail.com','8559125817','TKEklG9TTDErqU8','photo.jpg',8,'2024-05-22 20:58:05',NULL),(41,'Minnie Kuhic','62466 Tobin Forks','Bertrand_Mills27@yahoo.com','5921385619','WbeYd7A31uk8T66','photo.jpg',9,'2024-05-22 20:58:05',NULL),(42,'Mark Wintheiser','472 Diana Harbor','Mozell_Steuber91@gmail.com','9790608290','ZOb6PRqwWOxfWxm','photo.jpg',9,'2024-05-22 20:58:05',NULL),(43,'Tommie Bradtke','045 Cormier Burg','Merle.Fay80@gmail.com','5288822330','QhgX4V6l9SuYUzh','photo.jpg',9,'2024-05-22 20:58:05',NULL),(44,'Frederick Harvey','142 Giovanny Shore','Nick_Rice46@yahoo.com','6813021148','leq5hXsnumNNs1_','photo.jpg',9,'2024-05-22 20:58:05',NULL),(45,'Virginia Bayer','696 Ziemann Key','Norwood.Champlin@hotmail.com','0770204177','n8UazL8AwMBUyV9','photo.jpg',9,'2024-05-22 20:58:05',NULL),(46,'Jaime Klocko','917 Tyrell Place','Abbey_Thompson53@yahoo.com','4198023944','jwQiS6ktKoPn_nj','photo.jpg',10,'2024-05-22 20:58:05',NULL),(47,'Pauline Cole','972 Rau Parks','Zoe94@gmail.com','2572465687','H_UyLlvGot7tqIJ','photo.jpg',10,'2024-05-22 20:58:05',NULL),(48,'Juanita Bartell','2484 Ryan Plaza','Joana.Sipes@gmail.com','3823139455','XgTV1yU4jg5I8EC','photo.jpg',10,'2024-05-22 20:58:05',NULL),(49,'Dustin Sporer','58689 Wyman Mountains','Dillan.Grady15@hotmail.com','7725051859','MgXY4kTqiqG9jpx','photo.jpg',10,'2024-05-22 20:58:05',NULL),(50,'Michele Swift','1707 Misty Camp','Fatima.Herzog@yahoo.com','6298482798','BbgjvNMaD1O3xta','photo.jpg',10,'2024-05-22 20:58:05',NULL),(51,'Shannon Davis','607 Marjorie Tunnel','Delores96@gmail.com','6157747763','5lYirmuD4YSWIMc','photo.jpg',11,'2024-05-22 20:58:05',NULL),(52,'Jaime Sauer','1208 Kirsten Via','Morton90@hotmail.com','4132555402','hfpskNj5FrWMOu7','photo.jpg',11,'2024-05-22 20:58:05',NULL),(53,'Dr. Angel Lehner','33578 Cole Valleys','Sheldon22@hotmail.com','8471726136','Wje3TOq5TFXobWk','photo.jpg',11,'2024-05-22 20:58:05',NULL),(54,'Glenn Schaefer','353 Tamara Knolls','Alphonso.Wilkinson3@gmail.com','7451466357','g_YQMsYvyqvST_Q','photo.jpg',11,'2024-05-22 20:58:05',NULL),(55,'Trevor Rice','07309 Jacobs Keys','Lucy.Rice@gmail.com','3719089544','_wv9jANfM7B28Xx','photo.jpg',11,'2024-05-22 20:58:05',NULL),(56,'Eddie Pfeffer','893 Frances Pike','Michael_Rolfson@gmail.com','3619340362','GgLelptYFHXau3R','photo.jpg',12,'2024-05-22 20:58:05',NULL),(57,'Amy Fay','12914 Barton Motorway','Tre_Collier58@gmail.com','4293783718','nGLc9lbD4KE8D2y','photo.jpg',12,'2024-05-22 20:58:05',NULL),(58,'Marie O\'Keefe','44958 Ulices Parkways','Karlee.Ziemann81@gmail.com','2126372077','3JTSX1xTRBv4lTG','photo.jpg',12,'2024-05-22 20:58:05',NULL),(59,'Dr. Loren Schiller','10057 Schultz Cape','Bethel_Haag@gmail.com','7584613811','nnbZQPjCiIzhElA','photo.jpg',12,'2024-05-22 20:58:05',NULL),(60,'Virgil Veum','8598 Buckridge Gardens','Euna.McGlynn11@gmail.com','6661874312','h18Z3nUeaMilRMV','photo.jpg',12,'2024-05-22 20:58:05',NULL),(61,'Grady Fadel','98589 Garett Mission','Barry.Parker28@yahoo.com','0393477746','GIad7s9xHTRvxLH','photo.jpg',13,'2024-05-22 20:58:05',NULL),(62,'Allen West','813 Powlowski Divide','Litzy_Harber@gmail.com','2506513893','08b0mMUSUIfSsls','photo.jpg',13,'2024-05-22 20:58:05',NULL),(63,'Karen West','113 Dorthy Place','Trisha.Smitham41@yahoo.com','2573957827','i0yQzrvwypadFAx','photo.jpg',13,'2024-05-22 20:58:05',NULL),(64,'Estelle Ankunding','1924 Jackeline Groves','Russ.Kling@yahoo.com','5404505366','ZOE42mvGiXrU0Kr','photo.jpg',13,'2024-05-22 20:58:05',NULL),(65,'Mrs. Winston Feil','2348 Grady Island','Serenity.Marquardt@yahoo.com','6427242206','a9SXui3Fr9IZ_gh','photo.jpg',13,'2024-05-22 20:58:05',NULL),(66,'Jody Runolfsson','58263 Weber Loop','Florencio_Kovacek64@hotmail.com','1499788658','63yIrdD3RsUghkd','photo.jpg',14,'2024-05-22 20:58:05',NULL),(67,'Tara Bergstrom','341 Hoeger River','Margarett_Ondricka79@gmail.com','0755444583','cNHaZKM0sbYDf4G','photo.jpg',14,'2024-05-22 20:58:05',NULL),(68,'Dr. Ebony Zulauf','6097 Braun Knolls','Abraham_Jacobs18@gmail.com','8897771810','MYHo5CKVoXrDC_c','photo.jpg',14,'2024-05-22 20:58:05',NULL),(69,'Freda Tromp','156 Harvey Stream','Miguel_Stroman@hotmail.com','8891928742','6WSIK_2BTdcQ8UX','photo.jpg',14,'2024-05-22 20:58:05',NULL),(70,'Clarence Gibson','08343 Effertz Stream','Brice5@yahoo.com','0245535575','08n2fvJdtyEVH6D','photo.jpg',14,'2024-05-22 20:58:05',NULL),(71,'Scott Grady','665 Kiehn Via','Florine_Abernathy76@yahoo.com','4267435108','KT73ZzonJTNWfA4','photo.jpg',15,'2024-05-22 20:58:05',NULL),(72,'Kristie Medhurst','20302 Tamia Drive','Geraldine68@yahoo.com','5166132442','K4VEsl1Y4SBZwTW','photo.jpg',15,'2024-05-22 20:58:05',NULL),(73,'Beatrice Hills','5505 Elton Orchard','Natalia.Conn@hotmail.com','4226744557','VCAAyoj27zbisx7','photo.jpg',15,'2024-05-22 20:58:05',NULL),(74,'Preston Murphy DVM','601 Damaris Ways','Frida35@hotmail.com','7235067144','dHkUc_mXRSnp5qJ','photo.jpg',15,'2024-05-22 20:58:05',NULL),(75,'Kelvin Grant','65989 Rutherford Pass','Avis.Erdman89@yahoo.com','5856330663','YcYPTHNUOqXrWj7','photo.jpg',15,'2024-05-22 20:58:05',NULL),(76,'Jacob Strosin','0561 Russel Spurs','Ressie_Lehner@gmail.com','3165098605','kRQh3ai87ZyIV8v','photo.jpg',16,'2024-05-22 20:58:05',NULL),(77,'Mrs. Alexandra Becker','687 Mraz Street','Russ_Hammes@gmail.com','2858968431','S1nxn76rdWKJbrX','photo.jpg',16,'2024-05-22 20:58:05',NULL),(78,'Virgil Hane','0420 Bennett Valleys','Lulu.Rogahn@hotmail.com','1102604988','oJnJ4m8Emoai4lu','photo.jpg',16,'2024-05-22 20:58:05',NULL),(79,'Maggie Mitchell','8530 Litzy Station','Brennan.Rowe@gmail.com','2655806517','p_q7uDqmvLpD8_E','photo.jpg',16,'2024-05-22 20:58:05',NULL),(80,'Krista Pacocha','4508 Berge Way','Laney93@gmail.com','5979803737','aebaFypPckXyaIZ','photo.jpg',16,'2024-05-22 20:58:05',NULL),(81,'Reginald Wilderman','9160 Pearlie Squares','Jade66@yahoo.com','8857383448','Tabh1AfPjbs0Vkl','photo.jpg',17,'2024-05-22 20:58:05',NULL),(82,'Edgar Paucek','46873 Lily Square','Santina.Gaylord78@hotmail.com','4794365224','jaKmPaeV3xx4evf','photo.jpg',17,'2024-05-22 20:58:05',NULL),(83,'Miss Caleb Hilpert','2668 Davin Mills','Nyasia_Gutmann88@gmail.com','8127754028','P7o46VKZnibNTzv','photo.jpg',17,'2024-05-22 20:58:05',NULL),(84,'Guadalupe Legros','55366 Quitzon Crest','Savanna_Beatty13@hotmail.com','5642189818','pGPgt4eP1Feo74K','photo.jpg',17,'2024-05-22 20:58:05',NULL),(85,'Maryann Hessel','94678 Hannah Walk','Erick.Satterfield49@hotmail.com','3734458624','aUUveITNTsQAHPD','photo.jpg',17,'2024-05-22 20:58:05',NULL),(86,'Guadalupe Nitzsche V','116 Carroll Expressway','Hunter21@yahoo.com','4535374240','Y6mwB_4bSFu8DgC','photo.jpg',18,'2024-05-22 20:58:05',NULL),(87,'Esther Vandervort','417 Johns Union','Pedro.Graham@hotmail.com','4476980785','IqdgRjQwVwxk71W','photo.jpg',18,'2024-05-22 20:58:05',NULL),(88,'Mrs. Lora Romaguera','26799 Uriah Forge','Noemie_Nienow@hotmail.com','3948738474','DGMvgur5V6HB8I_','photo.jpg',18,'2024-05-22 20:58:05',NULL),(89,'Iris Hilpert','675 Romaine Garden','Alexane.Stiedemann@gmail.com','3858367640','zAdMfiWlJzSXsSO','photo.jpg',18,'2024-05-22 20:58:05',NULL),(90,'Miss Rudy Kovacek','7902 Daniela Vista','Paolo18@gmail.com','2683442789','PBlJEvStIjxT6lt','photo.jpg',18,'2024-05-22 20:58:05',NULL),(91,'Andres Franecki','20680 Leffler Locks','Leo.Ritchie@gmail.com','3340791562','B5vNjN9kOyPlI0e','photo.jpg',19,'2024-05-22 20:58:05',NULL),(92,'Lance Mante','595 Estrella Course','Audrey.Howe13@gmail.com','4596676701','Q49ZiS6q95ZXXuM','photo.jpg',19,'2024-05-22 20:58:05',NULL),(93,'Jonathon Jacobi','7928 Conn Prairie','Timmothy_Witting@gmail.com','8320597198','vk_Wljy2B_cOJs2','photo.jpg',19,'2024-05-22 20:58:05',NULL),(94,'Dominick Gottlieb','3129 Sporer Throughway','Miller.Pagac@gmail.com','3212999592','9yKD6pC6cxaMvbj','photo.jpg',19,'2024-05-22 20:58:05',NULL),(95,'Clint Hand','9456 Hintz Throughway','Leopold.Ryan52@gmail.com','7386019530','qAbZxVohCVANByZ','photo.jpg',19,'2024-05-22 20:58:05',NULL),(96,'Franklin Beier','198 Strosin Vista','Ezekiel16@gmail.com','0995436153','LSNalLohJ_lfAQ7','photo.jpg',20,'2024-05-22 20:58:05',NULL),(97,'Kenneth Hegmann','532 Runolfsson Hills','Ada.Paucek6@yahoo.com','5280558209','S2C7NoKb_tTsbfl','photo.jpg',20,'2024-05-22 20:58:05',NULL),(98,'Emily Nader','11209 Cara Valleys','Elvis.Buckridge@gmail.com','8554419413','TwQy9cCr7koiTwH','photo.jpg',20,'2024-05-22 20:58:05',NULL),(99,'Robert Rice','4142 Frankie Extension','Celestino_Greenfelder59@yahoo.com','9053540847','SJZpZlZyT6AFm5q','photo.jpg',20,'2024-05-22 20:58:05',NULL),(100,'Brandi Schmidt','48031 Thompson Plaza','Grayce_Hermiston@hotmail.com','1979612556','Y0hVcZi5ErekcEH','photo.jpg',20,'2024-05-22 20:58:05',NULL),(103,'jackie','123 Main Street, City, Country','john.doe@example.com','+918423652938','$2b$10$ghJM5cbyJAOn99cpwmAgluWl47w6GI9bqtNxWlhKaB1V8RRec9zna','src\\uploads\\jackie-3-.jpeg',3,'2024-05-22 21:11:29',NULL);
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `psychiatrists`
--

DROP TABLE IF EXISTS `psychiatrists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `psychiatrists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `hospitalId` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `hospitalId` (`hospitalId`),
  CONSTRAINT `psychiatrists_ibfk_1` FOREIGN KEY (`hospitalId`) REFERENCES `hospitals` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `psychiatrists`
--

LOCK TABLES `psychiatrists` WRITE;
/*!40000 ALTER TABLE `psychiatrists` DISABLE KEYS */;
INSERT INTO `psychiatrists` VALUES (1,'Kayla Lakin',1,'2024-05-22 20:58:04',NULL),(2,'Marsha Rowe',1,'2024-05-22 20:58:04',NULL),(3,'Emanuel Bergstrom',1,'2024-05-22 20:58:04',NULL),(4,'Essie Satterfield',1,'2024-05-22 20:58:04',NULL),(5,'Dexter Dicki',1,'2024-05-22 20:58:04',NULL),(6,'Lucy Brakus',2,'2024-05-22 20:58:04',NULL),(7,'Elaine Kunde MD',2,'2024-05-22 20:58:04',NULL),(8,'Judy Marquardt',2,'2024-05-22 20:58:04',NULL),(9,'Joanna Mosciski',2,'2024-05-22 20:58:04',NULL),(10,'Kevin Hauck',2,'2024-05-22 20:58:04',NULL),(11,'Myron Koss',3,'2024-05-22 20:58:04',NULL),(12,'Kelley Goyette',3,'2024-05-22 20:58:04',NULL),(13,'Mrs. Rufus Osinski',3,'2024-05-22 20:58:04',NULL),(14,'Miss Rodney Lesch',3,'2024-05-22 20:58:04',NULL),(15,'Helen Cremin',3,'2024-05-22 20:58:04',NULL),(16,'Edwin Little',4,'2024-05-22 20:58:04',NULL),(17,'Allen Schinner',4,'2024-05-22 20:58:04',NULL),(18,'Eleanor Batz I',4,'2024-05-22 20:58:04',NULL),(19,'Frederick Prohaska',4,'2024-05-22 20:58:04',NULL),(20,'Mae Grimes',4,'2024-05-22 20:58:04',NULL);
/*!40000 ALTER TABLE `psychiatrists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-23  2:47:02
