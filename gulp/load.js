var gulp = require('gulp');
var merge = require('lodash/merge');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var conf = require('./conf');

var requireUncached = function(moduleName) {
    delete require.cache[require.resolve(moduleName)];
    return require(moduleName);
};  

gulp.task('loadcustom', function(done){
    if(process.argv[2].indexOf('hybrid') !== -1){
        conf.customConfig = requireUncached(process.cwd() + '/hybrid.json');
    } else {
        conf.customConfig = requireUncached(process.cwd() + '/custom.json');
    }
    done();
});

gulp.task('loadconfig', ['loadcustom'], function(done){
    if(!conf.vhost){
        var xhrConfig = new XMLHttpRequest();
        xhrConfig.onload = function(){
            conf.vhost = JSON.parse(this.responseText);
            conf.vhost = merge(conf.vhost, conf.customConfig.config);
            conf.indexPage = conf.vhost.JS_INDEX_PAGE + '.html';
            done();
        };
        xhrConfig.open('get', conf.customConfig.domain + '/v01/config.getvars?keys=poggioacaiano', true);
        xhrConfig.send();
    } else {
        conf.vhost = merge(conf.vhost, conf.customConfig.config);
        conf.indexPage = conf.vhost.JS_INDEX_PAGE + '.html';
        done();
    }    
});

gulp.task('loaddict', ['loadcustom'], function(done){
    if(!conf.dict){
        var xhrConfig = new XMLHttpRequest();
        xhrConfig.onload = function(){
            conf.dict = JSON.parse(this.responseText);
            conf.dict = merge(conf.dict, conf.customConfig.dictionary);
            done();
        };
        xhrConfig.open('get', conf.customConfig.domain + '/v01/dictionary.getlist', true);
        xhrConfig.send();
    } else {
        conf.dict = merge(conf.dict, conf.customConfig.dictionary);
        done();
    }
});

gulp.task('loadfooter', ['loadcustom'], function(done){
    if(!conf.footer){
        var xhrConfig = new XMLHttpRequest();
        xhrConfig.onload = function(){
            conf.footer = JSON.parse(this.responseText);
            done();
        };
        xhrConfig.open('get', conf.customConfig.domain + '/v01/footer.getlist', true);
        xhrConfig.send();
    } else {
        done();
    }
});