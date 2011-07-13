FS = require 'fs'
PATH = require 'path'
SKELETONS_PATH = PATH.normalize "#{__dirname}/../skeleton"
PROJECT_NAME = if !!process.argv[2] then process.argv[2].toLowerCase() else null
unless PROJECT_NAME then return console.log( "Invalid Project Name" ) 
GEN_ROOT    = process.cwd()
GEN_DIR     = "#{GEN_ROOT}/#{PROJECT_NAME}"
#if PATH.existsSync GEN_DIR then return console.log "Project \"#{PROJECT_NAME}\" already exists in this location."

## Sync Ops
try
	FS.mkdirSync GEN_DIR, 0775
	FS.mkdirSync "#{GEN_DIR}/lib", 0775
	FS.mkdirSync "#{GEN_DIR}/src", 0775
	FS.writeFileSync "#{GEN_DIR}/src/#{PROJECT_NAME}.coffee" , "###\n\t#{PROJECT_NAME}\n###\n\n", 'utf8'
	FS.writeFileSync "#{GEN_DIR}/lib/#{PROJECT_NAME}.js"     , "/*\n\t#{PROJECT_NAME}\n*/\n\n", 'utf8'
catch E 


copyr = (options={})->
	# get first level
	filterer   = ( f  )-> !/^\./.test( f ) 
	mapper     = ( file )->
		fname = "#{options.source}/#{file}"
		stat = FS.statSync fname
		if stat.isFile()
			contents = FS.readFileSync fname, 'utf8'
			FS.writeFileSync "#{options.dest}/#{file}", contents.replace(/\%PROJECT_NAME\%/g,PROJECT_NAME), 'utf8'
		else
			FS.mkdirSync "#{options.dest}/#{file}", 0775
			copyr source: "#{options.source}/#{file}", dest: "#{options.dest}/#{file}"
	FS.readdirSync( options.source ).filter( filterer ).map mapper

copyr( source: SKELETONS_PATH, dest: GEN_DIR )
# 			
# console.log GEN_DIR
