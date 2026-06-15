const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, Header, Footer, PageBreak, SimpleField,
  TabStopType, TabStopPosition, ImageRun, ExternalHyperlink
} = require('docx');
const fs = require('fs');
const path = require('path');

// ── page setup ───────────────────────────────────────────────────────────────
const TW = 9360;
const F   = 'Times New Roman';
const FA  = 'Arial';
const BLU = '2563EB';   // blue for headings / names
const BLK = '000000';
const GRY = '374151';

const bdr = { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' };
const bdrs = { top: bdr, bottom: bdr, left: bdr, right: bdr };
const hbdr = { style: BorderStyle.SINGLE, size: 2, color: '1F3864' };
const hbdrs = { top: hbdr, bottom: hbdr, left: hbdr, right: hbdr };
const noBdr = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBdrs = { top: noBdr, bottom: noBdr, left: noBdr, right: noBdr };
const cm = { top: 80, bottom: 80, left: 120, right: 120 };

// ── helpers ───────────────────────────────────────────────────────────────────
const pb  = () => new Paragraph({ children: [new PageBreak()] });
const sp  = (n=120) => new Paragraph({ spacing:{before:0,after:n}, children:[new TextRun('')] });
const cen = (text,sz=24,bold=false,color=BLK,underline=false,italics=false) =>
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing:{before:60,after:60},
    children: [new TextRun({ text, size:sz, bold, font:F, color, underline: underline ? {} : undefined, italics })]
  });

const body = text =>
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED, spacing:{before:80,after:100,line:320,lineRule:'auto'},
    children: [new TextRun({ text, size:22, font:F })]
  });

const bul = text =>
  new Paragraph({
    numbering:{reference:'bullets',level:0}, spacing:{before:60,after:60,line:280,lineRule:'auto'},
    children: [new TextRun({ text, size:22, font:F })]
  });

const num = text =>
  new Paragraph({
    numbering:{reference:'numbers',level:0}, spacing:{before:60,after:60,line:280,lineRule:'auto'},
    children: [new TextRun({ text, size:22, font:F })]
  });

const h1 = (text, blue=true) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1, spacing:{before:280,after:120},
    children: [new TextRun({ text, font:FA, color: blue ? BLU : BLK })]
  });

const h2 = text =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2, spacing:{before:200,after:100},
    children: [new TextRun({ text, font:FA })]
  });

const h3 = text =>
  new Paragraph({
    heading: HeadingLevel.HEADING_3, spacing:{before:160,after:80},
    children: [new TextRun({ text, font:FA })]
  });

function thRow(cols,widths){
  return new TableRow({ children: cols.map((c,i)=>new TableCell({
    borders:hbdrs, width:{size:widths[i],type:WidthType.DXA}, margins:cm,
    shading:{fill:'1F3864',type:ShadingType.CLEAR},
    children:[new Paragraph({children:[new TextRun({text:c,bold:true,size:20,font:FA,color:'FFFFFF'})]})]
  }))});
}
function tdRow(cols,widths,alt=false){
  return new TableRow({ children: cols.map((c,i)=>new TableCell({
    borders:bdrs, width:{size:widths[i],type:WidthType.DXA}, margins:cm,
    shading:{fill: alt?'EEF2FF':'FFFFFF',type:ShadingType.CLEAR},
    children:[new Paragraph({children:[new TextRun({text:c,size:20,font:F})]})]
  }))});
}
function tbl(headers,rows,widths){
  return new Table({ width:{size:TW,type:WidthType.DXA}, columnWidths:widths,
    rows:[thRow(headers,widths), ...rows.map((r,i)=>tdRow(r,widths,i%2===1))]
  });
}

// code block paragraph
const code = text =>
  new Paragraph({
    spacing:{before:0,after:0,line:240,lineRule:'auto'},
    shading:{fill:'1E1E1E',type:ShadingType.CLEAR},
    children: [new TextRun({ text, size:18, font:'Courier New', color:'D4D4D4' })]
  });
const codeBlock = lines =>
  new Table({ width:{size:TW,type:WidthType.DXA}, columnWidths:[TW],
    rows:[new TableRow({ children:[new TableCell({
      borders:bdrs, width:{size:TW,type:WidthType.DXA}, margins:{top:80,bottom:80,left:160,right:160},
      shading:{fill:'1E1E1E',type:ShadingType.CLEAR},
      children: lines.map(l=>new Paragraph({
        spacing:{before:0,after:0,line:240,lineRule:'auto'},
        children:[new TextRun({text:l,size:18,font:'Courier New',color:'D4D4D4'})]
      }))
    })]})],
  });

// image helper
function img(path, w, h){
  if (!path || !fs.existsSync(path)) return sp(120);
  const data = fs.readFileSync(path);
  return new Paragraph({
    alignment: AlignmentType.CENTER, spacing:{before:120,after:120},
    children:[new ImageRun({ data, transformation:{width:w,height:h}, type:'png' })]
  });
}

// ── read diagram images ───────────────────────────────────────────────────────
const erImg  = path.join(__dirname, 'er_diagram.png');
const dfd0   = path.join(__dirname, 'dfd_level0.png');
const dfd1   = path.join(__dirname, 'dfd_level1.png');
const dfd2   = path.join(__dirname, 'dfd_level2.png');

// ── default header/footer (content pages) ────────────────────────────────────
const pageHeader = new Header({ children:[
  new Paragraph({
    border:{ bottom:{style:BorderStyle.SINGLE,size:4,color:'2563EB',space:4} },
    spacing:{before:0,after:120},
    children:[new TextRun({text:'TrueBite – AI-Powered Food Safety & Compliance Verification Platform',
      size:18, font:FA, color:BLU, italics:true })]
  })
]});

const pageFooter = new Footer({ children:[
  new Paragraph({
    border:{top:{style:BorderStyle.SINGLE,size:4,color:'2563EB',space:4}},
    spacing:{before:80,after:0},
    tabStops:[{type:TabStopType.RIGHT,position:TW}],
    children:[
      new TextRun({text:'Department of Computer Applications – DSCASC\t',size:18,font:FA,color:BLU}),
      new SimpleField('PAGE',undefined,{size:18,font:FA,color:BLU})
    ]
  })
]});

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════
const doc = new Document({
  numbering:{
    config:[
      {reference:'bullets',levels:[{level:0,format:LevelFormat.BULLET,text:'\u2022',
        alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
      {reference:'numbers',levels:[{level:0,format:LevelFormat.DECIMAL,text:'%1.',
        alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
    ]
  },
  styles:{
    default:{document:{run:{font:F,size:22}}},
    paragraphStyles:[
      {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,
        run:{size:28,bold:true,font:FA,color:BLU},
        paragraph:{spacing:{before:280,after:120},outlineLevel:0}},
      {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,
        run:{size:24,bold:true,font:FA,color:'1F3864'},
        paragraph:{spacing:{before:200,after:100},outlineLevel:1}},
      {id:'Heading3',name:'Heading 3',basedOn:'Normal',next:'Normal',quickFormat:true,
        run:{size:22,bold:true,font:FA,color:'374151'},
        paragraph:{spacing:{before:160,after:80},outlineLevel:2}},
    ]
  },
  sections:[
    // ══════════════════════════════════════════════════════════════════════════
    // COVER PAGE
    // ══════════════════════════════════════════════════════════════════════════
    {
      properties:{ page:{ size:{width:12240,height:15840}, margin:{top:1440,right:1080,bottom:1440,left:1080} }},
      children:[
        sp(240),
        cen('Bangalore University',32,true),
        cen('VI- Semester BCA-NEP Project Report on',22),
        sp(200),
        cen('TrueBite',52,true,BLU),
        cen('AI-Powered Food Safety & Compliance Verification Platform',24,false,BLU,false,true),
        sp(280),
        cen('Submitted by',22,false,BLK,true),
        sp(60),
        cen('Wazir Kazimi',30,true,BLU),
        cen('[Registration Number]',22,false,BLU),
        sp(160),
        cen('Under the Guidance of',22,false,BLK,true),
        sp(60),
        cen('[Guide Name]',30,true,BLU),
        cen('Department of Computer Applications – BCA',22,true),
        sp(200),
        new Paragraph({
          alignment:AlignmentType.CENTER,
          border:{bottom:{style:BorderStyle.SINGLE,size:4,color:'888888',space:4}},
          spacing:{before:0,after:160}, children:[new TextRun('')]
        }),
        sp(80),
        cen('DAYANANDA SAGAR COLLEGE OF ARTS, SCIENCE AND COMMERCE',24,true),
        cen('Kumaraswamy Layout, Bangalore – 560 111, Karnataka',20),
        new Paragraph({
          alignment:AlignmentType.CENTER, spacing:{before:40,after:80},
          children:[new ExternalHyperlink({
            link:'http://dayanandasagar.edu/dscasc/',
            children:[new TextRun({text:'http://dayanandasagar.edu/dscasc/',size:20,font:F,color:'2563EB',underline:{}})]
          })]
        }),
        cen('Academic Year 2025 – 2026',22,false,GRY),
        pb()
      ]
    },
    // ══════════════════════════════════════════════════════════════════════════
    // BODY SECTION
    // ══════════════════════════════════════════════════════════════════════════
    {
      properties:{ page:{ size:{width:12240,height:15840}, margin:{top:1080,right:1080,bottom:1080,left:1440} }},
      headers:{ default: pageHeader },
      footers:{ default: pageFooter },
      children:[

        // ── CERTIFICATE ──────────────────────────────────────────────────────
        cen('DAYANANDA SAGAR COLLEGE OF ARTS, SCIENCE AND COMMERCE',26,true),
        cen('Department of Computer Applications – BCA',22,true),
        sp(160),
        cen('CERTIFICATE',32,true,BLU),
        sp(160),
        new Paragraph({
          alignment:AlignmentType.JUSTIFIED, spacing:{before:80,after:100,line:360,lineRule:'auto'},
          children:[
            new TextRun({text:'This is to certify that the project entitled ',size:22,font:F}),
            new TextRun({text:'TrueBite – AI-Powered Food Safety & Compliance Verification Platform',size:22,font:F,bold:true,color:BLU}),
            new TextRun({text:' is a bonafide work carried out by ',size:22,font:F}),
            new TextRun({text:'Wazir Kazimi – [Registration Number]',size:22,font:F,bold:true,color:BLU}),
            new TextRun({text:', in fulfilment of VI Semester – NEP, Bachelor of Computer Applications as prescribed by Bangalore University during the academic year 2025–26.',size:22,font:F}),
          ]
        }),
        sp(320),
        new Table({ width:{size:TW,type:WidthType.DXA}, columnWidths:[3120,3120,3120],
          rows:[new TableRow({ children:[
            new TableCell({borders:noBdrs,width:{size:3120,type:WidthType.DXA},margins:cm,children:[
              new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'[Guide Name]',bold:true,size:22,font:F})]}),
              new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'[Designation]',size:20,font:F})]}),
              new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'DSCASC',size:20,font:F})]}),
            ]}),
            new TableCell({borders:noBdrs,width:{size:3120,type:WidthType.DXA},margins:cm,children:[
              new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'Dr. Aruna Devi C',bold:true,size:22,font:F})]}),
              new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'HOD – BCA',size:20,font:F})]}),
              new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'DSCASC',size:20,font:F})]}),
            ]}),
            new TableCell({borders:noBdrs,width:{size:3120,type:WidthType.DXA},margins:cm,children:[
              new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'Prof. Hemanth Uppala',bold:true,size:22,font:F})]}),
              new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'Vice Principal',size:20,font:F})]}),
              new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'DSCASC',size:20,font:F})]}),
            ]}),
          ]})]
        }),
        pb(),

        // ── ACKNOWLEDGEMENT ─────────────────────────────────────────────────
        cen('ACKNOWLEDGEMENT',30,true,BLU),
        sp(160),
        body('Dreams never turn to reality unless a lot of efforts and hard work is put into them, and no effort bears fruit in the absence of support and guidance. It takes a lot of effort to work my way through this goal and having someone to guide me and help me is always a blessing. I would like to take this opportunity to thank a few who were closely involved in completing and executing this project.'),
        sp(80),
        body('At the outset, I thank God Almighty for making my endeavor a success. I would like to express my sincere thanks to the Management of Dayananda Sagar College of Arts, Science and Commerce for providing excellent infrastructure and other facilities, which enabled me to sharpen my skills.'),
        sp(80),
        body('I would like to express a deep sense of gratitude to Dr. Balu L, Principal, and Prof. Hemanth Uppala, Vice Principal, Prof. Dr. Kumudavalli M V, Deputy Director and Dr. Aruna Devi C, Head of the Department, for providing us with adequate facilities, ways and means by which I was able to complete this project.'),
        sp(80),
        body('I express my sincere gratitude to the Project Guide [Guide Name] for the constant support and valuable suggestions without which the successful completion of this project would not have been possible. Their guidance on full-stack MERN development, API integration, and system design was invaluable throughout development.'),
        sp(80),
        body('I express my immense indebtedness to all the teachers and staff of the Department of Computer Applications, Dayananda Sagar College of Arts, Science and Commerce for their cooperation and support. I also thank my co-founder Jyotsna Bannur and my family members who in one way or another helped me in the successful completion of this work.'),
        sp(200),
        new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:'Wazir Kazimi',bold:true,size:22,font:F})]}),
        new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:'[Registration Number]',size:22,font:F})]}),
        pb(),

        // ── ABSTRACT ────────────────────────────────────────────────────────
        cen('ABSTRACT',30,true,BLU),
        sp(160),
        body('TrueBite is a full-stack web application built on the MERN-inspired stack (React.js, Node.js, Express.js) with Supabase (PostgreSQL) as the primary cloud database, designed to empower Indian consumers with real-time food safety and nutritional transparency. The platform allows users to scan or upload packaged food product images for OCR-based text extraction using the Google Vision REST API, or scan product barcodes using html5-qrcode for instant product lookup from the Open Food Facts database — filtered exclusively for Indian-packaged food products.'),
        sp(80),
        body('TrueBite verifies extracted FSSAI licence numbers against the official FSSAI FOSCOS API in real time and computes four internationally recognised health grades simultaneously: a proprietary Custom Health Score (0–10), the European Nutri-Score (A–E), Singapore\'s Nutri-Grade (A–D), and a Japanese nutritional balance grade. The platform features a personalised 4-step onboarding flow, health mode scoring (Weight Loss, Diabetic, Gym), Veg/Non-Veg detection and filtering, a personal Food Log with scan history, bookmarks, an in-app compliance reporting system, and a dedicated Experts consultation page.'),
        sp(80),
        body('Built with React.js (Vite) and Tailwind CSS v4 with Framer Motion animations on the frontend, the application is deployed to production on Vercel (frontend) and Render (backend) with Supabase as the cloud database. TrueBite represents a practical integration of OCR technology, government compliance API integration, health analytics, and consumer product design in a single cohesive application.'),
        pb(),

        // ── INDEX ────────────────────────────────────────────────────────────
        cen('INDEX',30,true,BLU),
        sp(160),
        tbl(
          ['Sl. No.','Content','Page No.'],
          [
            ['1','Introduction','1 – 5'],
            ['2','Requirement Analysis\n  Hardware Requirements\n  Software Requirements','6'],
            ['3','Software Requirement Specification','7 – 14'],
            ['4','Analysis and Design\n  E.R Diagram\n  DFD (Data Flow Diagram)\n  Tables','15 – 26'],
            ['5','Implementation\n  Snapshots\n  Coding','27 – 60'],
            ['6','Testing\n  Test Plan\n  Sample Test Cases','61 – 70'],
            ['7','Conclusion & Future Enhancement','71 – 72'],
            ['8','Bibliography','73'],
          ],
          [900,6660,1800]
        ),
        pb(),

        // ══════════════════════════════════════════════════════════════════════
        // CHAPTER 1 — INTRODUCTION
        // ══════════════════════════════════════════════════════════════════════
        h1('1. INTRODUCTION'),
        sp(80),
        new Paragraph({
          alignment:AlignmentType.JUSTIFIED, spacing:{before:80,after:100,line:320,lineRule:'auto'},
          children:[
            new TextRun({text:'Welcome to the Future of Food Transparency: ',size:22,font:F,bold:true}),
            new TextRun({text:'TrueBite',size:22,font:F,bold:true,color:BLU}),
          ]
        }),
        sp(60),
        body('In an era where health consciousness is rising and consumer rights are increasingly important, India\'s packaged food industry presents a critical transparency gap. Millions of products enter retail shelves every year with complex nutrition labels that most consumers cannot interpret, and FSSAI licence numbers that no one verifies. TrueBite is built to change that.'),
        body('TrueBite is a comprehensive, AI-powered food safety and compliance verification web application designed for Indian consumers. Whether you are a diabetic patient checking sugar levels, a fitness enthusiast tracking protein intake, or a parent verifying a product\'s compliance status, TrueBite provides all the information you need in a single scan. The platform integrates OCR technology, barcode scanning, government compliance APIs, and four internationally recognised health grading systems into one premium, mobile-first web application.'),
        sp(100),
        h2('Purpose'),
        body('The primary goal of TrueBite is to redefine food transparency for Indian consumers by combining advanced web technologies with practical health intelligence. The platform allows users to scan, verify, and grade any packaged food product in seconds.'),
        sp(60),
        body('Key purposes include:'),
        bul('FSSAI Compliance Verification: Verify whether a product\'s FSSAI licence is valid, invalid, or unverified in real time using the official FOSCOS API.'),
        bul('Multi-Standard Health Grading: Apply four internationally recognised grading systems (Custom Score, Nutri-Score, Nutri-Grade, Japanese Grade) to every product simultaneously.'),
        bul('Personalised Scoring: Adjust health scores based on the user\'s health goal — Weight Loss, Diabetic, Gym, or Default mode.'),
        bul('Dual Input Scanning: Accept product input via image upload (OCR) or live barcode scanning.'),
        bul('Community Reporting: Allow users to report non-compliant products directly within the app.'),
        sp(100),
        h2('Scope'),
        body('The TrueBite platform is a web application accessible on all modern browsers across desktop and mobile devices. The current version covers individual consumer use with the following in-scope features:'),
        sp(60),
        new Paragraph({
          spacing:{before:80,after:80},
          children:[new TextRun({text:'In-Scope Features:',size:22,font:F,bold:true})]
        }),
        num('User Registration and Authentication with 4-step personalised onboarding (Age, Goal, Vegan preference, Allergies).'),
        num('Dual Input: Image Upload + OCR (Google Vision REST API) and Live Barcode Scanning (html5-qrcode + Open Food Facts API).'),
        num('FSSAI Licence Verification via official FSSAI FOSCOS API with Valid / Invalid / Unverified status display.'),
        num('Four-Standard Health Grading Engine: Custom Health Score, Nutri-Score (A–E), Nutri-Grade (A–D), Japanese Grade.'),
        num('Personalised Health Mode scoring: Default, Weight Loss, Diabetic, Gym.'),
        num('Veg/Non-Veg detection, display, and filtering across all product views.'),
        num('Food Log: Personal scan history, bookmarks, and saved product records stored in Supabase.'),
        num('Product Search by name using the Open Food Facts API with India-specific filtering.'),
        num('In-app compliance reporting system with MongoDB-stored report records.'),
        num('Experts Consultation page featuring co-founders Wazir Kazimi (CEO) and Jyotsna Bannur (Head of Nutrition).'),
        sp(80),
        new Paragraph({
          spacing:{before:80,after:80},
          children:[new TextRun({text:'Out-of-Scope (current version):',size:22,font:F,bold:true})]
        }),
        num('Native mobile application (planned as React Native in future phase).'),
        num('Additive/INS number risk detection (planned future feature).'),
        num('AI-powered product recommendations (planned future feature).'),
        num('Retailer B2B compliance dashboard (future phase).'),
        sp(100),
        h2('Model Description'),
        body('TrueBite consists of the following primary modules:'),
        sp(80),
        h3('1. Authentication & Onboarding Module'),
        body('Handles user registration with a 4-step interactive onboarding survey, login with JWT-based session management, and profile management including health mode and Veg preference storage in Supabase.'),
        h3('2. Dual Input Scanning Module'),
        body('Provides two product input methods: image upload with Google Vision REST API OCR extraction, and live barcode scanning with html5-qrcode + Open Food Facts API lookup filtered for Indian products.'),
        h3('3. FSSAI Compliance Verification Module'),
        body('Extracted FSSAI licence numbers are verified in real time against the official FSSAI FOSCOS API. Results displayed as Valid (green), Invalid (red), or Unverified (grey) with contextual action buttons.'),
        h3('4. Health Grading Engine'),
        body('Computes all four health grades from extracted nutritional data per 100g: Custom Health Score with personalised mode modifiers, Nutri-Score using the official European algorithm, Singapore Nutri-Grade, and Japanese nutritional balance grade. All four grades visualised simultaneously on the Results dashboard.'),
        h3('5. Personalised Health Mode Module'),
        body('Users select one of four health modes (Default, Weight Loss, Diabetic, Gym) stored in Supabase. The active mode dynamically adjusts Custom Health Score weighting and is clearly displayed on the Results page with an explanation of its impact.'),
        h3('6. Product Search & Discovery Module'),
        body('Name-based product search via Open Food Facts API with India-specific filtering. Category chip clicks are mapped to concrete API queries. Results displayed as a responsive product card grid with grade badges and Veg/Non-Veg indicators.'),
        h3('7. Food Log, Bookmarks & Reporting Module'),
        body('Complete scan history persisted per user in Supabase. Users can bookmark products, filter history by grade and Veg status, and file in-app compliance reports against non-compliant products.'),
        h3('8. Experts Consultation Page'),
        body('Dedicated page featuring the actual co-founders — Wazir Kazimi (Co-Founder & CEO) and Jyotsna Bannur (Co-Founder & Head of Nutrition) — with professional bios, expertise tags, and consultation request functionality.'),
        pb(),

        // ══════════════════════════════════════════════════════════════════════
        // CHAPTER 2 — REQUIREMENT ANALYSIS
        // ══════════════════════════════════════════════════════════════════════
        h1('2. REQUIREMENT ANALYSIS'),
        sp(80),
        h2('HARDWARE REQUIREMENTS:'),
        sp(60),
        tbl(
          ['Component','Minimum','Recommended'],
          [
            ['RAM','4 GB','8 GB or higher'],
            ['Processor','Dual-core 1.5 GHz','Intel i5 / AMD Ryzen 5, 2.5 GHz+'],
            ['Hard Disk','5 GB free space','10 GB+ (SSD preferred)'],
            ['Camera / Webcam','Any basic webcam','HD webcam for live barcode scanning'],
            ['Internet Connection','Stable broadband (5 Mbps)','High-speed internet (25 Mbps+)'],
            ['Display','1280×720 resolution','1920×1080 or higher'],
          ],
          [3000,3180,3180]
        ),
        sp(160),
        h2('SOFTWARE REQUIREMENTS:'),
        sp(60),
        bul('Frontend: React.js 18 (Vite), Tailwind CSS v4, Framer Motion'),
        bul('Backend: Node.js 18+, Express.js 4.x'),
        bul('Database: Supabase (PostgreSQL) — cloud hosted'),
        bul('OCR: Google Vision REST API (primary), Tesseract.js (fallback)'),
        bul('Barcode Scanning: html5-qrcode (browser-based, hardware-accelerated)'),
        bul('Charts: Chart.js with react-chartjs-2'),
        bul('Authentication: JSON Web Tokens (JWT), BCryptJS'),
        bul('Image Storage: Cloudinary (free tier)'),
        bul('External APIs: Open Food Facts API, FSSAI FOSCOS API'),
        bul('Operating System: Windows 10+, macOS 12+, Ubuntu 20.04+'),
        bul('Browser Support: Chrome 110+, Firefox 110+, Safari 16+, Edge 110+'),
        bul('Other Tools: VS Code, Git, Postman, npm, Vite'),
        bul('Hosting: Vercel (Frontend) + Render (Backend)'),
        pb(),

        // ══════════════════════════════════════════════════════════════════════
        // CHAPTER 3 — SRS
        // ══════════════════════════════════════════════════════════════════════
        h1('3. SOFTWARE REQUIREMENT SPECIFICATION'),
        sp(80),
        body('The Software Requirement Specification (SRS) for TrueBite outlines the technologies and frameworks used to build and support the system\'s functionality, including client-side, server-side, and database components.'),
        sp(80),

        h2('React.js (Vite)'),
        body('React.js is used as the core frontend framework for building the TrueBite single-page application. Vite is used as the build tool for its fast hot-module replacement during development. React\'s component-based architecture allows each UI section (Scan page, Results dashboard, Food Log) to be developed, tested, and maintained independently.'),
        new Paragraph({spacing:{before:60,after:40},children:[new TextRun({text:'Key Features:',size:22,font:F,bold:true})]}),
        bul('Component-based UI rendering for all 8 application pages'),
        bul('React Router v6 for client-side navigation with protected routes'),
        bul('AuthContext (React Context API) for global JWT state management'),
        bul('useState and useEffect hooks for scan and grading state'),

        sp(80),
        h2('Tailwind CSS v4'),
        body('Tailwind CSS v4 provides utility-first styling for TrueBite\'s deep purple design system. The framework enables rapid UI development with consistent spacing, typography, and color tokens without writing custom CSS for each component.'),
        bul('Deep purple color palette (primary: #7C3AED, accent: #8B5CF6)'),
        bul('Responsive grid layouts (grid-cols-1 scaling to grid-cols-6 on desktop)'),
        bul('Glassmorphism effects using backdrop-blur and semi-transparent backgrounds'),
        bul('Dark purple gradient backgrounds on hero sections and CTAs'),

        sp(80),
        h2('Node.js + Express.js'),
        body('Node.js with Express.js serves as the backend REST API layer. All client requests are routed through Express middleware before reaching the appropriate controller. The backend handles authentication, image upload processing, OCR proxying, FSSAI verification, grading computation, and all Supabase database operations.'),
        bul('REST API with structured routes: /api/auth, /api/scan, /api/search, /api/report, /api/user'),
        bul('Multer middleware for multipart image upload handling'),
        bul('Express rate limiting to prevent API abuse'),
        bul('CORS configured for Vercel production domain'),

        sp(80),
        h2('Supabase (PostgreSQL)'),
        body('Supabase replaced the initial MongoDB setup as the primary database. Supabase provides a hosted PostgreSQL database with built-in user management, Row Level Security (RLS), and a real-time API. The relational structure of PostgreSQL is better suited for TrueBite\'s complex scan-user-bookmark relationships than a document database.'),
        bul('Four primary tables: users, scans, reports, bookmarks'),
        bul('Row Level Security enforced: users can only read/write their own scan records'),
        bul('JSONB columns for nutrition_data and scores — flexible schema within relational structure'),
        bul('Supabase client SDK used for direct frontend queries where appropriate'),

        sp(80),
        h2('Google Vision REST API'),
        body('Google Vision REST API is used as the primary OCR engine for extracting text from uploaded product label images. The implementation was migrated from the initial bulky JSON Service Account credential approach to a lightweight API key implementation, reducing server startup time and deployment complexity.'),
        bul('Endpoint: POST https://vision.googleapis.com/v1/images:annotate'),
        bul('Image sent as base64-encoded string in the request body'),
        bul('TEXT_DETECTION feature used to return full-text annotation'),
        bul('FSSAI number extracted using regex pattern /\\d{14}/'),
        bul('Nutritional values parsed by searching for keyword-adjacent numbers in OCR text'),

        sp(80),
        h2('html5-qrcode'),
        body('html5-qrcode enables hardware-accelerated live barcode scanning directly in the browser without requiring any native app installation. It uses the browser\'s getUserMedia API to access the device camera and actively decodes barcodes in real time.'),
        bul('Dynamically mounted on Scan.jsx component mount, cleared on unmount to prevent memory leaks'),
        bul('Supports QR codes, EAN-13, EAN-8, UPC-A, and UPC-E barcode formats'),
        bul('Decoded barcode sent to backend proxy for Open Food Facts API lookup'),
        bul('India-specific filtering applied via countries_tags_en=\'india\' parameter'),

        sp(80),
        h2('MODULES OF PROPOSED SYSTEM'),
        sp(80),
        h3('1. User Authentication & 4-Step Onboarding'),
        body('JWT-based registration and login. The Register.jsx page implements a 4-step onboarding survey collecting Age, Primary Goal, Dietary Preference (Vegan/Non-Vegan), and Known Allergies. On submission, BCrypt hashes the password and stores the user in Supabase. A JWT is issued and stored in localStorage.'),
        h3('2. Product Scanning Module'),
        body('Two input modes: Image Upload (Google Vision OCR) and Barcode Scanning (html5-qrcode + Open Food Facts). Both flows normalise to the same nutritional JSON schema before entering the grading pipeline.'),
        h3('3. FSSAI Compliance Module'),
        body('FSSAI licence numbers are verified against the official FOSCOS API. Results displayed as colour-coded status banners with contextual action buttons (Report for Invalid status).'),
        h3('4. Health Grading Engine'),
        body('Four grading algorithms computed from nutritional data per 100g. Initial lenient logic was completely rewritten: missing data now defaults to N/A instead of a false 10/10, and sugary beverages (high sugar, zero fat) correctly receive Poor grades.'),
        h3('5. Personalised Health Mode'),
        body('Mode stored in Supabase users table and applied dynamically during grading. Mode changes persisted via PUT /api/user/mode.'),
        h3('6. Food Log & Bookmarks'),
        body('Complete scan history per user stored in Supabase scans table. Filterable timeline view with bookmark and delete actions.'),
        h3('7. Product Reporting'),
        body('In-app report form pre-filling product name and FSSAI number from scan data. Reports stored in Supabase reports table with reporter user_id and timestamp.'),
        h3('Non-Functional Requirements:'),
        bul('Performance: API responses within 3 seconds; OCR processing within 5 seconds.'),
        bul('Security: BCrypt (salt rounds: 12), JWT with expiry, API keys in environment variables only.'),
        bul('Scalability: Supabase + Vercel/Render support horizontal scaling.'),
        bul('Reliability: FSSAI API failures return graceful "Unverified" status; missing data displays N/A.'),
        bul('Accessibility: Fully responsive; no hardcoded container widths.'),
        pb(),

        // ══════════════════════════════════════════════════════════════════════
        // CHAPTER 4 — ANALYSIS AND DESIGN
        // ══════════════════════════════════════════════════════════════════════
        h1('4. System Analysis and Design'),
        sp(80),
        h2('System Analysis'),
        body('System analysis is the process of understanding and defining the requirements and behavior of the proposed system. For TrueBite, the analysis identified four primary actors (User, Supabase Database, External APIs, Admin) and mapped their interactions across the eight functional modules.'),
        sp(80),
        h2('Requirements Analysis'),
        new Paragraph({spacing:{before:80,after:60},children:[new TextRun({text:'a) Functional Requirements',size:22,font:F,bold:true})]}),
        bul('User Registration, 4-step Onboarding, Login, and JWT session management'),
        bul('Product image upload with Google Vision OCR extraction'),
        bul('Live barcode scanning with html5-qrcode and Open Food Facts lookup'),
        bul('FSSAI licence verification via official FOSCOS API'),
        bul('Four-standard health grading (Custom, Nutri-Score, Nutri-Grade, Japanese Grade)'),
        bul('Personalised Health Mode scoring (Default, Weight Loss, Diabetic, Gym)'),
        bul('Veg/Non-Veg detection, display, and filtering'),
        bul('Scan history (Food Log), bookmarks, and in-app product reporting'),
        bul('Product name search with India-specific filtering'),
        sp(80),
        new Paragraph({spacing:{before:80,after:60},children:[new TextRun({text:'b) Non-Functional Requirements',size:22,font:F,bold:true})]}),
        bul('Performance: Sub-3-second API response times under normal conditions'),
        bul('Scalability: Architecture supports increased user load via Supabase + Vercel'),
        bul('Usability: Mobile-first UI fully responsive on all viewports'),
        bul('Security: BCrypt passwords, JWT auth, environment-variable API keys, CORS configuration'),
        bul('Reliability: Graceful degradation on all external API failures'),
        sp(100),
        h2('4.1. ER Diagram'),
        body('The Entity Relationship Diagram (ERD) depicts the relationship between the data objects in the TrueBite system. The primary entities are USER, SCAN, REPORT, and BOOKMARK. The ERD shows the cardinalities and relationships between these entities as they are stored in the Supabase (PostgreSQL) database.'),
        sp(60),
        body('Notations:'),
        bul('Entities: Rectangles'),
        bul('Attributes: Ovals'),
        bul('Primary Keys: Underlined'),
        bul('Relationships: Diamonds'),
        bul('Cardinalities: Labelled near connectors (1 and M)'),
        sp(120),
        img(erImg, 580, 400),
        sp(80),
        body('The ER Diagram shows: a USER creates many SCANs (1:M), a USER files many REPORTs (1:M), a USER saves many BOOKMARKs (1:M junction table linking Users and Scans), and each SCAN has one NUTRITION DATA record and one SCORES record embedded as JSONB columns.'),
        pb(),

        h2('4.2. Data Flow Diagrams (DFD)'),
        body('A Data Flow Diagram is a graphical tool used to describe and analyse the movement of data through a system. The DFDs for TrueBite are developed at three levels: Level 0 (Context Diagram), Level 1 (Main Functional Processes), and Level 2 (Scan & Grading Subprocess).'),
        sp(80),
        new Paragraph({spacing:{before:80,after:60},children:[new TextRun({text:'Level 0 DFD – Context Diagram:',size:22,font:F,bold:true})]}),
        bul('Purpose: Shows the TrueBite system as a single process.'),
        bul('Scope: High-level; includes only one process and its interaction with external entities.'),
        bul('External Entities: User (Consumer) and External APIs (Google Vision, Open Food Facts, FSSAI FOSCOS).'),
        bul('Data Flows from User to System: Product Image / Barcode / Login Info'),
        bul('Data Flows from System to User: Health Grades / FSSAI Status / Scan History'),
        sp(120),
        img(dfd0, 580, 240),
        pb(),

        new Paragraph({spacing:{before:80,after:60},children:[new TextRun({text:'Level 1 DFD:',size:22,font:F,bold:true})]}),
        bul('Purpose: Breaks down the single process into main functional modules.'),
        bul('Processes: 1.0 Authentication, 2.0 Product Input Processing, 3.0 FSSAI Verification, 4.0 Health Grading Engine, 5.0 Food Log & Reporting.'),
        bul('Data Stores: D1 Supabase Users, D2 Supabase Scans, D3 FSSAI FOSCOS API, D4 Open Food Facts API, D5 Supabase Reports.'),
        sp(120),
        img(dfd1, 580, 360),
        pb(),

        new Paragraph({spacing:{before:80,after:60},children:[new TextRun({text:'Level 2 DFD – Scan Input & Grading Process:',size:22,font:F,bold:true})]}),
        bul('Purpose: Further decomposes the Product Input & Grading process into detailed sub-processes.'),
        bul('Sub-processes: 2.1 Image Upload (Multer), 2.2 Barcode Decoding (html5-qrcode), 2.3 OCR Text Extraction (Google Vision), 2.4 Nutrition Data Parsing, 2.5 Grading Engine (4 Algorithms).'),
        bul('Data Flows: Image → OCR → Parse Nutrition → Grading → Save to Scans DB'),
        sp(120),
        img(dfd2, 580, 320),
        pb(),

        h2('4.3. Tables'),
        sp(80),
        h3('Users Table'),
        tbl(
          ['Column Name','Data Type','Description'],
          [
            ['user_id','UUID, PK, DEFAULT gen_random_uuid()','Unique user identifier'],
            ['name','VARCHAR(100), NOT NULL','User\'s full name'],
            ['email','VARCHAR(150), NOT NULL, UNIQUE','Email address (login credential)'],
            ['password_hash','TEXT, NOT NULL','BCrypt-hashed password'],
            ['health_mode','VARCHAR(20), DEFAULT \'default\'','Active mode: default | weightLoss | diabetic | gym'],
            ['veg_preference','BOOLEAN, DEFAULT FALSE','TRUE if user filters for vegetarian products'],
            ['age','INTEGER, NULL','User\'s age captured during onboarding'],
            ['allergies','TEXT[], NULL','Array of allergy strings (e.g., gluten, nuts)'],
            ['created_at','TIMESTAMPTZ, DEFAULT NOW()','Account creation timestamp'],
          ],
          [2800,3200,3360]
        ),
        sp(120),
        h3('Scans Table'),
        tbl(
          ['Column Name','Data Type','Description'],
          [
            ['scan_id','UUID, PK','Unique scan identifier'],
            ['user_id','UUID, FK → users','Owning user foreign key'],
            ['product_name','VARCHAR(255)','Detected or fetched product name'],
            ['image_url','TEXT','Cloudinary URL of uploaded product image'],
            ['barcode_number','VARCHAR(50)','Scanned product barcode number'],
            ['fssai_number','VARCHAR(20)','Extracted FSSAI licence number'],
            ['fssai_status','VARCHAR(20), DEFAULT \'unverified\'','valid | invalid | unverified'],
            ['veg_status','VARCHAR(10), DEFAULT \'unknown\'','veg | nonVeg | unknown'],
            ['nutrition_data','JSONB','calories, sugar, fat, saturatedFat, transFat, protein, fibre'],
            ['scores','JSONB','customScore, nutriScore, nutriGrade, japaneseGrade'],
            ['health_mode','VARCHAR(20)','Health mode active at time of scan'],
            ['created_at','TIMESTAMPTZ, DEFAULT NOW()','Scan timestamp'],
          ],
          [2800,3200,3360]
        ),
        sp(120),
        h3('Reports Table'),
        tbl(
          ['Column Name','Data Type','Description'],
          [
            ['report_id','UUID, PK','Unique report identifier'],
            ['reported_by','UUID, FK → users','User who filed the report'],
            ['product_name','VARCHAR(255)','Reported product name'],
            ['fssai_number','VARCHAR(20)','Reported FSSAI licence number'],
            ['note','TEXT','Optional user-provided note'],
            ['created_at','TIMESTAMPTZ, DEFAULT NOW()','Report submission timestamp'],
          ],
          [2800,3200,3360]
        ),
        pb(),

        // ══════════════════════════════════════════════════════════════════════
        // CHAPTER 5 — IMPLEMENTATION
        // ══════════════════════════════════════════════════════════════════════
        h1('5. Implementation'),
        sp(80),
        body('Implementation is the stage where the theoretical design is turned into a working system. The TrueBite implementation follows a client-server architecture with a React.js frontend and a Node.js/Express.js backend, communicating via REST APIs. The database is hosted on Supabase (PostgreSQL) and the application is deployed on Vercel and Render.'),
        body('The development follows a modular approach with clear separation of concerns: React components handle UI rendering, Express controllers handle business logic, Supabase handles data persistence, and dedicated service files encapsulate all external API integrations.'),
        sp(100),
        h2('5.1. Project Folder Structure'),
        sp(60),
        codeBlock([
          'truebite/',
          '├── client/                         # React.js Frontend (Vite)',
          '│   ├── src/',
          '│   │   ├── components/',
          '│   │   │   ├── ui/                 # Button, Card, Badge, GradeCircle',
          '│   │   │   ├── scanner/            # ImageUploader, BarcodeScanner',
          '│   │   │   └── dashboard/          # HealthScoreCard, GradingPanel',
          '│   │   ├── pages/',
          '│   │   │   ├── Landing.jsx',
          '│   │   │   ├── Login.jsx',
          '│   │   │   ├── Register.jsx        # 4-step onboarding',
          '│   │   │   ├── Home.jsx',
          '│   │   │   ├── Scan.jsx            # Image + Barcode input',
          '│   │   │   ├── Results.jsx         # 4-grade dashboard',
          '│   │   │   ├── Search.jsx',
          '│   │   │   ├── FoodLog.jsx',
          '│   │   │   ├── Profile.jsx',
          '│   │   │   └── Experts.jsx',
          '│   │   ├── context/',
          '│   │   │   └── AuthContext.jsx',
          '│   │   ├── utils/',
          '│   │   │   └── gradingAlgorithms.js',
          '│   │   ├── App.jsx',
          '│   │   └── main.jsx',
          '│   └── tailwind.config.js',
          '│',
          '└── server/                         # Node.js + Express.js Backend',
          '    ├── controllers/',
          '    │   ├── authController.js',
          '    │   ├── scanController.js',
          '    │   └── reportController.js',
          '    ├── routes/',
          '    │   ├── auth.js',
          '    │   ├── scan.js',
          '    │   └── report.js',
          '    ├── middleware/',
          '    │   ├── authMiddleware.js',
          '    │   └── uploadMiddleware.js',
          '    ├── services/',
          '    │   ├── ocrService.js',
          '    │   ├── fssaiService.js',
          '    │   ├── openFoodFactsService.js',
          '    │   └── gradingService.js',
          '    ├── .env',
          '    └── server.js',
        ]),
        sp(160),

        h2('5.2. Snapshots'),
        sp(80),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:80,after:40},children:[new TextRun({text:'5.2.1. Landing Page',size:22,font:F,bold:true,underline:{}})]}),
        body('Full-screen purple gradient hero with glassmorphism card, animated tagline "Scan. Verify. Trust.", three feature highlight cards (OCR Scan | FSSAI Verify | Health Grade), and a "Get Started" CTA button.'),
        sp(60),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:80,after:40},children:[new TextRun({text:'5.2.2. Register — 4-Step Onboarding',size:22,font:F,bold:true,underline:{}})]}),
        body('Step-by-step survey with progress indicator and Framer Motion transitions. Step 1: Name/Email/Password. Step 2: Primary health goal cards. Step 3: Vegan/Non-Vegan toggle. Step 4: Allergy tag input.'),
        sp(60),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:80,after:40},children:[new TextRun({text:'5.2.3. Home Dashboard',size:22,font:F,bold:true,underline:{}})]}),
        body('Personalised greeting with user name, pulsing central Scan CTA button, horizontally scrollable category chips, Healthy Picks product grid, and recent scan history cards.'),
        sp(60),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:80,after:40},children:[new TextRun({text:'5.2.4. Scan Page — Image & Barcode Tabs',size:22,font:F,bold:true,underline:{}})]}),
        body('Image tab: dashed purple drop zone with animated scanning line during OCR processing. Barcode tab: live camera viewfinder with corner bracket overlay and success animation on decode.'),
        sp(60),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:80,after:40},children:[new TextRun({text:'5.2.5. Results Dashboard',size:22,font:F,bold:true,underline:{}})]}),
        body('FSSAI status banner (green/red/grey), 2×2 grid of all four grade cards, Chart.js circular doughnut for Custom Score, horizontal bar charts for each nutritional value, and Save/Bookmark/Report action buttons.'),
        sp(60),
        new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:80,after:40},children:[new TextRun({text:'5.2.6. Food Log & Profile Page',size:22,font:F,bold:true,underline:{}})]}),
        body('Food Log: timeline view of past scans with product thumbnails and grade badges. Profile: avatar with purple gradient ring, 4-card health mode selector, Veg toggle, and account statistics.'),
        pb(),

        h2('5.3. Coding'),
        sp(80),
        h3('server.js'),
        codeBlock([
          'const express    = require(\'express\');',
          'const cors       = require(\'cors\');',
          'const rateLimit  = require(\'express-rate-limit\');',
          'require(\'dotenv\').config();',
          '',
          'const authRoutes   = require(\'./routes/auth\');',
          'const scanRoutes   = require(\'./routes/scan\');',
          'const searchRoutes = require(\'./routes/search\');',
          'const reportRoutes = require(\'./routes/report\');',
          'const userRoutes   = require(\'./routes/user\');',
          '',
          'const app = express();',
          '',
          'app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));',
          'app.use(express.json({ limit: \'10mb\' }));',
          'app.use(express.urlencoded({ extended: true }));',
          '',
          '// Rate limiting',
          'const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });',
          'app.use(\'/api/scan\', limiter);',
          '',
          'app.use(\'/api/auth\',   authRoutes);',
          'app.use(\'/api/scan\',   scanRoutes);',
          'app.use(\'/api/search\', searchRoutes);',
          'app.use(\'/api/report\', reportRoutes);',
          'app.use(\'/api/user\',   userRoutes);',
          '',
          'const PORT = process.env.PORT || 5000;',
          'app.listen(PORT, () => console.log(`TrueBite server running on port ${PORT}`));',
        ]),
        sp(120),
        h3('controllers/authController.js'),
        codeBlock([
          'const bcrypt  = require(\'bcryptjs\');',
          'const jwt     = require(\'jsonwebtoken\');',
          'const { supabase } = require(\'../config/supabase\');',
          '',
          'exports.register = async (req, res) => {',
          '  try {',
          '    const { name, email, password, healthMode, vegPreference, age, allergies } = req.body;',
          '    const passwordHash = await bcrypt.hash(password, 12);',
          '',
          '    const { data, error } = await supabase',
          '      .from(\'users\')',
          '      .insert([{ name, email, password_hash: passwordHash,',
          '                 health_mode: healthMode || \'default\',',
          '                 veg_preference: vegPreference || false,',
          '                 age, allergies }])',
          '      .select().single();',
          '',
          '    if (error) return res.status(400).json({ message: \'Email already in use\' });',
          '',
          '    const token = jwt.sign({ userId: data.user_id }, process.env.JWT_SECRET,',
          '                           { expiresIn: \'7d\' });',
          '    res.status(201).json({ token, user: data });',
          '  } catch (err) {',
          '    res.status(500).json({ message: err.message });',
          '  }',
          '};',
          '',
          'exports.login = async (req, res) => {',
          '  try {',
          '    const { email, password } = req.body;',
          '    const { data: user } = await supabase',
          '      .from(\'users\').select(\'*\').eq(\'email\', email).single();',
          '',
          '    if (!user) return res.status(401).json({ message: \'Invalid credentials\' });',
          '    const valid = await bcrypt.compare(password, user.password_hash);',
          '    if (!valid) return res.status(401).json({ message: \'Invalid credentials\' });',
          '',
          '    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET,',
          '                           { expiresIn: \'7d\' });',
          '    res.json({ token, user });',
          '  } catch (err) {',
          '    res.status(500).json({ message: err.message });',
          '  }',
          '};',
        ]),
        sp(120),
        h3('services/gradingService.js'),
        codeBlock([
          'exports.computeAllGrades = (nutrition, healthMode = \'default\') => {',
          '  return {',
          '    customScore:  computeCustomScore(nutrition, healthMode),',
          '    nutriScore:   computeNutriScore(nutrition),',
          '    nutriGrade:   computeNutriGrade(nutrition),',
          '    japaneseGrade: computeJapaneseGrade(nutrition),',
          '  };',
          '};',
          '',
          '// ── Custom Health Score (0–10) ────────────────────────────────────',
          'function computeCustomScore(n, mode) {',
          '  if (!n || !n.calories) return null;  // return null not 10 for missing data',
          '  let score = 10;',
          '  if (n.sugar         >  5) score -= 2;',
          '  if (n.sugar         > 10) score -= 2;  // stacking penalty for high sugar',
          '  if (n.calories      > 400) score -= 1;',
          '  if (n.saturatedFat  >  5) score -= 2;',
          '  if (n.transFat      >  0) score -= 3;',
          '',
          '  // Health Mode Modifiers',
          '  if (mode === \'diabetic\')   { if (n.sugar    >  5) score -= 2; }',
          '  if (mode === \'weightLoss\') { if (n.calories > 300) score -= 1;',
          '                              if (n.fat       >  10) score -= 1; }',
          '  if (mode === \'gym\')        { if (n.protein  >  20) score += 1;',
          '                              if (n.sugar     >  10) score -= 2; }',
          '  return Math.max(0, Math.min(10, score));',
          '}',
          '',
          '// ── Nutri-Score (A–E, European Algorithm) ────────────────────────',
          'function computeNutriScore(n) {',
          '  let neg = 0;',
          '  neg += n.calories      >= 335 ? 10 : Math.floor(n.calories / 33.5);',
          '  neg += n.sugar         >= 45  ? 10 : Math.floor(n.sugar / 4.5);',
          '  neg += n.saturatedFat  >= 10  ? 10 : Math.floor(n.saturatedFat);',
          '  neg += n.sodium        >= 900 ? 10 : Math.floor(n.sodium / 90);',
          '  let pos = 0;',
          '  pos += n.fiber   >= 4.7 ? 5 : Math.floor(n.fiber / 0.9);',
          '  pos += n.protein >= 8   ? 5 : Math.floor(n.protein / 1.6);',
          '  const final = neg - pos;',
          '  if (final <= -1) return \'A\';',
          '  if (final <=  2) return \'B\';',
          '  if (final <= 10) return \'C\';',
          '  if (final <= 18) return \'D\';',
          '  return \'E\';',
          '}',
          '',
          '// ── Nutri-Grade (A–D, Singapore HPB Standard) ────────────────────',
          'function computeNutriGrade(n) {',
          '  const s = n.sugar || 0, sf = n.saturatedFat || 0;',
          '  if (s < 1  && sf < 0.7)  return \'A\';',
          '  if (s < 5  && sf < 1.2)  return \'B\';',
          '  if (s < 10 && sf < 2.8)  return \'C\';',
          '  return \'D\';',
          '}',
          '',
          '// ── Japanese Nutritional Balance Grade ───────────────────────────',
          'function computeJapaneseGrade(n) {',
          '  const totalCals = n.calories || 1;',
          '  const carbCals   = (n.carbohydrates || 0) * 4;',
          '  const protCals   = (n.protein       || 0) * 4;',
          '  const fatCals    = (n.fat            || 0) * 9;',
          '  const carbRatio  = carbCals / totalCals;',
          '  const protRatio  = protCals / totalCals;',
          '  const fatRatio   = fatCals  / totalCals;',
          '  const ideal = carbRatio >= 0.5 && carbRatio <= 0.65 &&',
          '                protRatio >= 0.13 && protRatio <= 0.20 &&',
          '                fatRatio  >= 0.20 && fatRatio  <= 0.30;',
          '  if (ideal)               return \'Excellent\';',
          '  if (n.sugar < 5 && n.fat < 10) return \'Good\';',
          '  if (n.sugar < 15)        return \'Fair\';',
          '  return \'Poor\';',
          '}',
        ]),
        sp(120),
        h3('services/ocrService.js'),
        codeBlock([
          'const axios = require(\'axios\');',
          '',
          'exports.extractTextFromImage = async (imageBuffer) => {',
          '  const base64Image = imageBuffer.toString(\'base64\');',
          '  const response = await axios.post(',
          '    `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,',
          '    {',
          '      requests: [{',
          '        image:    { content: base64Image },',
          '        features: [{ type: \'TEXT_DETECTION\' }]',
          '      }]',
          '    }',
          '  );',
          '  const text = response.data.responses[0]?.fullTextAnnotation?.text || \'\';',
          '  return parseNutritionFromOCR(text);',
          '};',
          '',
          'function parseNutritionFromOCR(text) {',
          '  const fssaiMatch = text.match(/\\b\\d{14}\\b/);',
          '  const get = (kw) => {',
          '    const rx = new RegExp(kw + \'[\\\\s\\\\S]{0,20}?(\\\\d+\\\\.?\\\\d*)\\\\s*g\', \'i\');',
          '    const m = text.match(rx);',
          '    return m ? parseFloat(m[1]) : null;',
          '  };',
          '  return {',
          '    fssaiNumber:  fssaiMatch ? fssaiMatch[0] : null,',
          '    calories:     get(\'calories|energy|kcal\') || get(\'cal\'),',
          '    sugar:        get(\'sugar\'),',
          '    fat:          get(\'total fat\'),',
          '    saturatedFat: get(\'saturated\'),',
          '    transFat:     get(\'trans\'),',
          '    protein:      get(\'protein\'),',
          '    fiber:        get(\'fibre|fiber|dietary fibre\'),',
          '  };',
          '}',
        ]),
        sp(120),
        h3('src/context/AuthContext.jsx'),
        codeBlock([
          'import { createContext, useContext, useState, useEffect } from \'react\';',
          'import axios from \'axios\';',
          '',
          'const AuthContext = createContext();',
          '',
          'export const AuthProvider = ({ children }) => {',
          '  const [user,  setUser]  = useState(null);',
          '  const [token, setToken] = useState(localStorage.getItem(\'token\'));',
          '',
          '  useEffect(() => {',
          '    if (token) {',
          '      axios.defaults.headers.common[\'Authorization\'] = `Bearer ${token}`;',
          '      axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`)',
          '           .then(r => setUser(r.data))',
          '           .catch(()  => logout());',
          '    }',
          '  }, [token]);',
          '',
          '  const login = (newToken, userData) => {',
          '    localStorage.setItem(\'token\', newToken);',
          '    axios.defaults.headers.common[\'Authorization\'] = `Bearer ${newToken}`;',
          '    setToken(newToken);',
          '    setUser(userData);',
          '  };',
          '',
          '  const logout = () => {',
          '    localStorage.removeItem(\'token\');',
          '    delete axios.defaults.headers.common[\'Authorization\'];',
          '    setToken(null);',
          '    setUser(null);',
          '  };',
          '',
          '  return (',
          '    <AuthContext.Provider value={{ user, token, login, logout }}>',
          '      {children}',
          '    </AuthContext.Provider>',
          '  );',
          '};',
          '',
          'export const useAuth = () => useContext(AuthContext);',
        ]),
        sp(120),
        h3('src/App.jsx'),
        codeBlock([
          'import { BrowserRouter, Routes, Route, Navigate } from \'react-router-dom\';',
          'import { AuthProvider, useAuth } from \'./context/AuthContext\';',
          'import Landing from \'./pages/Landing\';',
          'import Login   from \'./pages/Login\';',
          'import Register from \'./pages/Register\';',
          'import Home    from \'./pages/Home\';',
          'import Scan    from \'./pages/Scan\';',
          'import Results from \'./pages/Results\';',
          'import Search  from \'./pages/Search\';',
          'import FoodLog from \'./pages/FoodLog\';',
          'import Profile from \'./pages/Profile\';',
          'import Experts from \'./pages/Experts\';',
          '',
          'const Protected = ({ children }) => {',
          '  const { token } = useAuth();',
          '  return token ? children : <Navigate to="/login" replace />;',
          '};',
          '',
          'export default function App() {',
          '  return (',
          '    <AuthProvider>',
          '      <BrowserRouter>',
          '        <Routes>',
          '          <Route path="/"         element={<Landing />} />',
          '          <Route path="/login"    element={<Login />} />',
          '          <Route path="/register" element={<Register />} />',
          '          <Route path="/home"     element={<Protected><Home /></Protected>} />',
          '          <Route path="/scan"     element={<Protected><Scan /></Protected>} />',
          '          <Route path="/results/:scanId" element={<Protected><Results /></Protected>} />',
          '          <Route path="/search"   element={<Protected><Search /></Protected>} />',
          '          <Route path="/log"      element={<Protected><FoodLog /></Protected>} />',
          '          <Route path="/profile"  element={<Protected><Profile /></Protected>} />',
          '          <Route path="/experts"  element={<Protected><Experts /></Protected>} />',
          '        </Routes>',
          '      </BrowserRouter>',
          '    </AuthProvider>',
          '  );',
          '}',
        ]),
        pb(),

        // ══════════════════════════════════════════════════════════════════════
        // CHAPTER 6 — TESTING
        // ══════════════════════════════════════════════════════════════════════
        h1('6. Testing'),
        sp(80),
        body('Testing is a critical phase in the development of TrueBite to ensure reliability, functionality, and user satisfaction. The testing strategy covers unit testing for individual service functions and grading algorithms, integration testing for complete API endpoint flows, UI/UX testing for responsive layout and cross-browser compatibility, security testing for JWT authentication and input validation, and User Acceptance Testing (UAT) with a sample group of 5 users.'),
        sp(80),
        body('Types of Testing Conducted:'),
        sp(60),
        h3('1. Unit Testing'),
        bul('gradingService.js tested with known nutritional values to verify correct grade outputs across all four algorithms.'),
        bul('ocrService.js parser tested with sample OCR text strings to verify FSSAI regex extraction accuracy.'),
        bul('BCrypt hashing and JWT generation tested in isolation within authController.js.'),
        h3('2. Integration Testing'),
        bul('All REST API endpoints tested end-to-end using Postman with valid and invalid request payloads.'),
        bul('Complete scan flow tested: image upload → OCR → FSSAI verify → grade compute → Supabase save.'),
        bul('Barcode flow tested: barcode decode → Open Food Facts API → nutrition parse → grade compute.'),
        h3('3. Functional Testing'),
        tbl(
          ['Functionality','Status','Notes'],
          [
            ['Login & Registration','Pass','4-step onboarding fully functional'],
            ['Image Upload & OCR','Pass','Google Vision REST API integrated'],
            ['Barcode Scanning','Pass','html5-qrcode working on Chrome & Firefox'],
            ['FSSAI Verification','Pass','FOSCOS API returning valid/invalid correctly'],
            ['4-Grade Dashboard','Pass','All four algorithms computing correctly'],
            ['Personalised Health Modes','Pass','Diabetic, Gym, Weight Loss modifiers working'],
            ['Veg/Non-Veg Detection','Pass','Filter functional on Search and Food Log'],
            ['Food Log & Bookmarks','Pass','Supabase persistence verified'],
            ['Product Reporting','Pass','Reports stored in Supabase reports table'],
            ['Sugary Drink Test','Pass','Cola now correctly receives Poor grade (fixed from PRD)'],
          ],
          [3000,1560,4800]
        ),
        sp(120),
        h3('4. Cross-Browser and Compatibility Testing'),
        bul('Chrome (Windows, Android) — Pass'),
        bul('Firefox (Linux, Windows) — Pass'),
        bul('Safari (macOS, iOS) — Pass'),
        bul('Edge (Windows 11) — Pass'),
        bul('Responsive layout on tablets and mobile — Pass'),
        sp(100),
        h2('Sample Test Cases:'),
        sp(60),
        h3('1. User Authentication'),
        tbl(
          ['TC#','Test Scenario','Test Steps','Expected Result','Status'],
          [
            ['TC01','Successful Registration','Fill 4-step onboarding form with valid data → Submit','JWT token returned; user record created in Supabase','Pass'],
            ['TC02','Duplicate Email','Register with already-existing email','Error: "Email already in use". No new record created.','Pass'],
            ['TC03','Successful Login','Enter valid email and password → Click "Sign In"','JWT issued; user redirected to Home dashboard','Pass'],
            ['TC04','Wrong Password','Enter valid email and incorrect password','Error: "Invalid credentials". No token issued.','Fail'],
          ],
          [700,2200,2200,2360,1100]
        ),
        sp(80),
        h3('2. Scanning & OCR'),
        tbl(
          ['TC#','Test Scenario','Test Steps','Expected Result','Status'],
          [
            ['TC05','Image Upload — clear label','Upload clear JPEG of Maggi noodles label','FSSAI number extracted; all 4 grades computed','Pass'],
            ['TC06','Image Upload — blurry','Upload low-resolution blurry product image','Missing fields display N/A (not false 10/10 — fixed)','Pass'],
            ['TC07','Barcode — valid Indian product','Scan barcode of registered Indian product','Product data from OFacts; results dashboard populated','Pass'],
            ['TC08','Barcode — foreign product','Scan US product barcode','Graceful error: "Product not found in Indian database"','Pass'],
          ],
          [700,2200,2200,2360,1100]
        ),
        sp(80),
        h3('3. FSSAI Verification & Grading'),
        tbl(
          ['TC#','Test Scenario','Test Steps','Expected Result','Status'],
          [
            ['TC09','Valid FSSAI licence','Submit valid 14-digit FSSAI number','Green "FSSAI Verified" banner displayed','Pass'],
            ['TC10','Invalid FSSAI licence','Submit fake/expired FSSAI number','Red "FSSAI Invalid" + Report button displayed','Pass'],
            ['TC11','FSSAI API timeout','FSSAI API unreachable','Grey "Could Not Verify" banner; app does not crash','Pass'],
            ['TC12','Sugary soda grading','Cola: sugar=11g, calories=42kcal, fat=0g','Custom Score: Poor; Nutri-Score: D or E','Pass'],
            ['TC13','Diabetic mode','Sugar=8g product; user in Diabetic Mode','Additional −2 penalty applied vs Default Mode','Pass'],
          ],
          [700,2200,2200,2360,1100]
        ),
        sp(80),
        h3('4. Food Log & Reporting'),
        tbl(
          ['TC#','Test Scenario','Test Steps','Expected Result','Status'],
          [
            ['TC14','Save scan to Food Log','Click Save on Results page','Record stored in Supabase; appears in Food Log timeline','Pass'],
            ['TC15','Report a product','Fill report modal and submit','Report in Supabase; toast notification shown','Pass'],
            ['TC16','Veg filter toggle','Enable Veg toggle on Search page','Only Veg products shown; Non-Veg hidden','Pass'],
            ['TC17','Unauthenticated access','Navigate to /log without JWT','Redirect to Login page; protected route enforced','Pass'],
          ],
          [700,2200,2200,2360,1100]
        ),
        pb(),

        // ══════════════════════════════════════════════════════════════════════
        // CHAPTER 7 — CONCLUSION
        // ══════════════════════════════════════════════════════════════════════
        h1('7. CONCLUSION'),
        sp(80),
        body('The development of TrueBite marks a significant step forward in making food safety and nutritional transparency accessible to everyday Indian consumers. By combining real-time FSSAI compliance verification, OCR-based label scanning, live barcode product lookup, and four internationally standardised health grading systems into a single cohesive MERN-inspired web application, the project demonstrates the practical power of modern full-stack web development when applied to a genuine social problem.'),
        body('Whether it is a diabetic patient checking sugar content, a fitness enthusiast verifying protein levels, or a parent confirming a product\'s regulatory status, TrueBite empowers users to:'),
        bul('Instantly verify FSSAI licence validity in real time using the official government API'),
        bul('Receive health grades from four international standards on a single, visual dashboard'),
        bul('Get personalised health scoring tailored to their specific dietary goals and conditions'),
        bul('Build a personal food history through the Food Log for long-term dietary awareness'),
        bul('Contribute to community food safety through the in-app compliance reporting system'),
        sp(80),
        body('The platform underwent significant technical evolution during development: MongoDB was replaced with Supabase (PostgreSQL) for more robust relational data management; the OCR implementation was refined from a bulky Service Account JSON approach to a lightweight REST API key; the grading algorithms were completely rewritten to eliminate false 10/10 scores for high-sugar products; the registration flow was transformed into a personalised 4-step onboarding survey; and the UI evolved from a mobile-constrained MVP into a fully responsive cross-platform application.'),
        sp(80),
        h2('Future Enhancement'),
        tbl(
          ['Enhancement','Description'],
          [
            ['Additive & INS Number Detection','Scan and flag harmful food additives by their INS codes with risk ratings.'],
            ['Product Comparison','Side-by-side comparison of two scanned products across all four grades.'],
            ['AI Recommendations','Suggest healthier product alternatives based on the user\'s scan history and active health mode.'],
            ['Retailer B2B Dashboard','Admin-facing compliance dashboard for food manufacturers to monitor FSSAI status and report volume.'],
            ['React Native Mobile App','Native iOS and Android application leveraging the same Node.js/Supabase backend.'],
            ['Multilingual Support','Hindi and regional Indian language support for broader accessibility.'],
            ['Community Trust Score','Crowd-sourced product rating system supplementing algorithmic health grades.'],
          ],
          [2800,6560]
        ),
        pb(),

        // ══════════════════════════════════════════════════════════════════════
        // CHAPTER 8 — BIBLIOGRAPHY
        // ══════════════════════════════════════════════════════════════════════
        h1('8. Bibliography'),
        sp(80),
        new Paragraph({spacing:{before:80,after:60},children:[new TextRun({text:'References:',size:22,font:F,bold:true})]}),
        sp(40),
        body('FSSAI FOSCOS Licensing Portal – https://foscos.fssai.gov.in'),
        body('Open Food Facts – https://world.openfoodfacts.org'),
        body('Google Cloud Vision API Documentation – https://cloud.google.com/vision/docs'),
        body('Supabase Documentation – https://supabase.com/docs'),
        body('Nutri-Score Official Documentation – https://www.santepubliquefrance.fr'),
        body('Singapore Health Promotion Board, Nutri-Grade – https://www.hpb.gov.sg'),
        body('React.js Documentation – https://react.dev'),
        body('Node.js Documentation – https://nodejs.org/en/docs'),
        body('Express.js Documentation – https://expressjs.com'),
        body('Tailwind CSS Documentation v4 – https://tailwindcss.com/docs'),
        body('Framer Motion Documentation – https://www.framer.com/motion/'),
        body('html5-qrcode Library – https://github.com/mebjas/html5-qrcode'),
        body('Chart.js Documentation – https://www.chartjs.org/docs/latest/'),
        body('W3Schools Online Web Tutorials – https://www.w3schools.com'),
        body('Silberschatz, A., Korth, H. F., & Sudarshan, S. (2019). Database System Concepts, 7th Edition. McGraw-Hill Education.'),
        body('Pressman, R. S. (2014). Software Engineering: A Practitioner\'s Approach, 8th Edition. McGraw-Hill Education.'),
        sp(240),
        new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:'— End of Project Report —',bold:true,size:22,font:FA,color:BLU})]})
      ]
    }
  ]
});

const outFile = path.resolve(__dirname, 'TrueBite_Final_Report_with_Diagrams.docx');
Packer.toBuffer(doc).then(buf=>{
  fs.writeFileSync(outFile, buf);
  console.log('Done', outFile);
});