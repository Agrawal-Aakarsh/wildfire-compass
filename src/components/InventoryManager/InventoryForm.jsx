// src/components/InventoryManager/InventoryForm.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowRight, Download } from 'lucide-react';

const InventoryForm = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [numBedrooms, setNumBedrooms] = useState(0);
  const [numBathrooms, setNumBathrooms] = useState(0);

  // Base questions
  const baseQuestions = [
    {
      id: 'outside_damage',
      question: "Let's start with the outside. What on the exterior of your house needs replacement or repair? (Think about siding, paint, roofing, windows, and doors)",
    },
    {
      id: 'outdoor_security',
      question: 'Do you have outdoor lighting, security systems, or cameras? Do any need repair or replacement?',
    },
    {
      id: 'num_bedrooms',
      question: 'How many bedrooms are in your house (aside from the main bedroom)?',
      type: 'number',
      onChange: (value) => setNumBedrooms(parseInt(value)),
    },
    {
      id: 'num_bathrooms',
      question: 'How many bathrooms are there in your house?',
      type: 'number',
      onChange: (value) => setNumBathrooms(parseInt(value)),
    },
    {
      id: 'main_bedroom',
      question: 'Now for the main bedroom. What furniture, electronics, or personal items need replacing?',
    },
  ];

  // Generate dynamic questions based on number of rooms
  const getDynamicQuestions = () => {
    let dynamicQuestions = [];

    // Add bedroom questions
    for (let i = 1; i <= numBedrooms; i++) {
      dynamicQuestions.push({
        id: `bedroom_${i}`,
        question: `For bedroom ${i}, what items need to be replaced? (Think about furniture, electronics, and personal items)`,
      });
    }

    // Add bathroom questions
    for (let i = 1; i <= numBathrooms; i++) {
      dynamicQuestions.push({
        id: `bathroom_${i}`,
        question: `For bathroom ${i}, what needs to be replaced? (Think about fixtures, cabinets, and personal items)`,
      });
    }

    // Add final questions
    dynamicQuestions.push(
      {
        id: 'kitchen',
        question: 'What items in your kitchen need replacing? (Think about appliances, utensils, and furniture)',
      },
      {
        id: 'living_room',
        question: 'What items in your living room need replacing? (Think about furniture, electronics, and decor)',
      }
    );

    return dynamicQuestions;
  };

  const allQuestions = [...baseQuestions, ...getDynamicQuestions()];

  const handleNext = () => {
    if (currentAnswer.trim()) {
      setAnswers({ ...answers, [allQuestions[currentQuestionIndex].id]: currentAnswer });
      setCurrentAnswer('');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  const generatePDF = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Home Inventory List', 20, 20);
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      let yPosition = 50;
      const leftMargin = 20;
      const pageHeight = doc.internal.pageSize.height;

      // Add each answer
      Object.entries(answers).forEach(([key, value]) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }

        // Format the key
        const formattedKey = key.replace(/_/g, ' ').toUpperCase();
        
        // Add section title
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(formattedKey, leftMargin, yPosition);
        yPosition += 10;

        // Add answer with word wrap
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        
        // Split long text into lines
        const lines = doc.splitTextToSize(value, 170);
        lines.forEach(line => {
          if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, leftMargin, yPosition);
          yPosition += 7;
        });

        yPosition += 10; // Add space between sections
      });

      // Add tips at the end
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Important Tips:', leftMargin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      const tips = [
        '• Document everything with photos and videos',
        '• Keep all receipts for repairs and replacements',
        '• Contact your insurance provider as soon as possible',
        '• Consider working with a public adjuster'
      ];

      tips.forEach(tip => {
        doc.text(tip, leftMargin, yPosition);
        yPosition += 7;
      });

      // Save the PDF
      doc.save('home-inventory-list.pdf');
    });
  };

  const variants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {currentQuestionIndex < allQuestions.length ? (
            <motion.div
              key={currentQuestionIndex}
              initial="enter"
              animate="center"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    {allQuestions[currentQuestionIndex].question}
                  </h2>
                  <div className="space-y-4">
                    <Input
                      type={allQuestions[currentQuestionIndex].type || 'text'}
                      value={currentAnswer}
                      onChange={(e) => {
                        setCurrentAnswer(e.target.value);
                        if (allQuestions[currentQuestionIndex].onChange) {
                          allQuestions[currentQuestionIndex].onChange(e.target.value);
                        }
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your answer here..."
                      className="w-full"
                    />
                    <Button 
                      onClick={handleNext}
                      className="w-full"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial="enter"
              animate="center"
              variants={variants}
            >
              <Card className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Inventory Summary</h2>
                  <div className="space-y-4 mb-6">
                    {Object.entries(answers).map(([key, value]) => (
                      <div key={key} className="border-b pb-2">
                        <h3 className="font-medium text-gray-700">{key.replace(/_/g, ' ').toUpperCase()}</h3>
                        <p className="text-gray-600">{value}</p>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={generatePDF}
                    className="w-full mb-4"
                  >
                    Download PDF
                    <Download className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Important Tips:</h3>
                    <ul className="list-disc list-inside text-blue-700 space-y-2">
                      <li>Document everything with photos and videos</li>
                      <li>Keep all receipts for repairs and replacements</li>
                      <li>Contact your insurance provider as soon as possible</li>
                      <li>Consider working with a public adjuster</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="text-center mt-4 text-gray-500">
          {currentQuestionIndex + 1} of {allQuestions.length}
        </div>
      </div>
    </div>
  );
};

export default InventoryForm;