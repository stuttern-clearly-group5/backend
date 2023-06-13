/*const characters = '0123456789';
let verificationToken 
for (let i = 0; i < 4; i++) {
    verificationToken += characters[Math.floor(Math.random() * characters.length )];
}

export default verificationToken;
*/
import otpGenerator from 'otp-generator';

otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, specialChars: false });

export default otpGenerator;