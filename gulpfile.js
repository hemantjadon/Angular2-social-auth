var gulp = require('gulp');
var watch = require('gulp-watch');

var tsc = require('gulp-typescript');
var tsProject = tsc.createProject('tsconfig.json');

gulp.task('transpile-ts', function () {
    return tsProject.src(['components/**/*.ts','main.ts'])
        			.pipe(tsc(tsProject))
        			.pipe(gulp.dest('dist/'));
});

gulp.task('watch',function () {
    watch(['components/**/*.ts','main.ts'],function(){
        gulp.start('transpile-ts');
    });
});

gulp.task('default',['transpile-ts','watch']);