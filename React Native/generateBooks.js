const fetch = require('node-fetch');
const books = [
  {
    author: 'J.D. Salinger',
    cover:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg',
    description:
      'The story of Holden Caulfield, a teenager in New York, exploring themes of alienation and the quest for authenticity.',
    name: 'The Catcher in the Rye',
    publication_year: 1951,
  },
  {
    author: 'May Sarton',
    cover:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602969343i/55703895.jpg',
    description:
      'May Sarton, in the 1950s, fulfills her dream of owning a country house in Nelson, New Hampshire. "A House of One\'s Own" chronicles her first house purchase and the initial decade of living there.',
    name: 'Anhelo de raíces',
    publication_year: 1951,
  },
  {
    author: 'Clare Chambers',
    cover:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1582096031i/51475209.jpg',
    description:
      'The story is set in 1957, in the south-east suburbs of London. Jean Swinney, a feature writer on a local paper, finds herself disappointed in love and on the brink of forty, living a limited existence with her truculent mother. Her small life offers no likelihood of escape.',
    name: 'Small Pleasures',
    publication_year: 2021,
  },
  {
    author: 'George Orwell',
    cover:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg',
    description:
      'A classic dystopia that examines the power of totalitarian government and the manipulation of truth.',
    name: '1984',
    publication_year: '1949',
  },
  {
    author: 'Douglas Adams',
    cover:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1531891848i/11.jpg',
    description:
      'A hilarious cosmic adventure following the misadventures of Earthling Arthur Dent in space.',
    name: "The Hitchhiker's Guide to the Galaxy",
    publication_year: 1979,
  },
  {
    author: 'Harper Lee',
    cover:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg',
    description:
      'A powerful tale of justice and morality in the southern United States during the era of racial segregation.',
    name: 'To Kill a Mockingbird',
    publication_year: 1960,
  },
  {
    author: 'Gabriel García Márquez',
    cover:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327881361i/320.jpg',
    description:
      'A masterpiece of magical realism that narrates the history of the Buendía family over several generations.',
    name: 'One Hundred Years of Solitude',
    publication_year: 1967,
  },
  {
    author: 'Aldous Huxley',
    cover:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1575509280i/5129.jpg',
    description:
      'A futuristic and dystopian vision of society that critiques dehumanization and the obsessive pursuit of pleasure.',
    name: 'Brave New World',
    publication_year: 1932,
  },
  {
    author: 'F. Scott Fitzgerald',
    cover:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg',
    description:
      'An exploration of moral decay and shattered dreams in the high society of the 1920s.',
    name: 'The Great Gatsby',
    publication_year: 1925,
  },
  {
    author: 'J.R.R. Tolkien',
    cover:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1566425108i/33.jpg',
    description:
      'A epic fantasy trilogy that follows the journey of Frodo Baggins to destroy the One Ring and save Middle-earth from the dark lord Sauron.',
    name: 'The Lord of the Rings',
    publication_year: 1955,
  },
];

const addBooks = async book => {
  await fetch(`http://localhost:8000/books/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  });
};

books.forEach(book => addBooks(book));
