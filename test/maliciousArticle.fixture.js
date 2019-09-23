function makeMaliciousArticle() {
   const maliciousArticle = {
     id: 911,
     style: 'How-to',
     date_published: new Date().toLocaleString(),
     title: 'Naughty naughty very naughty <script>alert("xss");</script>',
     content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
   }
   const expectedArticle = {
     ...maliciousArticle,
     title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
     content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
   }
   return {
     maliciousArticle,
     expectedArticle,
   }
}
 
module.exports = { makeMaliciousArticle }