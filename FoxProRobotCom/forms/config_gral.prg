Set Safety Off
Release MCODEINI
Public  MCODEINI
MCODE=Space(50)
MCODEINI=Space(50)
MSERIAL=Space(50)
MREGISTRO="DEMO"
MREGISTRO=Space(20)
MDOORLOG=Space(1)

If Not File("C:\WINDOWS\Cursors\cursores.dll")

	MRESP=Messagebox("COPIA ILEGAL, DEBE ACTIVAR SU PROGRAMA, DESEA ACTIVAR SU COPIA ",36,"VALIDAR COPIA")		
	
	If MRESP=6	
		MKEYSERIAL=Space(20)
		Do PFOLDERLOAD+"VOLSERIE"		
		MCODE =MSERIAL		
		
		Do Form PFOLDERLOAD+"FRMLICENCIA"
						
		If Not File("C:\WINDOWS\Cursors\cursores.dll")
			QUIT
			RETURN
		ENDIF							
	Else
		QUIT
	ENDIF
			
ELSE
	SELECT 0
	USE "C:\WINDOWS\Cursors\cursores.dll" ALIAS DATOS		
	IF DATE()- DATOS.FECHAINI>365
	   MESSAGEBOX("ERROR FALLA DE WINDOWS",48,"LLAMAR RobotComLab Tel. 6078-6882 WhatsApp +503 61512318")	
	   QUIT
	ENDIF		
Endif


