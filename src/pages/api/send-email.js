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
        user: "smartcareconnects@gmail.com", // Replace with your email
        pass: "uwgq dhjs hdyc zhsj", // Replace with your email password
      },
    });

    // Define the email options for the doctor
    const mailOptionsDoctor = {
      from: "smartcareconnects@gmail.com",
      to: doctorEmail,
      subject: "New Appointment Booking",
      html: `<p>You have a new appointment booking!</p>
             <p><strong>Patient Details:</strong></p>
             <p>Name: ${patientDetails.firstName} ${patientDetails.lastName}</p>
             <p>Disease: ${patientDetails.selectedDisease}</p>
             <p>Appointment Date: ${patientDetails.appointmentDate}</p>
             <p>Appointment Time: ${patientDetails.appointmentTime}</p>
             <p>Message: ${patientDetails.message}</p>`,
    };

    // Define the email options for the patient
    const mailOptionsPatient = {
      from: "smartcareconnects@gmail.com",
      to: patientEmail,
      subject: "Appointment Confirmation",
      html: `<p>Your appointment has been successfully booked!</p>
             <p><strong>Appointment Details:</strong></p>
             <p>Doctor: Dr. ${patientDetails.selectedDoctor}</p>
             <p>Disease: ${patientDetails.selectedDisease}</p>
             <p>Appointment Date: ${patientDetails.appointmentDate}</p>
             <p>Appointment Time: ${patientDetails.appointmentTime}</p>
             <p>Message: ${patientDetails.message}</p>
             <p>Thank you for choosing our service!</p>`,
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