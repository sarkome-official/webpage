import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export const SocialDock: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 flex gap-4 z-50">
      <a 
        href="https://github.com/sarkome-official" 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-primary/10 transition-colors"
      >
        <Github className="w-5 h-5" />
      </a>
      <a 
        href="https://twitter.com/sarkome" 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:bg-primary/10 transition-colors"
      >
        <Twitter className="w-5 h-5" />
      </a>
    </div>
  );
};

export default SocialDock;
