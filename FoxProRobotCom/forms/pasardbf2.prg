SET ECHO OFF 
SET TALK OFF

*-----------------------------------
* AUTHOR: Trevor Hancock
* CREATEC: 02/15/08 04:55:31 PM
* ABSTRACT: Code demonstrates how to connect to
* and extract data from an Excel 2007 Workbook
* using the "Microsoft Excel Driver (*.xls, *.xlsx, *.xlsm, *.xlsb)"
* from the 2007 Office System Driver: Data Connectivity Components

LOCAL lcXLBook AS STRING, lnSQLHand AS INTEGER, ;
    lcSQLCmd AS STRING, lnSuccess AS INTEGER, ;
    lcConnstr AS STRING
CLEAR

lcXLBook=GETFILE('XLS', 'Browse or Create a .XSL:') 

lcConnstr = [Driver=] + ;
    [{Microsoft Excel Driver (*.xls, *.xlsx, *.xlsm, *.xlsb)};] + ;
    [DBQ=] + lcXLBook

IF !FILE( lcXLBook )
    ? [Excel file not found]
    RETURN .F.
ENDIF
*-- Attempt a connection to the .XLSX WorkBook.
*-- NOTE: If the specified workbook is not found,
*-- it will be created by this driver! You cannot rely on a
*-- connection failure - it will never fail. Ergo, success
*-- is not checked here. Used FILE() instead.
lnSQLHand = SQLSTRINGCONNECT( lcConnstr )

*-- Connect successful if we are here. Extract data...
** lcSQLCmd = [Select * FROM "Sheet1$"]

lcSQLCmd = [Select * FROM "PARTIDAS$"]

lnSuccess = SQLEXEC( lnSQLHand, lcSQLCmd, [xlResults] )
? [SQL Cmd Success:], IIF( lnSuccess > 0, 'Good!', 'Failed' )
IF lnSuccess < 0
    LOCAL ARRAY laErr[1]
    AERROR( laErr )
    ? laErr(3)
    SQLDISCONNECT( lnSQLHand )
    RETURN .F.
ENDIF


*-- Show the results
SQLDISCONNECT( lnSQLHand )

SELECT xlResults
IF RECCOUNT()=0
	MESSAGEBOX("NO HAY REGISTROS PARA IMPORTAR",48,"VERIFIQUE ARCHIVO DE DATOS")
	USE IN xlResults
	RETURN
ENDIF

SELECT xlResults

COPY TO C:\LABOCLI\QUIPLANTILLA









