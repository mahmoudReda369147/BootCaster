# BootCaster - AI-Powered BootCast Generator

A modern web application that converts formatted text files into engaging BootCasts using AI technology. Built with Next.js, React, and Tailwind CSS.

## Features

- 🌍 **Multi-language Support**: Full Arabic and English localization
- 🎨 **Dark/Light Theme**: Toggle between themes with persistent storage
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔐 **Authentication**: User registration and login system
- 🎙️ **AI BootCast Generation**: Convert text files to audio content
- 📁 **File Upload**: Support for TXT, DOC, DOCX, and PDF files
- 🎯 **Demo Mode**: Try the application without registration

## Internationalization (i18n) 

This application includes a comprehensive internationalization system with the following features:

### Supported Languages
- **English (en)**: Default language
- **Arabic (ar)**: Full RTL support with Arabic fonts

### Translation System Structure

```
src/
├── lib/
│   └── i18n.js              # Main translation configuration
├── components/
│   └── I18nProvider.js      # Translation provider component
├── hooks/
│   ├── useLanguage.js       # Language management hook
│   └── useTheme.js          # Theme management hook
└── app/
    ├── login/page.js        # Login page with translations
    ├── register/page.js     # Registration page with translations
    ├── dashboard/page.js    # Dashboard with translations
    ├── demo/page.js         # Demo page with translations
    └── page.js              # Home page with translations
```

### Translation Keys

The application uses organized translation keys:

- **Navigation**: `nav.home`, `nav.dashboard`, `nav.login`, etc.
- **Authentication**: `auth.login.title`, `auth.register.subtitle`, etc.
- **Dashboard**: `dashboard.title`, `dashboard.convert`, etc.
- **Common**: `common.loading`, `common.error`, `common.success`, etc.
- **Features**: `features.title`, `features.ai.description`, etc.
- **Pricing**: `pricing.title`, `pricing.starter.name`, etc.
- **FAQ**: `faq.title`, `faq.contactSupport`, etc.

### Adding New Translations

1. **Add new keys to `src/lib/i18n.js`**:
```javascript
const resources = {
    en: {
        translation: {
            "new.key": "English text",
            // ... other keys
        }
    },
    ar: {
        translation: {
            "new.key": "النص العربي",
            // ... other keys
        }
    }
};
```

2. **Use in components**:
```javascript
import { useTranslation } from "react-i18next";

function MyComponent() {
    const { t } = useTranslation();
    
    return <h1>{t("new.key")}</h1>;
}
```

### Language Switching

The application automatically handles:
- Language persistence in localStorage
- RTL/LTR direction switching
- Font family switching (Arabic/English)
- Theme persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd tailwind-app
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
tailwind-app/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   ├── dashboard/      # Dashboard page
│   │   ├── demo/           # Demo page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.js       # Root layout
│   │   └── page.js         # Home page
│   ├── components/         # React components
│   │   ├── Navigation.js   # Navigation component
│   │   ├── HeroSection.js  # Hero section
│   │   ├── FeaturesSection.js # Features section
│   │   ├── PricingSection.js  # Pricing section
│   │   ├── FAQSection.js   # FAQ section
│   │   ├── Footer.js       # Footer component
│   │   ├── I18nProvider.js # Translation provider
│   │   └── index.js        # Component exports
│   ├── hooks/              # Custom React hooks
│   │   ├── useLanguage.js  # Language management
│   │   ├── useTheme.js     # Theme management
│   │   └── index.js        # Hook exports
│   └── lib/                # Utility libraries
│       ├── i18n.js         # Translation configuration
│       ├── firebase.js     # Firebase configuration
│       ├── dbConection.js  # Database connection
│       └── bootCasteModel.js # AI model integration
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind CSS configuration
├── next.config.mjs         # Next.js configuration
└── package.json            # Project dependencies
```

## Key Features Implementation

### 1. Multi-language Support
- Uses `react-i18next` for translations
- Automatic RTL/LTR switching for Arabic
- Font family switching (Cairo for Arabic, Inter for English)
- Persistent language selection

### 2. Theme System
- Dark/Light theme toggle
- System theme detection
- Persistent theme storage
- Smooth transitions

### 3. File Upload System
- Drag and drop support
- Multiple file format support
- File size validation
- Progress indicators

### 4. Authentication
- Form validation with Zod
- Error handling
- Loading states
- Social login options (Google, Twitter)

## Styling

The application uses Tailwind CSS with:
- Custom color schemes
- Responsive design
- Dark mode support
- Smooth animations and transitions
- Arabic font support (Cairo)

## API Integration

The application includes:
- File upload API (`/api/compile`)
- Authentication endpoints
- AI model integration for BootCast generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add translations for new text
5. Test in both languages
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the FAQ section in the application
