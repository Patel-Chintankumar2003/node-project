import express, { Request, Response ,NextFunction} from 'express';
import { User, Data } from './models';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Helper function for JWT generation
const generateToken = (user: any) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};

// Middleware to protect routes
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' }); 
        }
        req.body.userId = decoded.id; 
        next();
    });
};

// Register User
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login User
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Data (Protected)
router.post('/data', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        const data = new Data({ title, description });
        await data.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Read Data with Pagination and Sorting
router.get('/data', async (req: Request, res: Response) => {
  try {
      const { page = 1, limit = 10, sort = 'title', search = '' } = req.query;

      // search query
      const query = search ? { title: { $regex: search, $options: 'i' } } : {};

      // Prepare sorting: Handle possible '-' for descending and dynamic sorting fields
      const sortParam: { [key: string]: 1 | -1 } = 
          typeof sort === 'string' && sort.startsWith('-')
              ? { [sort.substring(1)]: -1 }
              : { [sort as string]: 1 };

      // Fetch data with pagination searching  and sorting
      const data = await Data.find(query)
          .sort(sortParam)
          .skip((+page - 1) * +limit)
          .limit(+limit);

      res.json(data);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
});


// Update Data
router.put('/data/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        const data = await Data.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Data
router.delete('/data/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        await Data.findByIdAndDelete(req.params.id);
        res.json({ message: 'Data deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
