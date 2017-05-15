const fs = require('fs');

const styles = JSON.parse(fs.readFileSync('./writeData/styles.txt').toString())
const categories = JSON.parse(fs.readFileSync('./writeData/categories.txt').toString());