***Con SYS(16,1) retornas la ruta completa y el nombre de la aplicación.
 
* Prueba.prg
SET STEP ON 

 lcRutaArchivo = SYS(16,1)
 lcSoloRuta = ADDBS(JUSTPATH(SYS(16,1)))
 lcSoloArchivo = JUSTFNAME(SYS(16,1))
 lcSoloUnidad = JUSTDRIVE(SYS(16,1))
 ? lcRutaArchivo
 ? lcSoloRuta
 ? lcSoloArchivo
 ? lcSoloUnidad
 
