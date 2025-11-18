# Health Profile Feature Documentation

## Overview

The Health Profile feature provides users with comprehensive, personalized health recommendations based on their BaZi calculation and ECM (Eight Constitution Medicine) type. This feature transforms ancient wisdom into actionable modern wellness guidance.

## Features

### 1. **Comprehensive Health Recommendations**
Based on your ECM constitution type (10 types: Yin/Yang × Wood/Fire/Earth/Metal/Water), you receive personalized advice covering:

#### Diet & Nutrition
- **Foods to Embrace**: Foods that support your constitution
- **Foods to Avoid**: Foods that may imbalance your system
- **Beneficial Foods**: Specific ingredients for your type
- **Cooking Methods**: Optimal food preparation techniques

#### Lifestyle Recommendations
- **Exercise**: Activities suited to your constitutional energy
- **Sleep**: Optimal sleep patterns and duration
- **Environment**: Ideal living spaces and settings
- **Activities**: Recommended hobbies and pursuits

#### Wellness Insights
- **Your Strengths**: Natural health advantages
- **Areas to Watch**: Potential vulnerabilities
- **Preventive Care**: Proactive health maintenance
- **Seasonal Advice**: How to adjust throughout the year

#### Emotional Wellness
- **Common Tendencies**: Emotional patterns for your type
- **Balancing Practices**: Techniques to maintain emotional health

### 2. **PDF Download**
Generate a professional, downloadable PDF report including:
- Complete BaZi Four Pillars chart
- ECM constitution analysis
- All health recommendations
- Branded Numinax design
- Multi-page comprehensive format
- Professional disclaimer

### 3. **Data Persistence**
- Automatically saves your last BaZi calculation to localStorage
- Quick access to profile without recalculation
- Seamless navigation between Calculator and Profile

## Implementation Details

### Key Files Created

1. **`src/lib/ecmHealthProfiles.ts`**
   - Complete health data for all 10 ECM constitution types
   - Structured recommendations by category
   - Fallback handling for unknown types

2. **`src/lib/pdfGenerator.ts`**
   - PDF generation using jsPDF
   - Professional layout with Numinax branding
   - Multi-page formatting with pagination
   - Table generation for Four Pillars
   - Auto-wrapping text for recommendations

3. **`src/pages/Profile.tsx`**
   - Main profile display page
   - Beautiful card-based layout
   - Color-coded sections (green for strengths, amber for vulnerabilities)
   - Responsive grid design
   - Badge components for tags

### ECM Constitution Types Covered

Each of the 10 types has complete, unique recommendations:

1. **Yang Wood** - Like strong trees (assertive, growth-oriented)
2. **Yin Wood** - Like flexible bamboo (adaptable, gentle)
3. **Yang Fire** - Like the sun (radiant, passionate)
4. **Yin Fire** - Like candlelight (warm, gentle)
5. **Yang Earth** - Like mountains (stable, grounded)
6. **Yin Earth** - Like fertile soil (nurturing, receptive)
7. **Yang Metal** - Like refined steel (strong, disciplined)
8. **Yin Metal** - Like precious gems (refined, pure)
9. **Yang Water** - Like the ocean (powerful, deep)
10. **Yin Water** - Like morning dew (subtle, adaptive)

## User Journey

1. **Calculate BaZi Chart**
   - User enters birth information in Calculator
   - System calculates Four Pillars and ECM type
   - Results automatically saved to localStorage

2. **View Results**
   - BaZi chart displayed with pillars
   - ECM type shown with analysis
   - "View Health Profile" button appears

3. **Access Profile**
   - Click "View Health Profile" or navigate via Dashboard/Navbar
   - Comprehensive health recommendations displayed
   - Beautiful, organized layout by category

4. **Download PDF**
   - Click "Download PDF Report" button
   - Professional multi-page PDF generated
   - Includes all BaZi data and recommendations
   - Branded with Numinax colors and logo

## Navigation Integration

### Dashboard
- New "Health Profile" card added
- Prominent placement (2nd position)
- Direct link to `/profile` route

### Navbar
- "Profile" link in main navigation (desktop)
- User icon for visual recognition
- Protected route (requires authentication)

### Calculator Results
- "View Health Profile" button after calculation
- Two-button layout: "View Health Profile" + "Calculate Another Chart"
- Seamless flow from calculation to personalized advice

## Technical Architecture

### Data Flow
```
Calculator Input → BaZi Calculation → ECM Type Determination
                                    ↓
                            localStorage Storage
                                    ↓
                            Profile Page Retrieval
                                    ↓
            ECM Health Profile Lookup → Display + PDF Generation
```

### Storage Strategy
- **localStorage key**: `lastBaziCalculation`
- **Data stored**: 
  - Four Pillars (Hour, Day, Month, Year)
  - ECM constitution type and analysis
  - User input (name, birth date/time/place)
  - Timestamp

### PDF Generation
- **Library**: jsPDF with jspdf-autotable plugin
- **Features**:
  - Purple header with Numinax branding
  - Automatic page breaks
  - Section headings with consistent styling
  - Bullet lists for recommendations
  - Page numbers and footer
  - Legal disclaimer
  - Professional spacing and layout

## Design Philosophy

### Visual Hierarchy
1. **Header** - Bold purple gradient with white text
2. **Personal Info** - Clean card with icons
3. **BaZi Pillars** - Purple gradient boxes
4. **Constitution** - Large badge with description
5. **Recommendations** - Organized by category with icons
6. **Wellness** - Color-coded (green/amber) for easy scanning

### Color Coding
- **Purple** - Primary brand color, main elements
- **Green** - Strengths, beneficial items, recommended foods
- **Red/Amber** - Warnings, areas to watch, foods to avoid
- **Gray** - Supporting text and descriptions

### Icons
- User, Calendar, MapPin - Personal information
- Utensils - Diet recommendations
- Dumbbell - Exercise and lifestyle
- Moon - Sleep recommendations
- Heart - Wellness insights
- Sparkles - Constitution type

## Future Enhancements

### Potential Additions
- [ ] Calculation history with multiple saved profiles
- [ ] Comparison tool for different birth times
- [ ] Share profile via unique URL
- [ ] Email delivery of PDF reports
- [ ] Print-optimized layout
- [ ] Practitioner mode for client management
- [ ] Customizable report templates
- [ ] Multi-language support for recommendations
- [ ] Integration with wearables for activity tracking
- [ ] Seasonal reminder system

### Database Integration
When Supabase is fully configured:
- Store all user calculations in database
- Enable calculation history page
- Track which recommendations users find helpful
- Allow users to save custom notes
- Generate insights from user patterns

## Health Recommendations Philosophy

All recommendations are based on traditional East Asian medicine principles:

### Five Elements Theory
- Each element (Wood, Fire, Earth, Metal, Water) corresponds to organs, emotions, and qualities
- Yin/Yang polarity affects intensity and expression
- Balance is achieved through supporting and moderating elements

### Personalization Principles
- **Diet**: Match food energetics to constitutional needs
- **Lifestyle**: Align activity levels with natural energy
- **Timing**: Optimize routines for organ clock
- **Environment**: Create spaces that support your element
- **Emotions**: Recognize tendencies and balance practices

### Safety & Disclaimers
- All profiles include medical disclaimer
- Recommendations are informational, not prescriptive
- Users encouraged to consult healthcare professionals
- Focus on general wellness, not disease treatment

## Success Metrics

The Profile feature is successful when users:
1. ✅ Easily navigate from calculation to profile
2. ✅ Understand their constitution type
3. ✅ Find recommendations clear and actionable
4. ✅ Download and share their PDF reports
5. ✅ Return to reference their profile
6. ✅ Feel empowered to make health choices
7. ✅ See value in premium subscription tiers

## Support & Resources

### For Users
- Each recommendation is self-explanatory
- Profile organized for easy scanning
- PDF for offline reference
- Dashboard provides quick access

### For Developers
- Type-safe interfaces throughout
- Modular architecture (profiles, PDF, display)
- Easy to add new constitution types
- Extensible recommendation structure
- Clear documentation in code

---

**Built with** ❤️ **by Numinax** - Where ancient wisdom meets modern wellness.
