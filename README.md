
A secure document management and AI-powered backend API built with Node.js, Express, and MongoDB. This application provides user authentication, document upload/management, and AI integration capabilities.

## Features

- **User Authentication**: Email-based registration with OTP verification
- **Document Management**: Upload, view, update, and delete documents (PDF, DOCX supported)
- **AI Integration**: OpenAI and Groq SDK integration for document processing
- **Session Management**: User session tracking and management
- **File Processing**: Support for PDF and DOCX file parsing
- **Cloud Storage**: AWS S3 integration for file storage
- **Email Services**: Nodemailer integration for OTP and notifications

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer with memory storage
- **Authentication**: OTP-based verification
- **AI Services**: OpenAI API, Groq SDK
- **Cloud Storage**: AWS SDK
- **Email**: Nodemailer
- **Deployment**: Vercel

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login

### Documents
- `POST /api/docs/upload` - Upload document
- `GET /api/docs/get/:userId` - Get user documents
- `GET /api/docs/content/:userId/:docId` - Get document content
- `PUT /api/docs/update` - Update document
- `DELETE /api/docs/delete` - Delete document

### Sessions
- Session management endpoints (check `/routes/session.js` for details)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stealth_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   GROQ_API_KEY=your_groq_api_key
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   S3_BUCKET_NAME=your_s3_bucket_name
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   or for development:
   ```bash
   node server.js
   ```

## Project Structure

```
stealth_backend/
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── docsController.js      # Document management
│   └── sessionController.js   # Session handling
├── models/
│   ├── User.js               # User schema
│   └── Session.js            # Session schema
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── docs.js               # Document routes
│   └── session.js            # Session routes
├── server.js                 # Main server file
├── package.json              # Dependencies and scripts
├── vercel.json              # Vercel deployment config
└── README.md                # This file
```

## Dependencies

### Core Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin resource sharing
- `body-parser` - Request body parsing
- `dotenv` - Environment variable management

### File Processing
- `multer` - File upload handling
- `pdf-parse` - PDF text extraction
- `mammoth` - DOCX file processing

### AI & External Services
- `openai` - OpenAI API client
- `groq-sdk` - Groq AI services
- `aws-sdk` - AWS services integration
- `nodemailer` - Email services

## Deployment

This project is configured for deployment on Vercel. The `vercel.json` file contains the necessary configuration.

To deploy:
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team." 
