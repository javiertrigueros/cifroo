# Set the source directory
srcdir = ./

# Create the list of modules
coreModules =   ${srcdir}/scripts/jquery.popline.js\
	    ${srcdir}/scripts/plugins/jquery.popline.backcolor.js\
	    ${srcdir}/scripts/plugins/jquery.popline.blockformat.js\
	    ${srcdir}/scripts/plugins/jquery.popline.decoration.js\
	    ${srcdir}/scripts/plugins/jquery.popline.email.js\
            ${srcdir}/scripts/plugins/jquery.popline.justify.js\
            ${srcdir}/scripts/plugins/jquery.popline.link.js\
            ${srcdir}/scripts/plugins/jquery.popline.list.js\
            ${srcdir}/scripts/plugins/jquery.popline.social.js\
	
scripts/jquery.popline.all.js: ${coreModules}
	cat > $@ $^
