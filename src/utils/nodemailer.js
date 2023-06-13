import nodemailer from 'nodemailer';


const user = process.env.ND_USERNAME;
const pass = process.env.ND_PASSWORD;
const mailHandler = (params) => {
	const {username, email, confirmationCode, resetToken, fullname} = params;

	const mailTransporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user, 
			pass
			
		}
	});
	let mailDetails;
	if(username && confirmationCode) {
		mailDetails = {
		   from: 'No Reply @ Clearly ',
		   to: email,
		   subject: 'Please Verify your Account',
		   html: `<h1>Email Confirmation</h1>
		   <h2> Hello ${username},</h2>
		   <p>Thank you for joining the Clearly Team. 
		   <p>Please confirm your email by entering the 4 digit code 
		   ${confirmationCode} </p>
		   </div>`,
	   };
	}

	if(resetToken && fullname) {
		mailDetails = {
			from: 'No Reply @ Clearly ',
			to: email,
			subject: 'Clearly Password assistance',
			html: `<h1>Password assistance</h1>
			<h2> Hello ${fullname},</h2>
			<p> To authenticate, please use the following verifcation code. 
			<br>${resetToken}</p>
			<p>Don't share this link with anyone. Our customer service team will never ask you for your password, OTP, or banking info. </p
			<p>We hope to see you again soon.
			 </p>
			</div>`,
		}
	}
	mailTransporter.sendMail(mailDetails, function(err, data) {
		if(err) {
			console.log('Email not sent');
		} else {
			console.log('Email sent successfully');
		}
	});
	
}

export default mailHandler;