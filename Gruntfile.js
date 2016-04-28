module.exports = function(grunt) {
  var _banner =
    '/**! <%= pkg.discription %>  \n *@version: <%= pkg.version %>-<%= grunt.template.today("yyyy/dd/mm") %>\n *@author: <%= pkg.author %>\n*/\n' +
    'var YE = (function($){\n\nvar $ = $ || jQuery;\n\n';
  _footer = "\nreturn YE;\n\n})(jQuery);\n";
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: _banner,
        footer: _footer,
        separator: '\n'
      },
      dist: {
        src: ['src/core/*.js', 'src/events/*.js', 'src/ui/*.js',
          'src/utils/*.js', 'src/ajax/*.js', 'src/handler/*.js',
          'src/dialog/*.js', 'src/plugin/ye_video.js',
          'src/plugin/ye_image.js', 'src/plugin/ye_link.js',
          'src/plugin/ye_vote.js', 'src/plugin/ye_audio.js',
          'src/ykeditor/core/*.js', 'src/ykeditor/ui/*.js',
          'src/ykeditor/events/*.js', 'src/ykeditor/ajax/*.js',
          'src/ykeditor/plugins/*.js'
        ],
        dest: '<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/**! <%= pkg.discription %>  \n *@version: <%= pkg.version %>-<%= grunt.template.today("yyyy/mm/dd") %>\n *@author: <%= pkg.author %>\n*/\n'
      },
      dist: {
        files: {
          '<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    lineending: {
      dist: { // Target
        options: { // Target options
          eol: 'lf'
        },
        files: { // Files to process
          '<%= concat.dist.dest %>': ['<%= concat.dist.dest %>'],
          '<%= pkg.name %>.min.js': ['<%= pkg.name %>.min.js']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        //这里是覆盖JSHint默认配置的选项
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    jsdoc: {
      dist: {
        src: ['src/**/*.js'],
        jsdoc: './node_modules/jsdoc/jsdoc.js',
        options: {
          configure: 'jsdoc.conf.json'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-lineending');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('doc', ['jsdoc']);
  //file line ending unix
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'lineending']);

};
