const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
let comments = [];
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user:'alphaloopit@gmail.com',
    pass: 'sxgj emhr dmec wvwd',
  },
});




app.post('/post-comment', (req, res) => {
  const { name, email, comment } = req.body;
  const newComment = { name, email, comment };
  comments.push(newComment);
  res.redirect('/'); // Redirect to the homepage or wherever you want after submitting a comment
});

app.get('/', (req, res) => {
  let commentSection = '<h3 class="mb-5">Comments</h3>';
  comments.forEach(comment => {
    commentSection += `
      <div class="comment">
        <h3>${comment.name}</h3>
        <p>${comment.comment}</p>
      </div>
    `;
  });
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <!-- Include your head content here -->
    </head>
    <body>
      <!-- Include your navbar and other content here -->
      ${commentSection}
      <!-- Include your footer here -->
    </body>
    </html>
  `;
  res.send(html);
});

app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'alphaloopit@gmail.com',
    subject: 'Message from Contact Form',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      // Render the same form page with a success message
      res.send(`
        // <script>
        //   alert('Email sent successfully');
        //   window.location.href = '/';
        // </script>
      `);
    }
  });
});

// Serve the HTML form page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Adjust the path as per your file structure
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
