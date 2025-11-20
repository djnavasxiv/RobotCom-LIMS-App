**** PROGRAMA SISTEMA.PRG ******************************
********************************************************
*** PROGRAMA PRINCIPAL DE LABORATORIO
*** DATE       : INICIADO 11/11/2012 Y FINALIZADO 4/6/2013
*** AUTHOR     : JOSE DAVID NAVAS CHAVARRIA
********************************************************

Set Echo Off
Set Talk Off
Set Score Off
Set Resource Off

DO carpetasbackup.PRG

Release PFOLDERLOAD, PRUTAKARDEX,  M.PLOGO,PRUTAROOT, TEXTOL, PAC, NOMBREPROGRA, prutabakup
Public  PFOLDERLOAD, PRUTAKARDEX,  M.PLOGO,PRUTAROOT, TEXTOL, PAC, NOMBREPROGRA, prutabakup
	
RELEASE P_NORDENLABO
PUBLIC  P_NORDENLABO

prutabakup=""

P_NORDENLABO=""   &&& PARA CONTROLAR EL USO DE ORDEN DE LABORATORIO

PAC="PROGRAMA NO AUTORIZADO"
NOMBREPROGRA="RobotComLab"


PFOLDERLOAD=Sys(5)+Curdir()
TEXTOL=""

PRUTAROOT=PFOLDERLOAD


PRUTAKARDEX=Sys(5)+Curdir()+"DBFS\"
Set Defa To &PFOLDERLOAD
Set Safety Off

If Not Directory(PFOLDERLOAD+"TEMRUTA")
	MORDEN =PFOLDERLOAD+"TEMRUTA"
	Md &MORDEN
Else
	ORDEN ="DELETE FILE "+PFOLDERLOAD+"TEMRUTA\*.*"
	&ORDEN
Endif

Release MDOORLOG
Public  MDOORLOG

Release MCODE,MSERIAL,MREGISTRO,MKEYSERIAL
Public  MCODE,MSERIAL,MREGISTRO,MKEYSERIAL

Close All

Clear Macros


Public SORDEN,MRAZON,MRAZONDOS,mload, MRUTA,Pruta,PRAZON,MLOADSYS,PNRC,PNIT,;
	PMANAGER,PSIGNAT1,PTIPOSIS,PNOMBRECONT,	PNOMBREAUDI,PNOAUDITOR,MPIVA,;
	MPCONTA,MPKARDEX,MPTODO,MDISCO,P_USUARIO,p_reportapor


Release PrutaLABO, PUBLIC_DATA_BOOT,PUBLIC_DATA_BUSCA
Public  PrutaLABO, PUBLIC_DATA_BOOT,PUBLIC_DATA_BUSCA

MDISCO =Space(10)
mload = PFOLDERLOAD
MLOADSYS=PFOLDERLOAD

PrutaLABO=PFOLDERLOAD+"DBFS\"
PUBLIC_DATA_BUSCA=PFOLDERLOAD+"frmbusquedas\"


MRUTA = Space(10)
MRAZON     = Space(30)
MRAZONDOS  = Space(30)
PNRC = Space(10)
PNIT = Space(20)
SORDEN = PFOLDERLOAD+"SEARCH"

Modify Window Screen Title "LABOCLI CONTROL DE LABORATORIOS";
	FONT 'foxfont', 9 ;
	ICON File c:\sistemab\MAC02.ICO ;
	FILL File c:\Windows\FondoLab.gif

Public bton
bton = 0

Clea
Set Scor Off
Set Bell Off
Set Stat Off
Set Talk Off
Set Echo Off
Set Exact On
Set Sysme To
Clear Macros
Set Help Off
Close Table All
Set Date French
Set Centu On
Set Delete On
Set Century To 19 ROLLOVER 80
Set Status Bar Off
** ? {02/16/96}	&& Muestra 02/16/1996
** ? {02/16/56}	&& Muestra 02/16/2056
On Key Label Escape
On Key Label Enter
Clear Macros
Close Table All
Set Defa To &PFOLDERLOAD

Close Table All
*** revificando serie
Do PFOLDERLOAD+"config_gral"
**** serie

Release marchivologo, marchivologo2
Public  marchivologo, marchivologo2


marchivologo=""
marchivologo=PFOLDERLOAD+"SISTEMAB\LOGOROBOT.JPG"

marchivologo2=""
marchivologo2=PFOLDERLOAD+"SISTEMAB\ROBOTLOGO.JPG"

Close Table All

Release PCSSP, PDIR1, PDIR2, PDIR3, BOTONBARRA, TIPOLETRAS
Public  PCSSP, PDIR1, PDIR2, PDIR3, BOTONBARRA, TIPOLETRAS

BOTONBARRA = 0
TIPOLETRAS = ""

Set Defa To &PFOLDERLOAD
Set Path To Forms

MCERRAR=""

Try
	Select 0
	Use "C:\WINDOWS\EMPSA.sys" Shared Again
	Go Top

Catch To oEx
	Messagebox("ERROR EN MEMORIA DE WINDOWS... ",48,"")

* ? "uh-oh: something went wrong"
* ? oEx.ErrorNo, oEx.Message
	MCERRAR="OK"

Endtry

If MCERRAR<>""
	Return
Endif

****
MCERRAR=""

If File("C:\WINDOWS\ROBOTCOMLAB.sys")

	Try
		Select 0
		Use "C:\WINDOWS\ROBOTCOMLAB.sys" Shared Again
		Go Top

	Catch To oEx
		Messagebox("ERROR EN MEMORIA VIRTUAL... ",48,"")
* ? "uh-oh: something went wrong"
* ? oEx.ErrorNo, oEx.Message
		MCERRAR="OK"

	Endtry

	If MCERRAR<>""
		Return
	Endif

Endif



Store Space(2) To PCSSP, PDIR1, PDIR2, PDIR3
Set Classlib To PFOLDERLOAD+"clasebotones.VCX" Additive


Do Form frmacceso

If MCERRAR<>"OK"

	If Not Empty(P_USUARIO)
		Do Form PFOLDERLOAD+"logocli"
	Endif
Endif

Set Sysme To Defa
Restore Macros
Close Table All
Clear All
Return