const express = require('express')
const path = require('path');
const app = express()
const PORT = process.env.PORT || 3000


app.use(express.static('build'))
/**
 * function below is used to redirect any <b>first</b> request to first pass by index.html, this way
 * react-router is loading and can take over the routing from there.
 * prevents 'CANNOT GET /[path]' from displaying to users when they go to '/[path]' first instead of '/'
 * taken from https://ui.dev/react-router-cannot-get-url-refresh
 */
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '/build/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))