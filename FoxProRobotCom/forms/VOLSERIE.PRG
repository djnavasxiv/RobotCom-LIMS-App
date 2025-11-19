PUBLIC VolNumber, SERDECIMAL, NAMVOL, mserial
STORE 0 TO VolNumber, SERDECIMAL
NANVOL = SPACE(11)
SET PROCEDURE TO
=GETVOL()
_Dec2Hex()

*-----------------------------------------------
FUNCTION GetVol(lpRoot)
*-----------------------------------------------
* Nuestra información del volumen
* USO: GetVol("C:\")
* PARAMETRO: lpRoot = LetraDrive + ":\"
*-----------------------------------------------
LOCAL lnRet, lcString, lpVolName, ;
  nVolSize, lpVolNumber, ;
  lpMaxComp, lpFlags, ;
  lpFSName, nFSSize

IF EMPTY(lpRoot)
  lpRoot = "C:\"
ENDIF
lpVolName = SPACE(256)
nVolSize = 256
lpVolNumber = 0
lpMaxComp = 256
lpFlags = 0
lpFSName = SPACE(256)
nFSSize = 256

DECLARE INTEGER GetVolumeInformation IN Win32API AS GetVolInfo ;
  STRING  @lpRoot, ;
  STRING  @lpVolName, ;
  INTEGER nVolSize, ;
  INTEGER @lpVolNumber, ;
  INTEGER @lpMaxComp, ;
  INTEGER @lpFlags, ;
  STRING  @lpFSName, ;
  INTEGER nFSSize

lnRet=GetVolInfo(@lpRoot, @lpVolName, ;
  nVolSize, @lpVolNumber, ;
  @lpMaxComp, @lpFlags, ;
  @lpFSName, nFSSize)

IF lnRet > 0
  lcString = "Vol name: " + ;
    LEFT(ALLT(lpVolName),LEN(ALLT(lpVolName))-1)+CHR(13)+ ;
    "Vol Serial #: " + ;
    ALLT(STR(lpVolNumber))
    
ELSE
  lcString = "No se pudo ver información de la Pc"
ENDIF
***** =MESSAGEBOX(lcString, "Información del volumen")

namvol    = LPVOLNAME
SERDECIMAL   = lpvolnumber
****wait windows  serdecimal

RETURN ""
ENDFUNC


*------------------------------------------------
FUNCTION _Dec2Hex(lpVolNumber)
*------------------------------------------------
* Transforma un número decimal a hexadecimal
* USO: _Dec2Hex(nDecimal)
* RETORNA: Caracter
*------------------------------------------------
  LOCAL lcHexa, lcChr, lnResto
  lcHexa=''
  NDECIMAL = SERDECIMAL 
  DO WHILE nDecimal > 0
    lnResto = MOD(nDecimal,16)
    nDecimal = INT(nDecimal / 16)
    lcChr = IIF(lnResto < 10,STR(lnResto,1),CHR(lnResto + 55))
    lcHexa = lcChr + lcHexa
  ENDDO
  lchexa = iif(len(lcHexa)<8,"0"+lcHexa,lcHexa)
  lchexa= left(lchexa,4)+"-"+righ(lchexa,4)
  mserial = lchexa
  RETURN lcHexa
ENDFUNC
