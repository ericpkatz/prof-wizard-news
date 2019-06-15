const express = require("express");
const path = require('path');
const app = express();

app.use(express.urlencoded());
app.use('/assets', express.static(path.join(__dirname, 'public')));


const { findAll, create } = require('./db');

app.post('/', (req, res, next)=> {

  const post = create(req.body);
  res.redirect(`/${post.id}`);
});



app.get('/create', (req, res, next)=> {
  res.send(`
    <!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/assets/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><a href="/" ><img src="/assets/logo.png"/>Wizard News</a></header>
      <form method="post" action="/">
        <label for="name">Author</label>
        <input type="text" name="name" />
        <label for="title">Title</label>
        <input type="text" name="title" />
        <textarea name="content"></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  </body>
  </html>`

  );

});

app.get("/:id?", (req, res) => {
  const posts = findAll();
  res.send(`
    <!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/assets/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><a href="/" ><img src="/assets/logo.png"/>Wizard News</a></header>
      <a href='/create'>Create Post</a>
      ${posts.filter( post => !req.params.id || req.params.id*1 === post.id).map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. <span class="upvote-button">▲</span></span><a href='/${post.id}'>${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          ${ req.params.id ? `<div>${ post.content }</div>`: ''}
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`);
}); 


app.use((err, req, res, next)=> {
  res.status(500).send(
    `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/assets/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><a href="/" ><img src="/assets/logo.png"/>Wizard News</a></header>
      Error ${ err }
    </div>
  </body>
  </html>`
  );
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
