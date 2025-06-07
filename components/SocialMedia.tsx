import styles from './SocialMedia.module.css';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

const socialLinks: SocialLink[] = [
  { name: 'Twitter', url: 'https://twitter.com/yourhandle', icon: <FaTwitter /> },
  { name: 'Facebook', url: 'https://facebook.com/yourhandle', icon: <FaFacebook /> },
  { name: 'Instagram', url: 'https://instagram.com/yourhandle', icon: <FaInstagram /> },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/yourhandle', icon: <FaLinkedin /> },
];

const SocialMedia: React.FC = () => {
  return (
    <div className={styles.container}>
      {socialLinks.map(link => (
        <a
          key={link.name}
          href={link.url}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;
