GULP task runner starter pack

Render static html files with
 - Assemble ( Handlebar templating rendering by default )
 - Pattern Lab templating generator ( atoms, molecular, organisms ... ) - not mandatory, use your own templating patten
 - Stylus css preprocesseur
 - Atomic css built-in helpers
 - Javascript ES6 with Babel Transpiler
 - Lint and Browser-sync with watch tasks
 - Pre-built-in styleguide static generator ( KSS documentation : https://github.com/kss-node/kss/blob/spec/SPEC.md )
 - Icons generated thru icofont system
 - image optimisation

Install node modules
 ```javascript
 npm install or Yarn
 ```

Install vendor
 ```javascript
 bower install
 ```
 Launch dist build and static server
 ```javascript
 gulp
 ```

 Launch styleguide build and static server
 ```javascript
 gulp styleguide --styleguide
 ```

Launch server
 ```javascript
 gulp serve
 ```
Clean dist folder
```javascript
gulp clean-dist
```
