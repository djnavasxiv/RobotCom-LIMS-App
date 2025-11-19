**** Programa Password.prg *******************
**** Author : Jose David Navas     ******
**** Tec. Biomedico         ******
**** Date   : 10/02/14                 ******
**** All Rights reserved                ******
**** *****************************************
PARAMETERS pasw1
RELEASE NEWP
PUBLIC NEWP
NEWP=SPACE(10)
A1=1
A2=SPACE(11)
pasw1=ALLTRIM(pasw1)
FOR I = 1 TO LEN(pasw1)
	A1= 256 - ASC(SUBSTR(pasw1,I,1))
	A2=ALLTRIM(A2)+CHR(A1)
ENDFOR
NEWP=A2
RETURN NEWP