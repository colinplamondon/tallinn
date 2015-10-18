module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // compile LESS into CSS
    less: {
      development: {
        options: {
          paths: ["static/css/"],
          cleancss: true
        },
        files: {
          "static/css/application.css"  :   "dev/less/app-main.less"
        }
      }
    },

    babel: {
        options: {
            sourceMap: true
        },
        dist: {
            files: [{
              "expand": true,
              "cwd": 'dev/js/components',
              'src': '**/*/*.jsx',
              'dest': 'dev/js/jsx-build',
              'ext': '.js'
            }]
        }
    },

    // Concat JS and CSS
    concat: {
      options: {
        separator: ' '
      },
      staticJS: {
        src: ['dev/js/libs/*.js',
              'dev/js/global.js',
              'dev/js/components/*.js',
              'dev/js/pages/*.js',
              'dev/js/jsx-build/*.js',
              'dev/js/jsx-build/*/*.js'
              ],
        dest: 'static/js/application.js'
      }
    },
    eslint: {
      target: ['dev/js/components/*.jsx' ]
    },
    // Lint your JS
    jshint: {
      files: ['Gruntfile.js',
              'dev/js/*.js',
              'dev/js/components/*.js',
              'dev/js/pages/*.js'],
      options: {
        // options here to override JSHint defaults
        "node": true,
        "bitwise": false,
        "strict": false,
        globals: {
          ReactDOM: true,
          React: true,
          Pages: true,
          moment: true,
          Global: true,
          jQuery: true,
          $: true,
          console: true,
          module: true,
          document: true,
          alert: true,
          confirm: true,
          window: true,
          location: true,
          mixpanel: true,
          Wistia: true,
          ga: true,
          FormData: true,
          FileReader: true,
          Image: true,
          audiojs: true,
          FB: true,
          Modernizr: true,
          navigator: true
        }
      }
    },

    // Run 'grunt watch' to start listening for changes to files, and perform tasks like compiling LESS.
    watch: {
      jsx: {
        files: ['dev/js/pages/*.jsx', 'dev/js/components/*.jsx', 'dev/js/components/*/*.jsx'],
        tasks: ['eslint', 'babel', 'js'],
      },
      js: {
        files: ['Gruntfile.js',
                'dev/js/*.js',
                'dev/js/*/*.js'],
        tasks: ['js']
      },
      less: {
        files: ['dev/less/*.less',
                'dev/less/components/*.less',
                'dev/less/base/*.less',
                'dev/less/libs/*',
                'dev/less/pages/*.less'],
        tasks: ['css', 'concat'],
        options: {
          livereload: 1337
        }
      }
    },

    // Command line helpers
    exec: {
      server: {
        cmd: "supervisor -e 'node|coffee|html' ./bin/www"
      }
    }

  });

  // Load plugins into Gruntfile
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-exec');

  // Default tasks. Run this by typing 'grunt' on the command line
  grunt.registerTask('default', ['less', 'jshint', 'babel', 'concat']);

  // Start server
  grunt.registerTask('s', ['exec:server']);
  grunt.registerTask('css', ['less']);
  grunt.registerTask('js', ['jshint', 'babel', 'concat']);

};
