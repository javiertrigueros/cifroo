

(function(window, arquematics ) {
   
   arquematics.storage = (function () {
        /**
         * almacena datos en cookies
         * 
         * objStore implementa write, read, remove y hasItem
         * 
         * @returns {objStore}
         */
        function getTypeCookie()
        {
            return  {
          
                parseCookieValue: function(s) {
                    if (s.indexOf('"') === 0) {
			         // This is a quoted cookie as according to RFC2068, unescape...
			         s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                    }

                    try {
                        var pluses = /\+/g;
                        // Replace server-side written pluses with spaces.
                        // If we can't decode the cookie, ignore it, it's unusable.
                        // If we can't parse the cookie, ignore it, it's unusable.
                        return decodeURIComponent(s.replace(pluses, ' '));
                    } catch(e) {}
                },
        
           
                write: function(key, value, hasExpire)
                {
                    hasExpire = hasExpire || false;
                 
                    if (hasExpire)
                    {
                        var t = new Date();
                        t.setTime(t - 1  * 864e+5);
                    }
                                    
                    return (document.cookie = [
                                encodeURIComponent(key), '=', value,
				hasExpire ? '; expires=' + t.toUTCString() : '; expires=Fri, 31 Dec 9999 23:59:59 GMT', // use expires attribute, max-age is not supported by IE
				'; path=/',
				'; domain=' + document.domain
			].join(''));
                },
        
                read: function(key)
                {
                 
                    var result = key ? undefined : {};

                    // To prevent the for loop in the first place assign an empty array
                    // in case there are no cookies at all. Also prevents odd result when
                    // calling $.cookie().
                    var cookies = document.cookie ? document.cookie.split('; ') : [];

                
                    for (var i = 0, l = cookies.length; i < l; i++)
                    {
			             var parts = cookies[i].split('='),
                            name = decodeURIComponent(parts.shift()),
                            cookie = parts.join('=');

			             if (key && key === name)
                         {
				            // If second argument (value) is a function it's a converter...
                                result = this.parseCookieValue(cookie);
				            break;
			             }

			             // Prevent storing a cookie that we couldn't decode.
			             if (!key)
                        {
                            cookie = this.parseCookieValue(cookie);
                            if  (cookie !== undefined) {
				                result[name] = cookie;
                            }
			             }
                    }

                    return result;
                },
                remove: function (key) {
                    if (this.read(key) === undefined) {
			return false;
                    }

                    // Must not alter options, thus extending a fresh object...
                    this.write(key, '', true);
                    return !this.read(key);
                },
        
                hasItem: function(sKey) {
                    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
                }
            };
        }
        /**
         * almacena datos en window.localStorage
         * 
         * objStore implementa write, read, remove y hasItem
         * 
         * @returns {objStore}
         */
        function getTypeLocal()
        {
            return {

                write: function(key, value)
                {
                    return window.localStorage.setItem(key, value);
                },
                read: function(key)
                {
                    return window.localStorage.getItem(key);
                },
                remove: function (key) {
                    window.localStorage.removeItem(key);
                },
                hasItem: function(key) 
                {
                    return (this.read(key) !== null);
                }
            };
        }
        
        var instance;
        return {
            
            /**
             * devuelve un singleton de objStore según 
             * las capacidades del navegador
             * 
             * @returns {objStore}
             */
            getInstance: function () {
                if (!instance) {
                    if (window.localStorage && window.localStorage !== null)
                    {
                        instance = getTypeLocal();
                    }
                    else
                    {
                       instance = getTypeCookie();     
                    }
                }

                return instance;
            }
        };
      
    })();

   /**
    * singleton de objStore 
    */
    arquematics.store = arquematics.storage.getInstance();
    
})(window, arquematics);