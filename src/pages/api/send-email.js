import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { doctorEmail, patientEmail, patientDetails } = req.body;

    if (!doctorEmail || !patientEmail || !patientDetails) {
      return res.status(400).json({ error: "Doctor's email, patient's email, and patient details are required." });
    }

    // Create a transporter object using SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "smartcareconnects@gmail.com",
        pass: "uwgq dhjs hdyc zhsj",
      },
    });

    // Professional HTML template for doctor's email
    const doctorEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: white; padding: 20px; text-align: center;">
        <img src="https://i.imghippo.com/files/McE4639Y.png" alt="SmartCare Connects Logo" style="height: 50px;">
        <h1 style="color: #1a73e8; margin: 10px 0 0 0;">New Appointment Booking</h1>
      </div>
      
      <div style="padding: 20px;">
        <p style="font-size: 16px;">Dear Dr. ${patientDetails.selectedDoctor},</p>
        <p style="font-size: 16px;">You have a new appointment request through SmartCare Connect. Below are the details:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #1a73e8; margin-top: 0;">Patient Information</h3>
          <p><strong>Name:</strong> ${patientDetails.firstName} ${patientDetails.lastName}</p>
          <p><strong>Condition:</strong> ${patientDetails.selectedDisease}</p>
          <p><strong>Appointment Date:</strong> ${patientDetails.appointmentDate}</p>
          <p><strong>Appointment Time:</strong> ${patientDetails.appointmentTime}</p>
          <p><strong>Patient Message:</strong> ${patientDetails.message || "No additional message provided."}</p>
        </div>
        
        <p style="font-size: 16px;">Please log in to your SmartCare Connect dashboard to confirm or manage this appointment.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View Appointment</a>
        </div>
        
        <p style="font-size: 14px; color: #666;">Thank you for using SmartCare Connect to streamline your practice.</p>
      </div>
      
      <div style="background-color: #f1f3f4; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        <p>© ${new Date().getFullYear()} SmartCare Connect. All rights reserved.</p>
        <p>If you need assistance, please contact our support team at support@smartcareconnect.com</p>
      </div>
    </div>
    `;

    // Professional HTML template for patient's email
    const patientEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: white; padding: 20px; text-align: center;">
        <img src="https://i.imghippo.com/files/McE4639Y.png" alt="SmartCare Connect Logo" style="height: 50px;">
        <h1 style="color: #1a73e8; margin: 10px 0 0 0;">Appointment Confirmation</h1>
      </div>
      
      <div style="padding: 20px;">
        <p style="font-size: 16px;">Dear ${patientDetails.firstName} ${patientDetails.lastName},</p>
        <p style="font-size: 16px;">Thank you for booking your appointment through SmartCare Connect. Your appointment details are confirmed as follows:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #1a73e8; margin-top: 0;">Appointment Details</h3>
          <p><strong>Doctor:</strong> Dr. ${patientDetails.selectedDoctor}</p>
          <p><strong>Specialty:</strong> ${patientDetails.selectedDisease}</p>
          <p><strong>Date:</strong> ${patientDetails.appointmentDate}</p>
          <p><strong>Time:</strong> ${patientDetails.appointmentTime}</p>
          <p><strong>Your Message:</strong> ${patientDetails.message || "No additional message provided."}</p>
        </div>
        
        <p style="font-size: 16px;">We recommend arriving 15 minutes prior to your scheduled appointment time.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View Appointment Details</a>
        </div>
        
        <p style="font-size: 14px; color: #666;">If you need to reschedule or cancel your appointment, please do so at least 24 hours in advance.</p>
      </div>
      
      <div style="background-color: #f1f3f4; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        <p>© ${new Date().getFullYear()} SmartCare Connects. All rights reserved.</p>
        <p>For any questions, contact us at support@smartcareconnects.com or call +977-9815253061</p>
      </div>
    </div>
    `;

    // Define the email options for the doctor
    const mailOptionsDoctor = {
      from: '"SmartCare Connects" <smartcareconnects@gmail.com>',
      to: doctorEmail,
      subject: `New Appointment: ${patientDetails.firstName} ${patientDetails.lastName} - ${patientDetails.appointmentDate}`,
      html: doctorEmailHtml,
    };

    // Define the email options for the patient
    const mailOptionsPatient = {
      from: '"SmartCare Connects" <smartcareconnects@gmail.com>',
      to: patientEmail,
      subject: `Appointment Confirmation with Dr. ${patientDetails.selectedDoctor} - ${patientDetails.appointmentDate}`,
      html: patientEmailHtml,
    };

    try {
      // Send the emails
      await transporter.sendMail(mailOptionsDoctor);
      await transporter.sendMail(mailOptionsPatient);
      res.status(200).json({ message: "Emails sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}