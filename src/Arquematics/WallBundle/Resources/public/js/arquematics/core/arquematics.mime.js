/**
 * arquematics.mime
 * 
 * @author Javier Trigueros Martínez de los Huertos
 * 
 * Copyright (c) 2014
 * Licensed under the MIT license.
 * 
 * dependencias:
 * - 
 */
var arquematics = (function(arquematics) {

arquematics.mime = {
   // Mirar http://webdesign.about.com/od/multimedia/a/mime-types-by-content-type.htm
   // fuente http://help.dottoro.com/lapuadlp.php
   ///tipo principal es [0] los demas on alias
   mimeTypesMap:{
    '323':['text/h323'],
    'epub': ['application/epub+zip'],
    'aac':['audio/aac'],
    'abw':['application/abiword'],
    'acx':['application/internet-property-stream'],
    'ai':['application/illustrator'],
    'aif':['audio/aiff','audio/aifc','audio/x-aiff'],
    'aifc':['audio/aiff','audio/aifc','audio/x-aiff'],
    'aiff':['audio/aiff','audio/aifc','audio/x-aiff'],
    'asf':['video/x-ms-asf'],
    'asp':['application/x-asp','text/asp'],
    'asr':['video/x-ms-asf'],
    'asx':['video/x-ms-asf'],
    'au':['audio/basic','audio/au','audio/x-au','audio/x-basic'],
    'avi':['video/avi','application/x-troff-msvideo','image/avi','video/msvideo','video/x-msvideo','video/xmpg2'],
    'axs':['application/olescript'],
    'bas':['text/plain'],
    'bin':['application/octet-stream','application/bin','application/binary','application/x-msdownload'],
    'bmp':['image/bmp','application/bmp','application/x-bmp','image/ms-bmp','image/x-bitmap','image/x-bmp','image/x-ms-bmp','image/x-win-bitmap','image/x-windows-bmp','image/x-xbitmap'],
    'bz2':['application/x-bzip2','application/bzip2','application/x-bz2','application/x-bzip'],
    'c':['text/x-csrc'],
    'c++':['text/x-c++src'],
    'cab':['application/vndms-cab-compressed','application/cab','application/x-cabinet'],
    'cat':['application/vndms-pkiseccat'],
    'cct':['application/x-director'],
    'cdf':['application/cdf','application/x-cdf','application/netcdf','application/x-netcdf','text/cdf','text/x-cdf'],
    'cer':['application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'],
    'cfc':['application/x-cfm'],
    'cfm':['application/x-cfm'],
    'class':['application/x-java','application/java','application/java-byte-code','application/java-vm','application/x-java-applet','application/x-java-bean','application/x-java-class','application/x-java-vm','application/x-jinit-bean','application/x-jinit-applet'],
    'clp':['application/x-msclip'],
    'cmx':['image/x-cmx','application/cmx','application/x-cmx','drawing/cmx','image/x-cmx'],
    'cod':['image/cis-cod'],
    'cp':['text/x-c++src'],
    'cpio':['application/x-cpio'],
    'cpp':['text/x-c++src', 'text/x-c'],
    'crd':['application/x-mscardfile'],
    'crt':['application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'],
    'crl':['application/pkix-crl'],
    'csh':['application/x-csh'],
    'css':['text/css','application/css-stylesheet'],
    'cst':['application/x-director'],
    'csv':['text/csv','application/csv','text/comma-separated-values','text/x-comma-separated-values'],
    'cxt':['application/x-director'],
    'dcr':['application/x-director'],
    'der':['application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'],
    'dib':['image/bmp','application/bmp','application/x-bmp','image/ms-bmp','image/x-bitmap','image/x-bmp','image/x-ms-bmp','image/x-win-bitmap','image/x-windows-bmp','image/x-xbitmap'],
    'diff':['text/x-patch'],
    'dir':['application/x-director'],
    'dll':['application/x-msdownload','application/octet-stream','application/x-msdos-program'],
    'dms':['application/octet-stream'],
    'doc':['application/vndms-word','application/doc','application/msword','application/msword-doc','application/vndmsword','application/winword','application/word','application/x-msw6','application/x-msword','application/x-msword-doc'],
    'docm':['application/vnd.ms-word.document.macroEnabled.12'],
    'docx':['application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-word.document.12', 'application/vnd.openxmlformats-officedocument.word'],
    'dot':['application/msword'],
    'dotm':['application/vnd.ms-word.template.macroEnabled.12'],
    'dotx':['application/vnd.openxmlformats-officedocument.wordprocessingml.template'],
    'dta':['application/x-stata'],
    'dv':['video/x-dv'],
    'dvi':['application/x-dvi'],
    'dwg':['image/x-dwg','application/acad','application/autocad_dwg','application/dwg','application/x-acad','application/x-autocad','application/x-dwg','image/vnddwg'],
    'dxf':['application/x-autocad','application/dxf','application/x-dxf','drawing/x-dxf','image/vnddxf','image/x-autocad','image/x-dxf'],
    'dxr':['application/x-director'],
    'elc':['application/x-elc'],
    'eml':['message/rfc822'],
    'enl':['application/x-endnote-library','application/x-endnote-refer'],
    'enz':['application/x-endnote-library','application/x-endnote-refer'],
    'eps':['application/postscript','application/eps','application/x-eps','image/eps','image/x-eps'],
    'etx':['text/x-setext','text/anytext'],
    'evy':['application/envoy','application/x-envoy'],
    'exe':['application/x-msdos-program','application/dos-exe','application/exe','application/msdos-windows','application/x-sdlc','application/x-exe','application/x-winexe'],
    'fif':['application/fractals','image/fif'],
    'flr':['x-world/x-vrml'],
    'fm':['application/vndframemaker','application/framemaker','application/maker','application/vndmif','application/x-framemaker','application/x-maker','application/x-mif'],
    'fqd':['application/x-director'],
    'gif':['image/gif'],
    'gtar':['application/tar','application/x-gtar','application/x-tar'],
    'gz':['application/gzip','application/gzip-compressed','application/gzipped','application/x-gunzip','application/x-gzip'],
    'h':['text/x-chdr'],
    'hdf':['application/x-hdf'],
    'hlp':['application/winhlp','application/x-helpfile','application/x-winhelp'],
    'hqx':['application/binhex','application/mac-binhex','application/mac-binhex40'],  
    'hta':['application/hta'],
    'htc':['text/x-component'],
    'htm':['text/html','application/xhtml+xml'],
    'html':['text/html','application/xhtml+xml'],
    'htt':['text/webviewhtml'],
    'ico':['image/x-ico'],
    'ics':['text/calendar'],
    'ief':['image/ief'],
    'iii':['application/x-iphone'],
    'indd':['application/x-indesign'],
    'ins':['application/x-internet-signup'],
    'isp':['application/x-internet-signup'],
    'jad':['text/vndsunj2meapp-descriptor'],
    'jar':['application/java-archive'],
    'java':['text/x-java','java/*','text/java','text/x-java-source'],
    'jfif':['image/jpeg','image/pjpeg'],
    'jpe':['image/jpeg','image/pjpeg'],
    'jpeg':['image/jpeg','image/pjpeg'],
    'jpg':['image/jpeg','image/pjpeg'],
    'jp2':['image/jp2'],
    'fh': ['image/x-freehand'],
    'fhc': ['image/x-freehand'],
    'fh4': ['image/x-freehand'],
    'fh5': ['image/x-freehand'],
    'fh7': ['image/x-freehand'],
    'svgz': ['image/svg+xml'],
    'svg': ['image/svg+xml'],
    'jpx':['image/jp2'],
    'xcf': ['image/x-xcf'],
    'djvu': ['image/vnd.djvu'],
    'djv': ['image/vnd.djvu'],
    'js':['text/javascript','application/javascript','application/x-javascript','application/x-js'],
    'kml':['application/vndgoogle-earthkml+xml'],
    'kmz':['application/vndgoogle-earthkmz'],
    'latex':['application/x-latex','text/x-latex'],
    'lha':['application/x-lha','application/lha','application/lzh','application/x-lzh','application/x-lzh-archive'],
    'lib':['application/x-endnote-library','application/x-endnote-refer'],
    'llb':['application/x-labview','application/x-labview-vi'],
    'log':['text/x-log'],
    'lsf':['video/x-la-asf'],
    'lsx':['video/x-la-asf'],
    'lvx':['application/x-labview-exec'],
    'lzh':['application/x-lha','application/lha','application/lzh','application/x-lzh','application/x-lzh-archive'],
    'm':['text/x-objcsrc'],
    'm1v':['video/mpeg'],
    'm2v':['video/mpeg'],
    'm3u':['audio/x-mpegurl','application/x-winamp-playlist','audio/mpegurl','audio/mpeg-url','audio/playlist','audio/scpls','audio/x-scpls'],
    'm4a':['audio/m4a','audio/x-m4a'],
    'm4v':['video/mp4','video/mpeg4','video/x-m4v'],
    'ma':['application/mathematica'],
    'mail':['message/rfc822'],
    'man':['application/x-troff-man'],
    'mcd':['application/x-mathcad','application/mcad'],
    'mdb':['application/vndms-access','application/mdb','application/msaccess','application/vndmsaccess','application/x-mdb','application/x-msaccess'],
    'me':['application/x-troff-me'],
    'mfp':['application/x-shockwave-flash','application/futuresplash'],
    'mht':['message/rfc822'],
    'mhtml':['message/rfc822'],
    'mid':['audio/x-midi','application/x-midi','audio/mid','audio/midi','audio/soundtrack'],
    'midi':['audio/x-midi','application/x-midi','audio/mid','audio/midi','audio/soundtrack'],
    'mif':['application/vndframemaker','application/framemaker','application/maker','application/vndmif','application/x-framemaker','application/x-maker','application/x-mif'],
    'mny':['application/x-msmoney'],
    'mov':['video/quicktime'],
    'mp2':['video/mpeg','audio/mpeg','audio/x-mpeg','audio/x-mpeg-2','video/x-mpeg','video/x-mpeq2a'],
    'mp3':['audio/mpeg','audio/mp3','audio/mpeg3','audio/mpg','audio/x-mp3','audio/x-mpeg','audio/x-mpeg3','audio/x-mpg'],
    'mpa':['video/mpeg'],
    'mpe':['video/mpeg'],
    'mpeg':['video/mpeg'],
    'mpg':['video/mpeg'],
    'mpp':['application/vndms-project','application/mpp','application/msproj','application/msproject','application/x-dos_ms_project','application/x-ms-project','application/x-msproject'],
    'mpv2':['video/mpeg'],
    'mqv':['video/quicktime'],
    'ms':['application/x-troff-ms'],
    'mvb':['application/x-msmediaview'],
    'mws':['application/x-maple','application/maple-v-r4'],
    'nb':['application/mathematica'],
    'nws':['message/rfc822'],
    'oda':['application/oda'],
    'odc':['application/vnd.oasis.opendocument.chart'],
    'odf':['application/vnd.oasis.opendocument.formula'],
    'odg':['application/vnd.oasis.opendocument.graphics'],
    'odp':['application/vnd.oasis.opendocument.presentation'],
    'ods':['application/vnd.oasis.opendocument.spreadsheet'],
    'ots':['application/vnd.oasis.opendocument.spreadsheet-template'],
    'ott':['application/vnd.oasis.opendocument.text-template'],
    'odt':['application/vnd.oasis.opendocument.text'],
    'ogg':['application/ogg','application/x-ogg','audio/x-ogg'],
    'one':['application/msonenote'],
    'p12':['application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'],
    'patch':['text/x-patch'],
    'pbm':['image/x-portable-bitmap','image/pbm','image/portable-bitmap','image/x-pbm'],
    'pcd':['image/x-photo-cd','image/pcd'],
    'pct':['image/x-pict','image/pict','image/x-macpict'],
    'pdf':['application/pdf','application/acrobat','application/nappdf','application/x-pdf','application/vndpdf','text/pdf','text/x-pdf'],
    'pfx':['application/x-pkcs12'],
    'pgm':['image/x-portable-graymap','image/x-pgm'],
    'php':['application/x-php','application/php','text/php','text/x-php'],
    'pic':['image/x-pict','image/pict','image/x-macpict'],
    'pict':['image/x-pict','image/pict','image/x-macpict'],
    'pjpeg':['image/jpeg','image/pjpeg'],
    'pl':['application/x-perl','text/x-perl'],
    'pls':['audio/x-mpegurl','application/x-winamp-playlist','audio/mpegurl','audio/mpeg-url','audio/playlist','audio/scpls','audio/x-scpls'],
    'pko':['application/yndms-pkipko'],
    'pm':['application/x-perl','text/x-perl'],
    'pmc':['application/x-perfmon'],
    'png':['image/png','image/x-png'],
    'pnm':['image/x-portable-anymap'],
    'pod':['text/x-pod'],
    'potm':['application/vndms-powerpointtemplatemacroEnabled12'],
    'potx':['application/vndopenxmlformats-officedocumentpresentationmltemplate'],
    'ppam':['application/vndms-powerpointaddinmacroEnabled12'],
    'ppm':['image/x-portable-pixmap','application/ppm','application/x-ppm','image/x-ppm'],
    'pps':['application/vndms-powerpoint','application/ms-powerpoint','application/mspowerpoint','application/powerpoint','application/ppt','application/vnd-mspowerpoint','application/vnd_ms-powerpoint','application/x-mspowerpoint','application/x-powerpoint'],
    'ppsm':['application/vnd.ms-powerpoint.slideshow.macroEnabled.12'],
    'ppsx':['application/vnd.openxmlformats-officedocument.presentationml.slideshow'],
    'ppt':['application/vnd.ms-powerpoint','application/ms-powerpoint','application/mspowerpoint','application/powerpoint','application/ppt','application/vnd-mspowerpoint','application/vnd_ms-powerpoint','application/x-mspowerpoint','application/x-powerpoint'],
    'pptm':['application/vnd.ms-powerpoint.presentation.macroEnabled.12'],
    'pptx':['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    'prf':['application/pics-rules'],
    'ps':['application/postscript','application/eps','application/x-eps','image/eps','image/x-eps'],
    'psd':['application/photoshop','application/psd','application/x-photoshop','image/photoshop','image/psd','image/x-photoshop','image/x-psd'],
    'pub':['application/vndms-publisher','application/x-mspublisher'],
    'py':['text/x-python'],
    'qt':['video/quicktime'],
    'ra':['audio/vndrn-realaudio','audio/vndpn-realaudio','audio/x-pn-realaudio','audio/x-pn-realaudio-plugin','audio/x-pn-realvideo','audio/x-realaudio'],
    'ram':['audio/vndrn-realaudio','audio/vndpn-realaudio','audio/x-pn-realaudio','audio/x-pn-realaudio-plugin','audio/x-pn-realvideo','audio/x-realaudio'],
    'rar':['application/rar','application/x-rar-compressed'],
    'ras':['image/x-cmu-raster'],
    'rgb':['image/x-rgb','image/rgb'],
    'rm':['application/vndrn-realmedia'],
    'rmi':['audio/mid'],
    'roff':['application/x-troff'],
    'rpm':['audio/vndrn-realaudio','audio/vndpn-realaudio','audio/x-pn-realaudio','audio/x-pn-realaudio-plugin','audio/x-pn-realvideo','audio/x-realaudio'],
    'rtf':['application/rtf','application/richtext','application/x-rtf','text/richtext','text/rtf'],
    'rtx':['application/rtf','application/richtext','application/x-rtf','text/richtext','text/rtf'],
    'rv':['video/vndrn-realvideo','video/x-pn-realvideo'],
    'sas':['application/sas','application/x-sas','application/x-sas-data','application/x-sas-log','application/x-sas-output'],
    'sav':['application/spss'],
    'scd':['application/x-msschedule'],
    'scm':['text/x-scriptscheme','text/x-scheme'],
    'sct':['text/scriptlet'],
    'sd2':['application/spss'],
    'sea':['application/x-sea'],
    'sh':['application/x-sh','application/x-shellscript'],
    'shar':['application/x-shar'],
    'shtml':['text/html','application/xhtml+xml'],
    'sit':['application/stuffit','application/x-sit','application/x-stuffit'],
    'smil':['application/smil','application/smil+xml'],
    'snd':['audio/basic','audio/au','audio/x-au','audio/x-basic'],
    'spl':['application/x-shockwave-flash','application/futuresplash'],
    'spo':['application/spss'],
    'sql':['text/x-sql','text/sql'],
    'src':['application/x-wais-source'],
    'sst':['application/vndms-pkicertstore'],
    'stl':['application/sla'],
    'stm':['text/html'],
    'swa':['application/x-director'],
    'swf':['application/x-shockwave-flash','application/futuresplash'],
    'sxw':['application/vndsunxmlwriter'],
    't':['application/x-troff'],
    'tar':['application/tar','application/x-gtar','application/x-tar'],
    'tcl':['application/x-tcl','text/x-scripttcl','text/x-tcl'],
    'tex':['application/x-tex','text/x-tex'],
    'tga':['image/x-targa','application/tga','application/x-targa','application/x-tga','image/targa','image/tga','image/x-tga'],
    'tgz':['application/gzip','application/gzip-compressed','application/gzipped','application/x-gunzip','application/x-gzip'],
    'tif':['image/tiff','application/tif','application/tiff','application/x-tif','application/x-tiff','image/tif','image/x-tif','image/x-tiff'],
    'tiff':['image/tiff','application/tif','application/tiff','application/x-tif','application/x-tiff','image/tif','image/x-tif','image/x-tiff'],
    'tnef':['application/ms-tnef'],
    'torrent': ['application/x-bittorrent'],
    'tfm': ['application/x-tex-tfm'],
    'tr':['application/x-troff'],
    'trm':['application/x-msterminal'],
    'tsv':['text/tsv','text/tab-separated-values','text/x-tab-separated-values'],
    'twb':['application/twb','application/twbx','application/x-twb'],
    'twbx':['application/twb','application/twbx','application/x-twb'],
    'text': ['text/plain'],
    'conf': ['text/plain'],
    'def': ['text/plain'],
    'list': ['text/plain'],
    'in': ['text/plain'],
    'txt':['text/plain'],
    'dsc': ['text/prs.lines.tag'],
    'uls':['text/iuls'],
    'ustar':['application/x-ustar'],
    'vcf':['text/x-vcard'],
    'vrml':['x-world/x-vrml'],
    'vsd':['application/vndvisio','application/visio','application/visiodrawing','application/vsd','application/x-visio','application/x-vsd','image/x-vsd'],
    'w3d':['application/x-director'],
    'war':['application/x-webarchive'],
    'wav':['audio/wav','audio/s-wav','audio/wave','audio/x-wav'],
    'wcm':['application/vndms-works'],
    'wdb':['application/vndms-works','application/x-msworks-wp'],
    'wks':['application/vndms-works','application/x-msworks-wp'],
    'wma':['audio/x-ms-wma'],
    'wmf':['image/x-wmf','application/wmf','application/x-msmetafile','application/x-wmf','image/wmf','image/x-win-metafile'],
    'wmv':['video/x-ms-wmv'],
    'wmz':['application/x-ms-wmz'],
    'wpd':['application/wordperfect','application/wordperf','application/wpd'],
    'wps':['application/vndms-works','application/x-msworks-wp'],
    'wri':['application/x-mswrite'],
    'wrl':['x-world/x-vrml'],
    'wrz':['x-world/x-vrml'],
    'xbm':['image/x-xbitmap'],
    'cc': ['text/x-c'],
    'cxx': ['text/x-c'],
    'hh': ['text/x-c'],
    'dic': ['text/x-c'],
    'xhtml':['text/html','application/xhtml+xml'],
    'xla':['application/vndms-excel'],
    'xlam':['application/vndms-exceladdinmacroEnabled12'],
    'xlc':['application/vndms-excel'],
    'xll':['application/vndms-excel','application/excel','application/msexcel','application/msexcell','application/x-dos_ms_excel','application/x-excel','application/x-ms-excel','application/x-msexcel','application/x-xls','application/xls'],
    'xlm':['application/vndms-excel'],
    'xls':['application/vndms-excel','application/excel','application/msexcel','application/msexcell','application/x-dos_ms_excel','application/x-excel','application/x-ms-excel','application/x-msexcel','application/x-xls','application/xls'],
    'xlsb':['application/vnd.ms-excel.sheet.binary.macroEnabled.12'],
    'xlsm':['application/vnd.ms-excel.sheet.macroEnabled.12'],
    'xlsx':['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    'xlt':['application/vndms-excel'],
    'xltm':['application/vndms-exceltemplatemacroEnabled12'],
    'xltx':['application/vndopenxmlformats-officedocumentspreadsheetmltemplate'],
    'xlw':['application/vndms-excel'],
    'xml':['text/xml','application/x-xml','application/xml'],
    'xpm':['image/x-xpixmap','image/x-xpm','image/xpm'],
    'xps':['application/vndms-xpsdocument'],
    'xsl':['text/xsl'],
    'xwd':['image/x-xwindowdump','image/xwd','image/x-xwd','application/xwd','application/x-xwd'],
    '7z':['application/x-7z-compressed'],
    'z':['application/x-compress','application/z','application/x-z'],
    'zip':['application/zip','application/x-compress','application/x-compressed','application/x-zip','application/x-zip-compressed','application/zip-compressed','application/x-7zip-compressed']
   },
  
   //tipos mime , icono y extension a convertir
   mimeTypesAndExt: {
         'text/plain': {icon: 'txt', convertType: 'txt'},
         
         'application/x-autocad': {icon: 'dxf', convertType: 'dxf'},
         'image/x-dwg': {icon: 'dwg', convertType: 'dwg'},
         
         'application/pdf': {icon: 'pdf', convertType: 'pdf'},
         'application/sla': {icon: 'stl', convertType: 'stl'},
         
         'application/zip': {icon: 'zip', convertType: 'zip'},
         'application/rar': {icon: 'zip', convertType: 'rar'},
         'application/photoshop': {icon: 'psd', convertType: 'psd'},
         //OpenOffice
         'application/vnd.oasis.opendocument.text': {icon: 'odt', convertType: 'odt'},
         'application/vnd.oasis.opendocument.presentation': {icon: 'odp', convertType: 'odp'},
         'application/vnd.oasis.opendocument.spreadsheet': {icon: 'ods', convertType: 'ods'},
         //Office 
         //word docx
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document':  {icon: 'doc', convertType: 'docx'},
         'application/vnd.ms-word.document.12':  {icon: 'doc', convertType: 'docx'},
         //word doc
         'application/vndms-word': {icon: 'doc', convertType:'doc'},
         'application/doc': {icon: 'doc', convertType:'doc'},
         'application/msword': {icon: 'doc', convertType:'doc'},
         'application/msword-doc': {icon: 'doc', convertType:'doc'},
         'application/vndmsword': {icon: 'doc', convertType:'doc'},
         'application/winword': {icon: 'doc', convertType:'doc'},
         'application/word': {icon: 'doc', convertType:'doc'},
         'application/x-msw6': {icon: 'doc', convertType:'doc'},
         'application/x-msword': {icon: 'doc', convertType:'doc'},
         'application/x-msword-doc': {icon: 'doc', convertType:'doc'},
         //powerpoint pptx
         'application/vnd.openxmlformats-officedocument.presentationml.slideshow': {icon: 'odp', convertType:'pptx'},
         'application/vnd.openxmlformats-officedocument.presentationml.presentation': {icon: 'odp',convertType:'pptx'},
          //powerpoint ppt
         'application/ms-powerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/mspowerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/powerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/ppt': {icon: 'ppt', convertType:'ppt'},
         'application/vnd-mspowerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/vnd_ms-powerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/x-mspowerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/x-powerpoint': {icon: 'ppt', convertType:'ppt'},
         'application/vnd.ms-powerpoint': {icon: 'ppt', convertType:'ppt'},
         //excel xls
         'application/vndms-excel': {icon: 'xls', convertType:'xls'},
         'application/excel': {icon: 'xls', convertType:'xls'},
         'application/msexcel': {icon: 'xls', convertType:'xls'},
         'application/msexcell': {icon: 'xls', convertType:'xls'},
         'application/x-dos_ms_excel': {icon: 'xls', convertType:'xls'},
         'application/x-excel': {icon: 'xls', convertType:'xls'},
         'application/x-ms-excel': {icon: 'xls', convertType:'xls'},
         'application/x-msexcel': {icon: 'xls', convertType:'xls'},
         'application/x-xls': {icon: 'xls', convertType:'xls'},
         'application/xls': {icon: 'xls', convertType:'xls'},
         //excel xlsx
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {icon: 'xls', convertType:'xlsx'}},
     
    
    getMimeTypesByExtensions: function (fileExtensions)
    {
        var ret = [];
        
        for ( var i = fileExtensions.length - 1;(i >= 0); --i)
        {
          ret.push(this.mimeTypesMap[fileExtensions[i]][0]);
        }
        
        return ret;
    },
    
    getMimeTypesByAllExtensions: function (fileExtensions)
    {
        var ret = [];
        
        for ( var i = fileExtensions.length - 1;(i >= 0); --i)
        {
           for (var ii = this.mimeTypesMap[fileExtensions[i]].length -1;(ii >= 0); --ii)
           {
              ret.push(this.mimeTypesMap[fileExtensions[i]][ii]); 
           }
        }
        return ret;
    },
    
    /**
     * devuelve el tipo mime real no el alias
     * 
     * @param {string}: mimeType
     * 
     *  @return {string}: false 
     */
    findRealMimeType: function(mimeType)
    {
        var ret = false
        , keys = [];
        
        if (mimeType && (mimeType.length > 0))
        {
            mimeType = mimeType.toLowerCase(); 
            
            for (var k in this.mimeTypesMap)
            {
                keys.push(k);
            }
        
            for ( var i = keys.length - 1;(!ret &&  (i > 0)); --i)
            {
                ret =  this.isFileType(mimeType, this.mimeTypesMap[keys[i]]); 
          
                if (ret)
                {
                    ret = this.mimeTypesMap[keys[i]][0];
                }  
            }   
        }
        return (!ret)?'':ret;
    },
    
    findExtensionByMimeType: function (mimeType) 
    {
        var realMimeType = this.findRealMimeType(mimeType)
        , keys = []
        , ret = false;
        
        if (realMimeType && (realMimeType.length > 0))
        {
            for (var k in this.mimeTypesMap)
            {
                keys.push(k);
            }
            
            for ( var i = keys.length - 1;(!ret &&  (i > 0)); --i)
            {
                ret =  (this.mimeTypesMap[keys[i]][0] === realMimeType); 
                if (ret)
                {
                    ret = keys[i];
                }  
            } 
        }
        
        return ret;
    },

    findRealMimeTypeByFileName: function(fileName)
    {
        var ret = ''
        , extension;
        if (fileName.length > 0)
        {
          extension = fileName.split('.').pop(); 
          if (extension && (extension.length > 0))
          {
             extension = extension.toLowerCase();
             ret = this.mimeTypesMap[extension]?this.mimeTypesMap[extension][0]: '';
          }
        }
        
        return ret;
    },
    
    isFileType: function(fileType, mimeTypes)
    {
       return (mimeTypes.indexOf(fileType) >= 0); 
    },
    
    isMimeVisorType:function (fileType)
    {
        return (this.isOfficeType(fileType) 
            || this.isPDFType(fileType) 
            || this.isSvgImageType(fileType) 
            || this.isOpenOfficeType(fileType)
            || this.is3DSTL(fileType)
            || this.isPsd(fileType)
            || this.isCompressedType(fileType)
            || this.isTextType(fileType));
    },

    isTextType: function(fileType)
    {
        return (this.isFileType(fileType, this.mimeTypesMap.txt));
    },
    
    isPDFType: function(fileType)
    {
        return (this.isFileType(fileType, this.mimeTypesMap.pdf));
    },
    
    isCompressedType: function(fileType)
    {
        return (this.isFileType(fileType, this.mimeTypesMap.zip.concat(
                                                this.mimeTypesMap.rar.concat(
                                                   this.mimeTypesMap.gz))));
    },
    
    isDxf: function(fileType)
    {
      return this.isFileType(fileType, this.mimeTypesMap.dxf);  
    },
    
    isDwg: function(fileType)
    {
      return this.isFileType(fileType, this.mimeTypesMap.dwg);  
    },
    
    isPsd: function(fileType)
    {
      return this.isFileType(fileType, this.mimeTypesMap.psd);  
    },
    
    isZip: function(fileType)
    {
      return this.isFileType(fileType, this.mimeTypesMap.zip);  
    },
    
    isRar: function(fileType)
    {
      return this.isFileType(fileType, this.mimeTypesMap.rar);  
    },
    
    
    isOpenOfficeType: function(fileType)
    {
        return (this.isFileType(fileType, ['application/vnd.oasis.opendocument.text',
                                           'application/vnd.oasis.opendocument.presentation',
                                           'application/vnd.oasis.opendocument.spreadsheet']));
    },
    
    isOfficeType: function(fileType)
    {
        return (this.isFileType(fileType, [
         //Office 
         //word docx
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'application/vnd.ms-word.document.12',
         //word doc
         'application/vndms-word',
         'application/doc',
         'application/msword',
         'application/msword-doc',
         'application/vndmsword',
         'application/winword',
         'application/word',
         'application/x-msw6',
         'application/x-msword',
         'application/x-msword-doc',
         //powerpoint pptx
         'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
         'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          //powerpoint ppt
         'application/ms-powerpoint',
         'application/mspowerpoint',
         'application/powerpoint',
         'application/ppt',
         'application/vnd-mspowerpoint',
         'application/vnd_ms-powerpoint',
         'application/x-mspowerpoint',
         'application/x-powerpoint',
         'application/vnd.ms-powerpoint',
         //excel xls
         'application/vndms-excel',
         'application/excel',
         'application/msexcel',
         'application/msexcell',
         'application/x-dos_ms_excel',
         'application/x-excel',
         'application/x-ms-excel',
         'application/x-msexcel',
         'application/x-xls',
         'application/xls',
         //excel xlsx
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                           ]));
    },
    
    is3DSTL: function (fileType)
    {
        return (this.isFileType(fileType, this.mimeTypesMap.stl));
    },
    
    getInputConvertNameType: function (fileType)
    {
        return (this.mimeTypesAndExt[fileType])?this.mimeTypesAndExt[fileType].convertType: false;
    },
    
    getInputIconByNameType: function (fileType)
    {
        return (this.mimeTypesAndExt[fileType])?this.mimeTypesAndExt[fileType].icon: false;
    },
    
    
    isImageType: function(fileType)
    {
        return (this.isFileType(fileType, ['image/x-portable-bitmap',
                                'image/jpg',
                                'image/jpeg',
                                'image/pjpeg',
                                'image/jpe',
                                'image/svg+xml',
                                'image/vnd.djvu',
                                'image/x-xcf',
                                'image/jfif',
                                'image/gif',
                                'image/jp2',
                                'image/png',
                                'image/bmp',
                                'image/tiff',
                                'image/tif'])); 
    },
    isSvgImageType: function(fileType)
    {
        return (this.isFileType(fileType, ['image/svg+xml'])); 
    }
  };
  
  return arquematics;
  
}(arquematics || {}));