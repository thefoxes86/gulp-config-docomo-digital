var gulp = require('gulp');
var merge = require('lodash/merge');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var base = require('./base');

var overrideJSON;

var requireUncached = function(moduleName) {
    delete require.cache[require.resolve(moduleName)];
    return require(moduleName);
};  

gulp.task('loadcustom', function(done){
    if(process.argv[2].indexOf('hybrid') !== -1){
        overrideJSON = requireUncached(process.cwd() + '/gulp/hybrid.json');
        base.settings = merge(base.settings, overrideJSON.settings);
    } else {
        overrideJSON = requireUncached(process.cwd() + '/gulp/local.json');
        base.settings = merge(base.settings, overrideJSON.settings);
    }
    done();
});

gulp.task('loadconfig', ['loadcustom'], function(done){
    if(!base.loadedConfig){
        var xhrConfig = new XMLHttpRequest();
        xhrConfig.onload = function(){
            base.config = merge(base.config, JSON.parse(this.responseText));
            base.config = merge(base.config, overrideJSON.config);
            base.loadedConfig = true;
            done();
        };
        xhrConfig.open('get', overrideJSON.settings.domain + '/v01/config.getvars?keys=' + overrideJSON.settings.secret, true);
        xhrConfig.send();
    } else {
        done();
    }    
});

gulp.task('loaddict', ['loadcustom'], function(done){
    if(!base.loadedDict){
        var xhrDict = new XMLHttpRequest();
        xhrDict.onload = function(){
            base.dictionary = merge(base.dictionary, JSON.parse(this.responseText));
            base.dictionary = merge(base.dictionary, overrideJSON.dictionary);
            base.loadedDict = true;
            done();
        };
        xhrDict.open('get', overrideJSON.settings.domain + '/v01/dictionary.getlist', true);
        xhrDict.send();
    } else {
        done();
    }
});

gulp.task('loadfooter', ['loadcustom'], function(done){
    if(!base.loadedFooter){
        var xhrFooter = new XMLHttpRequest();
        xhrFooter.onload = function(){
            base.footer = merge(base.footer, JSON.parse(this.responseText));
            base.footer = merge(base.footer, overrideJSON.footer);
            base.loadedFooter = true;
            done();
        };
        xhrFooter.open('get', overrideJSON.settings.domain + '/v01/footer.getlist', true);
        xhrFooter.send();
    } else {
        done();
    }
});