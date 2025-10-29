import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  en: {
    nav: {
      home: 'Home',
      modules: 'Modules',
      about: 'About',
      contact: 'Contact',
      imprint: 'Imprint'
    },
    landing: {
      hero: {
        title: 'Master AI-Assisted Journalism',
        subtitle: 'Learn to effectively use AI tools while maintaining journalistic integrity and accuracy',
        cta: 'Start Learning'
      }
    },
    modules: {
      title: 'Modules',
      comingSoon: 'Coming soon...'
    },
    about: {
      title: 'About',
      description: 'This is the About page. Information about the project will be added here soon.'
    },
    contact: {
      title: 'Contact',
      description: 'Contact information will be added here soon.'
    },
    imprint: {
      title: 'Imprint',
      description: 'This is the Imprint page. Legal information and impressum will be added here soon.'
    },
    systemParameters: {
      title: 'System Parameters',
      comingSoon: 'Coming soon...'
    },
    llmTraining: {
      title: 'LLM Training',
      comingSoon: 'Coming soon...'
    },
    multipleSources: {
      title: 'Multiple Sources',
      comingSoon: 'Coming soon...'
    },
    journalisticEvaluation: {
      title: 'Journalistic Evaluation',
      comingSoon: 'Coming soon...'
    },
    promptConstruction: {
      bias: {
        title: 'Bias',
        comingSoon: 'Coming soon...'
      },
      context: {
        title: 'Context',
        comingSoon: 'Coming soon...'
      },
      conversationStyle: {
        title: 'Conversation Style',
        comingSoon: 'Coming soon...'
      }
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      modules: 'Módulos',
      about: 'Acerca de',
      contact: 'Contacto',
      imprint: 'Aviso Legal'
    },
    landing: {
      hero: {
        title: 'Domina el Periodismo Asistido por IA',
        subtitle: 'Aprende a usar herramientas de IA de manera efectiva mientras mantienes la integridad y precisión periodística',
        cta: 'Comenzar a Aprender'
      }
    },
    modules: {
      title: 'Módulos',
      comingSoon: 'Próximamente...'
    },
    about: {
      title: 'Acerca de',
      description: 'Esta es la página Acerca de. La información sobre el proyecto se agregará aquí pronto.'
    },
    contact: {
      title: 'Contacto',
      description: 'La información de contacto se agregará aquí pronto.'
    },
    imprint: {
      title: 'Aviso Legal',
      description: 'Esta es la página de Aviso Legal. La información legal se agregará aquí pronto.'
    },
    systemParameters: {
      title: 'Parámetros del Sistema',
      comingSoon: 'Próximamente...'
    },
    llmTraining: {
      title: 'Entrenamiento LLM',
      comingSoon: 'Próximamente...'
    },
    multipleSources: {
      title: 'Múltiples Fuentes',
      comingSoon: 'Próximamente...'
    },
    journalisticEvaluation: {
      title: 'Evaluación Periodística',
      comingSoon: 'Próximamente...'
    },
    promptConstruction: {
      bias: {
        title: 'Sesgo',
        comingSoon: 'Próximamente...'
      },
      context: {
        title: 'Contexto',
        comingSoon: 'Próximamente...'
      },
      conversationStyle: {
        title: 'Estilo de Conversación',
        comingSoon: 'Próximamente...'
      }
    }
  }
};
