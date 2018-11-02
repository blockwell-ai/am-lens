# am-lens

Base system for building authenticated Node.js apps based on API Miner.

This is intended to be used as a submodule and included in the main project's
package.json as a file reference. Assuming this is a submodule under 
`am-lens`, you'd use:

```
"am-lens": "file:./am-lens"
```

You can then require files from it, for example to get the `isAuthenticated`
middleware:

```javascript
const {isAuthenticated} = require('am-lens/auth');
```
