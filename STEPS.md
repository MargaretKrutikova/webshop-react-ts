## Configure the environment

yarn add prettier tslint-plugin-prettier --dev

in package json:

"scripts": {
"lint": "tslint -c tslint.json './src/**/\*.ts{,x}'",
"prettier": "prettier --write \"src/**/\*.ts{,x}\""

## Add redux

yarn add redux react-redux recompose typesafe-actions reselect
yarn add @types/react-redux @types/recompose redux-logger @types/redux-logger redux-devtools-extension --dev
