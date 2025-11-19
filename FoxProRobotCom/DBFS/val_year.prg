*conversion de numeros a letras
PARAMETERS val_cnv
*  val_cnv  : Valor numerico a convertir
*  vls(n)   : Millones, Millares, Cientos, Centavos
*  rbr(n,x) : 'Millones, Un Millon' , 'Miles ' 'etc.

ult_str = ' '
DIMENSION VLT(40), vls(4), rbr(4,2)
Vlt = SPACE(0)
Vlt(01) = "UN"
Vlt(02) = "DOS"
Vlt(03) = "TRES"
Vlt(04) = "CUATRO"
Vlt(05) = "CINCO"
Vlt(06) = "SEIS"
Vlt(07) = "SIETE"
Vlt(08) = "OCHO"
Vlt(09) = "NUEVE"
Vlt(10) = "DIEZ"
Vlt(11) = "ONCE"
Vlt(12) = "DOCE"
Vlt(13) = "TRECE"
Vlt(14) = "CATORCE"
Vlt(15) = "QUINCE"
Vlt(16) = "DIECI"
Vlt(17) = "VEINT"
Vlt(18) = "TREINTA"
Vlt(19) = "CUARENTA"
Vlt(20) = "CINCUENTA"
Vlt(21) = "SESENTA"
Vlt(22) = "SETENTA"
Vlt(23) = "OCHENTA"
Vlt(24) = "NOVENTA"
Vlt(25) = "CIEN"
Vlt(26) = "DOSCIENTOS"
Vlt(27) = "TRESCIENTOS"
Vlt(28) = "CUATROCIENTOS"
Vlt(29) = "QUINIENTOS"
Vlt(30) = "SEISCIENTOS"
Vlt(31) = "SETECIENTOS"
Vlt(32) = "OCHOCIENTOS"
Vlt(33) = "NOVECIENTOS"
rbr(1,1) = "UN MILLON "
rbr(1,2) = " MILLONES "
rbr(2,1) = "UN MIL "
rbr(2,2) = " MIL "
rbr(3,1) = "UN DOLAR"
rbr(3,2) = " DOLARES "
rbr(4,1) = ' 01/100' &&" UN CENTAVO "
rbr(4,2) = " CENTAVOS "
amount = INT(val_cnv * 100 + 0.5) / 100
letras = SPACE(0)
cents  = INT(VAL(RIGHT(STR(amount,14,2),2)))
amount = INT(amount)
CAmount = STR(amount,9,0)
CAmount = "000000000"+LTRIM(CAmount)
CAmount = RIGHT(CAmount,9)
vls(1) = INT(VAL(SUBS(CAmount,1,3)))
vls(2) = INT(VAL(SUBS(CAmount,4,3)))
vls(3) = INT(VAL(SUBS(CAmount,7,3)))
vls(4) = INT(cents)
inx = 1
pase = .T.
DO WHILE inx <= 3
   IF vls(inx) > 0      && Verifica que haya valores
      *** Convierte Centenas
      qty = vls(inx)
      IF qty = 1
         IF inx =  3
	        letras = TRIM(letras) + IIF(val_cnv > 100, " ",rbr(inx,1))
         ELSE
            letras = TRIM(letras) + rbr(inx,1)
         ENDIF
      ELSE
         IF qty >= 100
            centenas = INT(qty/100)
            letras = TRIM(letras) + " " + TRIM (Vlt(centenas + 24))
            IF (qty > 100) AND (qty < 200)
               letras = TRIM(letras) + "TO "
            ELSE
               letras = TRIM(letras) + " "
            ENDIF
            note letras = TRIM(letras) + " "
            qty  = qty - (centenas * 100)
         ENDIF
         *** Convierte Decenas
         decenas  = INT(qty/10)
         unidades = qty - (decenas * 10)
         IF qty > 0
            unidades = ROUND(unidades,0)
            DO CASE
               CASE qty < 16
                  letras = TRIM(letras) + " " + Vlt(qty)
               CASE qty < 20
                  letras   = TRIM(letras) + " " + Vlt(16)+ TRIM(Vlt(unidades))
               CASE qty = 20
                  letras   = TRIM(letras) + " VEINTE"
               CASE qty < 30
                  letras   = TRIM(letras) + " " + Vlt(Decenas+15) + "I"+  Vlt(Unidades) 
               OTHERWISE
                  letras   = TRIM(letras) + " " + Vlt(Decenas+15) + IIF(Unidades#0," Y " +Vlt(Unidades),"")
            ENDCASE
         ENDIF
         IF inx = 3
            ult_str = " " + rbr(inx,2)
*            letras = TRIM(letras) + rbr(inx,2)
         ELSE
            note letras = TRIM(letras) + " " + rbr(inx,2)
            letras = TRIM(letras) + rbr(inx,2)
         ENDIF
     ENDIF
   ELSE
      IF inx = 3 .and. m->camount = "000000000"
         letras = TRIM(letras) + " " 
         pase = .F.
      ENDIF
   ENDIF
   inx = inx + 1
   letras = TRIM(letras)
ENDDO


IF PASE
	DO CASE 
	   CASE vls(2) = 0 AND vls(3)=0 
	      letras = TRIM(letras)+ " "
	   CASE vls(3)=0 
	      letras = TRIM(letras)
	ENDCASE
ENDIF
vletras = letras

RETURN vletras
