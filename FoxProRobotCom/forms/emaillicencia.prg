#Define Timeout 30  && timeout 30 secondes

o = Createobject("internetexplorer.application")
o.Navigate("http://www.atoutfox.org/ip.asp")
v_t = Seconds()

Do While o.ReadyState<>4 And (Seconds() -v_t) <= Timeout
	DoEvents
Enddo
If o.ReadyState<>4
	v_ip = "0.0.0.0"
Else
	v_ip = o.Document.nameprop()
Endif
Release o

LF = Len(Alltrim(Sys(0)))-( At("#",Sys(0))+1)
WEQUIPO = Subs(Sys(0),1,At("#",Sys(0))-1)
WUSUARIO = Subs(Sys(0),At("#",Sys(0))+2,LF)

PDIRE1 =PDIR1
PDIRE2 =PDIR2
PDIRE3 =PDIR3
p_PROPIETA = M.PROPIETA

Try
	Local lcSchema, loConfig, loMsg, loError, lcErr
	lcErr = ""
	lcSchema = "http://schemas.microsoft.com/cdo/configuration/"
	loConfig = Createobject("CDO.Configuration")

	With loConfig.Fields
		.Item(lcSchema + "smtpserver") = "smtp.gmail.com"
		.Item(lcSchema + "smtpserverport") = 465 && ó 587
		.Item(lcSchema + "sendusing") = 2
		.Item(lcSchema + "smtpauthenticate") = .T.
		.Item(lcSchema + "smtpusessl") = .T.
		.Item(lcSchema + "sendusername") = "robotcomlablicencia@gmail.com"
		.Item(lcSchema + "sendpassword") = "bundecote1963"
		.Update
	Endwith

	loMsg = Createobject ("CDO.Message")
	
	With loMsg
		.Configuration = loConfig
		.From = "robotcomlablicencia@gmail.com"
		.To = "programalabo@hotmail.com"
		.Subject = "ORDEN DE COMPRA: "+MRAZON
		.TextBody = "EQUIPO: " + WEQUIPO + " USUARIO: "+ WUSUARIO + Chr(13)+ ;
			" EMPRESA: "+ ALLTRIM(m.empresa)+ Chr(13)+;
			"PROPIETARIO: " + ALLTRIM(M.PROPIETA) +Chr(13)+;
			" AUTORIZACION: " + m.regisalud + Chr(13)+ ;
			" TELEFONO: "+m.TELEFONO+Chr(13)+;
			"IP: " + v_ip+ " HD:"+PSERIEDISCO+Chr(13)+;
		"DIRECCION: "+ PDIRE1 +Chr(13)+;
		PDIRE2+Chr(13) + ;
		PDIRE3+Chr(13)+Chr(13)	
		.Send()
	Endwith

	Messagebox("Datos DE CCOMPRAS enviados",48,"Envio de datos")


Catch To loError
	lcErr = [Error: ] + Str(loError.ErrorNo) + Chr(13) + ;
		[Linea: ] + Str(loError.Lineno) + Chr(13) + ;
		[Mensaje: ] + loError.Message

	Messagebox("Error de envio..."+ + loError.Message )
Finally

	Release loConfig, loMsg
	Store .Null. To loConfig, loMsg

	If Empty(lcErr)
** MESSAGEBOX("El mensaje se envió con éxito", 64, "Aviso")
	Else
** MESSAGEBOX(lcErr, 16 , "Error")
	Endif

Endtry
