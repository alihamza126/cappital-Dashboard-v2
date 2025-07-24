import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TopBar from '../../components/topbar/TopBar';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <>  
        <TopBar/>
        <Navbar/>
            <Container>
                <Box mt={4} mb={4}>
                    <Typography variant="h4" className='text-primary' gutterBottom>
                        Privacy Policy
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Updated at: 2024
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Welcome to The Capital Academy. We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and protect your information when you use our website.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        1. Information We Collect
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Personal Information:</strong> When you register or interact with our website, we may collect personal information such as your name, email address, phone number, and other contact details.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        <strong>Usage Data:</strong> We collect data on how you use our website, including your IP address, browser type, and browsing patterns.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        2. Use of Your Information
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We use your information to:
                    </Typography>
                    <ul>
                        <li>Provide and maintain our services.</li>
                        <li>Notify you about changes to our services.</li>
                        <li>Provide customer support.</li>
                        <li>Monitor the usage of our website.</li>
                        <li>Detect, prevent, and address technical issues.</li>
                    </ul>
                    <Typography variant="h6" gutterBottom>
                        3. Data Protection
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We implement appropriate security measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        4. Sharing Your Information
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We do not sell, trade, or otherwise transfer your personal information to outside parties, except to trusted third parties who assist us in operating our website, conducting our business, or serving you, as long as those parties agree to keep this information confidential.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        5. Cookies
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Our website uses cookies to improve your browsing experience. You can choose to accept or decline cookies through your browser settings.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        6. Your Rights
                    </Typography>
                    <Typography variant="body1" paragraph>
                        You have the right to:
                    </Typography>
                    <ul>
                        <li>Access and update your personal information.</li>
                        <li>Request deletion of your personal data.</li>
                        <li>Object to the processing of your data.</li>
                    </ul>
                    <Typography variant="h6" gutterBottom>
                        7. Changes to This Privacy Policy
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        8. Contact Us
                    </Typography>
                    <Typography variant="body1" paragraph>
                        If you have any questions about this Privacy Policy, please <Link to={'/contact'}>contact us</Link>.
                    </Typography>
                </Box>
            </Container>
            <Footer/>
        </>
    );
};

export default PrivacyPolicy;
