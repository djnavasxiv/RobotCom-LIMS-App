
If Val(Left(Version(4),2)) < 7
	Messagebox("Escrito para la version 7.00 o superior. "+;
		"Analizar el codigo antes de correr.",16,"")
	Return
Endif

Set Talk Off
Set Escape On
Set Notify On
Close All
Clear All
Clear

Local cFontAntes
cFontAntes = _Screen.FontName
_Screen.FontName="FOXPRO WINDOWS FONT"
?

Private cDir

Wait Window Nowait ;
	'Seleccione un directorio (o unidad)'+Chr(13)+Chr(10)+;
	'(sugiero una unidad o un directorio que tenga varios '+;
	'subdirectorios y archivos .TXT...)'

cDir =  Sys(5)+Curdir()
*!* --------------------------------------------
*- Ejemplo nro 2
**Wait Window Nowait Noclear "Buscando en: "+cDir+", espere..."
ListarSubCarpetas(cDir)

*!*	 *!* --------------------------------------------
*!*	 *- ejemplo 3
*!*	 Wait Window Nowait Noclear 'Escriba un nombre de archivo a buscar...'
*!*	 cNombFileaBuscar = Inputbox("nombre del archivo a buscar", "", "readme.txt")
*!*	 If !Empty(cNombFileaBuscar)
*!*	  nnnn = BuscarArchivoExacto(cDir, cNombFileaBuscar, .F.)
*!*	  ?"Archivos encontrados: ", nnnn
*!*	  ?
*!*	 Else
*!*	  Return
*!*	 Endif
*!*	 Wait 'Archivo encontrado en...'

*!*	 *!* --------------------------------------------
*!*	 *- ejemplo 4
*!*	 cExtencionaB = Inputbox("Ingrese EXTENCION a buscar", "", "TXT")
*!*	 nnnn = BuscarExtenciondeArchivo(cDir, cExtencionaB)
*!*	 ?"Archivos encontrados: ", nnnn
*!*	 ?
*!*	 ?
*!*	 Wait "Fin del ejemplo, ..."
*!*	 ?

_Screen.FontName = cFontAntes
*- fin.



Procedure ListarDirectorios
*- listar directorios del primer nivel un disco
*- o  subdirectorios de una carpeta
	Local x, nSon, nListados
	nListados = 0
	Wait Window Nowait ;
		'Listar directorios del primer nivel de un disco o '+;
		'subdirectorios de una carpeta'
	nSon = Adir(aArchivos, cDir+"*.*", "D")

	If nSon > 0

		=Asort(aArchivos,1)


		For x=1 To nSon

			If !("D"$aArchivos[x,5]) Or ;
					aArchivos[x,1] == "." Or aArchivos[x,1] == ".."
				Loop
			ENDIF
			

			If Left(Lower(aArchivos[x,1]),4)="BACK"

				?"Nombre: ", Lower(aArchivos[x,1])
				nListados = nListados + 1
			Endif

		Next
	ENDIF
	
	If nListados > 0
		?nListados, 'directorios del primer nivel listados.'
*- a partir de ahroa si se quiere acceder a la ruta completa
*- de algún directorio no hay mas que sumar: addbs(cDir + '\' +aArchivos[n,1])
	Else
		?"No hay Directorios en "+cDir
	Endif
	Release aArchivos
Endproc


Procedure ListarSubCarpetas
	Lparameters lpcDirectorio, lplNoMostrarResultados
*- listar todos los niveles de subcarpetas
*- si elijio el disco raiz listará todos los subdirectorios del disco con
*- todos los subdirectorios contenidos en ellos.
*- (o sea recorrerá el disco completo -esto puede llevar tiempo en un disco
*- grande-)
*- Este procedimiento requiere recursividad.
	Local x, nSon, nNivel

	nNivel = 0
	Dimension aTodaslasCarpertas[1,2]
	BuscarSubDir(lpcDirectorio, @aTodaslasCarpertas, @nNivel)
	nSon = Alen(aTodaslasCarpertas, 1)
	Wait Clear

	If !lplNoMostrarResultados
*- Nota: Esto es un ejemplo, no es la mejor forma de scan de directorios
*- en este ejemplo, primero se recorre y luego se muestra, dividiendo las
*- tareas... Lento!! como compilador de dos pasadas... :))))
*- Pero el objetivo es mostrar el uso de Adir.


		Set Safety OfF
		


		Select 0
		Create Table CARPETAS(corre C(10), nombre C(60) )
		i = 1

		For x=2 To nSon

			If Substr(Displaypath(aTodaslasCarpertas[x,1], 60),15,5)="\BACK"
				m.corre = Alltrim(Str(i))
				m.nombre=Displaypath(aTodaslasCarpertas[x,1], 60)
				Append Blank
				Gather Memvar
				I = i+1				
			Endif

		Next

		Select CARPETAS
	Endif
Endproc


Procedure BuscarSubDir
	Parameters lpcDir, aResultDir, vnNivel
*- procedimiento recursivo
	vnNivel = vnNivel + 1
	Local x, nSon
	Private aArchivos
	nSon = Adir(aArchivos, lpcDir+"*.*", "D")
	For x=1 To nSon
		If "D"$aArchivos[x,5]
			If aArchivos[x,1] == "." Or aArchivos[x,1] == ".."
				Loop
			Endif
			Dimension aResultDir[ALEN(aResultDir,1)+1,2]
			aResultDir[ALEN(aResultDir,1),1] = Addbs(lpcDir+aArchivos[x,1])
			aResultDir[ALEN(aResultDir,1),2] = vnNivel
			BuscarSubDir(Addbs(lpcDir+aArchivos[x,1]), @aResultDir, vnNivel)
		Endif
	Next
Endproc


Procedure BuscarArchivoExacto
*- podemos usar estas funciones para buscar un archivo en disco.
	Lparameters lpcDir, lpcNombre, lplDetenerSiEncuentra
*- lpcDir: carpeta o drive en donde buscar
*- lpcNombre: nombre del archivo con su extencion si la tuviera
*- lplDetenerSiEncuentra: buscar todos los archivos repetidos o el primero que encuentre.
*- Esta funcion devuelve la cantidad de archivos encontrados. ...
	Local nSon, x, nEncontrados, Y, nArch

	Local omostrar
	omostrar = Createobject("MostrarResultados")
	If Type("omostrar") # "O"
		Messagebox("ups!",16,"")
		Cancel
	Endif
	omostrar.Show()

	nEncontrados = 0
	lpcNombre = Upper(Alltrim(lpcNombre))
	Dimension aTodaslasCarpertas[1,2]

	ListarSubCarpetas(lpcDir, .T.)
*- este directorio
	aTodaslasCarpertas[1,1] = lpcDir
	aTodaslasCarpertas[1,2] = 0

	nSon = Alen(aTodaslasCarpertas, 1)

*- buscar en los directorios
	For x=1 To nSon

		omostrar.label1.Caption = "Buscando ahora en: "+;
			DISPLAYPATH(aTodaslasCarpertas[x,1],60)+"..."

		nArch = Adir(aFiles, aTodaslasCarpertas[x,1]+"*.*", "AHRSD")
		For Y=1 To nArch
			If "D"$aFiles[y,5] Or aFiles[y,1] == "." Or aFiles[y,1] == ".."
				Loop
			Endif
			If Upper(aFiles[y,1]) == lpcNombre
				nEncontrados = nEncontrados + 1

				omostrar.list1.AddItem("Encontrado en: "+;
					Displaypath(aTodaslasCarpertas[x,1]+ aFiles[y,1], 60))

				If lplDetenerSiEncuentra
					Exit
				Endif
			Endif
		Next

		If nEncontrados > 0 And lplDetenerSiEncuentra
			Exit
		Endif
	Next
	Clear Typeahead
	Wait Clear
	Wait Wind
	Return nEncontrados
Endproc



*!*	Procedure BuscarExtenciondeArchivo
*!*	 *- podemos usar estas funciones para buscar un archivo en disco.
*!*	 *- buscar todos los archivos cuya extencion sea igual a ...
*!*	 Lparameters lpcDir, lpcExtencion
*!*	 *- lpcDir: carpeta o drive en donde buscar
*!*	 *- lpcExtencion: Extencion de archivo (sin el punto)
*!*	 *- Esta funcion devuelve la cantidad de archivos encontrados. ...
*!*	 Local nSon, x, nEncontrados, Y, nArch

*!*	 Local omostrar
*!*	 omostrar = Createobject("MostrarResultados")
*!*	 If Type("omostrar") # "O"
*!*	  Messagebox("ups!",16,"")
*!*	  Cancel
*!*	 Endif
*!*	 omostrar.Show()

*!*	 nEncontrados = 0
*!*	 lpcExtencion = Upper(Alltrim(lpcExtencion))
*!*	 Dimension aTodaslasCarpertas[1,2]

*!*	 Wait Window Nowait Noclear 'Espere...'
*!*	 ListarSubCarpetas(lpcDir, .T.)
*!*	 *- este directorio
*!*	 aTodaslasCarpertas[1,1] = lpcDir
*!*	 aTodaslasCarpertas[1,2] = 0

*!*	 nSon = Alen(aTodaslasCarpertas, 1)

*!*	 *- buscar en los directorios
*!*	 For x=1 To nSon

*!*	  omostrar.label1.Caption = "Buscando ahora en: "+;
*!*	   DISPLAYPATH(aTodaslasCarpertas[x,1],60)+"..."

*!*	  nArch = Adir(aFiles, aTodaslasCarpertas[x,1]+"*.*", "AHRSD")
*!*	  For Y=1 To nArch
*!*	   If "D"$aFiles[y,5] Or aFiles[y,1] == "." Or aFiles[y,1] == ".."
*!*	    Loop
*!*	   Endif
*!*	   If Upper(Justext(aFiles[y,1])) == lpcExtencion
*!*	    nEncontrados = nEncontrados + 1
*!*	    omostrar.list1.AddItem("Encontrado en: "+;
*!*	     DISPLAYPATH(aTodaslasCarpertas[x,1] + aFiles[y,1],60))
*!*	   Endif
*!*	  Next

*!*	 Next
*!*	 Wait Clear
*!*	 Clear Typeahead
*!*	 Wait Wind
*!*	 Return nEncontrados
*!*	Endproc


*- alguna interface sencilla para mostrar resultados
Define Class MostrarResultados As Form
	AutoCenter = .T.
	Width = 640
	Height = 380

	Add Object label1 As Label With ;
		AutoSize = .T., ;
		Left = 5, ;
		Top = 10, ;
		TabIndex = 1

	Add Object list1 As ListBox With ;
		Left = 5, ;
		Top = 30, ;
		width = 630, ;
		height = 300, ;
		ItemTips = .T.,;
		TabIndex = 2

Enddefine