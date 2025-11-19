MLINEA=""

IF (M.leucocita)<>""
	MLINEA=	PADL("LEUCOCITARIOS",20,"")	
	MLINEA=MLINEA + iif( alltr(M.leucocita)="+100"  ,alltr(M.leucocita),alltr(M.leucocita)+" - "+ALLTR(M.leu2)+ " POR CAMPO"+CHR(13)
	
ENDIF


IF (M.HEMATICOS)<>""
	MLINEA=	PADL("HEMATICOS",20,"")	
	MLINEA=MLINEA + iif( alltr(M.hematicos)="+100"  ,alltr(M.hematicos),alltr(M.hematicos)+" - "+ALLTR(M.HEMA2))+ " POR CAMPO"+CHR(13)
	
ENDIF


IF (M.HIALINOS)<>""
	MLINEA=	PADL("HIALINOS",20,"")	
	MLINEA=MLINEA + iif( alltr(M.hialinos)="+100"  ,alltr(M.hialinos),alltr(M.hialinos)+" - "+ALLTR(M.hia2))+ " POR CAMPO"+CHR(13)	
ENDIF


IF (M.CEREOS)<>""
	MLINEA=	PADL("CEREOS",20,"")	
	MLINEA=MLINEA + iif( alltr(M.CEREOS)="+100"  ,alltr(M.CEREOS),alltr(M.CEREOS)+" - "+ALLTR(M.cere2)) + " POR CAMPO"+CHR(13)	
ENDIF



IF (M.granuloso)<>""
	MLINEA=	PADL("GRANULOSOS Fino",20,"")	
	MLINEA=MLINEA +iif( alltr(M.granuloso)="+100"  ,alltr(M.granuloso),alltr(M.granuloso)+" - "+ALLTR(M.GRANU2)) + " POR CAMPO"+CHR(13)	
ENDIF


IF (M.granuFINO)<>""
	MLINEA=	PADL("GRANULOSOS Grueso",20,"")	
	MLINEA=MLINEA +iif( alltr(M.granuFINO)="+100"  ,alltr(M.granuFINO),alltr(M.granuFINO)+" - "+ALLTR(M.GRAFI2)) + " POR CAMPO"+CHR(13)	
ENDIF


IF (M.cilindriod)<>""
	MLINEA=	PADL("CILINDROIDES",20,"")	
	MLINEA=MLINEA +iif( alltr(M.cilindriod)="+100"  ,alltr(M.cilindriod),alltr(M.cilindriod)+" - "+ALLTR(M.CILI2)) + " POR CAMPO"+CHR(13)	
ENDIF




IF (M.mixtos)<>""
	MLINEA=	PADL("MIXTOS",20,"")	
	MLINEA=MLINEA +iif( alltr(M.mixtos)="+100"  ,alltr(M.mixtos),alltr(M.mixtos)+" - "+ALLTR(M.mix2))+ " POR CAMPO"+CHR(13)	
ENDIF




IF (M.mixtos)<>""
	MLINEA=MLINEA + M.OTROS + " POR CAMPO"+CHR(13)	
ENDIF








