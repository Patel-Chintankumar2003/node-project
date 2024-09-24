import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true, // The cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // Set to true if in production
      expires: new Date(Date.now() + 3600000) // Cookie expires in 1 hour
    });

    return res.status(200).json({
      success: true,
      message: "Logged In Successfully",
    });
  } catch (error) {
    console.error('Error in loginUser:', error); // Log error details
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
