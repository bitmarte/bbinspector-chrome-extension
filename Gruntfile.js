module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			dist: ['dist'],
			tmp: ['tmp']
		},
		plato: {
			dist: {
				files: {
					'report/output/plato': ['js/**/*.js']
				  }
			}
		},
		replace: {
			dist: {
				src: ['manifest.json'],
				dest: 'tmp/manifest.json',
				replacements: [
					{
						from: '%ext_version%',
						to: '<%= pkg.version %>'
					},
					{
						from: '%ext_name%',
						to: '<%= pkg.name %>'
					},
					{
						from: '%ext_description%',
						to: '<%= pkg.description %>'
					}
				]
			}
		},
		fixmyjs: {
			options: {
				config: '.jshintrc'
			},
			fix: {
				files: [
					{
						expand: true,
						src: ['src/js/**/*.js'],
						dest: 'tmp/',
						ext: '.js'
					}
				]
			}
		},
		removelogging: {
			dist: {
				src: "tmp/js/**/*.js"
			}
		},
		htmlConvert: {
			dist: {
				src: ['src/templates/**/*.tpl'],
				dest: 'dist/templates/templates.js'
			},
			options: {
				module: '_templates',
				rename: function (moduleName) {
					return moduleName.replace('templates/', '').replace('.tpl', '');
				}
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			dist: {
				files: {
					'dist/background-min.js': ['tmp/src/js/background.js'],
					'dist/content-min.js': ['tmp/src/js/content.js'],
					'dist/devtools-min.js': ['tmp/src/js/devtools.js'],
					'dist/core-min.js': [
						'tmp/src/js/panel/backbaseInfo.js',
						'tmp/src/js/panel/itemsInPage.js',
						'tmp/src/js/panel/collapsiblePageTree.js',
						'tmp/src/js/panel/collapsiblePageGraph.js',
						'tmp/src/js/panel/main.js'
					],
					'dist/serializer-min.js': ['tmp/src/js/utils/serializer.js']
				}
			}
		},
		htmlmin: {
			dist: {
				options: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeComments: true,
					removeEmptyAttributes: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true
				},
				files: {
					'dist/devtools-min.html': 'src/html/devtools.html',
					'dist/panel-min.html': 'src/html/panel.html'
				}
			}
		},
		postcss: {
			options: {
				map: false,
				processors: [
					require('autoprefixer')({
						browsers: [
							'> 5%',
							'last 2 versions'
						]
					}),
					require('cssnano')({
						safe: true
					})
				]
			},
			dist: {
				expand: true,
				cwd: 'src',
				src: ['css/**/*.css'],
				dest: 'dist/',
				ext: '-min.css'
			}
		},
		copy: {
			main: {
				files: [
					{
						expand: false,
						src: ['images/**'],
						dest: 'dist/',
						filter: 'isFile'
					},
					{
						expand: false,
						src: ['_locales/**'],
						dest: 'dist/',
						filter: 'isFile'
					},
					{
						expand: false,
						src: ['tmp/manifest.json'],
						dest: 'dist/manifest.json',
						filter: 'isFile'
					},
					{
						expand: false,
						src: ['bower_components/pure/pure-min.css'],
						dest: 'dist/css/pure-min.css',
						filter: 'isFile'
					},
					{
						expand: false,
						src: ['node_modules/mustache-for-chromeapps/mustache.min.js'],
						dest: 'dist/mustache-min.js',
						filter: 'isFile'
					},
					{
						expand: false,
						src: ['node_modules/lodash/lodash.min.js'],
						dest: 'dist/lodash-min.js',
						filter: 'isFile'
					},
					{
						expand: false,
						src: ['node_modules/circular-json/build/circular-json.js'],
						dest: 'dist/circular-json-min.js',
						filter: 'isFile'
					},
					{
						expand: false,
						src: ['node_modules/zepto/dist/zepto.min.js'],
						dest: 'dist/zepto-min.js',
						filter: 'isFile'
					},
					{
						expand: false,
						src: ['node_modules/d3/d3.min.js'],
						dest: 'dist/d3-min.js',
						filter: 'isFile'
					}
				]
			}
		}
	});
	
	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-plato');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-fixmyjs');
	grunt.loadNpmTasks('grunt-html-convert');
	grunt.loadNpmTasks("grunt-remove-logging");
	grunt.loadNpmTasks('grunt-html-convert');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	grunt.registerTask(
		'default',[
			'clean:dist',
			'replace',
			'fixmyjs',
			'htmlConvert',
			'uglify',
			'htmlmin',
			'postcss',
			'copy',
			'clean:tmp'
		]
	);

	grunt.registerTask(
		'dist',[
			'clean:dist',
			'replace',
			'fixmyjs',
			'removelogging',
			'htmlConvert',
			'uglify',
			'htmlmin',
			'postcss',
			'copy',
			'clean:tmp'
		]
	);
};