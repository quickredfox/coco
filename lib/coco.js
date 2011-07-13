(function() {
  var FS, GEN_DIR, GEN_ROOT, PATH, PROJECT_NAME, SKELETONS_PATH, copyr;
  FS = require('fs');
  PATH = require('path');
  SKELETONS_PATH = PATH.normalize("" + __dirname + "/../skeleton");
  PROJECT_NAME = !!process.argv[2] ? process.argv[2].toLowerCase() : null;
  if (!PROJECT_NAME) {
    return console.log("Invalid Project Name");
  }
  GEN_ROOT = process.cwd();
  GEN_DIR = "" + GEN_ROOT + "/" + PROJECT_NAME;
  try {
    FS.mkdirSync(GEN_DIR, 0775);
    FS.mkdirSync("" + GEN_DIR + "/lib", 0775);
    FS.mkdirSync("" + GEN_DIR + "/src", 0775);
    FS.writeFileSync("" + GEN_DIR + "/src/" + PROJECT_NAME + ".coffee", "###\n\t" + PROJECT_NAME + "\n###\n\n", 'utf8');
    FS.writeFileSync("" + GEN_DIR + "/lib/" + PROJECT_NAME + ".js", "/*\n\t" + PROJECT_NAME + "\n*/\n\n", 'utf8');
  } catch (E) {

  }
  copyr = function(options) {
    var filterer, mapper;
    if (options == null) {
      options = {};
    }
    filterer = function(f) {
      return !/^\./.test(f);
    };
    mapper = function(file) {
      var contents, fname, stat;
      fname = "" + options.source + "/" + file;
      stat = FS.statSync(fname);
      if (stat.isFile()) {
        contents = FS.readFileSync(fname, 'utf8');
        return FS.writeFileSync("" + options.dest + "/" + file, contents.replace(/\%PROJECT_NAME\%/g, PROJECT_NAME), 'utf8');
      } else {
        FS.mkdirSync("" + options.dest + "/" + file, 0775);
        return copyr({
          source: "" + options.source + "/" + file,
          dest: "" + options.dest + "/" + file
        });
      }
    };
    return FS.readdirSync(options.source).filter(filterer).map(mapper);
  };
  copyr({
    source: SKELETONS_PATH,
    dest: GEN_DIR
  });
}).call(this);
