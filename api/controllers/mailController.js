const nodemailer = require("nodemailer");

// Controlador para enviar un correo
const sendMail = (req, res) => {
    const { recipientEmail, subject, message } = req.body;

    if (!recipientEmail || !subject || !message) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    // Configura el transporte del correo electrónico (SMTP)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER, // Cambiar a tu nombre de usuario de correo
            pass: process.env.GMAIL_PASSWORD // Cambiar a tu contraseña de correo
        },
        tls: {
            rejectUnauthorized: false // Desactiva la verificación del certificado SSL
        }
    });

    // Define el contenido del correo electrónico en formato HTML con la imagen
    const imageSrc = 'http://186.138.96.77:3000/static/media/logo.30bd7b947921d94d3131.png';
    const mailOptions = {
        from: 'mgondolesi@gmail.com', // Cambiar a tu dirección de correo
        to: recipientEmail,
        subject: subject,
        html: `
      <div padding: 20px; font-family: Arial, sans-serif;">
        <h1>${subject}</h1>
        <p style="color: #333; font-size: 16px;">${message}</p>
        <img src="${imageSrc}" alt="Tijera" style="width: 100%; max-width: 600px;">
        <p style="color: #555; font-size: 14px;">Gracias por usar nuestro servicio.</p>
        <p style="color: #555; font-size: 14px;">Salvador Estilistas</p>
      </div>
    `
    };

    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ msg: 'Error al enviar el correo. Intente nuevamente.' });
        } else {
            console.log('Correo electrónico enviado:', info.response);
            res.json({ msg: 'Correo electrónico enviado exitosamente.' });
        }
    });
};

// Exporta los controladores para usarlos en "routes.js"
module.exports = {
    sendMail,
};
