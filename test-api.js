require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.TEST_API_PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Sample data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
];

const posts = [
  { id: 1, title: 'First Post', content: 'This is the first post', userId: 1, likes: 10 },
  { id: 2, title: 'Second Post', content: 'This is the second post', userId: 2, likes: 5 },
  { id: 3, title: 'Third Post', content: 'This is the third post', userId: 1, likes: 20 },
];

const products = [
  { id: 1, name: 'Laptop', price: 999.99, stock: 5 },
  { id: 2, name: 'Phone', price: 599.99, stock: 10 },
  { id: 3, name: 'Tablet', price: 399.99, stock: 8 },
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Test API', timestamp: new Date().toISOString() });
});

// ===== USERS ENDPOINTS =====

// Get all users
app.get('/users', (req, res) => {
  res.json({ success: true, data: users, total: users.length });
});

// Get single user
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, data: user });
});

// Create user
app.post('/users', (req, res) => {
  const { name, email, role } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and email required' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: role || 'user',
  };

  users.push(newUser);
  res.status(201).json({ success: true, data: newUser, message: 'User created' });
});

// Update user
app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const { name, email, role } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;

  res.json({ success: true, data: user, message: 'User updated' });
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  const deletedUser = users.splice(index, 1);
  res.json({ success: true, data: deletedUser[0], message: 'User deleted' });
});

// ===== POSTS ENDPOINTS =====

// Get all posts
app.get('/posts', (req, res) => {
  res.json({ success: true, data: posts, total: posts.length });
});

// Get single post
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }
  res.json({ success: true, data: post });
});

// Create post
app.post('/posts', (req, res) => {
  const { title, content, userId } = req.body;
  
  if (!title || !content || !userId) {
    return res.status(400).json({ success: false, error: 'Title, content, and userId required' });
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    userId,
    likes: 0,
  };

  posts.push(newPost);
  res.status(201).json({ success: true, data: newPost, message: 'Post created' });
});

// Like a post
app.post('/posts/:id/like', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  post.likes += 1;
  res.json({ success: true, data: post, message: 'Post liked' });
});

// ===== PRODUCTS ENDPOINTS =====

// Get all products
app.get('/products', (req, res) => {
  res.json({ success: true, data: products, total: products.length });
});

// Get single product
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// Create product
app.post('/products', (req, res) => {
  const { name, price, stock } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ success: false, error: 'Name and price required' });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    stock: stock || 0,
  };

  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct, message: 'Product created' });
});

// ===== SEARCH ENDPOINT =====

// Search across all data
app.get('/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase();
  
  const results = {
    users: users.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)),
    posts: posts.filter(p => p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query)),
    products: products.filter(p => p.name.toLowerCase().includes(query)),
  };

  res.json({ success: true, data: results, query });
});

// ===== ERROR HANDLING =====

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: 'Use /users, /posts, or /products',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🧪 Test API running on http://localhost:${PORT}`);
  console.log('');
  console.log('📚 Available endpoints:');
  console.log('  GET  /health           - Health check');
  console.log('  GET  /users            - Get all users');
  console.log('  GET  /users/:id        - Get single user');
  console.log('  POST /users            - Create user');
  console.log('  PUT  /users/:id        - Update user');
  console.log('  DEL  /users/:id        - Delete user');
  console.log('');
  console.log('  GET  /posts            - Get all posts');
  console.log('  GET  /posts/:id        - Get single post');
  console.log('  POST /posts            - Create post');
  console.log('  POST /posts/:id/like   - Like a post');
  console.log('');
  console.log('  GET  /products         - Get all products');
  console.log('  GET  /products/:id     - Get single product');
  console.log('  POST /products         - Create product');
  console.log('');
  console.log('  GET  /search/:query    - Search all data');
  console.log('');
});
