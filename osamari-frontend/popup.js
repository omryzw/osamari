document.getElementById('fetchBtn').addEventListener('click', () => {
  fetch('http://localhost:3000/api/message')
    .then(res => res.json())
    .then(data => {
      document.getElementById('message').innerText = data.message;
    })
    .catch(err => {
      document.getElementById('message').innerText = 'Error fetching message';
      console.error(err);
    });
});