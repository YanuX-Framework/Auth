const path = require('path')
const fs = require('fs')
const sass = require('sass')
const cache = {}

module.exports = (options = {}) => async (req, res, next) => {
    // ignore non-CSS requests
    if (!req.path.endsWith('.css')) return next()
    // derive SCSS filepath from CSS request path
    const file = path.join(options.src ? options.src : process.cwd(), req.path).replace(/css/g, 'scss');
    if (!fs.existsSync(file)) return res.status(404).end()
    // cache rendered CSS in memory
    if (!cache[req.path]) {
        cache[req.path] = sass.renderSync({
            file,
            includePaths: [path.join(process.cwd(), 'node_modules')],
            outputStyle: (process.env.NODE_ENV === 'production') ? 'compressed' : 'expanded'
        });
        fs.watchFile(file, _ => {
            delete cache[req.path];
            fs.unwatchFile(file);
        });
    }
    res.header('content-type', 'text/css')
    res.send(cache[req.path].css.toString())
}