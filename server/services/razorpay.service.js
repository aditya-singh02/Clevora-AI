import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

//From Razorpay documentation, we need to create an instance of Razorpay with our key_id and key_secret to interact with the Razorpay API. This instance will be used to create orders, verify payments, etc.
const RazorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
}); 

export default RazorpayInstance;