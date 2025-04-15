export default {
  jwt: {
    secretOrKey: process.env.JWT_SECRET,
    expiresIn: 86400,
  },
  // You can also use any other email sending services
  mail: {
    service: {
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    senderCredentials: {
      name: process.env.PROJECT_NAME,
      email: process.env.NO_REPLY_EMAIL,
    },
  },
  // these are used in the mail templates
  project: {
    name: process.env.PROJECT_NAME || '__YOUR_PROJECT_NAME__',
    email: process.env.SUPPORT_EMAIL || '__YOUR_SUPPORT_EMAIL__',
    address: '__YOUR_PROJECT_ADDRESS__',
    logoUrl: process.env.PROJECT_LOGO_URL || '__YOUR_PROJECT_LOGO_URL__',
    slogan: 'Made with ❤️ in Istanbul',
    color: '#FDEEAB',
    socials: [
      ['GitHub', '__Project_GitHub_URL__'],
      ['__Social_Media_1__', '__Social_Media_1_URL__'],
      ['__Social_Media_2__', '__Social_Media_2_URL__'],
    ],
    url: 'http://localhost:5173',
    mailVerificationUrl: 'http://localhost:3000/auth/verify',
    mailChangeUrl: 'http://localhost:3000/auth/change-email',
    resetPasswordUrl: 'http://localhost:5173/reset-password',
    termsOfServiceUrl: 'http://localhost:4200/legal/terms',
  },
};
