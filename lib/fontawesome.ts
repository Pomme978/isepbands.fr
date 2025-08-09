import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faArrowLeft, 
  faUser, 
  faHome,
  faBars,
  faSignOutAlt,
  faEnvelope,       
  faLock,          
  faGraduationCap,  
  faCheck,          
  faTimes
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faArrowLeft, 
  faUser, 
  faHome,
  faBars,
  faSignOutAlt,
  faEnvelope,       
  faLock,          
  faGraduationCap,  
  faCheck,          
  faTimes
);

// Empêche Font Awesome d'ajouter automatiquement du CSS
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;