import nodemailer from 'nodemailer';
import router from '../routes/authRoutes';

//const user = process.env.ND_USERNAME;
//const pass = process.env.ND_PASSWORD;

const mailTransporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'ben.afunsho@gmail.com',
        pass: 'dtytucxfgousjphq'
        
	}
});

const mailDetails = {
	from: 'ben.afunsho@gmail.com',
	to: 'laughwithkelvin@gmail.com',
	subject: 'Please Verify your Account',
	html: `<h1>Email Confirmation</h1>
	<h2> Hello ${username}</h2>
	<p>Thank you for joining the Clearly Team. Please confirm your email by clicking on the following link</p>
	<a href=http://localhost:5001/confirm/${confirmationCode}> Click here</a>
	</div>`,
};

mailTransporter.sendMail(mailDetails, function(err, data) {
	if(err) {
		console.log('Email not sent');
	} else {
		console.log('Email sent successfully');
	}
});

export default sendMail;