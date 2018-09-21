# Set the source directory
srcdir = ./
# Create the list of files
coreModules = ${srcdir}core/arquematics.js\
            ${srcdir}core/arquematics.codec.js\
	    ${srcdir}core/arquematics.mime.js\
            ${srcdir}core/arquematics.loader.js\
            ${srcdir}utils/arquematics.store.js\
	    ${srcdir}utils/arquematics.utils.js\
	    ${srcdir}core/arquematics.ecc.js\
	
arquematics.core.js: ${coreModules}
	cat > $@ $^
	uglifyjs arquematics.core.js --compress --mangle > arquematics.core.min.js
clean:
	rm arquematics.core.js
	rm arquematics.core.min.js
