-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 17/03/2025 às 15:28
-- Versão do servidor: 10.4.20-MariaDB
-- Versão do PHP: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `bd_assistencia`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `componentes`
--

CREATE TABLE `componentes` (
  `id_comp` int(11) NOT NULL,
  `nome_comp` varchar(25) CHARACTER SET utf8mb4 NOT NULL,
  `descr_comp` varchar(60) CHARACTER SET utf8mb4 DEFAULT NULL,
  `modulo_comp` int(11) NOT NULL,
  `gaveta_comp` int(11) NOT NULL,
  `divi_comp` int(11) NOT NULL,
  `datash_comp` varchar(100) CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `componentes`
--

INSERT INTO `componentes` (`id_comp`, `nome_comp`, `descr_comp`, `modulo_comp`, `gaveta_comp`, `divi_comp`, `datash_comp`) VALUES
(2, '74AC00', '74AC00', 5, 1, 1, NULL),
(3, '74AC04', '74AC04', 5, 1, 2, NULL),
(4, '74AHC04', '74AHC04', 5, 1, 3, NULL),
(5, '74AC08', '74AC08', 5, 1, 4, NULL),
(6, '74HCT08', '74HCT05', 5, 1, 5, NULL),
(7, '74AC32', '74AC32', 5, 1, 6, NULL),
(8, '74HC32MTX FINO', '74HC32MTX FINO', 5, 1, 1, NULL),
(9, '74AC138', '74AC138', 5, 2, 2, NULL),
(10, '74ACT138', '74ACT138', 5, 2, 3, NULL),
(11, '74ACT04', '74ACT04', 5, 2, 4, NULL),
(12, '74AHC125', '74AHC125', 5, 2, 5, NULL),
(13, '74HCT125', '74HCT125', 5, 2, 6, NULL),
(14, '74HC541', '74HC541', 5, 3, 1, NULL),
(15, '74HC573', '74HC573', 5, 3, 2, NULL),
(16, '74HCT573', '74HC573', 5, 3, 3, NULL),
(17, '74HC393', '74HC393', 5, 3, 4, '74HC93,74HCT93.pdf'),
(18, '74HC237', '74HC237', 5, 3, 4, NULL),
(19, '74ACT08', '74ACT08', 5, 3, 6, NULL),
(20, '74VHC274', '74VHC274', 5, 4, 1, NULL),
(21, '74VHC257', '74VHC257', 5, 4, 2, NULL),
(22, '74HCT245', '74HCT245 FINO', 5, 4, 3, NULL),
(23, '74HC86', '74HC86', 5, 4, 4, NULL),
(24, '74HC595', '74HC595', 5, 4, 5, NULL),
(25, '74HC4060', '74HC4060', 5, 4, 6, NULL),
(26, '2N7002', '2N7002 MOSFET PRIX', 5, 5, 1, NULL),
(28, 'BQ24103', 'BQ24103 FONTE TI400', 5, 5, 3, NULL),
(29, 'BD42452', 'BD42452 RESET PRIX', 5, 5, 4, NULL),
(30, 'DS24019', 'DS24019 CHIP CELULA TOLEDO', 5, 5, 5, NULL),
(31, 'IL217D', 'IL217D FONTE TI400', 5, 5, 6, NULL),
(32, 'NTP1217D', 'NTP1217 FONTE TI400', 5, 5, 2, NULL),
(33, 'FQD1106P', 'FQD1106P', 5, 6, 1, NULL),
(34, '1.5KE200', '1.5KE200 FONTE UNO', 6, 6, 2, NULL),
(35, 'MRG856R', 'MGR856G FONTE UNO', 5, 6, 2, NULL),
(36, 'RESISTOR 15R 2W', 'RESISTOR 15R 2W', 5, 6, 6, NULL),
(37, '80C32 PLCC', '80C32PLCC', 5, 7, 1, NULL),
(38, 'CY27C010 PLCC', 'CY27C010 PLCC', 5, 7, 2, NULL),
(39, '74LS07 DIP14', '74LS07 DIP17', 5, 7, 3, NULL),
(40, 'M29F040B', 'M29F040B', 5, 7, 4, NULL),
(41, '27C1001', '27C1001 PLCC', 5, 7, 5, NULL),
(42, 'AM29F010', 'AM29F010 PLCC', 5, 7, 6, NULL),
(43, 'RESISTOR 10R SMD', 'RESISTOR 10R SMD', 6, 8, 1, NULL),
(44, 'RESISTOR 150R SMD', 'RESISTOR 150R SMD', 6, 8, 3, NULL),
(45, 'RESISTOR 100R SMD', 'RESISTOR 100R SMD', 5, 8, 4, NULL),
(46, 'INDUTOR 2.2 SMD', 'INDUTOR S.S SMD CELULA PLATIAN', 6, 8, 5, NULL),
(47, 'INDUTOR PRIX4 N', 'INDUTOR PRIX4 N', 5, 8, 6, NULL),
(48, 'CAPACITOR 1UF SMD', 'CAPACITOR 1UF SMD', 5, 10, 1, NULL),
(49, 'CAPACITOR 10UF SMD', 'CAPACITOR 10UF SMD', 5, 10, 2, NULL),
(50, 'CAPACITOR 100UF SMD', 'CAPACITOR 100UF SMD', 5, 10, 3, NULL),
(51, 'CAPACITOR 100K SMD', 'CAPACITOD 100K SMD', 5, 10, 4, NULL),
(52, 'CAPACITOR 220PF SMD', 'CAPACITOR 220PF SMD CELULA TOLEDO', 5, 9, 1, NULL),
(53, 'CAPACITOR 22PF SMD', 'CAPACITOR 22PF SMD CELULA TOLEDO', 5, 9, 2, NULL),
(54, 'CAPACITOR 30PF SMD', 'CAPACITOR 30PF SMD', 5, 9, 3, NULL),
(55, 'CAPACITOR 6.8PF', 'CAPACITOR 6.8PF', 5, 9, 4, NULL),
(56, 'CAPACITOR 47NF', 'CAPACITOR 47NF', 5, 9, 5, NULL),
(57, 'CAPACITOR 30NF SMD', 'CAPACITOR 30NF SMD', 5, 9, 6, NULL),
(58, '74ACT00', '74ACT00', 7, 9, 1, NULL),
(59, 'PCF8563T', 'PCF8562T RELOGIO TOLEDO', 7, 9, 2, NULL),
(60, 'BD6384T', 'BD6384T MOTOR DA UNO', 7, 9, 3, NULL),
(61, 'BD63877', 'BD63877 MOTOR DA PRIX6', 7, 9, 4, NULL),
(62, 'CS89000A', 'CS8900A REDE TOLEDO WEB', 7, 9, 5, NULL),
(63, '7673', '7673 BATERIA PRIX4 N', 7, 9, 6, NULL),
(64, '74HCT00', '74HCT00', 0, 5, 1, NULL),
(65, '89G668HB', 'ALFA 89G668', 0, 5, 2, NULL),
(66, 'MC95512', 'ALFA 95512', 69, 5, 3, NULL),
(67, 'MCP1700 3V3', 'TRIUNFO REGULADOR 3V3', 0, 5, 4, NULL),
(68, 'MCP1700 5V', 'TRIUNFO REGULADOR 5V', 0, 5, 5, NULL),
(69, 'KSZ8081', 'REDE UNO NOVA KSZ8081', 0, 5, 6, NULL),
(70, 'CAPACITOR 22NF SMD', 'CAPACITOR 22NF SMD', 5, 10, 5, NULL),
(71, 'teste', 'teste', 3, 3, 3, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `defeitos`
--

CREATE TABLE `defeitos` (
  `id_defeito` int(11) NOT NULL,
  `id_placa_fk` int(11) NOT NULL,
  `versao_fk` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `nome_defeito` varchar(120) CHARACTER SET utf8mb4 NOT NULL,
  `analise_defeito` text CHARACTER SET utf8mb4 DEFAULT NULL,
  `solucao_defeito` text CHARACTER SET utf8mb4 NOT NULL,
  `img_defeito` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `dikas_fk` text CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `defeitos`
--

INSERT INTO `defeitos` (`id_defeito`, `id_placa_fk`, `versao_fk`, `nome_defeito`, `analise_defeito`, `solucao_defeito`, `img_defeito`, `dikas_fk`) VALUES
(1, 1, 'RV2', 'Perdendo dados , após reiniciar', 'ainda nap', 'sim', NULL, 'ghgfhgffgghfgh  \r\n gggggggg\r\ndia 1 fez1'),
(2, 1, 'RV2', 'Nao comunica', 'nao cumunicA  PINOS DO 75176  1 2 3 VAI PARA 8 DO 74HC04', '31/03/23 memoria  ***\r\n26/03/23 ESTAVA EM CURTO O PINO 3 MAS O CURTO ERA SOLDA EM BAIXO DO CONECTOR DA CONEXAO TTL  RADIOTIBBO PI WIFI', NULL, 'ghgfhgffgghfgh  \r\n gggggggg\r\ndia 1 fez1'),
(3, 2, '620000', 'NAO IMPRIMI', 'TEM A TENSAO NO RELE DE ESTADO SOLIDO', 'TROCADO U11 E 13', NULL, 'OS PULSOS DE STROBE É NO U13 HC86 TEM OUTRO U38 PARA VERIFICAR'),
(4, 3, 'vs 2.06', 'Nao Pesa', 'faz a contagem , e não alinha', 'o capacitor c47 ele vai ao pino 10 , pode olhar tambem o outro lado ain1+ e ain1 -', NULL, 'display unico  verificar se tem 7,7v no Q7 so energizado , verificar a falta do Q6 cai facil da placa , o R43 é de 47k'),
(5, 4, '6202275', 'Nao liga , fica tudo 999999', 'Faz a contagem ate 99999 e trava', 'a', NULL, NULL),
(6, 5, '6207237', 'IMPRIMI RISCOS NA VERTICAL - CORTA PARTE DA IMPRESSAO', 'VERIFICADO QUE O U9 74HCT125 ESTAVA TORRADO, VERIFICADOS OS SINAIS DE ENTRADA E SAIDA E NAO TINHA O MOSI0 \r\nELE VEM DIRETO DO PROCESSADOR, DA PARA MEDIR SEM O U9\r\nCORTA PARTE -74HCT273', 'TROCA DO LCP2210 E U9', NULL, '31/03 U9 74HCT125'),
(7, 6, '6206133', 'NAO ATUALIZA A VERSAO', 'VERIFICAR TODO CIRCUITO  OS 3 HCT123', '01/04/23 U11 AC04', NULL, 'DISPLAY COM VALVULA'),
(8, 6, '6206133', 'NAO  COMUNICA', 'VERIFICAR O SINAL DE ENTRADA E SAIDA   (2V 1.00 MS) 6 E 7 ENTRA SINAL E PINO 1 SAI O SINAL, MANDA VERIFICAR A BALANÇA E TEM QUE TER SINAL NOS PINOS TX E RX NA SAIDA  1E3  - PINO 4 ( SCOP3 2V 200US)  VERIFICAR O JP7 POSIÇÃO 2 E3', '01/04/23 MAX485', NULL, 'VERIFICAR O JP7 POSIÇÃO 2 E3'),
(9, 2, '620000', 'VARIAÇÃO DE PESO', 'VERIFICAR OS CAPACITORES DE C36 E C37 10UFX25V mx29f040 funciona', 'U4  TROCA TL431CD', NULL, NULL),
(10, 7, 'REV 6', 'NAO LIGA FICA  BEEP LONGO CADENCIADO E NAO ACENDE DISPLAY E NEM RODA MOTOR', 'VERIFICAR CLOCK - ALIMENTAÇÃO DAS MEMORIAS', 'A', NULL, 'RV2 Q2 LM1951T Q1 vn20A'),
(11, 2, '620000', 'IMPRIMI MUITO FORTE BORRADO', 'efetuado teste nas portas do u13 u38 74hc86', 'U38 74hc86', NULL, 'OS PULSOS DE STROBE É NO U13 HC86 TEM OUTRO U38 PARA VERIFICAR'),
(12, 8, 'TODAS', 'NAO CALIBRA', 'NAO FAZ CONTAGEM  - ESQUENTA O DIODO DA ENTRADA, MEDE NO MULTIMETRO , TEM QUE SAIR 55V SENAO O DIODO TA RUIM', 'TROCA DOS TIP 31 E 32 - DIODO MEDINDO VERTO NO MULTIMENTRO MAS ESTA RUIM', NULL, NULL),
(13, 10, 'RV2', 'NAO IMPRIMI', NULL, 'A', NULL, NULL),
(14, 1, 'RV2', 'CARACTER ESTRANHO , DEPOIS DA INICIALIZAÇÃO', 'INICIALIZA NORMAL MAS APÓS A 0INICIALIZAÇÃO COMEÇA 1235 PULSO + 4 RD', 'OS4 374 373 00 04', NULL, 'ghgfhgffgghfgh  \r\n gggggggg\r\ndia 1 fez1'),
(15, 11, 'RV3', 'IMPRIMI RISCOS NA VERTICAL E NAO ALINHA A ETIQUETA', 'queimou a cabeça , o defeito era 80c32 e nao tinha o pulso peque no pino 15', 'Pino 16 do U15 74hc374 que vai para o Pino 2 do ds1804  defeito era o u15 74hc374, 74HC374 \r\n74hc00 era o defeito.\r\n8c32 pino 7 do conector da cabeça e pino 3 74hc04', NULL, 'scope 2v 5.00ms  barramento 200ns\r\nFORMAS DE ONDA IMPRIMINDO 2V 5.00MS PINOS 5 6 9 12  PULSO + 16 PULSO -  PINO 19 TEM PULSO -, (PINO1 - 11 +) pino 15 tem um forma de onde com menor amplitude'),
(16, 12, '09/03/09', 'PESO MORTO BAIXO', 'CALIBRA E FICA PISCANDO 0.000 - ADS O DEFEITO\r\nPESO MORTO 3333', 'ADS1242', NULL, NULL),
(17, 13, '127', 'NAO LIGA', 'VERIFICAR AS TRILHAS EM BAIXO DOS SOQUETES E LER A X24C01', 'TRILHA QUEBRADA EM BAIXO DO SOQUETE DA MEMORIA', NULL, NULL),
(18, 6, '6206133', 'NAO ACENDE O DISPLAY OPERADOR', NULL, 'A', NULL, 'VERIFICAR O JP7 POSIÇÃO 2 E3'),
(19, 14, '2.02D', 'NAO LIGA , SO ACENDE E APAGA O DISPLAY', 'VEIO COM O REGULADOR U17 QUEIMADO', 'CS5532ASZ', NULL, NULL),
(20, 15, '7.0CD', 'NAO IMPRIMI E RISCO NA VERTICAL', 'VERIFICADO QUE TINHA MUITA OXIDAÇÃO', 'REPARADO AS TRILHAS', NULL, 'para funcionar a web so funcionou com eeprom flash ST M29W80cdt 70n6'),
(21, 11, 'RV3', 'CARACTER ESTRANHO , O TEMPO TODO', NULL, '-', NULL, 'scope 2v 5.00ms  barramento 200ns\r\nFORMAS DE ONDA IMPRIMINDO 2V 5.00MS PINOS 5 6 9 12  PULSO + 16 PULSO -  PINO 19 TEM PULSO -, (PINO1 - 11 +) pino 15 tem um forma de onde com menor amplitude'),
(22, 16, '6204365', 'NAO  COMUNICA', 'ao mandar a requisição pino 12 scope 5v 5.00ms no triger selecionar a botda de descida pulso curto e no 11 o pulso e longo e os dois com nivel alto de 5v\r\nse nao tiver o pulso no pino 11 o problema esta no micro no pino 14 tambem tem polso mas a alimentação é negativa 1v abaixo da fonte\r\nNos capacitores c18 pulso nivel 0 em negativo e positivo ja no 19 o pulso é positivo menor\r\nmodelo antigoc28 10v com a forma de onda começando em 5v  410khz  5v   c29 10v onda iniciando em 10v 10 negativo \r\npino 10 e 12  5v quando requisita tem pulso negativo 13 -9v pulso positivo 11v', 'ADM 202 E O PROCESSADOR  usar o cabo ponto a ponto\r\nSE NAO TIVER OS PULSOS NOS CAPACITOR MICKRO', NULL, 'o cabo é ponto a ponto'),
(23, 2, '620000', 'VAI DIRETO PARA MODO DE PROGRAMÇÃO', '22/09/22	vai direto para modo de programação	U48 74hc541', 'A', NULL, NULL),
(24, 7, 'REV 6', 'NAO LIGA', 'VERIFICAR PRIMEIRO COMPONENTE QUENTE , ALIMENTAÇÃO, CLOCK , O BARRAMENTO SÓ ATIVA COM U29BOM 2V 1uS', 'A', NULL, NULL),
(25, 7, 'REV 6', 'VARIAÇÃO DE PESO SUBINDO QUANDO LIGA', 'A BASE PARA ANALIZE USAR O ESQUEMA DA 9091', 'TROCAR OS CD4052 LM339 E OS 27M2C- 01/08/23 CD4052 LM339', NULL, NULL),
(26, 5, '6207237', 'FICA EM LOOP MAS APARECE AS MENSAGENS', 'FOI TROCADO AS MEMORIAS E A FLASH E O CHIPAO FICOU COM SALDA RUIM', 'FOI TROCADO AS MEMORIAS E A FLASH E O CHIPAO FICOU COM SALDA RUIM', NULL, '31/03 U9 74HCT125'),
(27, 11, 'RV3', 'NAO LIGA , TESTE DE TODOS NO VERSIS OK', 'TESTE EM TODOS E O 74HC08  U11', 'A', NULL, 'scope 2v 5.00ms  barramento 200ns\r\nFORMAS DE ONDA IMPRIMINDO 2V 5.00MS PINOS 5 6 9 12  PULSO + 16 PULSO -  PINO 19 TEM PULSO -, (PINO1 - 11 +) pino 15 tem um forma de onde com menor amplitude'),
(28, 11, 'RV3', 'NAO CALIBRA FICA PESO MORTO ALTO E NAO TEM VARIAÇÃO', 'O PESO MORTO ALTO 210000 E NAO TEM VARIAÇÃO DA CELULA E FICA DO MESMO JEITO SE RETIRAR A CELULA,', 'r56 150R', NULL, 'scope 2v 5.00ms  barramento 200ns\r\nFORMAS DE ONDA IMPRIMINDO 2V 5.00MS PINOS 5 6 9 12  PULSO + 16 PULSO -  PINO 19 TEM PULSO -, (PINO1 - 11 +) pino 15 tem um forma de onde com menor amplitude'),
(29, 7, 'REV 6', 'APITANDO DIRETO , QUANDO PASSA A MAO EM CIMA DOS CHIPS MUDA A CARACTERISTICA DO BEEP E LIGA ,COMO SEM ATERRAMENTO', 'AO PASSAR A MAO SOBRE OS COMPONENTES AC138 FAZ RUIDOS COMO SE FOSSE SEM ATERAMENTO, AS VEZES LIGA,', 'MAX705', NULL, NULL),
(30, 17, 'ELGIN', 'NAO LIGA', 'LIGAR 3,3V NO REGULADOR- DAR UM JUMPER NO TRANSISTOR 2G- VERIFICAR AS TRILHAS PERTO DO PRIMEIRO DISPLAY', 'A', NULL, NULL),
(31, 18, 'RV2', 'REINICIANDO QUANDO IMPRIMI', 'VERIFICAR OS RELES DE ESTADO SOLIDO SE NAO TEM TERMINAL QUEBRADO', 'Q2 COM TERMINAL QUEBRADO', NULL, NULL),
(32, 7, 'REV 6', 'AGUARDE REINICIO OU VARIANDO PESO 1', 'COLOCAR CAPACITOR 473 AS ENTRADAS DE SINAL DA CELULA DE CARGA EM PARALELO COM OS 2 FILTROS\r\np87c52ba pode ser usado nao u38, TODOS OS ADS COMPRADO NA CHINA ESTA OK', 'AGUARDE REINICIO - TRILHA ROMPIDA EM BAIXO DA EPROM U35 - VERIFICAR RESET - BARRAMENTO EM TODOS CHIPS AI PODE ACHAR TRILHA ROMPIDA.', NULL, 'RV2 Q2 LM1951T Q1 vn20A'),
(33, 1, 'RV2', 'VAI DIRETO PARA MODo DE PROGRAMÇÃO', 'PINO 11 74HC244', 'PINO 11 74HC244', NULL, 'ghgfhgffgghfgh  \r\n gggggggg\r\ndia 1 fez1'),
(34, 1, 'RV2', 'AO IMPRIMIR FICA IMPRIMINDO CONTINUA SO PARA SE DESLIGAR', NULL, 'TROCADO O 80C32', NULL, 'ghgfhgffgghfgh  \r\n gggggggg\r\ndia 1 fez1'),
(35, 7, 'REV 6', 'DICAS', 'VARIAÇÃO NO PESO PODE SER PROBLEMA NO CABO DE LIGAÇÃO DA PLACA REFAZER AS PONTAS\r\nCLOCK ADM705\r\nligou cabo da cabeça invetido\r\nQUANDO FICAR AGUARDE REINICIO LIMPAR OS FUZIVEL DOS 2 LADOS, LM339 CD 4056 TLC2654\r\nQUANDO NAO LIGA E FICA APITANDO COMO SE NAO TIVESSE O CABO DO DISPLAY E SE TIRAR O CABO NAO DA DIFERENÇA MEDIR OS SINAIS QUE VAI PARA O DISPLAY SCOPE 5V 5US 1 PULSO , SEGUNDO DIODO CLOCK NEGATIVO 5V, 3º FULSO DE 5V, 4º RESET PULSO DE 200MS  5º 5V TEM UM ESQUEMA MOSTRANDO A INTERLIGAÇÃO DOS RESETS', 'RV2 Q2 LM1951T Q1 vn20A\r\nRV5 Q2 VN02N    Q1 VN30A  TS87C52X2-MBC  TC7652CPD', NULL, NULL),
(36, 15, '7.0CD', 'NAO LIGA - FICA REINICIANDO DEPOIS DE LIGADO E NAO É FONTE', 'VERIFICAR AS TENSOES, ENVIAR FIRMEWARE VERIFICAR RESET ( USAR 2 CANAIS 2V 100NS TRIGER CANAL 1 NO PINO DE SAIDA DO BD4506 E VER O ARTRAZO, OUTRO NO 3,3V', 'ERA O BD46302 DO RESET U5 SEM WEB E U6 COM WEB\r\nPODE DE SER O RESET OU TRANSISTOR Q3 DO RESET\r\n 	para funcionar a web so funcionou com eeprom flash ST M29W80cdt 70n6', NULL, 'u1 pode ser lm358'),
(37, 4, '6202275', 'NAO PESA', 'PODE USAR O CS5530 VERIFICAR NO ESQUEMATICO DA PRIX6', 'RESISTOR DE 1K50 MAS FOI COLOCADO 1K', NULL, NULL),
(38, 19, 'TODAS', 'AO LIGAR MOSTRA FFFFF E TRAVA', '1-VERIFICADO O MEMORIA  MODELIO 3104 VER 1.67 VERIFICAR OS 2 CAPACITORES DA ENTRADA DA CELULA DE 47X50V\r\n2- NAO ENTRA NO MODO DE CALIBRAÇÃO, MAS SE COLOCAR NIVEL ALTO NO PINO 2 74AC14 ENTRA', '1- TROCA DA EEPROM 95512 TEM QUE GRAVAR A EEPROM ANTES TEM ARQUIVO SALVO\r\n2- 74AC14', NULL, 'TROCA DA EEPROM 95512 TEM QUE GRAVAR A EEPROM ANTES TEM ARQUIVO SALVO\r\nTEM QUE TER 5V NOS PINOS DAS CHAVES'),
(39, 20, 'TODAS', 'NAO LIGA', 'CCHIP ATMEL FUNCIONA O RD2 \r\nversao 338-01 16t  ads1240E  philips p87c51rc+ja \r\nversao 338-05 16t ads1240e atmel 89c51ed2-um funciona', 'S', NULL, NULL),
(40, 21, 'TODAS', 'NAO LIGA', 'so imprimi riscos na vertical  - 273 do strobe e 74hc00', 'refazer as soldas  dos componentes ja trocado, principalmente memorias', NULL, NULL),
(41, 22, 'TODAS', 'NAO COMUNICA', 'esquendando o U2 - max232 ---   APÓS A CONTAGEM TRAVA  DEF 93C46', 'PINIOS  1__2_3  (NO DB9  1 PINO 5 GND   ) NO DB2 2 PINO 2 RX  NO DB9 3 TX PINO 3', NULL, 'PINIOS  1__2_3  (NO DB9  1 PINO 5 GND   ) NO DB2 2 PINO 2 RX  NO DB9 3 TX PINO 3'),
(42, 7, 'REV 6', 'PERDE DADOS', 'JA FOI TROCADO AS MEMORIAS - TENTATIVA 2 PROCESSADOR U15 74HC373 U24 3 U25 O 74HC133 U33 AINDA NAO FOI TROCADO', 'AINDA NAO', NULL, NULL),
(43, 16, '6204365', 'APAGA OS DIGITOS MAS FICA COM AS SETAS , COMO SE FOSSE SEM CELULA  - APÓS A CONTAGEM TRAVA  DEF 93C46', 'VERIFICADO QUE OS NUMEROS APAGAM , MAS NAO DESLIGA A BALANÇA', 'MEMORIA', NULL, NULL),
(44, 7, 'REV 6', 'CARACTER EM HEXADECIMAL NOS PARAMETROS DE CONFIGURAÇÃO EM VERSAO 6.4 NAS MENORES OK NAO SALVA CARACTERISTICAS', 'TROCADO A EEPROM E NAO DEU CERTO', '27/08/2023 TROCA DO BANCO DE MEMORIAS', NULL, NULL),
(45, 7, 'REV 6', 'NAO ATUALIZA O RELOGIO , NA BATERIA SO NA ELETRICA', 'NAO ATUALIZA O RELOGIO FORA DA ENERGIA', 'trilha', NULL, NULL),
(46, 23, '6204514', 'NAO LIGA', 'VERIFICADO QUE NAO TINHA 5V - FUNCIONA SEM O 74HCT273', '74HCT273', NULL, NULL),
(47, 10, 'RV2', 'PERDE DADOS - COM BATERIA BOA - AO REINICIAR VAI PERDE DADOS , MAS NAO FICA COM CARACTER ESTRANH0S', 'RELOGIO OK , SO TEM ESTA CARACTERISTICA QUANDO LIGA NO BOTAO', 'TRILHA ROMPIDA NO BARRAMENTO EM BAIXO DO BANCO DE MEMMORIA', NULL, NULL),
(48, 7, 'REV 6', 'PROBLEMA DE IMPRESSAO  TODOS', 'SO SAI RISCOS NA VERTICAL', 'u22 e u23 esquentando  U22 e U25    ( u27 u23 u22 u25 u5)   u22 testar tambem os hc125', NULL, NULL),
(49, 15, '7.0CD', 'NAO TRACIONA O REBOBINADOR MAS NAO É O BLOCO', NULL, 'BD3864 U18', NULL, 'u1 pode ser lm358'),
(50, 11, 'RV3', 'NAO ALINHA A ETIQUETA', 'VERIFICAR AS TRILHAS E SOLDA FRIA NOS RESISTORES QUE SAI DO TERMINAL DOGAP\r\nPINO 1 DO DS1804 VAI PARA O 80CPINO TX QUE PASSA NO CHIP DA COMUNICAÇÃOE E VAI PARA O 7404 DO MOTOR', 'LM393-DS1804-U15 74HC374\r\n26/08/2023  74hc374', NULL, 'scope 2v 5.00ms  barramento 200ns\r\nFORMAS DE ONDA IMPRIMINDO 2V 5.00MS PINOS 5 6 9 12  PULSO + 16 PULSO -  PINO 19 TEM PULSO -, (PINO1 - 11 +) pino 15 tem um forma de onde com menor amplitude'),
(51, 11, 'RV3', 'AO LIGAR SO DA INICIALIZANDO E DEPOIS DA EM BEEP IGUAL A SIRENE, E TESTE 31', 'O DEFEITO TROCADO A MEMORIAS HC138 HC00 HC04, VEIO COM O 80C32 DANIFICADO O ULTIMO FOI O CHIP DA TRANSMISSAO', 'CHIP DE COMUNICAÇÃO.', NULL, 'scope 2v 5.00ms  barramento 200ns\r\nFORMAS DE ONDA IMPRIMINDO 2V 5.00MS PINOS 5 6 9 12  PULSO + 16 PULSO -  PINO 19 TEM PULSO -, (PINO1 - 11 +) pino 15 tem um forma de onde com menor amplitude'),
(52, 5, '6207237', 'NAO ATUALIZA DISPLAY', 'VERIFICAR OS CHIPS DE COMUNUCAÇÃO U11-U10-U13-U20', 'U20 E FLASH', NULL, '31/03 U9 74HCT125'),
(53, 25, 'TODAS', 'TODOS', 'LIGAR A PLACA SEM BATERIA', 'LIGAR A FONTE DE 7.7 NA CONEXÃO DA PLACA E LIGAR SÓ O POSITIVO NO DISPLAY\r\nligar a serial laranja-+vp (amarelo txd) ( branco rxd) (azul gnd)', NULL, NULL),
(54, 5, '6207237', 'PROBLEMA DE IMPRESSAO  TODOS', '07/01/20	prix5 plus 6206133	imprimindo tudo preto 	u09 74hct125 U09 u9\r\n15/07/20	prix5 plus 6207237	imprimindo borrado	U15 74hct273 usei 74hc273 normal 74hc273\r\n10/12/20	prix5 plus 6206134	imprimindo com falha como fosse cabo rompido ficado	U15 74hct273 usei 74hc273 normal, ou u13 74hct125 U9 74HCT125 U11 74ac04\r\n07/12/22	Prix 5 plus	imprimindo queimando muito	U11  s', '07/01/20	prix5 plus 6206133	imprimindo tudo preto 	u09 74hct125 U09 u9\r\n15/07/20	prix5 plus 6207237	imprimindo borrado	U15 74hct273 usei 74hc273 normal 74hc273\r\n10/12/20	prix5 plus 6206134	imprimindo com falha como fosse cabo rompido ficado	U15 74hct273 usei 74hc273 normal, ou u13 74hct125 U9 74HCT125 U11 74ac04', NULL, '31/03 U9 74HCT125'),
(55, 27, 'TODAS', 'NAO LIGA', 'REGULADOR DE TENSAO LM1117 5V, ATIVA A PLACA MAS NAO LIGA SEM TECLADO', 'REGULADOR DE TENSAO LM1117', NULL, 'NAO LIGA VERIFICAR O REGULADOR DE TENSAO LM1117 5V, ELA ATIVA SEM TECLADO MAS NAO LIGA FICA O LED ACESO'),
(56, 5, '6207237', 'NAO CALIBRA TODOS', 'MEIDIR ALIMENTAÇAO , DEPOIS TESTAT OS REISITORES DO DIVISOR DE TENSAO,\r\nVERIFICAR OS SINAIS SPI VERIFICAR A TENSAO DO SPI', 'RESITOR DE 1K54\r\nDEFEITO PROCESSADOR LPC2210FBD144', NULL, '31/03 U9 74HCT125'),
(57, 21, 'TODAS', 'NAO ATENDE O DISPLAY MAS TRACIONA OS MOTORES', 'CAPACITOR C25 3,3X16V  E Q1BC817 (1F)', 'TRNASISTOR 1F', NULL, NULL),
(58, 11, 'RV3', 'ALIMENTAÇÃO NOS PINOS DE COMUNICAÇÃO', 'VERIFICADO E TINHA TRILHA EM BAIXO DO CONECTOR DO RADIO', 'VERIFICADO E TINHA TRILHA EM BAIXO DO CONECTOR DO RADIO', NULL, 'scope 2v 5.00ms  barramento 200ns\r\nFORMAS DE ONDA IMPRIMINDO 2V 5.00MS PINOS 5 6 9 12  PULSO + 16 PULSO -  PINO 19 TEM PULSO -, (PINO1 - 11 +) pino 15 tem um forma de onde com menor amplitude'),
(59, 29, 'TODAS', 'TODOS', '220 . 440  110 300  SECUNDARIO 8.40  BASE Q1 DENTE DE SERRA QUE VARIA DE ACORDO COM A CARGA\r\n8V BIAS', '220 . 440  110 300  SECUNDARIO 8.40  BASE Q1 DENTE DE SERRA QUE VARIA DE ACORDO COM A CARGA\r\n8V BIAS', NULL, NULL),
(60, 5, '6207237', 'DEFEITO DE DISPLAY TODOS', 'NAO LIGA OS DISPLAYS MAS TRACIONA OS MOTORES', 'TRANSISTOR 1FEM FRENTE AO TIP32  BASE 3V MAIS OU MENOS', NULL, '31/03 U9 74HCT125'),
(61, 30, 'TODAS', 'FAZ A CONTAGEM MAS TRAVA O TECLADO', 'PODE USAR O FUNCIONA O 96C66 NO LUGAR DO 96C56 , ESQUEMA DA 2098TRANSISTOR', 'TRANSISTOR Q6 2N7002', NULL, 'A VERSAO 1.05 FUNCIONA O 96C56 PODE COLOCAR O 93C66');

--
-- Gatilhos `defeitos`
--
DELIMITER $$
CREATE TRIGGER `atualiza_placas` AFTER UPDATE ON `defeitos` FOR EACH ROW BEGIN
SET @id_placa=new.id_placa_fk;
SET @versao=new.versao_fk;
SET @dica=new.dikas_fk;
UPDATE placas SET dicas_placa=@dica WHERE id_placa=@id_placa AND versao_placa=@versao;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `copia_dicas` BEFORE INSERT ON `defeitos` FOR EACH ROW BEGIN
SET @id_defeito=new.id_defeito;
SET @id_placa=new.id_placa_fk;
SET @versao=new.versao_fk;
SET new.dikas_fk=(SELECT dicas_placa FROM placas WHERE id_placa=@id_placa AND versao_placa=@versao);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `placas`
--

CREATE TABLE `placas` (
  `id_placa` int(11) NOT NULL,
  `nome_placa` varchar(120) CHARACTER SET utf8mb4 NOT NULL,
  `versao_placa` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
  `manual_placa` varchar(25) CHARACTER SET utf8mb4 DEFAULT NULL,
  `dicas_placa` text CHARACTER SET utf8mb4 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Despejando dados para a tabela `placas`
--

INSERT INTO `placas` (`id_placa`, `nome_placa`, `versao_placa`, `manual_placa`, `dicas_placa`) VALUES
(1, 'PLATINA UNIFICADA 12v', 'RV2', NULL, 'ghgfhgffgghfgh  \r\n gggggggg\r\ndia 1 fez1'),
(2, 'PRIX 5', '620000', NULL, NULL),
(3, '9094 plus 3090588', 'vs 2.06', NULL, 'display unico  verificar se tem 7,7v no Q7 so energizado , verificar a falta do Q6 cai facil da placa , o R43 é de 47k'),
(4, 'PCI Principal 2098/2099 Std 6202275', '6202275', NULL, NULL),
(5, 'PRIX 5 plus', '6207237', NULL, '31/03 U9 74HCT125'),
(6, 'PRIX 5 PLUS', '6206133', NULL, 'VERIFICAR O JP7 POSIÇÃO 2 E3'),
(7, 'PRIX 4 N STANDART 3090381', 'REV 6', NULL, 'RV2 Q2 LM1951T Q1 vn20A'),
(8, '9091', 'TODAS', NULL, NULL),
(9, 'PRIX 3 FIT PLUS 6212985', '5.13', NULL, NULL),
(10, 'PLATINA ANTIGA', 'RV2', NULL, NULL),
(11, 'Platina Unificada 12v', 'RV3', NULL, 'scope 2v 5.00ms  barramento 200ns\r\nFORMAS DE ONDA IMPRIMINDO 2V 5.00MS PINOS 5 6 9 12  PULSO + 16 PULSO -  PINO 19 TEM PULSO -, (PINO1 - 11 +) pino 15 tem um forma de onde com menor amplitude'),
(12, 'DIGITRON', '09/03/09', NULL, NULL),
(13, 'CS15 LED ANTIGA', '127', NULL, NULL),
(14, 'PCI PRINCIPAL 9098', '2.02D', NULL, NULL),
(15, 'PRIX4 UNO WEB 6205409', '7.0CD', NULL, 'u1 pode ser lm358'),
(16, '8217 LP', '6204365', NULL, 'o cabo é ponto a ponto'),
(17, 'ELGIN', 'ELGIN', NULL, NULL),
(18, 'PRIX4 N RV2', 'RV2', NULL, NULL),
(19, 'ALFA', 'TODAS', NULL, 'TROCA DA EEPROM 95512 TEM QUE GRAVAR A EEPROM ANTES TEM ARQUIVO SALVO\r\nTEM QUE TER 5V NOS PINOS DAS CHAVES'),
(20, 'IDM TODAS', 'TODAS', NULL, NULL),
(21, 'PRIX4 FLEX', 'TODAS', NULL, NULL),
(22, '8217 MODELO NOVO', 'TODAS', '8217.jpeg', 'PINIOS  1__2_3  (NO DB9  1 PINO 5 GND   ) NO DB2 2 PINO 2 RX  NO DB9 3 TX PINO 3\r\ncomunicacao P06 envia continua\r\ncodigo 6209256'),
(23, 'PRIX4  PLUS', '6204514', NULL, NULL),
(24, 'WI-FI TOLEDO REDPINE', 'TODAS', NULL, 'VERIFICAR OS INDUTORES DA ENTRADA'),
(25, 'TI-200', 'TODAS', NULL, NULL),
(26, 'PLURIS', 'TODAS', NULL, 'VERSAO 408-0 MODELO TRAFO'),
(27, 'BALMAK ELG NG', 'TODAS', NULL, 'NAO LIGA VERIFICAR O REGULADOR DE TENSAO LM1117 5V, ELA ATIVA SEM TECLADO MAS NAO LIGA FICA O LED ACESO'),
(28, 'DISPLAY PRIX 5', 'TODOS', NULL, 'PINO 7 DO ADM705 SAI NIVEL ALTO'),
(29, 'FONTE DIGITRON', 'TODAS', NULL, NULL),
(30, '9098C COM BACKLIGHT', 'TODAS', NULL, 'A VERSAO 1.05 FUNCIONA O 96C56 PODE COLOCAR O 93C66'),
(31, 'PRIX3 LC DISPLAY GRANDE TODAS 6202777', 'TODAS', NULL, 'PLACA NAO REINICIA SEM O CS5550'),
(32, 'PRIX5 PLUS TODAS', 'TODAS', NULL, NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `componentes`
--
ALTER TABLE `componentes`
  ADD PRIMARY KEY (`id_comp`);

--
-- Índices de tabela `defeitos`
--
ALTER TABLE `defeitos`
  ADD PRIMARY KEY (`id_defeito`);

--
-- Índices de tabela `placas`
--
ALTER TABLE `placas`
  ADD PRIMARY KEY (`id_placa`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `componentes`
--
ALTER TABLE `componentes`
  MODIFY `id_comp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT de tabela `defeitos`
--
ALTER TABLE `defeitos`
  MODIFY `id_defeito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de tabela `placas`
--
ALTER TABLE `placas`
  MODIFY `id_placa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
