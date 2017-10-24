# gulp-config-docomo-digital

## setup

- create a void file into css/gulp/local.less
- create files **js/gulp/local.json** and **js/gulp/hybrid.json** with minimal configuration:

<code>
    {
        "domain": "http://www.mydomain.com",
        "stageURL": "http://www.mydomain.com",
        "imagePrefix": "//d.motime.com/news/img/",
        "config": {
            "JS_INDEX_PAGE": "index",
            "LESS_CSS_NAME": "app.less"
        },
        "dictionary": {}
    }
</code>

## tasks

- *gulp lint* : run eslint on JavaScript files on app/ folder (if you add --fix then eslint fix some possible errors)
- *gulp crtolf* : convert cr to lf
- *gulp stage* : run local server to debug app/ folder (set config.json before, if necessary)
- *gulp build* : create build (minified and map) into dist/ folder
- *gulp hybrid:stage* : create www for hybrid app into hybrid/www and run hybrid app on an android device connected; it need a proper cordova project in hybrid folder
- *gulp hybrid:build* : create production www for hybrid app into hybrid/www and run hybrid app on an android device connected

## gulp stage

- edit *domain* and *stageURL* on **js/gulp/local.json** with domain to test
- you can add config variables on **js/gulp/local.json** (field *config*), they'll override domain config
- you can add dictionary variables on **js/gulp/local.json** (field *dictionary*), they'll override domain dictionary
- you can add LESS style on **css/gulp/local.json**, they'll override domain styles