/**
 * @package: arquematicsPlugin
 * @version: 0.1
 * @Autor: Arquematics 2010 
 *         by Javier Trigueros Martínez de los Huertos
 *         
 * dependencias con:
 *  - arquematics.infinite.js
 *  - timeago:  http://timeago.yarp.com/
 *  - autosize: https://github.com/jackmoore/autosize.git
 *  
 * 
 * @param {jQuery} $
 * @param {arquematics} arquematics
 */

(function($, arquematics) {


$.widget( "arquematics.social", {
        options: {
            twitter:false,
            facebook:false,
            linkedin:false,
            
            content:                    '#control-list',
            input_control_tag_name:     '#wallTag_name',
            color:                      '#444',
            
            color_twitter:              'red',
            color_facebook:             'red',
            color_linkedin:             'red'
            
            /*
            color_twitter:              '#59c4e4',
            color_facebook:             '#2a94db',
            color_linkedin:             '#006699'
            */
	},

        changeContent: function() {
                          
        },
        isMovile: false,
        configure: function()
        {
            this.isMovile = ($(window).width() <= 400);
            
            $('#wallbundle_wall_lists option').removeAttr('selected');
        },
        
        _create: function()
        {
            this.configure();
           
            this.addHanlers();
	},
        
        controlName: function()
        {
          return 'social';
        },
        
        reset: function()
        {
            var options = this.options;
           
           
            $('.cmd-twiter')
                .removeClass('enabled')
                .addClass('disabled');
        
                
            $('.cmd-twiter').css({"color":options.color});
            
            $('.cmd-facebook')
                .removeClass('enabled')
                .addClass('disabled');
        
            $('.cmd-facebook').css({"color":options.color});
            
            $('.cmd-linkedin')
                .removeClass('enabled')
                .addClass('disabled');
        
            $('.cmd-linkedin').css({"color":options.color});
                        
            $('#wallbundle_wall_lists option')
                            .filter('[value=1]')
                            .removeAttr('selected', true)
                            .prop("selected", false); 
                    
            $('#wallbundle_wall_lists option')
                            .filter('[value=2]')
                            .removeAttr('selected')
                            .prop("selected", false);
                    
            $('#wallbundle_wall_lists option')
                            .filter('[value=3]')
                            .removeAttr('selected')
                            .prop("selected", false);
        },
        
        update: function(message) 
        {  
            if (message instanceof arquematics.wall.message)
            {
                this.reset();
            }
        },
        
        getSocial: function()
        {
            var options = this.options;
            
            
            return {
                twitter:    options.twitter,
                facebook:   options.facebook,
                linkedin:   options.linkedin
            };
        },
         
        addHanlers: function()
        {
           var that = this;
            var options = this.options;
            
            if (!options.twitter)
            {
                $('.twitter-item').remove();
            }
            else 
            {
                $('.cmd-twiter').off();
                $('.cmd-twiter').on("click",function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();

                    
                    if ($(this).hasClass('enabled'))
                    {
                        $(this).removeClass('enabled')
                                .addClass('disabled');
                        
                        $(this).css({"color":options.color});
                        
                        $('#wallbundle_wall_lists option')
                            .filter('[value=1]')
                            .removeAttr('selected', true)
                            .prop("selected", false)
                        ;
                    }
                    else
                    {
                        $(this).removeClass('disabled')
                                .addClass('enabled');
                        
                        $(this).css({"color":options.color_twitter});
                        
                        $('#wallbundle_wall_lists option')
                            .filter('[value=1]')
                            .removeAttr('selected')
                            .attr('selected', true)
                            .prop("selected", true)
                        ;
                        
                    }
                })
                ;

            }

            if (!options.facebook )
            {
                $('.facebook-item').remove();
            }
            else
            {
                $('.cmd-facebook').off();
                $('.cmd-facebook').on("click",function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if ($(this).hasClass('enabled'))
                    {
                        $(this).removeClass('enabled')
                                .addClass('disabled');
                        
                        $(this).css({"color":options.color});
                        
                        $('#wallbundle_wall_lists option')
                            .filter('[value=2]')
                            .removeAttr('selected')
                            .prop("selected", false)
                            ;
                    }
                    else
                    {
                        $(this).removeClass('disabled')
                                .addClass('enabled');
                        
                        $(this).css({"color": options.color_facebook});
                        
                        $('#wallbundle_wall_lists option')
                            .filter('[value=2]')
                            .removeAttr('selected')
                            .attr('selected', true)
                            .prop("selected", true)
                        ;
                    }
                });
            }

            if (!options.linkedin)
            {
                $('.linkedin-item').remove();
            }
            else
            {
                $('.cmd-linkedin').off();
                $('.cmd-linkedin').on("click",function(e)
                {
                    e.preventDefault();
                    
                    if ($(this).hasClass('enabled'))
                    {
                        $(this).removeClass('enabled')
                                .addClass('disabled');
                        
                        $(this).css({"color": options.color});
                        
                         $('#wallbundle_wall_lists option')
                            .filter('[value=3]')
                            .removeAttr('selected')
                            .prop("selected", false);
                    }
                    else
                    {
                        $(this).removeClass('disabled')
                                .addClass('enabled');
                        
                        $(this).css({"color": options.color_linkedin});
                        
                        $('#wallbundle_wall_lists option')
                            .filter('[value=3]')
                            .removeAttr('selected')
                            .attr('selected', true)
                            .prop("selected", true);
                       
                    }
                });
            } 
        }
    });

  
}(jQuery, arquematics || {}));