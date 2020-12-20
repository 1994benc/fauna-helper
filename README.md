# FaunaDB query helpers

## Installation
``` 
npm install --save fauna-helper
```
or
```
yarn add fauna-helper
```

## Create an instance of FaunaHelper
```
import {FaunaHelper} from 'fauna-helper';
const serverKey = <your faunaDB server key>;
const faunaHelper = new FaunaHelper(serverKey);
```

## Use helper methods to interact with your collections
```
## For example, get documents from a given collection and specify how many documents to return (page size)
faunaHelper.getDocumentsFromCollection('myCollectioName', 10).then(results=>{
    // do something with results
});
```

## For more info on how to use the library
See each method's definitions. The library is written in TypeScript so auto-completion in most IDEs should be able to help you.