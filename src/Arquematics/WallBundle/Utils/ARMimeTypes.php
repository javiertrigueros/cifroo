<?php

namespace Arquematics\WallBundle\Utils;

class ARMimeTypes
{

    static private $instancia = null;
    
    //lista de previsualizaciones
    static  $mimeTypesPreviewMap = array(
        'application/sla' => 'stl',
        //dwg
        'image/x-dwg'               => 'png',
        'application/acad'          => 'png',
        'application/autocad_dwg'   => 'png',
        'application/dwg'           => 'png',
        'application/x-acad'        => 'png',
        'application/x-autocad'     => 'png',
        'application/x-dwg'         => 'png',
        'image/vnddwg'              => 'png',
        //dxf
        'application/x-autocad'     => 'png',
        'application/dxf'           => 'png',
        'application/x-dxf'         => 'png',
        'drawing/x-dxf'             => 'png',
        'image/vnddxf'              => 'png',
        'image/x-autocad'           => 'png',
        'image/x-dxf'               => 'png',
        //images
        'image/x-portable-bitmap' => 'jpg',
        'image/jpg' => 'jpg',
        'image/jpeg' => 'jpg',  
        'image/pjpeg' => 'jpg',
        'image/jpe' => 'jpg',
        'image/gif' => 'jpg',
        'image/jp2' => 'jpg',
        'image/png' => 'jpg',
        'image/bmp' => 'jpg',
        'image/tiff' => 'jpg',
        'image/tif' => 'jpg',
        //svg
        'image/svg+xml' => 'png',
        //'doc' 
        'application/vndms-word'  => 'pdf',
        'application/doc'  => 'pdf',
        'application/msword'  => 'pdf',
        'application/msword-doc'  => 'pdf',
        'application/vndmsword'  => 'pdf',
        'application/winword'  => 'pdf',
        'application/word'  => 'pdf',
        'application/x-msw6'  => 'pdf',
        'application/x-msword'  => 'pdf',
        'application/x-msword-doc'  => 'pdf',
        //'docx'
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'pdf',
        'application/vnd.ms-word.document.12' => 'pdf',
        'application/vnd.openxmlformats-officedocument.word' => 'pdf',
        //'xls'
        'application/vndms-excel'  => 'pdf',
        'application/excel' => 'pdf',
        'application/msexcel'  => 'pdf',
        'application/msexcell'  => 'pdf',
        'application/x-dos_ms_excel' => 'pdf',
        'application/x-excel' => 'pdf',
        'application/x-ms-excel' => 'pdf',
        'application/x-msexcel' => 'pdf',
        'application/x-xls' => 'pdf',
        'application/xls' => 'pdf',
        //'xlsx' 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'pdf',
         //rar
        'application/rar' => 'rar',
        'application/x-rar-compressed' => 'rar',
        //'zip'
        'application/zip' => 'zip',
        'application/x-compress' => 'zip',
        'application/x-compressed' => 'zip',
        'application/x-zip' => 'zip',
        'application/x-zip-compressed' => 'zip',
        'application/zip-compressed' => 'zip',
        'application/x-7zip-compressed' => 'zip',
        //'tgz'
        'application/gzip' => 'zip',
        'application/gzip-compressed' => 'zip',
        'application/gzipped' => 'zip',
        'application/x-gunzip' => 'zip',
        'application/x-gzip' => 'zip',
        //'ppt'
        'application/vnd.ms-powerpoint' => 'pdf',
        'application/ms-powerpoint' => 'pdf',
        'application/mspowerpoint' => 'pdf',
        'application/powerpoint' => 'pdf',
        'application/ppt' => 'pdf',
        'application/vnd-mspowerpoint' => 'pdf',
        'application/vnd_ms-powerpoint' => 'pdf',
        'application/x-mspowerpoint' => 'pdf',
        'application/x-powerpoint' => 'pdf',
        //'pptx'
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'  => 'pdf',
        //odp
        'application/vnd.oasis.opendocument.presentation' => 'pdf',
        //'pdf'
        'application/pdf' => 'pdf',
        'application/acrobat' => 'pdf',
        'application/nappdf' => 'pdf',
        'application/x-pdf' => 'pdf',
        'application/vndpdf' => 'pdf',
        'text/pdf' => 'pdf',
        'text/x-pdf' => 'pdf',
        //'ods' 
        'application/vnd.oasis.opendocument.spreadsheet' => 'pdf',
        //'odt'
        'application/vnd.oasis.opendocument.text' => 'pdf',
        //psd
        'application/photoshop' => 'png',
        'application/psd' => 'png',
        'application/x-photoshop' => 'png',
        'image/photoshop' => 'png',
        'image/psd' => 'png',
        'image/x-photoshop' => 'png',
        'image/x-psd' => 'png'
    );
    
    //agrupaciones de tipos mime del explorador
    static  $mimeTypesGroupMap = array(
        'application/sla' => 'stl',
        //dwg
        'image/x-dwg' => 'dwg',
        'application/acad' => 'dwg',
        'application/autocad_dwg' => 'dwg',
        'application/dwg' => 'dwg',
        'application/x-acad' => 'dwg',
        'application/x-autocad' => 'dwg',
        'application/x-dwg' => 'dwg',
        'image/vnddwg' => 'dwg',
        //dxf
        'application/x-autocad' => 'dxf',
        'application/dxf' => 'dxf',
        'application/x-dxf' => 'dxf',
        'drawing/x-dxf' => 'dxf',
        'image/vnddxf' => 'dxf',
        'image/x-autocad' => 'dxf',
        'image/x-dxf' => 'dxf',
        //images
        'image/x-portable-bitmap'   => 'gif',
        'image/jpg'                 => 'gif',
        'image/jpeg'                => 'gif',  
        'image/pjpeg'               => 'gif',
        'image/jpe'                 => 'gif',
        'image/gif'                 => 'gif',
        'image/jp2'                 => 'gif',
        'image/png'                 => 'gif',
        'image/bmp'                 => 'gif',
        'image/tiff'                => 'gif',
        'image/tif'                 => 'gif',
        //SVG
        'image/svg+xml'             => 'svg',
        //'doc' 
        'application/vndms-word'  => 'doc',
        'application/doc'  => 'doc',
        'application/msword'  => 'doc',
        'application/msword-doc'  => 'doc',
        'application/vndmsword'  => 'doc',
        'application/winword'  => 'doc',
        'application/word'  => 'doc',
        'application/x-msw6'  => 'doc',
        'application/x-msword'  => 'doc',
        'application/x-msword-doc'  => 'doc',
        //'docx'
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'doc',
        'application/vnd.ms-word.document.12' => 'doc',
        'application/vnd.openxmlformats-officedocument.word' => 'doc',
         //'odt'
        'application/vnd.oasis.opendocument.text' => 'doc',
        //'xls'
        'application/vndms-excel'  => 'xls',
        'application/excel' => 'xls',
        'application/msexcel'  => 'xls',
        'application/msexcell'  => 'xls',
        'application/x-dos_ms_excel' => 'xls',
        'application/x-excel' => 'xls',
        'application/x-ms-excel' => 'xls',
        'application/x-msexcel' => 'xls',
        'application/x-xls' => 'xls',
        'application/xls' => 'xls',
        //'xlsx' 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xls',
        //'ods' 
        'application/vnd.oasis.opendocument.spreadsheet' => 'xls',
        //rar
        'application/rar' => 'zip',
        'application/x-rar-compressed' => 'zip',
        //'zip'
        'application/zip' => 'zip',
        'application/x-compress' => 'zip',
        'application/x-compressed' => 'zip',
        'application/x-zip' => 'zip',
        'application/x-zip-compressed' => 'zip',
        'application/zip-compressed' => 'zip',
        'application/x-7zip-compressed' => 'zip',
        //'tgz'
        'application/gzip' => 'zip',
        'application/gzip-compressed' => 'zip',
        'application/gzipped' => 'zip',
        'application/x-gunzip' => 'zip',
        'application/x-gzip' => 'zip',
        //'ppt'
        'application/vnd.ms-powerpoint' => 'ppt',
        'application/ms-powerpoint' => 'ppt',
        'application/mspowerpoint' => 'ppt',
        'application/powerpoint' => 'ppt',
        'application/ppt' => 'ppt',
        'application/vnd-mspowerpoint' => 'ppt',
        'application/vnd_ms-powerpoint' => 'ppt',
        'application/x-mspowerpoint' => 'ppt',
        'application/x-powerpoint' => 'ppt',
        //odp
        'application/vnd.oasis.opendocument.presentation' => 'ppt',
        //'pptx'
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'  => 'ppt',
        //'pdf'
        'application/pdf' => 'pdf',
        'application/acrobat' => 'pdf',
        'application/nappdf' => 'pdf',
        'application/x-pdf' => 'pdf',
        'application/vndpdf' => 'pdf',
        'text/pdf' => 'pdf',
        'text/x-pdf' => 'pdf',
        //psd
        'application/photoshop' => 'psd',
        'application/psd' => 'psd',
        'application/x-photoshop' => 'psd',
        'image/photoshop' => 'psd',
        'image/psd' => 'psd',
        'image/x-photoshop' => 'psd',
        'image/x-psd' => 'psd'
    );
   
    static  $mimeTypesInverseMap = array(
        'application/sla' => 'stl',
        //dwg
        'image/x-dwg' => 'dwg',
        'application/acad' => 'dwg',
        'application/autocad_dwg' => 'dwg',
        'application/dwg' => 'dwg',
        'application/x-acad' => 'dwg',
        'application/x-autocad' => 'dwg',
        'application/x-dwg' => 'dwg',
        'image/vnddwg' => 'dwg',
        //dxf
        'application/x-autocad' => 'dxf',
        'application/dxf' => 'dxf',
        'application/x-dxf' => 'dxf',
        'drawing/x-dxf' => 'dxf',
        'image/vnddxf' => 'dxf',
        'image/x-autocad' => 'dxf',
        'image/x-dxf' => 'dxf',
        //images
        'image/x-portable-bitmap' => 'bmp',
        'image/jpg' => 'jpg',
        'image/jpeg' => 'jpg',  
        'image/pjpeg' => 'jpg',
        'image/jpe' => 'jpg',
        'image/svg+xml' => 'svg',
        'image/gif' => 'gif',
        'image/jp2' => 'jp2',
        'image/png' => 'png',
        'image/bmp' => 'bmp',
        'image/tiff' => 'tif',
        'image/tif' => 'tif',
        //'doc' 
        'application/vndms-word'  => 'doc',
        'application/doc'  => 'doc',
        'application/msword'  => 'doc',
        'application/msword-doc'  => 'doc',
        'application/vndmsword'  => 'doc',
        'application/winword'  => 'doc',
        'application/word'  => 'doc',
        'application/x-msw6'  => 'doc',
        'application/x-msword'  => 'doc',
        'application/x-msword-doc'  => 'doc',
        //'docx'
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        'application/vnd.ms-word.document.12' => 'docx',
        'application/vnd.openxmlformats-officedocument.word' => 'docx',
        //'odt'
        'application/vnd.oasis.opendocument.text' => 'odt',
        //'xls'
        'application/vndms-excel'  => 'xls',
        'application/excel' => 'xls',
        'application/msexcel'  => 'xls',
        'application/msexcell'  => 'xls',
        'application/x-dos_ms_excel' => 'xls',
        'application/x-excel' => 'xls',
        'application/x-ms-excel' => 'xls',
        'application/x-msexcel' => 'xls',
        'application/x-xls' => 'xls',
        'application/xls' => 'xls',
        //'xlsx' 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
        //rar
        'application/rar' => 'rar',
        'application/x-rar-compressed' => 'rar',
        //'zip'
        'application/zip' => 'zip',
        'application/x-compress' => 'zip',
        'application/x-compressed' => 'zip',
        'application/x-zip' => 'zip',
        'application/x-zip-compressed' => 'zip',
        'application/zip-compressed' => 'zip',
        'application/x-7zip-compressed' => 'zip',
        //'tgz'
        'application/gzip' => 'tgz',
        'application/gzip-compressed' => 'tgz',
        'application/gzipped' => 'tgz',
        'application/x-gunzip' => 'tgz',
        'application/x-gzip' => 'tgz',
        //'ppt'
        'application/vnd.ms-powerpoint' => 'ppt',
        'application/ms-powerpoint' => 'ppt',
        'application/mspowerpoint' => 'ppt',
        'application/powerpoint' => 'ppt',
        'application/ppt' => 'ppt',
        'application/vnd-mspowerpoint' => 'ppt',
        'application/vnd_ms-powerpoint' => 'ppt',
        'application/x-mspowerpoint' => 'ppt',
        'application/x-powerpoint' => 'ppt',
        //'pptx'
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'  => 'pptx',
        //odp
        'application/vnd.oasis.opendocument.presentation' => 'odp',
        //'pdf'
        'application/pdf' => 'pdf',
        'application/acrobat' => 'pdf',
        'application/nappdf' => 'pdf',
        'application/x-pdf' => 'pdf',
        'application/vndpdf' => 'pdf',
        'text/pdf' => 'pdf',
        'text/x-pdf' => 'pdf',
        //'ods' 
        'application/vnd.oasis.opendocument.spreadsheet' => 'ods',
        //psd
        'application/photoshop' => 'psd',
        'application/psd' => 'psd',
        'application/x-photoshop' => 'psd',
        'image/photoshop' => 'psd',
        'image/psd' => 'psd',
        'image/x-photoshop' => 'psd',
        'image/x-psd' => 'psd'
        
    );
    
    
    
    static  $mimeTypesMap = array(
    '323' => array('text/h323'),
    'epub'=> array('application/epub+zip'),
    'aac'=> array('audio/aac'),
    'abw'=> array('application/abiword'),
    'acx'=> array('application/internet-property-stream'),
    'ai' => array('application/illustrator'),
    'aif'=> array('audio/aiff','audio/aifc','audio/x-aiff'),
    'aifc'=> array('audio/aiff','audio/aifc','audio/x-aiff'),
    'aiff'=> array('audio/aiff','audio/aifc','audio/x-aiff'),
    'asf'=> array('video/x-ms-asf'),
    'asp'=> array('application/x-asp','text/asp'),
    'asr'=> array('video/x-ms-asf'),
    'asx'=> array('video/x-ms-asf'),
    'au' => array('audio/basic','audio/au','audio/x-au','audio/x-basic'),
    'avi'=> array('video/avi','application/x-troff-msvideo','image/avi','video/msvideo','video/x-msvideo','video/xmpg2'),
    'axs'=> array('application/olescript'),
    'bas'=> array('text/plain'),
    'bin'=> array('application/octet-stream','application/bin','application/binary','application/x-msdownload'),
    'bmp'=> array('image/bmp','application/bmp','application/x-bmp','image/ms-bmp','image/x-bitmap','image/x-bmp','image/x-ms-bmp','image/x-win-bitmap','image/x-windows-bmp','image/x-xbitmap'),
    'bz2'=> array('application/x-bzip2','application/bzip2','application/x-bz2','application/x-bzip'),
    'c'  => array('text/x-csrc'),
    'c++'=> array('text/x-c++src'),
    'cab'=> array('application/vndms-cab-compressed','application/cab','application/x-cabinet'),
    'cat'=> array('application/vndms-pkiseccat'),
    'cct'=> array('application/x-director'),
    'cdf'=> array('application/cdf','application/x-cdf','application/netcdf','application/x-netcdf','text/cdf','text/x-cdf'),
    'cer' => array('application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'),
    'cfc' => array('application/x-cfm'),
    'cfm' => array('application/x-cfm'),
    'class'=> array('application/x-java','application/java','application/java-byte-code','application/java-vm','application/x-java-applet','application/x-java-bean','application/x-java-class','application/x-java-vm','application/x-jinit-bean','application/x-jinit-applet'),
    'clp' => array('application/x-msclip'),
    'cmx' => array('image/x-cmx','application/cmx','application/x-cmx','drawing/cmx','image/x-cmx'),
    'cod' => array('image/cis-cod'),
    'cp'  => array('text/x-c++src'),
    'cpio'=> array('application/x-cpio'),
    'cpp' => array('text/x-c++src', 'text/x-c'),
    'crd' => array('application/x-mscardfile'),
    'crt' => array('application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'),
    'crl' => array('application/pkix-crl'),
    'csh' => array('application/x-csh'),
    'css' => array('text/css','application/css-stylesheet'),
    'cst' => array('application/x-director'),
    'csv' => array('text/csv','application/csv','text/comma-separated-values','text/x-comma-separated-values'),
    'cxt' => array('application/x-director'),
    'dcr' => array('application/x-director'),
    'der' => array('application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'),
    'dib' => array('image/bmp','application/bmp','application/x-bmp','image/ms-bmp','image/x-bitmap','image/x-bmp','image/x-ms-bmp','image/x-win-bitmap','image/x-windows-bmp','image/x-xbitmap'),
    'diff'=> array('text/x-patch'),
    'dir' => array('application/x-director'),
    'dll' => array('application/x-msdownload','application/octet-stream','application/x-msdos-program'),
    'dms' => array('application/octet-stream'),
    'doc' => array('application/vndms-word','application/doc','application/msword','application/msword-doc','application/vndmsword','application/winword','application/word','application/x-msw6','application/x-msword','application/x-msword-doc'),
    'docm'=> array('application/vnd.ms-word.document.macroEnabled.12'),
    'docx'=> array('application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-word.document.12', 'application/vnd.openxmlformats-officedocument.word'),
    'dot' => array('application/msword'),
    'dotm'=> array('application/vnd.ms-word.template.macroEnabled.12'),
    'dotx'=> array('application/vnd.openxmlformats-officedocument.wordprocessingml.template'),
    'dta' => array('application/x-stata'),
    'dv'  => array('video/x-dv'),
    'dvi' => array('application/x-dvi'),
    'dwg' => array('image/x-dwg','application/acad','application/autocad_dwg','application/dwg','application/x-acad','application/x-autocad','application/x-dwg','image/vnddwg'),
    'dxf' => array('application/x-autocad','application/dxf','application/x-dxf','drawing/x-dxf','image/vnddxf','image/x-autocad','image/x-dxf'),
    'dxr' => array('application/x-director'),
    'elc' => array('application/x-elc'),
    'eml' => array('message/rfc822'),
    'enl' => array('application/x-endnote-library','application/x-endnote-refer'),
    'enz' => array('application/x-endnote-library','application/x-endnote-refer'),
    'eps' => array('application/postscript','application/eps','application/x-eps','image/eps','image/x-eps'),
    'etx' => array('text/x-setext','text/anytext'),
    'evy' => array('application/envoy','application/x-envoy'),
    'exe' => array('application/x-msdos-program','application/dos-exe','application/exe','application/msdos-windows','application/x-sdlc','application/x-exe','application/x-winexe'),
    'fif' => array('application/fractals','image/fif'),
    'flr' => array('x-world/x-vrml'),
    'fm' => array('application/vndframemaker','application/framemaker','application/maker','application/vndmif','application/x-framemaker','application/x-maker','application/x-mif'),
    'fqd' => array('application/x-director'),
    'gif' => array('image/gif'),
    'gtar' => array('application/tar','application/x-gtar','application/x-tar'),
    'gz' => array('application/gzip','application/gzip-compressed','application/gzipped','application/x-gunzip','application/x-gzip'),
    'h' => array('text/x-chdr'),
    'hdf' => array('application/x-hdf'),
    'hlp' => array('application/winhlp','application/x-helpfile','application/x-winhelp'),
    'hqx' => array('application/binhex','application/mac-binhex','application/mac-binhex40'),  
    'hta' => array('application/hta'),
    'htc' => array('text/x-component'),
    'htm' => array('text/html','application/xhtml+xml'),
    'html' => array('text/html','application/xhtml+xml'),
    'htt' => array('text/webviewhtml'),
    'ico' => array('image/x-ico'),
    'ics' => array('text/calendar'),
    'ief' => array('image/ief'),
    'iii' => array('application/x-iphone'),
    'indd' => array('application/x-indesign'),
    'ins' => array('application/x-internet-signup'),
    'isp' => array('application/x-internet-signup'),
    'jad' => array('text/vndsunj2meapp-descriptor'),
    'jar' => array('application/java-archive'),
    'java' => array('text/x-java','java/*','text/java','text/x-java-source'),
    'jfif' => array('image/jpeg','image/pjpeg'),
    'jpe' => array('image/jpeg','image/pjpeg'),
    'jpeg' => array('image/jpeg','image/pjpeg'),
    'jpg' => array('image/jpeg','image/pjpeg'),
    'jp2' => array('image/jp2'),
    'fh' => array('image/x-freehand'),
    'fhc' => array('image/x-freehand'),
    'fh4' => array('image/x-freehand'),
    'fh5' => array('image/x-freehand'),
    'fh7' => array('image/x-freehand'),
    'svgz' => array('image/svg+xml'),
    'svg' => array('image/svg+xml'),
    'jpx' => array('image/jp2'),
    'xcf' => array('image/x-xcf'),
    'djvu' => array('image/vnd.djvu'),
    'djv' => array('image/vnd.djvu'),
    'js' => array('text/javascript','application/javascript','application/x-javascript','application/x-js'),
    'kml' => array('application/vndgoogle-earthkml+xml'),
    'kmz' => array('application/vndgoogle-earthkmz'),
    'latex' => array('application/x-latex','text/x-latex'),
    'lha' => array('application/x-lha','application/lha','application/lzh','application/x-lzh','application/x-lzh-archive'),
    'lib' => array('application/x-endnote-library','application/x-endnote-refer'),
    'llb' => array('application/x-labview','application/x-labview-vi'),
    'log' => array('text/x-log'),
    'lsf' => array('video/x-la-asf'),
    'lsx' => array('video/x-la-asf'),
    'lvx' => array('application/x-labview-exec'),
    'lzh' => array('application/x-lha','application/lha','application/lzh','application/x-lzh','application/x-lzh-archive'),
    'm' => array('text/x-objcsrc'),
    'm1v' => array('video/mpeg'),
    'm2v' => array('video/mpeg'),
    'm3u' => array('audio/x-mpegurl','application/x-winamp-playlist','audio/mpegurl','audio/mpeg-url','audio/playlist','audio/scpls','audio/x-scpls'),
    'm4a' => array('audio/m4a','audio/x-m4a'),
    'm4v' => array('video/mp4','video/mpeg4','video/x-m4v'),
    'ma' => array('application/mathematica'),
    'mail' => array('message/rfc822'),
    'man' => array('application/x-troff-man'),
    'mcd' => array('application/x-mathcad','application/mcad'),
    'mdb' => array('application/vndms-access','application/mdb','application/msaccess','application/vndmsaccess','application/x-mdb','application/x-msaccess'),
    'me' => array('application/x-troff-me'),
    'mfp' => array('application/x-shockwave-flash','application/futuresplash'),
    'mht' => array('message/rfc822'),
    'mhtml' => array('message/rfc822'),
    'mid' => array('audio/x-midi','application/x-midi','audio/mid','audio/midi','audio/soundtrack'),
    'midi' => array('audio/x-midi','application/x-midi','audio/mid','audio/midi','audio/soundtrack'),
    'mif' => array('application/vndframemaker','application/framemaker','application/maker','application/vndmif','application/x-framemaker','application/x-maker','application/x-mif'),
    'mny' => array('application/x-msmoney'),
    'mov' => array('video/quicktime'),
    'mp2' => array('video/mpeg','audio/mpeg','audio/x-mpeg','audio/x-mpeg-2','video/x-mpeg','video/x-mpeq2a'),
    'mp3' => array('audio/mpeg','audio/mp3','audio/mpeg3','audio/mpg','audio/x-mp3','audio/x-mpeg','audio/x-mpeg3','audio/x-mpg'),
    'mpa' => array('video/mpeg'),
    'mpe' => array('video/mpeg'),
    'mpeg' => array('video/mpeg'),
    'mpg' => array('video/mpeg'),
    'mpp' => array('application/vndms-project','application/mpp','application/msproj','application/msproject','application/x-dos_ms_project','application/x-ms-project','application/x-msproject'),
    'mpv2' => array('video/mpeg'),
    'mqv' => array('video/quicktime'),
    'ms' => array('application/x-troff-ms'),
    'mvb' => array('application/x-msmediaview'),
    'mws' => array('application/x-maple','application/maple-v-r4'),
    'nb' => array('application/mathematica'),
    'nws' => array('message/rfc822'),
    'oda' => array('application/oda'),
    'odc' => array('application/vnd.oasis.opendocument.chart'),
    'odf' => array('application/vnd.oasis.opendocument.formula'),
    'odg' => array('application/vnd.oasis.opendocument.graphics'),
    'odp' => array('application/vnd.oasis.opendocument.presentation'),
    'ods' => array('application/vnd.oasis.opendocument.spreadsheet'),
    'ots' => array('application/vnd.oasis.opendocument.spreadsheet-template'),
    'ott' => array('application/vnd.oasis.opendocument.text-template'),
    'odt' => array('application/vnd.oasis.opendocument.text'),
    'ogg' => array('application/ogg','application/x-ogg','audio/x-ogg'),
    'one' => array('application/msonenote'),
    'p12' => array('application/x-x509-ca-cert','application/pkix-cert','application/x-pkcs12','application/keychain_access'),
    'patch' => array('text/x-patch'),
    'pbm' => array('image/x-portable-bitmap','image/pbm','image/portable-bitmap','image/x-pbm'),
    'pcd' => array('image/x-photo-cd','image/pcd'),
    'pct' => array('image/x-pict','image/pict','image/x-macpict'),
    'pdf' => array('application/pdf','application/acrobat','application/nappdf','application/x-pdf','application/vndpdf','text/pdf','text/x-pdf'),
    'pfx' => array('application/x-pkcs12'),
    'pgm' => array('image/x-portable-graymap','image/x-pgm'),
    'php' => array('application/x-php','application/php','text/php','text/x-php'),
    'pic' => array('image/x-pict','image/pict','image/x-macpict'),
    'pict' => array('image/x-pict','image/pict','image/x-macpict'),
    'pjpeg' => array('image/jpeg','image/pjpeg'),
    'pl' => array('application/x-perl','text/x-perl'),
    'pls' => array('audio/x-mpegurl','application/x-winamp-playlist','audio/mpegurl','audio/mpeg-url','audio/playlist','audio/scpls','audio/x-scpls'),
    'pko' => array('application/yndms-pkipko'),
    'pm' => array('application/x-perl','text/x-perl'),
    'pmc' => array('application/x-perfmon'),
    'png' => array('image/png','image/x-png'),
    'pnm' => array('image/x-portable-anymap'),
    'pod' => array('text/x-pod'),
    'potm' => array('application/vndms-powerpointtemplatemacroEnabled12'),
    'potx' => array('application/vndopenxmlformats-officedocumentpresentationmltemplate'),
    'ppam' => array('application/vndms-powerpointaddinmacroEnabled12'),
    'ppm' => array('image/x-portable-pixmap','application/ppm','application/x-ppm','image/x-ppm'),
    'pps' => array('application/vndms-powerpoint','application/ms-powerpoint','application/mspowerpoint','application/powerpoint','application/ppt','application/vnd-mspowerpoint','application/vnd_ms-powerpoint','application/x-mspowerpoint','application/x-powerpoint'),
    'ppsm' => array('application/vnd.ms-powerpoint.slideshow.macroEnabled.12'),
    'ppsx' => array('application/vnd.openxmlformats-officedocument.presentationml.slideshow'),
    'ppt' => array('application/vnd.ms-powerpoint','application/ms-powerpoint','application/mspowerpoint','application/powerpoint','application/ppt','application/vnd-mspowerpoint','application/vnd_ms-powerpoint','application/x-mspowerpoint','application/x-powerpoint'),
    'pptm' => array('application/vnd.ms-powerpoint.presentation.macroEnabled.12'),
    'pptx' => array('application/vnd.openxmlformats-officedocument.presentationml.presentation'),
    'prf' => array('application/pics-rules'),
    'ps' => array('application/postscript','application/eps','application/x-eps','image/eps','image/x-eps'),
    'psd' => array('application/photoshop','application/psd','application/x-photoshop','image/photoshop','image/psd','image/x-photoshop','image/x-psd'),
    'pub' => array('application/vndms-publisher','application/x-mspublisher'),
    'py' => array('text/x-python'),
    'qt' => array('video/quicktime'),
    'ra' => array('audio/vndrn-realaudio','audio/vndpn-realaudio','audio/x-pn-realaudio','audio/x-pn-realaudio-plugin','audio/x-pn-realvideo','audio/x-realaudio'),
    'ram' => array('audio/vndrn-realaudio','audio/vndpn-realaudio','audio/x-pn-realaudio','audio/x-pn-realaudio-plugin','audio/x-pn-realvideo','audio/x-realaudio'),
    'rar' => array('application/rar','application/x-rar-compressed'),
    'ras' => array('image/x-cmu-raster'),
    'rgb' => array('image/x-rgb','image/rgb'),
    'rm' => array('application/vndrn-realmedia'),
    'rmi' => array('audio/mid'),
    'roff' => array('application/x-troff'),
    'rpm' => array('audio/vndrn-realaudio','audio/vndpn-realaudio','audio/x-pn-realaudio','audio/x-pn-realaudio-plugin','audio/x-pn-realvideo','audio/x-realaudio'),
    'rtf' => array('application/rtf','application/richtext','application/x-rtf','text/richtext','text/rtf'),
    'rtx' => array('application/rtf','application/richtext','application/x-rtf','text/richtext','text/rtf'),
    'rv' => array('video/vndrn-realvideo','video/x-pn-realvideo'),
    'sas' => array('application/sas','application/x-sas','application/x-sas-data','application/x-sas-log','application/x-sas-output'),
    'sav' => array('application/spss'),
    'scd' => array('application/x-msschedule'),
    'scm' => array('text/x-scriptscheme','text/x-scheme'),
    'sct' => array('text/scriptlet'),
    'sd2' => array('application/spss'),
    'sea' => array('application/x-sea'),
    'sh' => array('application/x-sh','application/x-shellscript'),
    'shar' => array('application/x-shar'),
    'shtml' => array('text/html','application/xhtml+xml'),
    'sit' => array('application/stuffit','application/x-sit','application/x-stuffit'),
    'smil' => array('application/smil','application/smil+xml'),
    'snd' => array('audio/basic','audio/au','audio/x-au','audio/x-basic'),
    'spl' => array('application/x-shockwave-flash','application/futuresplash'),
    'spo' => array('application/spss'),
    'sql' => array('text/x-sql','text/sql'),
    'src' => array('application/x-wais-source'),
    'sst' => array('application/vndms-pkicertstore'),
    'stl' => array('application/sla'),
    'stm' => array('text/html'),
    'swa' => array('application/x-director'),
    'swf' => array('application/x-shockwave-flash','application/futuresplash'),
    'sxw' => array('application/vndsunxmlwriter'),
    't' => array('application/x-troff'),
    'tar' => array('application/tar','application/x-gtar','application/x-tar'),
    'tcl' => array('application/x-tcl','text/x-scripttcl','text/x-tcl'),
    'tex' => array('application/x-tex','text/x-tex'),
    'tga' => array('image/x-targa','application/tga','application/x-targa','application/x-tga','image/targa','image/tga','image/x-tga'),
    'tgz' => array('application/gzip','application/gzip-compressed','application/gzipped','application/x-gunzip','application/x-gzip'),
    'tif' => array('image/tiff','application/tif','application/tiff','application/x-tif','application/x-tiff','image/tif','image/x-tif','image/x-tiff'),
    'tiff' => array('image/tiff','application/tif','application/tiff','application/x-tif','application/x-tiff','image/tif','image/x-tif','image/x-tiff'),
    'tnef' => array('application/ms-tnef'),
    'torrent' => array('application/x-bittorrent'),
    'tfm' => array('application/x-tex-tfm'),
    'tr' => array('application/x-troff'),
    'trm' => array('application/x-msterminal'),
    'tsv' => array('text/tsv','text/tab-separated-values','text/x-tab-separated-values'),
    'twb' => array('application/twb','application/twbx','application/x-twb'),
    'twbx' => array('application/twb','application/twbx','application/x-twb'),
    'text' => array('text/plain'),
    'conf' => array('text/plain'),
    'def' => array('text/plain'),
    'list' => array('text/plain'),
    'in'      => array('text/plain'),
    'txt' => array('text/plain'),
    'dsc' => array('text/prs.lines.tag'),
    'uls' => array('text/iuls'),
    'ustar' => array('application/x-ustar'),
    'vcf' => array('text/x-vcard'),
    'vrml' => array('x-world/x-vrml'),
    'vsd' => array('application/vndvisio','application/visio','application/visiodrawing','application/vsd','application/x-visio','application/x-vsd','image/x-vsd'),
    'w3d' => array('application/x-director'),
    'war' => array('application/x-webarchive'),
    'wav' => array('audio/wav','audio/s-wav','audio/wave','audio/x-wav'),
    'wcm' => array('application/vndms-works'),
    'wdb' => array('application/vndms-works','application/x-msworks-wp'),
    'wks' => array('application/vndms-works','application/x-msworks-wp'),
    'wma' => array('audio/x-ms-wma'),
    'wmf' => array('image/x-wmf','application/wmf','application/x-msmetafile','application/x-wmf','image/wmf','image/x-win-metafile'),
    'wmv' => array('video/x-ms-wmv'),
    'wmz' => array('application/x-ms-wmz'),
    'wpd' => array('application/wordperfect','application/wordperf','application/wpd'),
    'wps' => array('application/vndms-works','application/x-msworks-wp'),
    'wri' => array('application/x-mswrite'),
    'wrl' => array('x-world/x-vrml'),
    'wrz' => array('x-world/x-vrml'),
    'xbm' => array('image/x-xbitmap'),
    'cc' => array('text/x-c'),
    'cxx' => array('text/x-c'),
    'hh' => array('text/x-c'),
    'dic' => array('text/x-c'),
    'xhtml' => array('text/html','application/xhtml+xml'),
    'xla' => array('application/vndms-excel'),
    'xlam' => array('application/vndms-exceladdinmacroEnabled12'),
    'xlc' => array('application/vndms-excel'),
    'xll' => array('application/vndms-excel','application/excel','application/msexcel','application/msexcell','application/x-dos_ms_excel','application/x-excel','application/x-ms-excel','application/x-msexcel','application/x-xls','application/xls'),
    'xlm' => array('application/vndms-excel'),
    'xls' => array('application/vndms-excel','application/excel','application/msexcel','application/msexcell','application/x-dos_ms_excel','application/x-excel','application/x-ms-excel','application/x-msexcel','application/x-xls','application/xls'),
    'xlsb' => array('application/vnd.ms-excel.sheet.binary.macroEnabled.12'),
    'xlsm' => array('application/vnd.ms-excel.sheet.macroEnabled.12'),
    'xlsx' => array('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    'xlt' => array('application/vndms-excel'),
    'xltm' => array('application/vndms-exceltemplatemacroEnabled12'),
    'xltx' => array('application/vndopenxmlformats-officedocumentspreadsheetmltemplate'),
    'xlw' => array('application/vndms-excel'),
    'xml' => array('text/xml','application/x-xml','application/xml'),
    'xpm' => array('image/x-xpixmap','image/x-xpm','image/xpm'),
    'xps' => array('application/vndms-xpsdocument'),
    'xsl' => array('text/xsl'),
    'xwd' => array('image/x-xwindowdump','image/xwd','image/x-xwd','application/xwd','application/x-xwd'),
    '7z'  => array('application/x-7z-compressed'),
    'z'   => array('application/x-compress','application/z','application/x-z'),
    'zip' => array('application/zip','application/x-compress','application/x-compressed','application/x-zip','application/x-zip-compressed','application/zip-compressed','application/x-7zip-compressed')
   );
    
    
    static  $imageMimeTypes = array(
        'image/x-portable-bitmap',
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
        'image/tif'
    );
    
    static  $imageBasicMimeTypes = array(
        'image/x-portable-bitmap',
        'image/jpg',
        'image/jpeg',
        'image/pjpeg',
        'image/jpe',
        'image/gif',
        'image/png',
        'image/bmp',
        'image/tiff',
        'image/tif'
    );
    
    //va a dar error 
    static  $errorMimeTypes = array(
       'application/vnd.ms-office',
       'application/octet-stream'
    ); 
    
    function __construct() {

    }
     /**
     * Singleton
     * @return <arSystemInfo>
     */
    static public function getInstance()
    {
       if (self::$instancia == null) {
          self::$instancia = new ARMimeTypes();
       }
       return self::$instancia;
    }
    /**
     * El fichero tiene un tipo mime valido para la entidad Document
     * 
     * @param <string $fileType>
     * @return <boolean>
     */
    static public function isDocument ($fileType, $filename = false)
    {
      //si esta en la lista de tipos mime que pueden ser problematicos de detectar
      //saca el tipo mime archivo por la extension
      //esto ... no esta del todo bien
      if ($filename 
          && in_array($fileType, ARMimeTypes::$errorMimeTypes))
      {
          $arrayKeys = array_keys(ARMimeTypes::$mimeTypesMap);
          $ext = preg_match('/\.([^\.]+)$/', $filename);
          //tiene extension
          if ($ext)
          {
              $filenameitems = explode(".", $filename);
              $ext = $filenameitems[count($filenameitems) - 1]; // .ext
              if (in_array($ext, $arrayKeys))
              {
                return  ARMimeTypes::isDocument(ARMimeTypes::$mimeTypesMap[$ext][0], false);
              }
              else
              {
                return false; 
              }
          }
          
          return false;
      }
      else
      {
         return in_array($fileType, array_merge(
                ARMimeTypes::$mimeTypesMap['7z'],
                ARMimeTypes::$mimeTypesMap['zip'],
                ARMimeTypes::$mimeTypesMap['rar'],
                ARMimeTypes::$mimeTypesMap['gz'],
                ARMimeTypes::$mimeTypesMap['doc'],
                ARMimeTypes::$mimeTypesMap['doc'],
                ARMimeTypes::$mimeTypesMap['docx'],
                ARMimeTypes::$mimeTypesMap['xls'],
                ARMimeTypes::$mimeTypesMap['xlsx'],
                ARMimeTypes::$mimeTypesMap['ppt'],
                ARMimeTypes::$mimeTypesMap['odp'],
                ARMimeTypes::$mimeTypesMap['pptx'],
                ARMimeTypes::$mimeTypesMap['pdf'],
                ARMimeTypes::$mimeTypesMap['ods'],
                ARMimeTypes::$mimeTypesMap['odt'],
                ARMimeTypes::$mimeTypesMap['txt']
              ));  
      }
         
    }
    
    
    
    static public function isTaskDocument ($fileType, $filename = false)
    {
        
       if ($filename 
          && in_array($fileType, ARMimeTypes::$errorMimeTypes))
      {
          $arrayKeys = array_keys(ARMimeTypes::$mimeTypesMap);
          $ext = preg_match('/\.([^\.]+)$/', $filename);
          //tiene extension
          if ($ext)
          {
              $filenameitems = explode(".", $filename);
              $ext = $filenameitems[count($filenameitems) - 1]; // .ext
              if (in_array($ext, $arrayKeys))
              {
                return  ARMimeTypes::isTaskDocument(ARMimeTypes::$mimeTypesMap[$ext][0], false);
              }
              else
              {
                return false; 
              }
          }
          
          return false;
      }
      else
      {
         return in_array($fileType, array_merge(
                ARMimeTypes::$mimeTypesMap['doc'],
                ARMimeTypes::$mimeTypesMap['docx'],
                ARMimeTypes::$mimeTypesMap['xls'],
                ARMimeTypes::$mimeTypesMap['xlsx'],
                ARMimeTypes::$mimeTypesMap['ppt'],
                ARMimeTypes::$mimeTypesMap['pptx'],
                ARMimeTypes::$mimeTypesMap['pdf'],
                ARMimeTypes::$mimeTypesMap['ods'],
                ARMimeTypes::$mimeTypesMap['odp'],
                ARMimeTypes::$mimeTypesMap['odt'],
                ARMimeTypes::$imageMimeTypes,
                ARMimeTypes::$mimeTypesMap['7z'],
                ARMimeTypes::$mimeTypesMap['zip'],
                ARMimeTypes::$mimeTypesMap['rar'],
                ARMimeTypes::$mimeTypesMap['gz']
              ));   
      }
        
    }
    
    static public function toGroup ($fileType)
    {
        if (isset(ARMimeTypes::$mimeTypesGroupMap[$fileType]))
        {
          return ARMimeTypes::$mimeTypesGroupMap[$fileType];
        }
        else 
        {
           return 'no implementado'; 
        }
    }
    
    static public function toExtension ($fileType)
    {
      
        if (isset(ARMimeTypes::$mimeTypesInverseMap[$fileType]))
        {
          return ARMimeTypes::$mimeTypesInverseMap[$fileType];
        }
        else 
        {
           return 'no implementado'; 
        }
        
    }
    
    static public function toPreview ($fileType)
    {
      
        if (isset(ARMimeTypes::$mimeTypesPreviewMap[$fileType]))
        {
          return ARMimeTypes::$mimeTypesPreviewMap[$fileType];
        }
        else 
        {
           return 'no implementado'; 
        }
        
    }
    
    static public function extensionToMime ($extension)
    {
       return ARMimeTypes::$mimeTypesMap[$extension][0];
    }
    
    static public function isWord($fileType)
    {    
         return in_array($fileType, array_merge(ARMimeTypes::$mimeTypesMap['doc'], 
                                                ARMimeTypes::$mimeTypesMap['docx']));
    }
    
    static public function isExcel($fileType)
    {
       
       return in_array($fileType, array_merge(ARMimeTypes::$mimeTypesMap['xls'], 
                                                ARMimeTypes::$mimeTypesMap['xlsx']));
       
    }
    
    static public function isPPT($fileType)
    {
        return in_array($fileType, array_merge( 
                                                ARMimeTypes::$mimeTypesMap['ppt'], 
                                                ARMimeTypes::$mimeTypesMap['pptx']));
    }
    
    static public function isOdp($fileType)
    {
        return in_array($fileType, ARMimeTypes::$mimeTypesMap['odp']);
    }
    
    static public function isOdt($fileType)
    {
        return in_array($fileType, ARMimeTypes::$mimeTypesMap['odt']);
    }
    
    static public function isOds($fileType)
    {
       return in_array($fileType, ARMimeTypes::$mimeTypesMap['ods']); 
    }
    
    static public function isImage ($fileType)
    {
        return in_array($fileType, ARMimeTypes::$imageMimeTypes); 
    }
    /**
     * Es una imagen de mapa de bits simple 'image/svg+xml'
     * 
     * @param string $fileType
     * <@return boolean> : true
     */
    static public function isBasicImage ($fileType)
    {
        return in_array($fileType, ARMimeTypes::$imageBasicMimeTypes); 
    }
    
    static public function isPDF ($fileType)
    {
        return in_array($fileType, ARMimeTypes::$mimeTypesMap['pdf']);
    }
    
    static public function isJPG ($fileType)
    {
        return in_array($fileType, ARMimeTypes::$mimeTypesMap['jpg']);
    }
    
    static public function isPNG ($fileType)
    {
        return in_array($fileType, ARMimeTypes::$mimeTypesMap['png']);
    }
    
    static public function isGIF ($fileType)
    {
        return in_array($fileType, ARMimeTypes::$mimeTypesMap['gif']);
    }
    
    static public function isZIP ($fileType)
    {
        return in_array($fileType, ARMimeTypes::$mimeTypesMap['zip']);
    }
    
    static public function is7z ($fileType)
    {
        return in_array($fileType, ARMimeTypes::$mimeTypesMap['7z']);
    }
    
    static public function isRAR ($fileType)
    {
        return in_array($fileType, ARMimeTypes::$mimeTypesMap['rar']);
    }
    
    static public function isTXT ($fileType)
    {
        return in_array($fileType, ARMimeTypes::$mimeTypesMap['txt']);
    }
       
    static public function isCompressedType ($fileType)
    {
        return in_array($fileType, array_merge(ARMimeTypes::$mimeTypesMap['7z'], 
                                               ARMimeTypes::$mimeTypesMap['zip'],
                                               ARMimeTypes::$mimeTypesMap['rar'],
                                               ARMimeTypes::$mimeTypesMap['gz']));
    }

    /**
     * 
     * @param type $fileType
     * @return booleam
     */
    static public function hasPreview($fileType)
    {
         return in_array($fileType, array_merge(
                                        ARMimeTypes::$mimeTypesMap['dwg'], 
                                        ARMimeTypes::$mimeTypesMap['dxf'],
                                        //doc
                                        ARMimeTypes::$mimeTypesMap['doc'], 
                                        ARMimeTypes::$mimeTypesMap['docx'],
                                        //xls      
                                        ARMimeTypes::$mimeTypesMap['xls'],
                                        ARMimeTypes::$mimeTypesMap['xlsx'],
                                        //ppt       
                                        ARMimeTypes::$mimeTypesMap['ppt'], 
                                        ARMimeTypes::$mimeTypesMap['pptx'],
                                        //stl
                                        //stl no tiene preview
                                        //odp
                                        ARMimeTypes::$mimeTypesMap['odp'],
                                        //doc
                                        ARMimeTypes::$mimeTypesMap['doc'], 
                                        ARMimeTypes::$mimeTypesMap['docx'],
                                        //xls      
                                        ARMimeTypes::$mimeTypesMap['xls'],
                                        ARMimeTypes::$mimeTypesMap['xlsx'],
                                        //ppt       
                                        ARMimeTypes::$mimeTypesMap['ppt'], 
                                        ARMimeTypes::$mimeTypesMap['pptx'],
                                        //pds
                                        ARMimeTypes::$mimeTypesMap['psd'],
                                        //ods
                                        ARMimeTypes::$mimeTypesMap['ods'],
                                        //odp
                                        ARMimeTypes::$mimeTypesMap['odp'],
                                        ARMimeTypes::$mimeTypesMap['odt'])); 
    }

}