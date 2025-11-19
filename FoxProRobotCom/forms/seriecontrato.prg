**Prueba con esto
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
  
 
 serial =""
 serial = TRANSFORM(lpVolNumber,"@0")
 serial = ALLTRIM(SUBSTR(serial,3,20))
  
 