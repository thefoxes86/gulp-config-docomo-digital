var gulp = require('gulp');
var merge = require('lodash/merge');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

var base = require('./base');

var requireUncached = function(moduleName) {
    delete require.cache[require.resolve(moduleName)];
    return require(moduleName);
};  

gulp.task('loadcustom', function(done){
    if(process.argv[2].indexOf('hybrid') !== -1){
        base.vhostCustom = requireUncached(process.cwd() + '/gulp/hybrid.json');
    } else {
        base.vhostCustom = requireUncached(process.cwd() + '/gulp/local.json');
    }
    done();
});

gulp.task('loadconfig', ['loadcustom'], function(done){
    if(!base.vhost){
        var xhrConfig = new XMLHttpRequest();
        xhrConfig.onload = function(){
            base.vhost = JSON.parse(this.responseText);
            base.vhost = merge(base.vhost, base.vhostDefault);
            base.vhost = merge(base.vhost, base.vhostCustom.config);
            base.indexPage = base.vhost.JS_INDEX_PAGE + '.html';
            done();
        };
        xhrConfig.open('get', base.vhostCustom.domain + '/v01/config.getvars?keys=' + base.vhostCustom.secret, true);
        xhrConfig.send();
    } else {
        base.vhost = merge(base.vhost, base.vhostCustom.config);
        base.indexPage = base.vhost.JS_INDEX_PAGE + '.html';
        done();
    }    
});

gulp.task('loaddict', ['loadcustom'], function(done){
    if(!base.dict){
        var xhrConfig = new XMLHttpRequest();
        xhrConfig.onload = function(){
            base.dict = JSON.parse(this.responseText);
            base.dict = merge(base.dict, base.vhostCustom.dictionary);
            done();
        };
        xhrConfig.open('get', base.vhostCustom.domain + '/v01/dictionary.getlist', true);
        xhrConfig.send();
    } else {
        base.dict = merge(base.dict, base.vhostCustom.dictionary);
        done();
    }
});

gulp.task('loadfooter', ['loadcustom'], function(done){
    if(!base.footer){
        var xhrConfig = new XMLHttpRequest();
        xhrConfig.onload = function(){
            base.footer = JSON.parse(this.responseText);
            done();
        };
        xhrConfig.open('get', base.vhostCustom.domain + '/v01/footer.getlist', true);
        xhrConfig.send();
    } else {
        done();
    }
});