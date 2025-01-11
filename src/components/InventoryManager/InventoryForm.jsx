// src/components/InventoryManager/InventoryForm.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowRight, Download, ClipboardCheck } from 'lucide-react';

const IntroCard = ({ onStart }) => (
  <Card className="bg-white shadow-lg my-4 md:my-8">
    <CardContent className="p-8">
      <div className="flex items-center justify-center mb-6">
        <ClipboardCheck className="h-12 w-12 text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-center mb-6">Insurance Inventory Builder</h1>
      
      <div className="space-y-4 text-gray-600 mb-8">
        <p className="font-medium text-gray-800">Key Points to Remember:</p>
        
        <ul className="list-disc pl-5 space-y-2">
          <li>Always check for structural damage before entering your home, including loose power lines, gas leaks, foundation cracks, and missing support beams.</li>
          
          <li>Document everything thoroughly:
            <ul className="list-circle pl-5 mt-2">
              <li>Take photographs of all damage</li>
              <li>Keep all receipts for repairs and purchases</li>
              <li>Make detailed lists of damaged items</li>
            </ul>
          </li>
          
          <li>Safety First:
            <ul className="list-circle pl-5 mt-2">
              <li>Check for gas leaks and smoke</li>
              <li>Inspect electrical systems carefully</li>
              <li>Watch for unstable structures</li>
            </ul>
          </li>
          
          <li>Contact your insurance company immediately and:
            <ul className="list-circle pl-5 mt-2">
              <li>Don't discard items until inventoried</li>
              <li>Document all communication</li>
              <li>Save receipts for temporary repairs</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <p className="text-sm text-yellow-800">
          This worksheet will guide you through creating a comprehensive inventory of your home and possessions. 
          Take your time to be thorough and accurate - this documentation will be crucial for your insurance claim. </p>
          <p className="text-sm text-yellow-800">
          Moreover feel free to separate your items with semi-colons (;), the PDF will automatically turn those into a readable list!
          <span STYLE="font-weight:bold"> Additionally please do not leave in the middle of the worksheet as your data is not saved!</span>
        </p>
      </div>

      <Button 
        onClick={onStart}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white"
      >
        Begin Worksheet
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

const InventoryForm = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [numBedrooms, setNumBedrooms] = useState(0);
  const [numBathrooms, setNumBathrooms] = useState(0);
  const inputRef = useRef(null); // Add this line to define the ref

  // Auto-focus input when question changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestionIndex]);

  // Base questions
  const baseQuestions = [
    // Structural Assessment
    {
      id: 'structural_integrity',
      question: "Let's start with making sure your home is safe. Have you noticed any concerning signs in your home's structure? Things like cracks in the foundation, walls that don't seem quite right, or any parts of the roof that worry you?",
    },
    {
      id: 'exterior_damage',
      question: "Now, let's look at the exterior of your home together. What parts of your home's exterior have been affected? This includes the siding, paint, roofing, gutters, and any windows or doors that may need attention.",
    },
    // Utilities and Systems
    {
      id: 'utility_systems',
      question: "Your home's systems are crucial for daily life. Which utilities or systems have been impacted? This could include electrical wiring, plumbing, heating/cooling (HVAC), or solar panels if you have them.",
    },
    {
      id: 'outdoor_features',
      question: "Let's not forget about your outdoor space. What damage has occurred to your yard, fencing, outdoor lighting, or any special features like pools or patios? Remember to include any outdoor furniture or equipment.",
    },
    // Room Count
    {
      id: 'num_bedrooms',
      question: "To help us get a complete picture of your home, could you tell us how many bedrooms you have, not counting the main bedroom?",
      type: 'number',
      onChange: (value) => setNumBedrooms(parseInt(value)),
    },
    {
      id: 'num_bathrooms',
      question: "And how many bathrooms are there in your home?",
      type: 'number',
      onChange: (value) => setNumBathrooms(parseInt(value)),
    },
    // Main Rooms
    {
      id: 'main_bedroom_furniture',
      question: "Let's start with your main bedroom. What furniture has been affected? This might include your bed, dressers, chairs, or any other furniture pieces that need attention.",
    },
    {
      id: 'main_bedroom_electronics',
      question: "Still thinking about your main bedroom, what electronics have been impacted? This could be things like your TV, computer, phone chargers, or any other electronic devices.",
    },
    {
      id: 'main_bedroom_personal',
      question: "Personal items hold special meaning for everyone. In your main bedroom, what personal belongings have been affected? Think about clothing, jewelry, or any other items (no matter the size of it).",
    },
  ];

  // Generate dynamic questions based on number of rooms
  const getDynamicQuestions = () => {
    let dynamicQuestions = [];

    // Additional Bedrooms
    for (let i = 1; i <= numBedrooms; i++) {
      dynamicQuestions.push(
        {
          id: `bedroom_${i}_furniture`,
          question: `Moving to bedroom ${i}, what furniture items need to be documented? Take your time to think about each piece that's been affected.`,
        },
        {
          id: `bedroom_${i}_electronics`,
          question: `For the same bedroom, what electronics have been impacted? Don't forget about any devices, chargers, or other electronic items.`,
        },
        {
          id: `bedroom_${i}_personal`,
          question: `Lastly for this bedroom, what personal belongings have been affected? We want to make sure we capture everything that matters to you.`,
        }
      );
    }

    // Bathrooms
    for (let i = 1; i <= numBathrooms; i++) {
      dynamicQuestions.push(
        {
          id: `bathroom_${i}_fixtures`,
          question: `For bathroom ${i}, what fixtures have been impacted? This includes things like the toilet, sink, shower, or bathtub.`,
        },
        {
          id: `bathroom_${i}_storage`,
          question: `In the same bathroom, what storage or built-in items need attention? Think about cabinets, shelving, or any other storage solutions.`,
        },
        {
          id: `bathroom_${i}_personal`,
          question: `And what about the personal items in this bathroom? Consider toiletries, towels, or any other personal belongings.`,
        }
      );
    }

    // Kitchen Questions
    dynamicQuestions.push(
      {
        id: 'kitchen_appliances',
        question: "Let's look at your kitchen. What appliances have been affected? This includes major appliances like your refrigerator, stove, dishwasher, or microwave.",
      },
      {
        id: 'kitchen_cabinets',
        question: "How about your kitchen's built-in features? Tell us about any damage to your cabinets, countertops, or any installed fixtures.",
      },
      {
        id: 'kitchen_items',
        question: "Now think about your kitchen items. What cookware, dishes, utensils, or small appliances need to be documented?",
      }
    );

    // Living Areas
    dynamicQuestions.push(
      {
        id: 'living_room_furniture',
        question: "Moving to your living room, what furniture pieces have been affected? Take your time to think about each item.",
      },
      {
        id: 'living_room_electronics',
        question: "What about the electronics in your living room? Consider entertainment systems, gaming consoles, or any other electronic devices.",
      },
      {
        id: 'living_room_decor',
        question: "Let's not forget about the items that make your living room special. What decorative items or artwork have been impacted?",
      },
      {
        id: 'dining_room',
        question: "In your dining area, what items need to be documented? Think about your furniture, any special china or silverware, or other dining room pieces that matter to you.",
      }
    );

    // Additional Areas
    dynamicQuestions.push(
      {
        id: 'garage_tools',
        question: 'Now list damaged items in the garage (tools, equipment, storage):',
      },
      {
        id: 'laundry_room',
        question: 'List damaged laundry room items (washer, dryer, supplies):',
      },
      {
        id: 'home_office',
        question: 'List damaged home office items (furniture, electronics, supplies):',
      }
    );

    return dynamicQuestions;
  };

  const allQuestions = [...baseQuestions, ...getDynamicQuestions()];

  const handleNext = () => {
    if (currentAnswer.trim()) {
      // Store the answer as an array if it contains semicolons
      const processedAnswer = currentAnswer.includes(';') 
        ? currentAnswer.split(';').map(item => item.trim()).filter(Boolean)
        : currentAnswer;
        
      setAnswers({ ...answers, [allQuestions[currentQuestionIndex].id]: processedAnswer });
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
      const bulletMargin = 25;
      const pageHeight = doc.internal.pageSize.height;
      const maxWidth = 170;

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
        
        if (Array.isArray(value)) {
          // Handle itemized list
          value.forEach(item => {
            if (yPosition > pageHeight - 20) {
              doc.addPage();
              yPosition = 20;
            }
            
            const bullet = '•';
            const itemText = ` ${item.trim()}`;
            
            // Add bullet point
            doc.text(bullet, leftMargin, yPosition);
            
            // Split long text into lines
            const lines = doc.splitTextToSize(itemText, maxWidth - (bulletMargin - leftMargin));
            lines.forEach((line, index) => {
              if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
              }
              doc.text(line, bulletMargin, yPosition);
              yPosition += 7;
            });
          });
        } else {
          // Handle single paragraph
          const lines = doc.splitTextToSize(value, maxWidth);
          lines.forEach(line => {
            if (yPosition > pageHeight - 20) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, leftMargin, yPosition);
            yPosition += 7;
          });
        }

        yPosition += 10; // Add space between sections
      });

      // Add tips section
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
    // Next question animations
    enterNext: { opacity: 0, x: 50 },
    enterPrev: { opacity: 0, x: -50 },
    center: { opacity: 1, x: 0 },
    exitNext: { opacity: 0, x: -50 },
    exitPrev: { opacity: 0, x: 50 }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-240px)]">
      <div className="w-full max-w-2xl">
        {showIntro ? (
          <IntroCard onStart={() => setShowIntro(false)} />
        ) : (
          <>
            <AnimatePresence mode="wait">
              {currentQuestionIndex < allQuestions.length ? (
                <motion.div
                key={currentQuestionIndex}
                initial={answers[allQuestions[currentQuestionIndex]?.id] ? "enterPrev" : "enterNext"}
                animate="center"
                exit={answers[allQuestions[currentQuestionIndex]?.id] ? "exitNext" : "exitPrev"}
                variants={variants}
                transition={{ duration: 0.3 }}
              >
                  <Card className="bg-white shadow-lg my-4 md:my-8">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-6">
                        {allQuestions[currentQuestionIndex].question}
                      </h2>
                      <div className="space-y-4">
                        <div className="relative">
                          <Input
                            ref={inputRef}
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
                          <div className="mt-2 flex items-center">
                            <div className="flex-1">
                              <p className="text-sm text-gray-500">
                                Separate multiple items with semicolons:
                                <span className="ml-1 px-1 py-0.5 bg-gray-100 rounded font-mono">item 1; item 2; item 3</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                        {currentQuestionIndex > 0 && (
                            <Button 
                              onClick={() => {
                                setCurrentQuestionIndex(currentQuestionIndex - 1);
                                setCurrentAnswer(answers[allQuestions[currentQuestionIndex - 1].id] || '');
                              }}
                              variant="outline"
                              className="flex-1"
                            >
                              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                              Back
                            </Button>
                          )}
                          <Button 
                            onClick={handleNext}
                            className={`flex-1 bg-blue-500 hover:bg-blue-700 text-white ${currentQuestionIndex > 0 ? "" : "w-full"}`}
                          >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
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
                            {Array.isArray(value) ? (
                              <ul className="list-disc pl-5 text-gray-600 mt-2 space-y-1">
                                {value.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-600">{value}</p>
                            )}
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
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryForm;