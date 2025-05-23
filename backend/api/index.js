const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors({ origin: '*' }));
app.use(express.json());



 const isValidEmail = (email) =>
  /^[a-zA-Z0-9._%+-]{4,}@[a-zA-Z0-9.-]+\.com$/.test(email);

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address with at least 4 characters before "@" and ending with ".com".' });
  }

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  console.log('Contact form submitted:', { name, email, message });
  res.status(200).json({ message: 'Your message has been sent successfully!' });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address with at least 4 characters before "@" and ending with ".com".' });
  }

  console.log('Newsletter signup:', email);
  res.status(200).json({ message: 'Thank you for subscribing!' });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});