import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ECMHealthProfile } from './ecmHealthProfiles';

interface BaziData {
  hourPillar: { stem: string; branch: string };
  dayPillar: { stem: string; branch: string };
  monthPillar: { stem: string; branch: string };
  yearPillar: { stem: string; branch: string };
}

interface ECMData {
  constitutionType: string;
  element: string;
  polarity: string;
  rootStrengthScore: number;
  stability: string;
}

interface ProfileData {
  userName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  bazi: BaziData;
  ecm: ECMData;
  healthProfile: ECMHealthProfile;
}

export const generateProfilePDF = (data: ProfileData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  // Helper function to add section
  const addSection = (title: string, y: number): number => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(103, 58, 183); // Purple color
    doc.text(title, 14, y);
    return y + 8;
  };

  // Helper function to add text with wrapping
  const addText = (text: string, y: number, fontSize: number = 10, style: 'normal' | 'bold' = 'normal'): number => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', style);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, pageWidth - 28);
    doc.text(lines, 14, y);
    return y + (lines.length * fontSize * 0.4) + 3;
  };

  // Helper to check if we need a new page
  const checkNewPage = (requiredSpace: number): number => {
    if (currentY + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      return 20;
    }
    return currentY;
  };

  // Header
  doc.setFillColor(103, 58, 183);
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Numinax', 14, 15);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Personal Health & Constitution Profile', 14, 25);

  currentY = 45;

  // Personal Information
  currentY = addSection('Personal Information', currentY);
  currentY = addText(`Name: ${data.userName}`, currentY);
  currentY = addText(`Birth Date: ${data.birthDate}`, currentY);
  currentY = addText(`Birth Time: ${data.birthTime}`, currentY);
  currentY = addText(`Birth Place: ${data.birthPlace}`, currentY);
  currentY += 5;

  // BaZi Four Pillars
  currentY = checkNewPage(40);
  currentY = addSection('BaZi Four Pillars', currentY);
  
  autoTable(doc, {
    startY: currentY,
    head: [['Pillar', 'Heavenly Stem', 'Earthly Branch']],
    body: [
      ['Hour', data.bazi.hourPillar.stem, data.bazi.hourPillar.branch],
      ['Day', data.bazi.dayPillar.stem, data.bazi.dayPillar.branch],
      ['Month', data.bazi.monthPillar.stem, data.bazi.monthPillar.branch],
      ['Year', data.bazi.yearPillar.stem, data.bazi.yearPillar.branch],
    ],
    theme: 'striped',
    headStyles: { fillColor: [103, 58, 183], textColor: [255, 255, 255] },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // ECM Constitution
  currentY = checkNewPage(30);
  currentY = addSection('ECM Constitution Analysis', currentY);
  currentY = addText(`Constitution Type: ${data.ecm.constitutionType}`, currentY, 11, 'bold');
  currentY = addText(`Primary Element: ${data.ecm.element}`, currentY);
  currentY = addText(`Polarity: ${data.ecm.polarity}`, currentY);
  currentY = addText(`Root Strength Score: ${data.ecm.rootStrengthScore}`, currentY);
  currentY = addText(`Stability: ${data.ecm.stability}`, currentY);
  currentY += 5;

  // Constitution Description
  currentY = checkNewPage(20);
  currentY = addText(data.healthProfile.description, currentY, 10);
  currentY += 5;

  // Characteristics
  currentY = checkNewPage(30);
  currentY = addSection('Your Characteristics', currentY);
  data.healthProfile.characteristics.forEach(char => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${char}`, currentY);
  });
  currentY += 5;

  // Diet Recommendations
  currentY = checkNewPage(40);
  doc.addPage();
  currentY = 20;
  currentY = addSection('Dietary Recommendations', currentY);
  
  currentY = addText('Foods to Embrace:', currentY, 11, 'bold');
  data.healthProfile.dietRecommendations.recommended.forEach(food => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${food}`, currentY);
  });
  currentY += 5;

  currentY = checkNewPage(20);
  currentY = addText('Foods to Avoid:', currentY, 11, 'bold');
  data.healthProfile.dietRecommendations.avoid.forEach(food => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${food}`, currentY);
  });
  currentY += 5;

  currentY = checkNewPage(20);
  currentY = addText('Beneficial Foods:', currentY, 11, 'bold');
  data.healthProfile.dietRecommendations.beneficialFoods.forEach(food => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${food}`, currentY);
  });
  currentY += 5;

  currentY = checkNewPage(20);
  currentY = addText('Cooking Methods:', currentY, 11, 'bold');
  data.healthProfile.dietRecommendations.cookingMethods.forEach(method => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${method}`, currentY);
  });
  currentY += 10;

  // Lifestyle Recommendations
  currentY = checkNewPage(40);
  if (currentY > 200) {
    doc.addPage();
    currentY = 20;
  }
  currentY = addSection('Lifestyle Recommendations', currentY);
  
  currentY = addText('Exercise:', currentY, 11, 'bold');
  data.healthProfile.lifestyleRecommendations.exercise.forEach(ex => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${ex}`, currentY);
  });
  currentY += 5;

  currentY = checkNewPage(20);
  currentY = addText('Sleep:', currentY, 11, 'bold');
  data.healthProfile.lifestyleRecommendations.sleep.forEach(sleep => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${sleep}`, currentY);
  });
  currentY += 5;

  currentY = checkNewPage(20);
  currentY = addText('Environment:', currentY, 11, 'bold');
  data.healthProfile.lifestyleRecommendations.environment.forEach(env => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${env}`, currentY);
  });
  currentY += 5;

  currentY = checkNewPage(20);
  currentY = addText('Activities:', currentY, 11, 'bold');
  data.healthProfile.lifestyleRecommendations.activities.forEach(act => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${act}`, currentY);
  });
  currentY += 10;

  // Wellness Insights
  currentY = checkNewPage(40);
  if (currentY > 200) {
    doc.addPage();
    currentY = 20;
  }
  currentY = addSection('Wellness Insights', currentY);
  
  currentY = addText('Your Strengths:', currentY, 11, 'bold');
  data.healthProfile.wellness.strengths.forEach(strength => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${strength}`, currentY);
  });
  currentY += 5;

  currentY = checkNewPage(20);
  currentY = addText('Areas to Watch:', currentY, 11, 'bold');
  data.healthProfile.wellness.vulnerabilities.forEach(vuln => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${vuln}`, currentY);
  });
  currentY += 5;

  currentY = checkNewPage(20);
  currentY = addText('Preventive Care:', currentY, 11, 'bold');
  data.healthProfile.wellness.preventiveCare.forEach(care => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${care}`, currentY);
  });
  currentY += 5;

  currentY = checkNewPage(20);
  currentY = addText('Seasonal Advice:', currentY, 11, 'bold');
  data.healthProfile.wellness.seasonalAdvice.forEach(advice => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${advice}`, currentY);
  });
  currentY += 10;

  // Emotional Wellness
  currentY = checkNewPage(40);
  if (currentY > 200) {
    doc.addPage();
    currentY = 20;
  }
  currentY = addSection('Emotional Wellness', currentY);
  
  currentY = addText('Common Tendencies:', currentY, 11, 'bold');
  data.healthProfile.emotionalWellness.tendencies.forEach(tend => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${tend}`, currentY);
  });
  currentY += 5;

  currentY = checkNewPage(20);
  currentY = addText('Balancing Practices:', currentY, 11, 'bold');
  data.healthProfile.emotionalWellness.balancingPractices.forEach(practice => {
    currentY = checkNewPage(10);
    currentY = addText(`• ${practice}`, currentY);
  });
  currentY += 10;

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by Numinax | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Disclaimer on first page
  doc.setPage(1);
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  const disclaimer = doc.splitTextToSize(
    'Disclaimer: This report is for informational purposes only and is not medical advice. Consult healthcare professionals for medical decisions.',
    pageWidth - 28
  );
  doc.text(disclaimer, 14, doc.internal.pageSize.getHeight() - 20);

  // Save the PDF
  const fileName = `Numinax_Profile_${data.userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
