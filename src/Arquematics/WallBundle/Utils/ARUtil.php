<?php

namespace Arquematics\WallBundle\Utils;
/**
 * funciones generales
 * 
 * Arquematics 
 *  
 */
class ARUtil
{
    static public function stripTags($string, $remove_breaks = false) 
    {
        $string = preg_replace( '@<(script|style)[^>]*?>.*?</\\1>@si', '', $string );
        $string = strip_tags($string);
 
        if ( $remove_breaks )
        {
           $string = preg_replace('/[\r\n\t ]+/', ' ', $string); 
        } 
 
        return trim( $string );
    }
    
    static public function removeRLText($textContent, $prefixUrl)
    {
        return ARUtil::leftTrim(ARUtil::rightTrim($textContent, $prefixUrl), $prefixUrl);
    }
    
    /**
    * @param string    $str           Original string
    * @param string    $needle        String to trim from the end of $str
    * @param bool|true $caseSensitive Perform case sensitive matching, defaults to true
    * @return string Trimmed string
    */
    function rightTrim($str, $needle, $caseSensitive = true)
    {
        $strPosFunction = $caseSensitive ? "strpos" : "stripos";
        if ($strPosFunction($str, $needle, strlen($str) - strlen($needle)) !== false) {
            $str = substr($str, 0, -strlen($needle));
        }
        return $str;
    }

    /**
    * @param string    $str           Original string
    * @param string    $needle        String to trim from the beginning of $str
    * @param bool|true $caseSensitive Perform case sensitive matching, defaults to true
    * @return string Trimmed string
    */
    function leftTrim($str, $needle, $caseSensitive = true)
    {
        $strPosFunction = $caseSensitive ? "strpos" : "stripos";
        if ($strPosFunction($str, $needle) === 0) {
            $str = substr($str, strlen($needle));
        }
        return $str;
    }
    
    
    static public function truncate($text, $length=100, $append="...")
    {
        $input = ARUtil::stripTags( $text );
 
        $input = trim(preg_replace('/\s+/', ' ', $input));
        
        $countTextChars = strlen($input);
        
        if ($countTextChars <= $length) 
        {
            return $input;
        }
        
        //
        $last_space = strrpos(substr($input, 0, $length), ' ');
        // no tiene espacios
        if (!$last_space)
        {
           $trimmed_text = substr($input, 0, $length); 
        }
        else
        {
            $trimmed_text = substr($input, 0, $last_space);
        }
        
        

        return $trimmed_text.$append;
    }
    
    static function getHumanSize($bytes = 0, $decimals = 2) 
    {
        $size = array('B','kB','MB','GB','TB','PB','EB','ZB','YB');
        $factor = floor((strlen($bytes) - 1) / 3);
        
        if ($bytes == 0)
        {
          return '0 '.$size[1];  
        }
        else {
          return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$size[$factor];
        }
    }

    
    static function toUTF8($text) {
	
        $text = mb_convert_encoding($text, "UTF-8");
        
	return iconv(mb_detect_encoding($text, mb_detect_order(), true), "UTF-8", $text);
    }
    
    static function toAscii($str, $delimiter='-') {
	$clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
	$clean = preg_replace("/[^a-zA-Z0-9\.\/_|+ -]/", '', $clean);
	$clean = strtolower(trim($clean, '-'));
	$clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
	
	return $clean;
    }
}