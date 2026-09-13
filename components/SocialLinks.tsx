import { SocialLink } from '@prisma/client';

interface SocialLinksProps {
  links: SocialLink[];
}

export default function SocialLinks({ links }: SocialLinksProps) {
  return (
    <section className="py-12 px-4 max-w-[480px] mx-auto">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-tevin-product hover:bg-tevin-accent/10 border border-tevin-product hover:border-tevin-accent rounded-xl p-4 text-center transition-all duration-200 group"
            title={link.name}
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
              {link.icon || '→'}
            </div>
            <p className="text-sm font-semibold text-tevin-text group-hover:text-tevin-accent transition-colors">
              {link.name}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
