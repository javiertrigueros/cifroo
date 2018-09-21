 /** @class  */
var Person = Class.create(
    /**
      @lends Person.prototype
    */
    {
      initialize: function(name) {
            this.name = name;
        },
        say: function(message) {
            return this.name + ': ' + message;
        }
    }
 );

/** @lends Person.prototype */
Person.prototype = {
	/** like say but more musical */
	sing: function(song) {
	},
                
        getCount: function() {
    
	}       
};
