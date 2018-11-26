# Bethany Allen Photography

## Developement
use node `6.9.5` and `nodemon current/index.js --watch content/themes/bethany-allen --ext hbs,js,css` in the root of the local ghost install to start ghost.

Theme is bundled with `parcel`. Scripts are found in the package.json. Run these from the theme's folder. Currently supported up to node `8.7.0`.

## Deployment

### Digital Ocean
Pull repo down with git

## Custom Helper
Add the following to `current/core/server/helpers` as a partial.

Then include in the index file for helpers.
`registerThemeHelper('lazy_content', coreHelpers.lazy_content);`

Of hack the `content` helper file by adding the following code to the end of the content render function.

``` js
// # Lazy_content Helper
// @author Paul Allen

var proxy = require('./proxy'),
    SafeString = proxy.SafeString;

module.exports = function lazy_content() {
    let html = this.html;
    const imgTags = new RegExp('<img src=', 'g');
    const newImgTags = '<img class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" data-src=';

    html = html.replace(imgTags, newImgTags);

    return new SafeString(html);
};
```
