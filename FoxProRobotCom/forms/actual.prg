SET SAFETY OFF 
CLOSE TABLES ALL

lpRoot ="c:\"  && Unidad de Disco
lpVolName = Space(256)
nVolSize = 256
lpVolNumber = 0
lpMaxComp = 256
lpFlags = 0
lpFSName = Space(256)
nFSSize = 256
 
Declare Integer GetVolumeInformation ;
 IN Win32API As GetVolInfo ;
 STRING @lpRoot, ;
 STRING @lpVolName, ;
 INTEGER nVolSize, ;
 INTEGER @lpVolNumber, ;
 INTEGER @lpMaxComp, ;
 INTEGER @lpFlags, ;
 STRING @lpFSName, ;
 INTEGER nFSSize
 
 
lnRet=GetVolInfo(@lpRoot, @lpVolName, ;
 nVolSize, @lpVolNumber, ;
 @lpMaxComp, @lpFlags, ;
 @lpFSName, nFSSize)
  
 
 m.discoduro=""
 m.discoduro= TRANSFORM(lpVolNumber,"@0")
 m.DISCODURO= ALLTRIM(SUBSTR(M.DISCODURO,3,20))
 m.discoduro=LEFT(m.discoduro,4)+"-"+SUBSTR(m.discoduro,5,10)
  
***** 

PFOLDERLOAD=SYS(5)+CURDIR()
TEXTOL=""

PRUTAROOT=PFOLDERLOAD

IF RIGHT(ALLTRIM(PFOLDERLOAD),1)<>"\"
	PFOLDERLOAD=PFOLDERLOAD+"\"
ENDIF


SELECT 0
USE PFOLDERLOAD+"EMPSA" EXCLUSIVE

REPLACE EMPRESA WITH "ROBOTCOMLAB-DEMO"
datos			= pasword(EMPSA.EMPRESA)

REPLACE LABORATO 	WITH EMPRESA
REPLACE EMPRESA  	WITH datos
REPLACE DISCODURO	WITH PASWORD(M.discoduro)

replace finstala  WITH DATE()
replace fvence    WITH DATE()

REPLACE SERIALA   WITH PASWORD(DTOS(FINSTALA))
REPLACE SERIALB   WITH PASWORD(DTOS(fvence))

COPY TO empsa.sys

CLOSE TABLES all

