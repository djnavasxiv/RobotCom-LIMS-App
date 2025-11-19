*** Definir el timeout (en segundos)
#define TIMEOUT 30

*** Obtener la dirección IP
o = createobject("internetexplorer.application")
o.Navigate("http://www.atoutfox.org/ip.asp")
v_t = SECONDS()

DO WHILE o.ReadyState <> 4 AND (SECONDS() - v_t) <= TIMEOUT
    DOEVENTS
ENDDO

IF o.ReadyState <> 4
    v_ip = "0.0.0.0"
ELSE
    v_ip = o.document.nameprop()
ENDIF

RELEASE o

*** Datos del correo electrónico
mrazon = "LABORATORIO LA UNION"

LF = LEN(ALLTRIM(SYS(0))) - (AT("#", SYS(0)) + 1)
WEQUIPO = SUBS(SYS(0), 1, AT("#", SYS(0)) - 1)
WUSUARIO = SUBS(SYS(0), AT("#", SYS(0)) + 2, LF)

PDIRE1 = PDIR1
PDIRE2 = PDIR2
PDIRE3 = PDIR3

TRY
    LOCAL lcSchema, loConfig, loMsg, loError, lcErr
    lcErr = ""
    lcSchema = "http://schemas.microsoft.com/cdo/configuration/"
    loConfig = CREATEOBJECT("CDO.Configuration")

    WITH loConfig.Fields
        .Item(lcSchema + "smtpserver") = "smtp.gmail.com"
        .Item(lcSchema + "smtpserverport") = 465 && Puerto SSL para Gmail
        .Item(lcSchema + "sendusing") = 2  && Envío usando SMTP
        .Item(lcSchema + "smtpauthenticate") = .T. && Autenticación requerida
        .Item(lcSchema + "smtpusessl") = .T. && Usar SSL
        .Item(lcSchema + "sendusername") = "robotcomlab@gmail.com" && Correo remitente
        .Item(lcSchema + "sendpassword") = "RobotComlabJonach1263" && Contraseña del correo remitente
        .Update
    ENDWITH

    loMsg = CREATEOBJECT("CDO.Message")

    WITH loMsg
        .Configuration = loConfig
        .FROM = "robotcomlab@gmail.com"
        .TO = "programalabo@hotmail.com"
        .Subject = mrazon
        .TextBody = "EQUIPO: " + WEQUIPO + " USUARIO " + WUSUARIO + ;
                    " EMPRESA " + mrazon + CHR(13) + ;
                    "IP:" + v_ip + CHR(13) + ;
                    "DIRECCION: " + PDIRE1 + CHR(13) + ;
                    PDIRE2 + CHR(13) + ;
                    PDIRE3 + CHR(13) + CHR(13)
        .Send()
    ENDWITH

CATCH TO loError
    lcErr = [Error: ] + STR(loError.ERRORNO) + CHR(13) + ;
            [Linea: ] + STR(loError.LINENO) + CHR(13) + ;
            [Mensaje: ] + loError.MESSAGE
FINALLY
    RELEASE loConfig, loMsg
    STORE .NULL. TO loConfig, loMsg

    IF EMPTY(lcErr)
        MESSAGEBOX("El mensaje se envió con éxito", 64, "Aviso")
    ELSE
        MESSAGEBOX(lcErr, 16, "Error al enviar el correo")
    ENDIF
ENDTRY
