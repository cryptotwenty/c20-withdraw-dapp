crypto20-withdraw

NOTE: there is a version issue with the 'halogen/PulseLoader' package. Must add:
```
var PropTypes = require('prop-types')
var createReactClass = require('create-react-class')
```
and replace `React.PropTypes` with `PropTypes` and `React. createClass` with `createReactClass` in the file `node_modules/halogen/PulseLoader.js`.
