import RazorpayInstance from "../services/razorpay.service.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Payment from "../models/payment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto";
import { User } from "../models/user.model.js";

//A. Create Razorpay order and save order details in the database
// This function is responsible for creating a new order in Razorpay and saving the order details in our database. It takes the planId, amount, and credit from the request body, creates an order with Razorpay, and then saves the order information along with the user ID in our Payment collection. If any step fails, it throws an appropriate error.
const createOrder = asyncHandler(async (req, res) => {

        const { planId, amount, credit } = req.body;

        if(!planId || !amount || !credit) {
            throw new ApiError(400, "Invalid Plan details");
        }

        // Create Razorpay order with the specified amount and currency details.
        //  Razorpay expects the amount in paise, so we multiply by 100.
        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        // Calling the SDK via the imported instance wrapper
        
        const order = await RazorpayInstance.orders.create(options);

        if(!order) {
            throw new ApiError(500, "Failed to create order");
        }

        // We create a new payment record in our database to keep track of this order. We associate it with the user who initiated the payment (using req.user._id), and we also store the planId, amount, credit, and the Razorpay order ID for future reference. 
        await Payment.create({ 
            userId: req.user._id,
            planId,
            amount,
            credit,
            razorpayOrderId: order.id,
            status: "created",
        })

        return res
        .status(201)
        .json(
            new ApiResponse(201, order,"Order created successfully")) 
});


// B. Verify Razorpay payment and update payment status in the database
// This function captures verification hashes sent back by the frontend client window,
// authenticates them via crypto signature matching, and increments the user's available credits if the payment is verified successfully. It also updates the payment record in the database to reflect the payment status. If verification fails, it throws an error indicating that the payment verification failed.

// The frontend generates a signature using the Razorpay secret key and the order/payment details, and sends it back to the backend for verification. 
// The backend then recreates the signature using the same method and compares it with the signature sent by the frontend. 
// If they match, it means the payment details are authentic and have not been tampered with. If the signatures match, we proceed to update the payment record in our database and add credits to the user's account based on the payment record's credit value.
const verifyPayment = asyncHandler(async (req, res) => {

    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body; //razorpay_signature is getting generated in the frontend using the secret key and the order/payment details, and sent back to the backend for verification 

    if(!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        throw new ApiError(400, "Invalid payment details");
    }

    // Recreate signature using HMAC SHA256
    // Razorpay signs: orderId + "|" + paymentId using your secret 
    const body = razorpayOrderId + "|" + razorpayPaymentId;

    // We use the crypto module to create a HMAC SHA256 hash of the body using our Razorpay secret key. This will generate a signature that we can compare with the signature sent by the frontend. If they match, it means the payment details are authentic and have not been tampered with.
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // Use the Razorpay secret key from environment variables to create the HMAC hash
        .update(body) // Update the HMAC object with the string that Razorpay signs (orderId + "|" + paymentId)
        .digest("hex"); // Generate the final signature in hexadecimal format

    // Compare signatures
        //Temporarily commenting out signature verification for testing purposes. Uncomment in production.
    if (expectedSignature !== razorpaySignature) {
        throw new ApiError(400, "Payment verification failed — Invalid signature")
    }

    // If the signatures match, we proceed to update the payment record in our database. We find the payment record using the Razorpay order ID, and we update it with the Razorpay payment ID and change the status to "paid". This way, we keep track of successful payments in our system.
    const paymentRecord = await Payment.findOne(
        { razorpayOrderId: razorpayOrderId },
    );

    if (!paymentRecord) {
        throw new ApiError(404, "Payment record not found");
    }

    if(paymentRecord.status === "paid") {
        return res
        .status(200)
        .json(
            new ApiResponse(200, paymentRecord, "Payment already processed")
        );
    }

    // Fetch payment details from Razorpay to confirm the amount and other details before updating the user's credits. This step adds an extra layer of verification to ensure that the payment details match what we have in our database before we proceed to update the user's credits.
    //Double verification 
    const payment = await RazorpayInstance.payments.fetch(
        razorpayPaymentId
    );

    if (payment.amount !== paymentRecord.amount * 100) {
        throw new ApiError(400, "Amount mismatch");
    }

    //Update user's credits based on the payment record's credit value.
    paymentRecord.status = "paid";
    paymentRecord.razorpayPaymentId = razorpayPaymentId;
    await paymentRecord.save();

    //Add credits to user's account 
    const updatedUser = await User.findByIdAndUpdate(
        paymentRecord.userId,
        { $inc: { credits: paymentRecord.credit } }, // Increment the user's credits by the amount specified in the payment record
        { new: true } 
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {
            user : updatedUser,
        }, "Payment verified and credits added successfully")
    );
})

// C. Handle failed payment scenarios and update payment status accordingly
// This function is designed to handle scenarios where a payment has failed. It takes the Razorpay order ID and an optional reason for failure from the request body, finds the corresponding payment record in the database, and updates its status to "failed". This allows us to keep track of failed payment attempts and their reasons in our system. If the payment record is not found, it throws an error indicating that the record was not found.
const handleFailedPayment = asyncHandler(async (req, res) => {
    const { razorpayOrderId, reason } = req.body;

    if (!razorpayOrderId) throw new ApiError(400, "Order ID required");

    const paymentRecord = await Payment.findOne({ razorpayOrderId });

    if (!paymentRecord) throw new ApiError(404, "Payment record not found");

    if (paymentRecord.status === "created") {
        paymentRecord.status = "failed";
        paymentRecord.failReason = reason || "unknown";
        await paymentRecord.save();
    }

    return res.status(200).json(new ApiResponse(200, {}, "Failure recorded"));
});

const getPaymentHistory = asyncHandler(async (req, res) => {
    const payments = await Payment.find({
        userId: req.user._id
    })
        .sort({ createdAt: -1 });

    // 3. Raw array ko directly respond karenge, formatting frontend handle karega
    return res.status(200).json(
        new ApiResponse(
            200,
            payments,
            "Payment history fetched successfully"
        )
    );
});

export { createOrder, verifyPayment, handleFailedPayment, getPaymentHistory };