import React from 'react';
import { Container, Typography, Box, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ = () => {
  const faqs = [
    {
      question: "What is Hong Kong Bazaar Guide?",
      answer: "Hong Kong Bazaar Guide is a platform that helps visitors explore local markets, exhibitions, and carnivals in Hong Kong. We provide information about events, booth locations, and contact details for various vendors."
    },
    {
      question: "How do I find events near me?",
      answer: "You can browse events on our homepage or use the search function to find events by location, date, or type. Each event page includes a map showing booth locations and detailed information about participating vendors."
    },
    {
      question: "How can I contact booth owners?",
      answer: "Each booth listing includes contact information provided by the vendor. You can find their phone number, email, and social media handles on their booth page."
    },
    {
      question: "Is the platform free to use?",
      answer: "Yes, our platform is completely free for visitors. Booth owners may need to pay a small fee to list their booth, but browsing and searching for events is free."
    },
    {
      question: "How do I get directions to an event?",
      answer: "Each event page includes the venue address and a map. You can use the map to get directions or click on the address to open it in your preferred navigation app."
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Frequently Asked Questions
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography variant="h6">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Still have questions?
          </Typography>
          <Typography>
            Contact us at support@hkbazaar.com or call +852 XXXX XXXX
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default FAQ; 