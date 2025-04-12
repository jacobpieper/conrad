// vercel-build-env.js
const fs = require('fs')

const buildTime = new Date().toISOString()

fs.writeFileSync('.env.build', `BUILD_TIME=${buildTime}\n`, 'utf8')
