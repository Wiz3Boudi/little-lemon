import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

const transform = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

export const sendCRM = async (email, response, username) => {
    try {
        const bookingData = response;
        console.log(bookingData);
        return await transform.sendMail({
            from: `Little Lemoen: ${process.env.EMAIL}`,
            to: email,
            subject: "Reservation confirmation message",
            html: `
             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
               <h2>Confirmation reservation</h2>
               <p>Thank you for booking ! Please use the following information to confirm</p>
               <div style="background-color: #f4f4f4; padding: 20px; text-align: start; margin: 20px 0;">
               <h4> ${username} </h4>
               <p> <strong> Occasion: </strong> ${response.occasion} </p>
               <p> <strong> Time: </strong> ${response.time} </p>
               <p> <strong> Seats: </strong> ${response.seats} </p>
               <p> <strong> Number of guests: </strong> ${response.numberOfGuest} </p>
               <p> <strong> Date: </strong> ${response.choosenDate} </p>
                </div>
               <p> <strong> Booked At: </strong> ${new Date(response.createdAt)} </p>
               <p> <strong> Confirmed eamil: </strong> ${response.email} </p>
               <p>If you didn't request this, please ignore this email.</p>
             </div>
    `
        })
    } catch (error) {
        console.error(error);
    }
}